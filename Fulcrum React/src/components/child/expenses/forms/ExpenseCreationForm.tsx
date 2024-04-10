import FulcrumButton from "../../other/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  BudgetItemEntity,
  ExpenseCreationFormData,
  ExpenseItemEntity,
  SelectorOptionsFormattedData,
  handleExpenseCreation,
  colourStyles,
  handleInputChangeOnFormWithAmount,
  handleRecurringExpenseCreation,
  RecurringExpenseItemEntity,
  recurringFrequencyOptions,
  Value,
  RecurringExpenseFormVisibility,
  ExpenseFormVisibility,
  SetFormVisibility,
  EmailContext,
  CategoryToIconGroupAndColourMap,
  getColourOfGroup,
  GroupItemEntity,
} from "../../../../util.ts";
import { v4 as uuid } from "uuid";

import Select from "react-select/creatable";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import CategorySelector from "../../selectors/CategorySelector.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ExpenseCreationFormProps {
  setExpenseFormVisibility: SetFormVisibility<RecurringExpenseFormVisibility> | SetFormVisibility<ExpenseFormVisibility>;
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  categoryOptions: SelectorOptionsFormattedData[];
  currencySymbol: string;
  defaultCalendarDate: Date;
  mustBeRecurring: boolean;
}

/**
 * A form for creating a new expense item.
 */
export default function ExpenseCreationForm({
  setExpenseFormVisibility,
  budgetArray,
  groupArray,
  categoryOptions,
  currencySymbol,
  defaultCalendarDate,
  mustBeRecurring,
}: ExpenseCreationFormProps) {
  const [formData, setFormData] = useState<ExpenseCreationFormData>({
    category: "",
    amount: 0,
    timestamp: defaultCalendarDate,
    frequency: mustBeRecurring ? "monthly" : "never",
  });
  const formRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  interface ExpenseCreationMutationProps {
    newExpenseItem: ExpenseItemEntity;
    newBudgetItem?: BudgetItemEntity;
  }

  const expenseCreationMutation = useMutation({
    mutationFn: async (expenseCreationMutationProps: ExpenseCreationMutationProps) => {
      // expenseCreationMutationProps.newBudgetItem && (await handleBudgetCreation(expenseCreationMutationProps.newBudgetItem));
      await handleExpenseCreation(expenseCreationMutationProps.newExpenseItem);
    },
    onMutate: async (expenseCreationMutationProps: ExpenseCreationMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      await queryClient.cancelQueries({ queryKey: ["groupAndColourMap", email] });

      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return [...prevBudgetCache, { ...expenseCreationMutationProps.newBudgetItem }];
      });

      const categoryDataMapBeforeOptimisticUpdate = await queryClient.getQueryData(["groupAndColourMap", email]);
      if (expenseCreationMutationProps.newBudgetItem) {
        const newBudgetItem = expenseCreationMutationProps.newBudgetItem;
        await queryClient.setQueryData(["groupAndColourMap", email], (prevCategoryMap: CategoryToIconGroupAndColourMap) => {
          return new Map([
            ...prevCategoryMap,
            [
              newBudgetItem.category,
              {
                iconPath: newBudgetItem.iconPath,
                group: newBudgetItem.group,
                colour: getColourOfGroup(newBudgetItem.group, groupArray),
              },
            ],
          ]);
        });
      }

      const expenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);
      await queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        return [expenseCreationMutationProps.newExpenseItem, ...prevExpenseCache];
      });

      return {
        budgetArrayBeforeOptimisticUpdate,
        expenseArrayBeforeOptimisticUpdate,
        categoryDataMapBeforeOptimisticUpdate,
      };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["budgetArray", email], context?.budgetArrayBeforeOptimisticUpdate);
      queryClient.setQueryData(["groupAndColourMap", email], context?.categoryDataMapBeforeOptimisticUpdate);
      queryClient.setQueryData(["expenseArray", email], context?.expenseArrayBeforeOptimisticUpdate);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["groupAndColourMap", email] });
      await queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });

  interface RecurringExpenseCreationMutationProps {
    newRecurringExpenseItem: RecurringExpenseItemEntity;
    newBudgetItem?: BudgetItemEntity;
  }

  const recurringExpenseCreationMutation = useMutation({
    mutationFn: async (recurringExpenseCreationMutationProps: RecurringExpenseCreationMutationProps) => {
      // recurringExpenseCreationMutationProps.newBudgetItem &&
      //   (await handleBudgetCreation(recurringExpenseCreationMutationProps.newBudgetItem));
      await handleRecurringExpenseCreation(recurringExpenseCreationMutationProps.newRecurringExpenseItem);
    },
    onMutate: async (recurringExpenseCreationMutationProps: RecurringExpenseCreationMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      await queryClient.cancelQueries({ queryKey: ["groupAndColourMap", email] });
      await queryClient.cancelQueries({ queryKey: ["recurringExpenseArray", email] });

      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return [...prevBudgetCache, { ...recurringExpenseCreationMutationProps.newBudgetItem }];
      });

      const categoryDataMapBeforeOptimisticUpdate = await queryClient.getQueryData(["groupAndColourMap", email]);
      if (recurringExpenseCreationMutationProps.newBudgetItem) {
        const newBudgetItem = recurringExpenseCreationMutationProps.newBudgetItem;
        await queryClient.setQueryData(["groupAndColourMap", email], (prevCategoryMap: CategoryToIconGroupAndColourMap) => {
          return new Map([
            ...prevCategoryMap,
            [
              newBudgetItem.category,
              {
                iconPath: newBudgetItem.iconPath,
                group: newBudgetItem.group,
                colour: getColourOfGroup(newBudgetItem.group, groupArray),
              },
            ],
          ]);
        });
      }

      const recurringExpenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["recurringExpenseArray", email]);
      await queryClient.setQueryData(
        ["recurringExpenseArray", email],
        (prevRecurringExpenseCache: RecurringExpenseItemEntity[]) => {
          return [recurringExpenseCreationMutationProps.newRecurringExpenseItem, ...prevRecurringExpenseCache];
        },
      );

      return {
        budgetArrayBeforeOptimisticUpdate,
        recurringExpenseArrayBeforeOptimisticUpdate,
        categoryDataMapBeforeOptimisticUpdate,
      };
    },
    onError: async (_error, _variables, context) => {
      await queryClient.setQueryData(["budgetArray", email], context?.budgetArrayBeforeOptimisticUpdate);
      await queryClient.setQueryData(["groupAndColourMap", email], context?.categoryDataMapBeforeOptimisticUpdate);
      queryClient.setQueryData(["recurringExpenseArray", email], context?.recurringExpenseArrayBeforeOptimisticUpdate);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["groupAndColourMap", email] });
      await queryClient.invalidateQueries({ queryKey: ["recurringExpenseArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });

  // const budgetCreationMutation = useMutation({
  //   mutationFn: (newBudgetItem: BudgetItemEntity) => handleBudgetCreation(newBudgetItem),
  //   onMutate: async (newBudgetItem: BudgetItemEntity) => {
  //     await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
  //     const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
  //     await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
  //       return [...prevBudgetCache, { ...newBudgetItem }];
  //     });
  //     return { dataBeforeOptimisticUpdate };
  //   },
  //   onError: (_error, _variables, context) => {
  //     return queryClient.setQueryData(["budgetArray", email], context?.dataBeforeOptimisticUpdate);
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
  //   },
  // });

  function hideForm() {
    setExpenseFormVisibility((current: any) => ({
      ...current,
      isCreateExpenseVisible: false,
    }));
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();

    const newExpenseItem: ExpenseItemEntity = {
      expenseId: uuid(),
      category: formData.category,
      amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
      timestamp: formData.timestamp as Date,
      recurringExpenseId: null,
    };

    let newDefaultBudgetItem: BudgetItemEntity | undefined = undefined;

    if (!budgetArray.map((budgetItem) => budgetItem.category).includes(newExpenseItem.category)) {
      newDefaultBudgetItem = {
        category: formData.category,
        amount: 0,
        iconPath: "category-default-icon.svg",
        group: "Miscellaneous",
        timestamp: formData.timestamp as Date,
      };
      // budgetCreationMutation.mutate(newDefaultBudgetItem);
    }

    if (formData.frequency === "never") {
      expenseCreationMutation.mutate({
        newExpenseItem: newExpenseItem,
        newBudgetItem: newDefaultBudgetItem,
      });
    } else {
      const newRecurringExpenseItem: RecurringExpenseItemEntity = {
        recurringExpenseId: uuid(),
        category: formData.category,
        amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
        timestamp: formData.timestamp as Date,
        frequency: formData.frequency,
      };
      recurringExpenseCreationMutation.mutate({
        newRecurringExpenseItem: newRecurringExpenseItem,
        newBudgetItem: newDefaultBudgetItem,
      });
    }
    setFormData({
      category: "",
      amount: 0,
      timestamp: defaultCalendarDate,
      frequency: mustBeRecurring ? "monthly" : "never",
    });
  }

  function handleFrequencyInputChange(e: any) {
    setFormData((prevFormData) => ({ ...prevFormData, frequency: e.value }));
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  function onDateInputChange(newValue: Value) {
    setFormData((prevFormData) => ({ ...prevFormData, timestamp: newValue }));
  }

  return (
    <div ref={formRef} className="fulcrum-form justify-center items-center">
      <FulcrumButton
        onClick={() => {
          hideForm();
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <p className="mb-6 mt-4 font-bold text-3xl">New {mustBeRecurring && "Recurring "}Expense</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="category">Category</label>
        <CategorySelector categoryOptions={categoryOptions} setFormData={setFormData} />

        <label htmlFor="amount">Amount</label>
        <div>
          <b className="relative left-6 text-black">{currencySymbol}</b>
          <input
            type="text"
            onChange={handleInputChange}
            value={formData.amount === 0 ? "" : formData.amount}
            name="amount"
            id="amount"
            className="mb-3 text-black"
            required
          />
        </div>

        <label htmlFor="timestamp">Date</label>
        <div className={"text-black"}>
          <DatePicker onChange={onDateInputChange} value={formData.timestamp} />
        </div>

        <label htmlFor="frequency">Repeat Frequency</label>
        <Select
          id="frequency"
          name="frequency"
          defaultValue={{
            label: mustBeRecurring ? "Monthly" : "Never",
            value: mustBeRecurring ? "monthly" : "never",
            colour: "black",
          }}
          options={mustBeRecurring ? recurringFrequencyOptions.slice(1) : recurringFrequencyOptions}
          onChange={handleFrequencyInputChange}
          styles={colourStyles}
          className="mb-3"
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "rgba(201,223,201,0.1)",
              primary: "rgba(34,237,34,0.18)",
            },
          })}
          required
        />

        <FulcrumButton displayText={`Insert ${mustBeRecurring ? "Recurring " : ""}Expense`} optionalTailwind={"mt-6"} />
      </form>
    </div>
  );
}
