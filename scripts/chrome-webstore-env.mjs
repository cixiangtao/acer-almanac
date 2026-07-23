import { readFile } from "node:fs/promises";

export const CHROME_WEBSTORE_ENV_KEYS = [
  "CWS_CLIENT_ID",
  "CWS_CLIENT_SECRET",
  "CWS_REFRESH_TOKEN",
  "CWS_PUBLISHER_ID",
  "CWS_EXTENSION_ID",
];

const parseValue = (value) => {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const parseEnvFile = (contents, envFile) => {
  const values = {};

  for (const [index, sourceLine] of contents.split(/\r?\n/u).entries()) {
    const line = sourceLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = /^([A-Z][A-Z0-9_]*)=(.*)$/u.exec(line);
    if (!match) {
      throw new Error(`Invalid line ${index + 1} in ${envFile}`);
    }

    values[match[1]] = parseValue(match[2]);
  }

  return values;
};

export const loadChromeWebStoreEnv = async (envFile = ".env.chrome-webstore") => {
  let fileValues;
  try {
    fileValues = parseEnvFile(await readFile(envFile, "utf8"), envFile);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      fileValues = {};
    } else {
      throw error;
    }
  }

  return Object.fromEntries(
    CHROME_WEBSTORE_ENV_KEYS.map((key) => [key, process.env[key] || fileValues[key] || ""]),
  );
};

export const assertChromeWebStoreEnv = (values) => {
  const missing = CHROME_WEBSTORE_ENV_KEYS.filter((key) => !values[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Chrome Web Store values: ${missing.join(", ")}`);
  }
};

export const maskSecret = (value) => {
  if (value.length <= 8) return "*".repeat(value.length);
  return `${value.slice(0, 4)}${"*".repeat(Math.min(12, value.length - 8))}${value.slice(-4)}`;
};
