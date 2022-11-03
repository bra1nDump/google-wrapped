const esbuild = require("esbuild");
const copyStaticFiles = require("esbuild-copy-static-files");

// Will not reload if html is updated
esbuild.build({
  entryPoints: ["src/App.tsx"],
  outfile: "public/bundle.js",
  platform: "browser",
  bundle: true,
  minify: true,
  sourcemap: true,
  watch: true,

  plugins: [
    copyStaticFiles({
      src: "src/static",
      dest: "public",
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
      recursive: true,
    }),
  ],
});
