import { axiosCustomized } from "@/api/axios";
import { ExpenseTypes } from "@/types/ExpenseTypes";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateExpense(expenseId: number, savePrev?: boolean) {
  return useMutation({
    mutationFn: (expense: ExpenseTypes) =>
      axiosCustomized.patch(`/expenses/${expenseId}?savePrev=${savePrev}`, {
        ...expense,
      }),
  });
}
