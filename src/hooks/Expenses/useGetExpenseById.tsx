import { axiosCustomized } from "@/api/axios";
import { ExpenseTypes } from "@/types/ExpenseTypes";
import { useQuery } from "@tanstack/react-query";

export default function useGetExpenseById(expenseId: number) {
  return useQuery({
    queryKey: ["expenses", expenseId],
    queryFn: () => axiosCustomized.get<ExpenseTypes>(`/expenses/${expenseId}`).then((r) => r.data),
    enabled: !!expenseId,
  });
}
