import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";

export default [
  // UMD build for browsers (single file) - MINIFIED
  {
    input: "src/index.ts",
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
          drop_console: true, // Supprime console.log
          drop_debugger: true, // Supprime debugger
          pure_funcs: ["console.log"], // Supprime les appels console
          passes: 2, // Plus de passes d'optimisation
        },
        mangle: {
          toplevel: true, // Mangle les noms de variables globales
        },
        format: {
          comments: false, // Supprime tous les commentaires
        },
      }),
    ],
  },

  // TypeScript declarations only
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
