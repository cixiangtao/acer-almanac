import { spawnSync } from "node:child_process";
import process from "node:process";

import {
  assertChromeWebStoreEnv,
  CHROME_WEBSTORE_ENV_KEYS,
  loadChromeWebStoreEnv,
  maskSecret,
} from "./chrome-webstore-env.mjs";

const readOption = (name, fallback = null) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  if (!process.argv[index + 1]) throw new Error(`${name} requires a value`);
  return process.argv[index + 1];
};

const dryRun = process.argv.includes("--dry-run");
const envFile = readOption("--env-file", ".env.chrome-webstore");
const githubEnvironment = readOption("--github-environment", "chrome-web-store");
const values = await loadChromeWebStoreEnv(envFile);
assertChromeWebStoreEnv(values);

const runGh = (args, input) => {
  const result = spawnSync("gh", args, {
    encoding: "utf8",
    input,
    stdio: input === undefined ? ["ignore", "pipe", "pipe"] : ["pipe", "pipe", "pipe"],
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `gh ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
};

if (dryRun) {
  for (const key of CHROME_WEBSTORE_ENV_KEYS) {
    console.log(`${key}=${maskSecret(values[key])}`);
  }
  console.log(`Target GitHub environment: ${githubEnvironment}`);
  console.log("Dry run only; no GitHub secrets were changed.");
  process.exit(0);
}

runGh(["auth", "status"]);
const repository =
  readOption("--repo") ||
  runGh(["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);

for (const key of CHROME_WEBSTORE_ENV_KEYS) {
  runGh(["secret", "set", key, "--repo", repository, "--env", githubEnvironment], values[key]);
  console.log(`Updated ${key} for ${repository} environment ${githubEnvironment}`);
}
