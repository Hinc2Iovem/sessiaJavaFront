import { ExpenseFrequency } from "@/consts/ExpenseFrequency";

export type PrevExpenseTypes = {
  id: number;
  expenseId: number;
  prevName: string;
  prevSpentAmount: number;
  prevSpentAt: string;
  prevType: ExpenseFrequency;
};
