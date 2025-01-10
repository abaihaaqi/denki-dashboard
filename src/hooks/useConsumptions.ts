import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { consumptionService } from "../services/consumptions";
import toast from "react-hot-toast";

export function useConsumption() {
  const queryClient = useQueryClient();

  const {
    data: consumptions,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["consumptions"],
    queryFn: consumptionService.getConsumptions,
  });

  const resetMutation = useMutation({
    mutationFn: consumptionService.reset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumptions"] });
      toast.success("Consumption reset successfully");
    },
    onError: () => {
      toast.error("Failed to reset consumption");
    },
  });

  return {
    consumptions,
    isLoading,
    refetch,
    reset: resetMutation.mutate,
  };
}
