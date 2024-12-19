import { axiosCustomized } from "@/api/axios";
import { PrevExpenseTypes } from "@/types/PrevExpenseTypes";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllPrevExpenses(expenseId: number) {
  return useQuery({
    queryKey: ["prevExpenses", "expenses", expenseId],
    queryFn: () => axiosCustomized.get<PrevExpenseTypes[]>(`/prevExpenses/expenses/${expenseId}`).then((r) => r.data),
    enabled: !!expenseId,
  });
}
