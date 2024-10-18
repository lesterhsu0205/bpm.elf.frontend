import fs from "fs";
import path from "path";

const Handler = (req, res) => {
  const { fileName } = req.query;
  if (req.method === "DELETE") {
    try {
      const jsonDir = path.join(process.cwd(), "public");
      const filePath = path.join(jsonDir, `${fileName}`);

      fs.unlinkSync(filePath)

      res.status(200).json({ message: "File delete successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error delete file", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default Handler;
