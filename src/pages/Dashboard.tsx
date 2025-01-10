import { useEffect, useState } from "react";
import { AlertTriangle, Upload } from "lucide-react";
import UploadForm from "../components/upload/UploadForm";
import Modal from "../components/ui/Modal";
import { useConsumption } from "../hooks/useConsumptions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAI } from "../hooks/useAI";
import toast from "react-hot-toast";

// interface FileRecord {
//   id: string;
//   name: string;
//   uploadedAt: Date;
//   preview: {
//     headers: string[];
//     rows: string[][];
//   };
// }

const querySchema = z.object({
  query: z.string(),
});

type queryFormData = z.infer<typeof querySchema>;

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convo, setConvo] = useState<string[]>([]);
  const { consumptions, isLoading, refetch, reset } = useConsumption();
  const { askAnalyze } = useAI();
  const {
    register,
    handleSubmit,
    reset: resetInput,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<queryFormData>({
    resolver: zodResolver(querySchema),
  });
  // const [files, setFiles] = useState<FileRecord[]>([]);

  const handleUploadSuccess = () =>
    // file: File,
    // preview: { headers: string[]; rows: string[][] }
    {
      // const newFile: FileRecord = {
      //   id: Date.now().toString(),
      //   name: file.name,
      //   uploadedAt: new Date(),
      //   preview,
      // };
      // setFiles((prev) => [newFile, ...prev]);
      refetch();
      setIsModalOpen(false);
    };

  const stringDate = (d: Date): string => {
    const date = new Date(d).toLocaleDateString();
    return date;
  };

  const stringTime = (d: Date): string => {
    const date = new Date(d).toLocaleTimeString();
    return date;
  };

  const onSubmit = async (data: queryFormData) => {
    try {
      const response = await askAnalyze(data.query);
      setConvo([...convo, data.query, response]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to ask AI");
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      resetInput({ query: "" });
    }
  }, [isSubmitSuccessful, resetInput]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Energy Consumption Table Chatbot
        </h1>
      </div>
      {consumptions?.length != 0 && (
        <div className="max-w-96 mx-auto mb-6 p-2 rounded-lg bg-sky-200">
          <div>
            <div className="mb-3 px-2 py-1 text-white bg-indigo-600 w-4/5 rounded-t-lg rounded-r-lg">
              Hello, i have read your table and i can find specific table value
              according to your need.
            </div>
            {convo.map((conversation, i) => {
              if (i % 2 == 0) {
                return (
                  <div className="flex justify-end">
                    <div className="mb-3 px-2 py-1 text-white bg-green-600 w-4/5 rounded-t-lg rounded-l-lg">
                      {conversation}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="mb-3 px-2 py-1 text-white bg-indigo-600 w-4/5 rounded-t-lg rounded-r-lg">
                    {conversation}
                  </div>
                );
              }
            })}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex">
              <textarea
                {...register("query")}
                className="mr-2 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.query && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.query.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? "Asking..." : "Ask"}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold text-gray-900">Table</h1>
        {consumptions?.length == 0 ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload CSV
          </button>
        ) : (
          <button
            onClick={() => reset()}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Reset
          </button>
        )}
      </div>

      {consumptions?.length != 0 && (
        <>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appliance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Energy Consumption
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consumptions?.map((consumption, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {i + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stringDate(consumption.consumption_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stringTime(consumption.consumption_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {consumption.appliance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {consumption.energy_consumption}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {consumption.room}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {consumption.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">
                Uploaded on {file.uploadedAt.toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {file.preview.headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {file.preview.rows.slice(0, 3).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {file.preview.rows.length > 3 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Showing 3 of {file.preview.rows.length} rows
                </p>
              )}
            </div>
          </div>
        ))}
      </div> */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload CSV File"
      >
        <UploadForm
          onSuccess={handleUploadSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
