import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const publicDir = path.join(process.cwd(), "public");
  const fileNames = fs.readdirSync(publicDir);
  const jsonFileNames = fileNames.filter((fileName) =>
    fileName.endsWith(".json")
  );

  let files = [];

  for (let i = 0; i < jsonFileNames.length; i++) {
    const fileName = jsonFileNames[i];
    const filePath = path.join(process.cwd(), "public", fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    files.push({ file: fileName, content: JSON.parse(fileContent) });
  }

  res.status(200).json(files);
}
