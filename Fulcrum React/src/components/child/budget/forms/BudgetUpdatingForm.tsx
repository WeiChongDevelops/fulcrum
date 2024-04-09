import FulcrumButton from "../../other/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  addIconSelectionFunctionality,
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetUpdatingFormData,
  colourStyles,
  getColourOfGroup,
  groupListAsOptions,
  handleBudgetUpdating,
  GroupItemEntity,
  handleInputChangeOnFormWithAmount,
  SetFormVisibility,
  changeFormOrModalVisibility,
  EmailContext,
  PreviousBudgetBeingEdited,
} from "../../../../util.ts";
import CreatableSelect from "react-select/creatable";
import CategoryIconSelector from "../../selectors/CategoryIconSelector.tsx";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface BudgetUpdatingFormProps {
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  groupArray: GroupItemEntity[];
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  currencySymbol: string;
}

/**
 * A form for updating an existing budget item.
 */
export default function BudgetUpdatingForm({
  groupArray,
  oldBudgetBeingEdited,
  setBudgetFormVisibility,
  currencySymbol,
}: BudgetUpdatingFormProps) {
  const [formData, setFormData] = useState<BudgetUpdatingFormData>({
    category: oldBudgetBeingEdited.oldCategory,
    amount: oldBudgetBeingEdited.oldAmount,
    iconPath: oldBudgetBeingEdited.oldIconPath,
    group: oldBudgetBeingEdited.oldGroup,
  });
  const formRef = useRef<HTMLDivElement>(null);

  interface BudgetUpdatingMutationProps {
    originalCategory: string;
    updatedBudgetItem: BudgetItemEntity;
  }

  const queryClient = useQueryClient();
  const email = useContext(EmailContext);
  const budgetUpdatingMutation = useMutation({
    mutationFn: (budgetUpdatingMutationProps: BudgetUpdatingMutationProps) => {
      return handleBudgetUpdating(
        budgetUpdatingMutationProps.originalCategory,
        budgetUpdatingMutationProps.updatedBudgetItem,
      );
    },
    onMutate: async (budgetUpdatingMutationProps: BudgetUpdatingMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return prevBudgetCache.map((budgetItem) =>
          budgetItem.category === budgetUpdatingMutationProps.originalCategory
            ? budgetUpdatingMutationProps.updatedBudgetItem
            : budgetItem,
        );
      });
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      return queryClient.setQueryData(["budgetArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
    },
  });

  useEffect(() => {
    addIconSelectionFunctionality(setFormData, "category");
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function hideForm() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateBudgetVisible", false);
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  function handleGroupInputChange(e: any) {
    setFormData((prevFormData) => ({ ...prevFormData, group: e.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    hideForm();

    // await handleBudgetUpdating(oldBudgetBeingEdited.oldCategory, formData);
    // getBudgetList().then((budgetList) => setBudgetArray(budgetList));

    const updatedBudgetItem: BudgetItemEntity = { ...formData, iconPath: formData.iconPath, timestamp: new Date() };
    budgetUpdatingMutation.mutate({
      originalCategory: oldBudgetBeingEdited.oldCategory,
      updatedBudgetItem: updatedBudgetItem,
    });

    setFormData({
      category: oldBudgetBeingEdited.oldCategory,
      amount: oldBudgetBeingEdited.oldAmount,
      iconPath: "",
      group: oldBudgetBeingEdited.oldGroup,
    });
  }

  return (
    <div ref={formRef} className="fulcrum-form fixed flex flex-col justify-start items-center rounded-3xl text-white">
      <FulcrumButton
        onClick={() => {
          hideForm();
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <p className="mb-6 font-bold text-3xl">Updating Budget for '{oldBudgetBeingEdited.oldCategory}'</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="category">Category Name</label>
        <input
          type="text"
          onChange={handleInputChange}
          value={formData.category}
          name="category"
          id="category"
          maxLength={18}
          required
        />

        <label htmlFor="amount" className={"mt-3"}>
          Amount
        </label>
        <div>
          <b className="relative left-6 text-black">{currencySymbol}</b>
          <input
            type="text"
            onChange={handleInputChange}
            value={formData.amount ?? ""}
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
            label: oldBudgetBeingEdited.oldGroup,
            value: oldBudgetBeingEdited.oldGroup,
            colour: getColourOfGroup(oldBudgetBeingEdited.oldGroup, groupArray),
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
        <input type="hidden" id="iconPath" name="iconPath" value="" />
        <FulcrumButton displayText="Update Budget" />
      </form>
    </div>
  );
}
