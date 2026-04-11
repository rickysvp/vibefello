import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      ["tests/client/**/*.test.tsx", "jsdom"],
      ["tests/server/**/*.test.ts", "node"],
    ],
    setupFiles: ["tests/setup/client.ts"],
  },
});
