import FulcrumButton from "../../other/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  addIconSelectionFunctionality,
  BudgetFormVisibility,
  BudgetItemEntity,
  capitaliseFirstLetter,
  colourStyles,
  getColourOfGroup,
  groupListAsOptions,
  handleBudgetCreation,
  GroupItemEntity,
  BudgetCreationFormData,
  handleInputChangeOnFormWithAmount,
  SetFormVisibility,
  changeFormOrModalVisibility,
  EmailContext,
  getRandomGroupColour,
  groupSort,
} from "../../../../util.ts";
import CreatableSelect from "react-select/creatable";
import "../../../../css/Budget.css";
import CategoryIconSelector from "../../selectors/CategoryIconSelector.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BudgetCreationFormProps {
  groupArray: GroupItemEntity[];
  groupNameOfNewItem: string;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  currencySymbol: string;
}

/**
 * A form for creating a new budget item.
 */
export default function BudgetCreationForm({
  groupArray,
  groupNameOfNewItem,
  setBudgetFormVisibility,
  currencySymbol,
}: BudgetCreationFormProps) {
  const [formData, setFormData] = useState<BudgetCreationFormData>({
    category: "",
    amount: 0,
    iconPath: "",
    group: groupNameOfNewItem,
  });
  const formRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  interface BudgetCreationMutationProps {
    newBudgetItem: BudgetItemEntity;
    newGroupItem?: GroupItemEntity;
  }

  const budgetCreationMutation = useMutation({
    mutationFn: (budgetCreationMutationProps: BudgetCreationMutationProps) =>
      handleBudgetCreation(budgetCreationMutationProps.newBudgetItem),
    onMutate: async (budgetCreationMutationProps: BudgetCreationMutationProps) => {
      if (!!budgetCreationMutationProps.newGroupItem) {
        await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
        await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
          return [...prevGroupCache, budgetCreationMutationProps.newGroupItem!].sort(groupSort);
        });
      }
      const groupArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);

      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return [...prevBudgetCache, budgetCreationMutationProps.newBudgetItem];
      });

      return { budgetArrayBeforeOptimisticUpdate, groupArrayBeforeOptimisticUpdate };
    },
    onError: async (_error, _variables, context) => {
      await queryClient.setQueryData(["budgetArray", email], context?.budgetArrayBeforeOptimisticUpdate);
      await queryClient.setQueryData(["groupArray", email], context?.groupArrayBeforeOptimisticUpdate);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
    },
  });
  function hideForm() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateBudgetVisible", false);
  }
  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    addIconSelectionFunctionality(setFormData, "category");
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newBudgetItem: BudgetItemEntity = {
      category: formData.category,
      amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
      iconPath: formData.iconPath === "" ? "category-default-icon.svg" : formData.iconPath,
      group: formData.group ? formData.group : "Miscellaneous",
      timestamp: new Date(),
    };

    let defaultGroupItem: GroupItemEntity | undefined = undefined;

    if (!groupArray.map((groupItem) => groupItem.group).includes(newBudgetItem.group)) {
      defaultGroupItem = {
        group: newBudgetItem.group,
        colour: getRandomGroupColour(),
        timestamp: new Date(),
      };
    }

    budgetCreationMutation.mutate({
      newBudgetItem: newBudgetItem,
      newGroupItem: defaultGroupItem,
    });

    setFormData({
      category: "",
      amount: 0,
      iconPath: "",
      group: groupNameOfNewItem,
    });

    // setBudgetArray((current) => [...current, newBudgetItem]);

    // await handleBudgetCreation(setBudgetArray, newBudgetItem);

    hideForm();
  }

  function handleGroupInputChange(e: any) {
    setFormData((currentFormData: BudgetCreationFormData) => ({
      ...currentFormData,
      group: e.value,
    }));
  }

  return (
    <div ref={formRef} className="fulcrum-form fixed flex flex-col justify-center items-center rounded-3xl">
      <FulcrumButton
        displayText={"Close"}
        backgroundColour={"grey"}
        optionalTailwind={"ml-auto mb-auto"}
        onClick={() => {
          hideForm();
        }}
      />

      <p className="mb-6 font-bold text-3xl">New Budget Item</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto ">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          onChange={handleInputChange}
          value={capitaliseFirstLetter(formData.category)}
          name="category"
          id="category"
          className="mb-3"
          maxLength={18}
          required
        />
        <label htmlFor="amount">Amount</label>
        <div>
          <b className="relative left-6 text-black">{currencySymbol}</b>
          <input
            type="text"
            onChange={handleInputChange}
            value={formData.amount === 0 ? "" : formData.amount}
            name="amount"
            id="amount"
            className="mb-3"
            required
          />
        </div>

        <label htmlFor="group">Category Group</label>
        <CreatableSelect
          id="group"
          name="group"
          defaultValue={{
            label: groupNameOfNewItem,
            value: groupNameOfNewItem,
            colour: getColourOfGroup(groupNameOfNewItem, groupArray),
          }}
          options={groupListAsOptions(groupArray).map((option) => {
            return {
              label: option.label,
              value: option.value,
              colour: option.colour!!,
            };
          })}
          onChange={handleGroupInputChange}
          styles={colourStyles}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "rgba(201,223,201,0.1)",
              primary: "rgba(34,237,34,0.18)",
            },
          })}
        />

        <CategoryIconSelector />
        <input type="hidden" id="iconPath" name="iconPath" value="test" />
        <FulcrumButton displayText="Insert Budget" />
      </form>
    </div>
  );
}
