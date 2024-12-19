import { axiosCustomized } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: number) => axiosCustomized.delete(`/expenses/${expenseId}`),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", "type"],
      });
    },
  });
}
