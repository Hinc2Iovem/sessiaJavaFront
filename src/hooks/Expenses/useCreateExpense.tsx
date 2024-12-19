import { axiosCustomized } from "@/api/axios";
import { CreateExpenseTypes } from "@/features/NewExpense/NewExpense";
import { useMutation } from "@tanstack/react-query";

export default function useCreateExpense() {
  return useMutation({
    mutationFn: (expense: CreateExpenseTypes) =>
      axiosCustomized.post(`/expenses`, {
        ...expense,
      }),
  });
}
