import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { connectDB } from "./lib/db.js";
import UploadModel from "./model/upload.schema.js";

const app = express();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Middleware
// app.use(cors(
//   {
//     origin: 'https://file-upload-client-steel.vercel.app',
//     methods: ['GET', 'POST', 'DELETE', 'PUT'],
//     credentials: true
//   }
// ));

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

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Define APIs
app.get("/", (req, res) => {
  res.send("Hello World");
});

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
    res.status(500).json(err);
  }
});

app.get("/files", async (req, res) => {
  try {
    const files = await UploadModel.find().lean().exec();
    res.status(200).json(files);
  } catch (err) {
    console.error("Files retrieval error", err);
    res.status(500).json(err);
  }
});

// Server Start
const port = process.env.PORT || 4200;
app.listen(port, async () => {
  try {
    await connectDB();
    console.log("Database connected and server started at: 4200");
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
});
