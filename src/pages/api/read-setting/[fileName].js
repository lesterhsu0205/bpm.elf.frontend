import fs  from "fs";
import path from "path";

const Handler = (req, res) => {
  const { fileName } = req.query;
  if (req.method === "GET") {
    try {
      const jsonDir = path.join(process.cwd(), "public");
      const filePath = path.join(jsonDir, `${fileName}`);

      const fileContent = fs.readFileSync(filePath, "utf-8");

      res.status(200).json(JSON.parse(fileContent));
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error reading file", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default Handler;
