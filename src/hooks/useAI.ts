import { useState } from "react";
import toast from "react-hot-toast";
import { AIService } from "../services/ai";

export function useAI() {
  const [isAsking, setIsAsking] = useState(false);

  const askAnalyze = async (query: string): Promise<string> => {
    setIsAsking(true);
    try {
      try {
        const response = await AIService.askAnalyze(query);
        return response;
      } catch (error) {
        toast.error("Internal server error");
        throw error;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to ask AI");
    } finally {
      setIsAsking(false);
    }
  };

  const chatWithAI = async (query: string): Promise<string> => {
    setIsAsking(true);
    try {
      try {
        const response = await AIService.chatWithAI(query);
        return response;
      } catch (error) {
        toast.error("Internal server error");
        throw error;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to ask AI");
    } finally {
      setIsAsking(false);
    }
  };

  return {
    askAnalyze,
    isAsking,
    chatWithAI,
  };
}
