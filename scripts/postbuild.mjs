import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const sourceDir = resolve(rootDir, "dist/client");
const targetDir = resolve(rootDir, process.env.DOCS_OUT_DIR || "docs");

if (!existsSync(sourceDir)) {
  throw new Error(`Expected TanStack Start client output at ${sourceDir}`);
}

if (sourceDir !== targetDir) {
  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(targetDir, { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true });
}

writeFileSync(resolve(targetDir, ".nojekyll"), "");
