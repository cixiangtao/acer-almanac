import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import process from "node:process";

import { assertChromeWebStoreEnv, loadChromeWebStoreEnv } from "./chrome-webstore-env.mjs";

const DEFAULT_MANIFEST = "apps/chrome-extension/public/manifest.json";
const DEFAULT_PACKAGE_JSON = "apps/chrome-extension/package.json";
const SUCCESSFUL_SUBMISSION_STATES = new Set([
  "PENDING_REVIEW",
  "PUBLISHED",
  "PUBLISHED_TO_TESTERS",
  "STAGED",
]);

const command = process.argv[2];
const jsonOutput = process.argv.includes("--json");

const readOption = (name, fallback = null) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  if (!process.argv[index + 1]) throw new Error(`${name} requires a value`);
  return process.argv[index + 1];
};

if (!["publish", "status"].includes(command)) {
  throw new Error(
    "Usage: node scripts/chrome-webstore.mjs <status|publish> [--env-file path] [--manifest path] [--package path] [--json]",
  );
}

const envFile = readOption("--env-file", ".env.chrome-webstore");
const manifestFile = readOption("--manifest", DEFAULT_MANIFEST);
const packageJsonFile = readOption("--package-json", DEFAULT_PACKAGE_JSON);
const extensionPackageFile = readOption("--package");
const credentials = await loadChromeWebStoreEnv(envFile);
assertChromeWebStoreEnv(credentials);

const readJsonFile = async (file) => JSON.parse(await readFile(file, "utf8"));
const manifest = await readJsonFile(manifestFile);
const extensionPackage = await readJsonFile(packageJsonFile);
const localVersion = manifest.version;

if (localVersion !== extensionPackage.version) {
  throw new Error(
    `Manifest version ${localVersion} does not match package version ${extensionPackage.version}`,
  );
}

const requestJson = async (url, init, label) => {
  const response = await fetch(url, init);
  const text = await response.text();
  let body = {};

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!response.ok) {
    const detail =
      body.error?.message || body.error_description || body.message || response.statusText;
    throw new Error(`${label} failed (${response.status}): ${detail}`);
  }

  return body;
};

const getAccessToken = async () => {
  const body = new URLSearchParams({
    client_id: credentials.CWS_CLIENT_ID,
    client_secret: credentials.CWS_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: credentials.CWS_REFRESH_TOKEN,
  });
  const response = await requestJson(
    "https://oauth2.googleapis.com/token",
    {
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
    },
    "OAuth token refresh",
  );

  if (!response.access_token) throw new Error("OAuth response did not include an access token");
  return response.access_token;
};

const itemName = `publishers/${encodeURIComponent(credentials.CWS_PUBLISHER_ID)}/items/${encodeURIComponent(credentials.CWS_EXTENSION_ID)}`;
const apiUrl = (suffix) => `https://chromewebstore.googleapis.com/v2/${itemName}:${suffix}`;
const uploadUrl = `https://chromewebstore.googleapis.com/upload/v2/${itemName}:upload`;
const authorizationHeaders = (accessToken) => ({
  Authorization: `Bearer ${accessToken}`,
});

const fetchRawStatus = (accessToken) =>
  requestJson(
    apiUrl("fetchStatus"),
    { headers: authorizationHeaders(accessToken), method: "GET" },
    "Chrome Web Store status",
  );

const revisionVersion = (revision) =>
  revision?.distributionChannels?.find((channel) => channel.crxVersion)?.crxVersion || null;

const normalizeStatus = (rawStatus) => {
  const publishedVersion = revisionVersion(rawStatus.publishedItemRevisionStatus);
  const submittedVersion = revisionVersion(rawStatus.submittedItemRevisionStatus);
  const publishedState = rawStatus.publishedItemRevisionStatus?.state || null;
  const submittedState = rawStatus.submittedItemRevisionStatus?.state || null;

  return {
    itemId: rawStatus.itemId || credentials.CWS_EXTENSION_ID,
    localVersion,
    publishedVersion,
    publishedState,
    submittedVersion,
    submittedState,
    upToDate: [publishedVersion, submittedVersion].includes(localVersion),
    pendingReview: submittedState === "PENDING_REVIEW",
    uploadState: rawStatus.lastAsyncUploadState || null,
    takenDown: Boolean(rawStatus.takenDown),
    warned: Boolean(rawStatus.warned),
  };
};

const printStatus = (status) => {
  if (jsonOutput) {
    console.log(JSON.stringify(status, null, 2));
    return;
  }

  console.log(`Item: ${status.itemId}`);
  console.log(`Local version: ${status.localVersion}`);
  console.log(
    `Published: ${status.publishedVersion || "none"} (${status.publishedState || "none"})`,
  );
  console.log(
    `Submitted: ${status.submittedVersion || "none"} (${status.submittedState || "none"})`,
  );
  console.log(`Up to date: ${status.upToDate ? "yes" : "no"}`);
  console.log(`Pending review: ${status.pendingReview ? "yes" : "no"}`);
};

const accessToken = await getAccessToken();
const initialRawStatus = await fetchRawStatus(accessToken);
const initialStatus = normalizeStatus(initialRawStatus);

if (command === "status") {
  printStatus(initialStatus);
  process.exit(0);
}

if (initialStatus.takenDown || initialStatus.warned) {
  throw new Error("The Chrome Web Store item has a policy warning or takedown");
}

if (initialStatus.upToDate) {
  printStatus({ ...initialStatus, skipped: true });
  if (!jsonOutput) {
    console.log(`Skipping publish because v${localVersion} is already published or submitted.`);
  }
  process.exit(0);
}

if (!extensionPackageFile) {
  throw new Error("publish requires --package <extension.zip>");
}

const packageBytes = await readFile(extensionPackageFile);
let uploadResponse = await requestJson(
  uploadUrl,
  {
    body: packageBytes,
    headers: {
      ...authorizationHeaders(accessToken),
      "Content-Type": "application/zip",
      "X-Goog-Upload-File-Name": basename(extensionPackageFile),
      "X-Goog-Upload-Protocol": "raw",
    },
    method: "POST",
  },
  "Chrome Web Store package upload",
);

for (
  let attempt = 0;
  uploadResponse.uploadState === "UPLOAD_IN_PROGRESS" && attempt < 30;
  attempt++
) {
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 2_000));
  const uploadStatus = await fetchRawStatus(accessToken);
  uploadResponse = { uploadState: uploadStatus.lastAsyncUploadState };
}

if (uploadResponse.uploadState !== "UPLOAD_SUCCEEDED") {
  throw new Error(
    `Chrome Web Store upload ended in ${uploadResponse.uploadState || "unknown state"}`,
  );
}

await requestJson(
  apiUrl("publish"),
  {
    body: JSON.stringify({ blockOnWarnings: true, publishType: "DEFAULT_PUBLISH" }),
    headers: {
      ...authorizationHeaders(accessToken),
      "Content-Type": "application/json",
    },
    method: "POST",
  },
  "Chrome Web Store publish",
);

let finalStatus = normalizeStatus(await fetchRawStatus(accessToken));
let finalState = finalStatus.submittedState || finalStatus.publishedState;

for (let attempt = 0; !finalState && attempt < 5; attempt++) {
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 2_000));
  finalStatus = normalizeStatus(await fetchRawStatus(accessToken));
  finalState = finalStatus.submittedState || finalStatus.publishedState;
}

if (!finalState) {
  throw new Error("Chrome Web Store publish succeeded but no submission state was returned");
}

if (!SUCCESSFUL_SUBMISSION_STATES.has(finalState)) {
  throw new Error(`Chrome Web Store publish ended in ${finalState}`);
}

printStatus(finalStatus);
