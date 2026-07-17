import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
    pedantic: "off",
    style: "off",
    restriction: "off",
    nursery: "off",
  },
  plugins: ["typescript", "unicorn", "import", "vitest", "oxc"],
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/.astro/**",
    "**/.turbo/**",
    "**/coverage/**",
    "**/playwright-report/**",
    "**/test-results/**",
  ],
  overrides: [
    {
      files: ["**/*.test.{ts,tsx}", "tests/**/*.ts"],
      env: {
        browser: true,
        node: true,
      },
    },
    {
      files: ["**/*.astro"],
      rules: {
        "no-unused-vars": "off",
      },
    },
  ],
});
