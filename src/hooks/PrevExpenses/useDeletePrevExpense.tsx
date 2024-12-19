import { axiosCustomized } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export default function useDeletePrevExpense(prevExpenseId: number) {
  return useMutation({
    mutationFn: () => axiosCustomized.delete(`/prevExpenses/${prevExpenseId}`),
  });
}
