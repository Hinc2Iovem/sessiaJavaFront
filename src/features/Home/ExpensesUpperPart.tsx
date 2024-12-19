import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExpenseFrequency } from "@/consts/ExpenseFrequency";
import useGetAllExpenses from "@/hooks/Expenses/useGetAllExpenses";
import useGetAllExpensesForToday from "@/hooks/Expenses/useGetAllExpensesForToday";
import { ExpenseTypes } from "@/types/ExpenseTypes";
import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";

export default function ExpensesUpperPart() {
  const { data: items } = useGetAllExpensesForToday();

  return (
    <div className="flex flex-col gap-[1rem]">
      <header className="w-full flex">
        <Link to="/newExpense" className="ml-auto">
          <Plus size={40} className="text-white hover:opacity-80 active:scale-[0.96] transition-all" />
        </Link>
      </header>
      gfdgdfg
      <div className="flex gap-[1rem] flex-wrap">
        <ExpenseFrequencyBlocks expenseFrequencyType="Today" items={items} />
        <ExpenseFrequencyBlocks expenseFrequencyType="DAILY" />
        <ExpenseFrequencyBlocks expenseFrequencyType="MONTHLY" />
        <ExpenseFrequencyBlocks expenseFrequencyType="YEARLY" />
      </div>
    </div>
  );
}

type ExpenseFrequencyBlocksTypes = {
  items?: ExpenseTypes[];
  expenseFrequencyType: ExpenseFrequency | "Today";
};

function ExpenseFrequencyBlocks({ items, expenseFrequencyType }: ExpenseFrequencyBlocksTypes) {
  const enabled = expenseFrequencyType !== "Today";
  const [open, setOpen] = useState(false);
  const { data: itemsByType } = useGetAllExpenses(enabled, expenseFrequencyType as ExpenseFrequency);
  const currentItems = items?.length ? items : itemsByType;

  return (
    <div className="flex-grow min-w-[20rem]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full hover:bg-accent transition-all capitalize text-[1.5rem] px-[1rem] py-[2rem] rounded-md"
          >
            {`${expenseFrequencyType === "Today" ? expenseFrequencyType : expenseFrequencyType.toLowerCase()} Expense`}
            <ChevronsUpDown
              size={10}
              accentHeight={20}
              absoluteStrokeWidth={true}
              className="ml-2 w-[4rem] h-[4rem] shrink-0 opacity-50"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[20rem] w-full">
          <Command>
            <CommandInput className="text-[1.5rem]" placeholder="Search expense..." />
            <CommandList>
              <CommandEmpty className="text-[1.3rem]">No expense found.</CommandEmpty>
              <CommandGroup>
                {currentItems?.map((expense) => (
                  <CommandItem
                    key={expense.name}
                    value={expense.name}
                    onSelect={() => {
                      setOpen(false);
                    }}
                  >
                    {expense.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
