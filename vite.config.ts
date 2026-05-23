import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { defineConfig } from "vite-plus";

const sitesWorker = `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== "GET") return response;

    const url = new URL(request.url);
    if (url.pathname.includes(".")) return response;

    return env.ASSETS.fetch(new Request(new URL("/", url), request));
  },
};

export default worker;
`;

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  plugins: [
    {
      name: "sites",
      apply: "build",
      async buildStart() {
        await rm(resolve("dist"), { force: true, recursive: true });
      },
      async closeBundle() {
        const serverDirectory = resolve("dist/server");
        const metadataDirectory = resolve("dist/.openai");

        await mkdir(serverDirectory, { recursive: true });
        await mkdir(metadataDirectory, { recursive: true });
        await writeFile(resolve(serverDirectory, "index.js"), sitesWorker);
        await copyFile(resolve(".openai/hosting.json"), resolve(metadataDirectory, "hosting.json"));
      },
    },
  ],
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    sortImports: true,
    sortPackageJson: true,
    sortTailwindcss: true,
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
