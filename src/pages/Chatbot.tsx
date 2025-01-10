import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAI } from "../hooks/useAI";

const querySchema = z.object({
  query: z.string(),
});

type queryFormData = z.infer<typeof querySchema>;

export default function Chatbot() {
  const [convo, setConvo] = useState<string[]>([]);
  const { chatWithAI } = useAI();
  const {
    register,
    handleSubmit,
    reset: resetInput,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<queryFormData>({
    resolver: zodResolver(querySchema),
  });

  const onSubmit = async (data: queryFormData) => {
    try {
      const response = await chatWithAI(data.query);
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Denki Chatbot
        </h1>
      </div>
      <div className="max-w-96 mx-auto">
        <div>
          <div className="mb-3 px-2 py-1 text-white bg-indigo-600 w-max max-w-[80%] rounded-t-lg rounded-r-lg">
            Hello, you can ask me anything
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
          <div className="mb-6 flex">
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
    </div>
  );
}
