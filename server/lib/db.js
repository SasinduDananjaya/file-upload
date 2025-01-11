import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const DB_URL = "mongodb+srv://sasindu:sasindu@file-upload.cghm9.mongodb.net/?retryWrites=true&w=majority&appName=file-upload";
    await mongoose.connect(DB_URL, {
      dbName: "file-upload",
    });
    console.log("DB Connected!");
  } catch (err) {
    console.log("DB Connection Error: ", err);
  }
};
