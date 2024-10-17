import { promises as fs } from "fs";
import path from "path";

const Handler = async (req, res) => {
  const { fileName } = req.query;
  if (req.method === "POST") {
    try {
      const data = req.body;
      const jsonDir = path.join(process.cwd(), "public");
      const filePath = path.join(jsonDir, `${fileName}`);

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));

      res.status(200).json({ message: "File written successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error writing file", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default Handler;
