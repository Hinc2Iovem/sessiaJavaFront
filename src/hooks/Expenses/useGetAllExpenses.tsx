import { axiosCustomized } from "@/api/axios";
import { ExpenseFrequency } from "@/consts/ExpenseFrequency";
import { ExpenseTypes } from "@/types/ExpenseTypes";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllExpenses(enabled?: boolean, type?: ExpenseFrequency) {
  return useQuery({
    queryKey: ["expenses", "type", type],
    queryFn: () => axiosCustomized.get<ExpenseTypes[]>(`/expenses?type=${type}`).then((r) => r.data),
    enabled,
  });
}
