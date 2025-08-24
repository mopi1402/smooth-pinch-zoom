import typescript from "@rollup/plugin-typescript";

export default [
  // ES Module build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true,
    },
    plugins: [typescript()],
  },

  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    plugins: [typescript()],
  },

  // UMD build for browsers
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "SmoothPinchZoom",
      sourcemap: true,
      exports: "named",
    },
    plugins: [typescript()],
  },
];
