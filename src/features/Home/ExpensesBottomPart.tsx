import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseFrequency } from "@/consts/ExpenseFrequency";
import useDeleteExpense from "@/hooks/Expenses/useDeleteExpense";
import useGetAllExpenses from "@/hooks/Expenses/useGetAllExpenses";
import useUpdateExpense from "@/hooks/Expenses/useUpdateExpense";
import { useToast } from "@/hooks/use-toast";
import { formatDateToISOString } from "@/utils/dateFormatter";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash } from "lucide-react";
import { useState } from "react";
import { CreateExpenseTypes } from "../NewExpense/NewExpense";
import { ExpenseTypes } from "@/types/ExpenseTypes";

export default function ExpensesBottomPart() {
  const { data: expenses } = useGetAllExpenses(true, "" as ExpenseFrequency);
  const deleteExpense = useDeleteExpense();
  const rowsCount = Math.ceil((expenses?.length || 1) / 4);
  const [editingExpense, setEditingExpense] = useState({} as ExpenseTypes);
  const [deletedExpenses, setDeletedExpenses] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const handleDeletingExpense = (expenseId: number) => {
    setDeletedExpenses((prev) => [...prev, expenseId]);
    deleteExpense.mutate(expenseId);
  };

  const handleEditing = ({ id, name, spentAmount, spentAt, type }: ExpenseTypes) => {
    setEditingExpense({
      id,
      name,
      spentAmount,
      spentAt,
      type,
    });
    setShowModal(true);
  };

  return (
    <section className="mt-[6rem]">
      <Table className="text-secondary">
        <TableCaption>A list of your expenses.</TableCaption>
        <TableHeader>
          <TableRow className="hover:text-secondary">
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="">Spent Amount</TableHead>
            <TableHead className="text-right text-inherit"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!expenses?.length ? (
            <TableRow>
              <TableCell className="font-medium animate-pulse"></TableCell>
              <TableCell className="animate-pulse"></TableCell>
              <TableCell className="animate-pulse"></TableCell>
              <TableCell className="animate-pulse"></TableCell>
              <TableCell className="text-right animate-pulse"></TableCell>
            </TableRow>
          ) : (
            Array.from({ length: rowsCount }).map((_, rowIndex) => (
              <>
                {Array.from({ length: 4 }).map((_, colIndex) => {
                  const expenseIndex = rowIndex * 4 + colIndex;
                  const expense = expenses?.[expenseIndex];

                  if (!expense) return null;

                  return (
                    <TableRow
                      className={`${deletedExpenses.includes(expense.id) ? "hidden" : ""} w-full flex-grow`}
                      key={expense.id}
                    >
                      <TableCell className="font-medium">{expense.id}</TableCell>
                      <TableCell>{expense.name}</TableCell>
                      <TableCell>{formatDateToISOString(expense.spentAt)}</TableCell>
                      <TableCell className="">${expense.spentAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right flex gap-[.5rem] ">
                        <Trash onClick={() => handleDeletingExpense(expense.id)} className="hover:cursor-pointer" />
                        <Edit2 className="hover:cursor-pointer" onClick={() => handleEditing({ ...expense })} />
                        {showModal ? (
                          <EditingModal {...editingExpense} setShowModal={setShowModal} showModal={showModal} />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  );
}

function EditingModal({
  id,
  name,
  spentAmount,
  spentAt,
  type,
  setShowModal,
  showModal,
}: {
  id: number;
  name: string;
  spentAmount: number;
  spentAt: string;
  type: ExpenseFrequency;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateExpense = useUpdateExpense(id, false);

  const form = useForm<CreateExpenseTypes>({
    defaultValues: {
      name: name,
      spentAmount: spentAmount,
      spentAt: spentAt,
      type: type,
    },
    onSubmit: async ({ value }) => {
      try {
        console.log(value);

        await updateExpense.mutateAsync({ ...value, id: id });
        setShowModal(false);
        queryClient.invalidateQueries({
          queryKey: ["expenses", "type"],
        });
        toast({
          title: "Expense Updated",
          description: `Yoooh, updated successufully!`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to update`,
        });
        console.error(error);
      }
    },
  });

  return (
    <Dialog open={showModal}>
      <DialogContent handleClose={() => setShowModal(false)}>
        <DialogHeader>
          <DialogDescription>
            <form
              className="flex flex-col gap-[2rem]"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="flex gap-[1rem] flex-wrap">
                <form.Field
                  name="name"
                  children={(field) => (
                    <div className="w-[55%] flex flex-col gap-[.5rem] flex-grow">
                      <Label className="text-[1.4rem]" htmlFor={field.name}>
                        Name
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        className=" text-[1.2rem]"
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.isTouched ? <em>{field.state.meta.errors}</em> : null}
                    </div>
                  )}
                />

                <form.Field
                  name="spentAmount"
                  children={(field) => (
                    <div className="w-[40%] min-w-[9rem] flex flex-col gap-[.5rem] flex-grow">
                      <Label className=" text-[1.4rem]" htmlFor={field.name}>
                        SpentAmount
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        className=" text-[1.2rem]"
                        onChange={(e) => field.handleChange(+e.target.value)}
                      />
                      {field.state.meta.isTouched ? <em>{field.state.meta.errors}</em> : null}
                    </div>
                  )}
                />
              </div>

              <form.Field
                name="spentAt"
                children={(field) => (
                  <div className="self-center">
                    <Calendar
                      mode="single"
                      selected={new Date(field.state.value)}
                      onSelect={(date) => field.handleChange((date ?? new Date()).toISOString())}
                      className="rounded-md border bg-secondary w-full"
                    />
                    {field.state.meta.isTouched ? <em>{field.state.meta.errors}</em> : null}
                  </div>
                )}
              />

              <form.Field
                name="type"
                children={(field) => (
                  <div className="flex-grow">
                    <Select
                      onValueChange={(value) => field.handleChange(value as ExpenseFrequency)}
                      defaultValue={type}
                    >
                      <SelectTrigger className="">
                        <SelectValue className="capitalize" placeholder={type.toLowerCase()} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                        <SelectItem value="ONCE">Once</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.state.meta.isTouched ? <em>{field.state.meta.errors}</em> : null}
                  </div>
                )}
              />

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button variant="outline" className="text-[1.5rem]" disabled={!canSubmit}>
                    {isSubmitting ? "..." : "Update"}
                  </Button>
                )}
              />
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
