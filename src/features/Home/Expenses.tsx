import ExpensesBottomPart from "./ExpensesBottomPart";
import ExpensesUpperPart from "./ExpensesUpperPart";

export default function Expenses() {
  return (
    <section className="flex flex-col gap-[2rem] justify-between">
      <ExpensesUpperPart />
      <ExpensesBottomPart />
    </section>
  );
}
