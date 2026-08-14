import { spawn } from "node:child_process";
import process from "node:process";

const nextCli = "node_modules/next/dist/bin/next";
const playwrightCli = "node_modules/@playwright/test/cli.js";

function run(commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, commandArgs, { stdio: "inherit", env: process.env });
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

const buildCode = await run([nextCli, "build"]);
if (buildCode !== 0) process.exit(buildCode);

const server = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1"], {
  stdio: ["ignore", "inherit", "inherit"],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});

let exitCode = 1;
try {
  await waitForServer("http://127.0.0.1:3000");
  exitCode = await run([playwrightCli, "test", "--config=playwright.external.config.ts"]);
} finally {
  server.kill();
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 1_000)),
  ]);
}

process.exit(exitCode);
