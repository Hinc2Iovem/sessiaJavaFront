import NewExpenseForm from "@/features/NewExpense/NewExpense";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/newExpense")({
  component: NewExpense,
});

function NewExpense() {
  return <NewExpenseForm />;
}
