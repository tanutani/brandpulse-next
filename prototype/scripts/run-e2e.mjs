import { spawn } from "node:child_process";
import process from "node:process";

const nextCli = "node_modules/next/dist/bin/next";
const playwrightCli = "node_modules/@playwright/test/cli.js";
const TEST_PORT = "3107";
const TEST_ENV = {
  ...process.env,
  DEMO_MODE: "static",
  LIVE_AI_ENABLED: "false",
  GEMINI_API_KEY: "",
  NEXT_TELEMETRY_DISABLED: "1",
  PLAYWRIGHT_BASE_URL: `http://127.0.0.1:${TEST_PORT}`,
};

function run(commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, commandArgs, { stdio: "inherit", env: TEST_ENV });
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

const server = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1", "--port", TEST_PORT], {
  stdio: ["ignore", "inherit", "inherit"],
  env: TEST_ENV,
});

let exitCode = 1;
try {
  await waitForServer(TEST_ENV.PLAYWRIGHT_BASE_URL);
  exitCode = await run([playwrightCli, "test", "--config=playwright.external.config.ts"]);
} finally {
  server.kill();
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 1_000)),
  ]);
}

process.exit(exitCode);
