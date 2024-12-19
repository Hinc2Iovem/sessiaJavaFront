import { axiosCustomized } from "@/api/axios";
import { ExpenseTypes } from "@/types/ExpenseTypes";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllExpensesForToday() {
  return useQuery({
    queryKey: ["expenses", "today", new Date().getDay()],
    queryFn: () => axiosCustomized.get<ExpenseTypes[]>(`/expenses/today`).then((r) => r.data),
  });
}
