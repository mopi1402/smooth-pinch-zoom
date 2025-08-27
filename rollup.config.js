import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

const input = resolve(__dirname, "src/index.ts");

const terserConfig = {
  compress: {
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ["console.log", "console.warn", "console.error"],
    passes: 2,
  },
  mangle: {
    toplevel: true,
    properties: {
      regex: /^_/,
    },
  },
  format: {
    comments: false,
  },
  ecma: 2020,
  module: true,
  toplevel: true,
};

const getPlugins = () => [
  typescript({
    tsconfig: "./tsconfig.json",
    declaration: false,
    declarationMap: false,
  }),
  ...(isProduction ? [terser(terserConfig)] : []),
];

export default [
  {
    input,
    output: {
      file: "dist/index.js",
      format: "umd",
      name: "SmoothPinchZoom",
      sourcemap: !isProduction,
      exports: "named",
    },
    plugins: getPlugins(),
  },

  {
    input,
    output: {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: !isProduction,
    },
    plugins: getPlugins(),
  },
  {
    input,
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
