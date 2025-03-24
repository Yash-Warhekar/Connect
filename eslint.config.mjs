import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disable unused variables error
      "@typescript-eslint/ban-ts-comment": "off", // Allow @ts-ignore and @ts-nocheck
      "no-console": "warn", // Optional: Keep console logs but show warnings
    },
  },
];

export default eslintConfig;
