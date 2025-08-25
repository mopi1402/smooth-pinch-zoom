import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    input: resolve(__dirname, "src/index.ts"),
    output: {
      file: "dist/index.js",
      format: "umd",
      name: "SmoothPinchZoom",
      sourcemap: false,
      exports: "named",
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log", "console.warn", "console.error"],
        },
        mangle: {
          toplevel: true,
        },
        format: {
          comments: false,
        },
        ecma: 2020,
        module: true,
        toplevel: true,
      }),
    ],
  },

  {
    input: resolve(__dirname, "src/index.ts"),
    output: {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: false,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log", "console.warn", "console.error"],
        },
        mangle: {
          toplevel: true,
        },
        format: {
          comments: false,
        },
        ecma: 2020,
        module: true,
        toplevel: true,
      }),
    ],
  },

  // TypeScript declarations only
  {
    input: resolve(__dirname, "src/index.ts"),
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
