import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import FileUpload from "../ui/FileUpload";
import CSVPreview from "../csv/CSVPreview";
import { parseCSV, validateCSVStructure } from "../../utils/csv";
import { useFileUpload } from "../../hooks/useFileUpload";

const fileSizeLimit = 10 * 1024 * 1024;
const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => ["text/csv"].includes(file.type), {
      message: "Invalid document file type",
    })
    .refine((file) => file.size <= fileSizeLimit, {
      message: "File size should not exceed 10MB",
    }),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadFormProps {
  onSuccess?: (
    file: File,
    preview: { headers: string[]; rows: string[][] }
  ) => void;
  onCancel?: () => void;
}

export default function UploadForm({ onSuccess, onCancel }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const { uploadFile } = useFileUpload();
  const [preview, setPreview] = useState<{
    headers: string[];
    rows: string[][];
  } | null>(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const handleFileChange = async (newFile: File | null) => {
    try {
      setFile(newFile);
      if (!newFile) {
        setPreview(null);
        return;
      }
      const rows = await parseCSV(newFile as File);
      const { isValid, error } = validateCSVStructure(rows);

      if (!isValid) {
        toast.error(error as string);
        setFile(null);
        return;
      }
      setValue("file", newFile, { shouldValidate: true });

      const [headers, ...dataRows] = rows;
      setPreview({ headers, rows: dataRows });
    } catch (error) {
      console.log(error);

      toast.error("Failed to parse CSV file");
      setFile(null);
      setPreview(null);
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    try {
      if (!file || !preview) {
        toast.error("Please upload a CSV file");
        return;
      }
      const res = await uploadFile(data.file);
      console.log(res);

      onSuccess?.(file, preview);
    } catch (error) {
      console.log(error);

      toast.error("Failed to process CSV file");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            CSV File
          </label>
          <FileUpload
            value={file ?? undefined}
            onChange={handleFileChange}
            className="mt-1"
          />
          {errors.file && (
            <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
          )}
        </div>

        {preview && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="text-sm font-medium text-gray-700">Preview</h3>
            </div>
            <div className="p-4">
              <CSVPreview
                headers={preview.headers}
                rows={preview.rows}
                maxRows={5}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !file}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Upload"}
        </button>
      </div>
    </form>
  );
}
