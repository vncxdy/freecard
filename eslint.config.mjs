import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const ignoredPaths = [
  ".next/**",
  "node_modules/**",
  "out/**",
  "build/**",
  "dist/**",
  "coverage/**"
];

const eslintConfig = [...nextVitals, ...nextTypescript, { ignores: ignoredPaths }];

export default eslintConfig;
