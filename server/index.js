import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import UploadModel from "./model/upload.schema.js";

const app = express();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Middleware
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Define APIs
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const newFile = new UploadModel({
      name: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path,
    });

    await newFile.save();

    res.status(201).json({ message: "File uploaded successfully!" });
  } catch (err) {
    console.log("Upload Error", err);
  }
});

app.get("/files", async (req, res) => {
  const files = await UploadModel.find().lean().exec();
  return res.status(200).send(files);
});

// Server Start
app.listen(4200, async () => {
  console.log("Server Started at: 4200");
  await connectDB();
});
