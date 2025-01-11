import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export const BASE_URL = "http://localhost:4200";

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
    const formData = new FormData();
    formData.append("file", file);

    const { status, data } = await axios.post(BASE_URL + "/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
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
  };

  const getAllFiles = async () => {
    const { data } = await axios.get(BASE_URL + "/files");
    setFiles(data);
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
