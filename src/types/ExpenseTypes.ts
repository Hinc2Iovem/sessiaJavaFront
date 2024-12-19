import { ExpenseFrequency } from "@/consts/ExpenseFrequency";

export type ExpenseTypes = {
  id: number;
  name: string;
  spentAmount: number;
  spentAt: string;
  type: ExpenseFrequency;
};
