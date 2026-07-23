import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import process from "node:process";

const SOURCE_MANIFEST = "apps/chrome-extension/public/manifest.json";
const DIST_MANIFEST = "apps/chrome-extension/dist/manifest.json";
const EXTENSION_PACKAGE = "apps/chrome-extension/package.json";
const DIST_DIRECTORY = resolve("apps/chrome-extension/dist");

const getOutputArgument = () => {
  const index = process.argv.indexOf("--output");
  if (index === -1) return null;
  if (!process.argv[index + 1]) throw new Error("--output requires a path");
  return process.argv[index + 1];
};

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));

const sourceManifest = await readJson(SOURCE_MANIFEST);
const distManifest = await readJson(DIST_MANIFEST);
const extensionPackage = await readJson(EXTENSION_PACKAGE);

if (sourceManifest.version !== distManifest.version) {
  throw new Error(
    `Built manifest version ${distManifest.version} does not match source ${sourceManifest.version}`,
  );
}

if (sourceManifest.version !== extensionPackage.version) {
  throw new Error(
    `Manifest version ${sourceManifest.version} does not match package ${extensionPackage.version}`,
  );
}

const output = resolve(
  getOutputArgument() || `artifacts/acer-almanac-chrome-${sourceManifest.version}.zip`,
);
if (!output.endsWith(".zip")) throw new Error("Extension package output must end in .zip");

await mkdir(dirname(output), { recursive: true });
await rm(output, { force: true });

const archive = spawnSync("zip", ["-qr", output, "."], {
  cwd: DIST_DIRECTORY,
  encoding: "utf8",
  env: { ...process.env, COPYFILE_DISABLE: "1" },
});

if (archive.error) throw archive.error;
if (archive.status !== 0) {
  throw new Error(archive.stderr || `zip exited with status ${archive.status}`);
}

console.log(`Packaged ${basename(output)} from manifest v${sourceManifest.version}`);
console.log(output);
