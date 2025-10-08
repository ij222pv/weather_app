import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, prettier: eslintPluginPrettier },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: { "prettier/prettier": "error" },
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
]);
