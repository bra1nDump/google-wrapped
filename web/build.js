const esbuild = require("esbuild");
const copyStaticFiles = require("esbuild-copy-static-files");

const shouldWatch = process.argv.slice(2)[0] === "--watch";

// Will not reload if html is updated
esbuild.build({
  entryPoints: ["src/App.tsx", "src/BaggyWords.tsx"],
  outdir: "public",
  platform: "browser",
  bundle: true,
  sourcemap: true,
  watch: shouldWatch,
  external: ["*.woff2", "oval-background.png?v=1"],

  plugins: [
    // Will not reload - does not respect watch option
    copyStaticFiles({
      src: "src/static",
      dest: "public",
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
      recursive: true,
    }),
    copyStaticFiles({
      src: "assets",
      dest: "public",
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
      recursive: true,
    }),

    copyStaticFiles({
      src: "../datasets-client",
      dest: "public",
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
      recursive: true,
    }),
  ],
});
