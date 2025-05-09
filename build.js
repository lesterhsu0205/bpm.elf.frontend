const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const tar = require("tar");

const distPath = path.resolve(
  __dirname,
  "dist/opt/sw/bpm.elf.frontend/{host}-01/nodejs"
);
const standalonePath = path.resolve(__dirname, ".next/standalone");
const staticPath = path.resolve(__dirname, ".next/static");
const publicPath = path.resolve(__dirname, "public");
// const dockerComposeYml = path.resolve(__dirname, "docker-compose.yml");
const patchHttpsJs = path.resolve(__dirname, "patch-https.js");
const certPath = path.resolve(__dirname, "certs");
const outputTar = path.resolve(__dirname, "dist/bpm.elf.frontend.tar.gz");

const mkdirRecursive = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.info(`Created directory: ${dir}`);
  }
};

const copyRecursiveSync = (src, dest) => {
  const stat = fs.statSync(src);
  if (stat.isFile()) {
    // 如果是檔案就直接拷貝，然後結束
    mkdirRecursive(dest);
    const fileName = path.basename(src);
    const destFile = path.join(dest, fileName);
    fs.copyFileSync(src, destFile);
    console.info(`Copied file: ${src} -> ${destFile}`);
    return;
  }
  // 否則才當資料夾掃目錄
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
    fs.rmSync("dist", { recursive: true, force: true });

    copyRecursiveSync(standalonePath, distPath);
    copyRecursiveSync(staticPath, path.join(distPath, ".next/static"));
    copyRecursiveSync(publicPath, path.join(distPath, "public"));
    copyRecursiveSync(certPath, path.join(distPath, "certs"));
    // copyRecursiveSync(dockerComposeYml, path.join(distPath, "bin"));
    copyRecursiveSync(patchHttpsJs, distPath);

    compressToTar(distPath, outputTar);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

main();
