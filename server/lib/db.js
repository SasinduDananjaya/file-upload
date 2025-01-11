import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    const DB_URL = process.env.DB_URL;
    await mongoose.connect(DB_URL, {
      dbName: "file-upload",
    });
    console.log("DB Connected!");
  } catch (err) {
    console.log("DB Connection Error: ", err);
  }
};
