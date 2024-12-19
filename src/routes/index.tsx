import Expenses from "@/features/Home/Expenses";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: ExpenseHomePage,
});

function ExpenseHomePage() {
  return (
    <>
      <Expenses />
    </>
  );
}
