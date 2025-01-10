import { useState } from "react";
import { toast } from "react-hot-toast";
import { uploadService } from "../services/upload";

interface UseFileUploadOptions {
  maxSize?: number;
  acceptedTypes?: string[];
}

export function useFileUpload({
  maxSize = 10 * 1024 * 1024,
  acceptedTypes = ["text/csv"],
}: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a CSV file.");
      return false;
    }

    if (file.size > maxSize) {
      toast.error(
        `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB.`
      );
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) {
      throw new Error("Invalid file");
    }

    setIsUploading(true);
    try {
      try {
        const res = await uploadService.uploadFile(file);
        console.log(res);
        toast.success("File uploaded");
      } catch (error) {
        toast.error("Internal server error");
        throw error;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    validateFile,
  };
}
