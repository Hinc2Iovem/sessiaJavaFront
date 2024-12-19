import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseFrequency } from "@/consts/ExpenseFrequency";
import useCreateExpense from "@/hooks/Expenses/useCreateExpense";
import { useToast } from "@/hooks/use-toast";
import { ExpenseTypes } from "@/types/ExpenseTypes";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export type CreateExpenseTypes = Omit<ExpenseTypes, "id">;

export default function NewExpenseForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const createExpense = useCreateExpense();

  const form = useForm<CreateExpenseTypes>({
    defaultValues: {
      name: "",
      spentAmount: 0,
      spentAt: new Date().toISOString(),
      type: "ONCE",
    },
    onSubmit: async ({ value }) => {
      try {
        console.log(value);

        await createExpense.mutateAsync({ ...value });
        queryClient.invalidateQueries({
          queryKey: ["expenses", "type"],
        });
        navigate({ to: "/" });
        toast({
          title: "Expense Created",
          description: `Yoooh, created successufully!`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to create new expense`,
        });
        console.error(error);
      }
    },
  });
  return (
    <div className="flex items-center justify-center flex-col h-full w-full">
      <div className="p-[1rem] rounded-md w-[30rem] flex flex-col gap-[1rem] mt-[1.5rem] border-[1px] border-secondary">
        <h2 className="text-[2rem] text-center text-secondary">New Expense</h2>
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
                <div className="w-[55%] flex-grow">
                  <Label className="text-secondary text-[1.4rem]" htmlFor={field.name}>
                    Name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    className="text-secondary text-[1.2rem]"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched ? <em>{field.state.meta.errors}</em> : null}
                </div>
              )}
            />

            <form.Field
              name="spentAmount"
              children={(field) => (
                <div className="w-[40%] min-w-[9rem] flex-grow">
                  <Label className="text-secondary text-[1.4rem]" htmlFor={field.name}>
                    SpentAmount
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    className="text-secondary text-[1.2rem]"
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
                <Select onValueChange={(value) => field.handleChange(value as ExpenseFrequency)} defaultValue="ONCE">
                  <SelectTrigger className="text-secondary">
                    <SelectValue className="" placeholder="Once" />
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
                {isSubmitting ? "..." : "Create"}
              </Button>
            )}
          />
        </form>
      </div>
    </div>
  );
}
