import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export const BASE_URL = "https://file-upload-api-beta.vercel.app";

export const useUpload = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  useEffect(() => {
    getAllFiles();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      uploadedFile["preview"] = URL.createObjectURL(uploadedFile);

      setFile(uploadedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "image/*": [] },
  });

  const uploadFile = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const { status, data } = await axios.post(BASE_URL + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercentage(percentCompleted);
        },
      });
  
      if (status === 201) {
        toast("Success!", {
          description: data.message,
        });
        await getAllFiles();
        setFile(null);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast("Error!", {
        description: "File upload failed. Please try again.",
      });
    }
  };

  const getAllFiles = async () => {
    try {
      const { data } = await axios.get(BASE_URL + "/files");
      setFiles(data);
    } catch (error) {
      console.error("Fetch Files Error:", error);
      toast("Error!", {
        description: "Failed to fetch files. Please try again.",
      });
    }
  };

  return {
    isDragActive,
    getRootProps,
    getInputProps,
    file,
    uploadPercentage,
    allFiles: files,
    onUpload: uploadFile,
  };
};
