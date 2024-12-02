const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const tar = require("tar");

const distPath = path.resolve(__dirname, "dist/com.line.bank.bxi.bpm.guide");
const standalonePath = path.resolve(__dirname, ".next/standalone");
const staticPath = path.resolve(__dirname, ".next/static");
const outputTar = path.resolve(
  __dirname,
  "dist/com.line.bank.bxi.bpm.guide.tar.gz"
);

const mkdirRecursive = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.info(`Created directory: ${dir}`);
  }
};

const copyRecursiveSync = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.error(`Source path does not exist: ${dir}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    mkdirRecursive(dest);
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.info(`Copied: ${srcPath} -> ${destPath}`);
    }
  });
};

const compressToTar = (src, dest) => {
  tar
    .create(
      {
        gzip: true,
        file: dest,
        cwd: path.dirname(src),
      },
      [path.basename(src)]
    )
    .then(() => console.info(`Compressed to TAR: ${dest}`))
    .catch((err) => console.error(`Error compressing to TAR: ${err}`));
};

const main = async () => {
  try {
    mkdirRecursive(distPath);

    copyRecursiveSync(standalonePath, distPath);

    const staticDest = path.join(distPath, ".next/static");
    mkdirRecursive(staticDest);
    copyRecursiveSync(staticPath, staticDest);

    compressToTar(distPath, outputTar);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

main();
