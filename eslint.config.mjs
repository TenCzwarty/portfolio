import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "simple-import-sort": pluginSimpleImportSort,
      import: pluginImport,
    },
    rules: {
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // packages, `react` first
            ["^react", "^@?\\w"],
            // internal packages
            ["^~(/.*|$)"],
            // side effect imports
            ["^\\u0000"],
            // parent imports, `..` last
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // other relative imports, same-folder imports and `.` last
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
    },
  },
  { ignores: ["node_modules/", ".next/", ".env.d.ts"] },
];

export default eslintConfig;
