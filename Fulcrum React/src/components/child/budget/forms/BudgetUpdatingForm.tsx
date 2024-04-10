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
  getRandomGroupColour,
  groupSort,
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
    newGroupItem?: GroupItemEntity;
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
      if (!!budgetUpdatingMutationProps.newGroupItem) {
        await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
        await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
          return [...prevGroupCache, budgetUpdatingMutationProps.newGroupItem!].sort(groupSort);
        });
      }
      const groupArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);

      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return prevBudgetCache.map((budgetItem) =>
          budgetItem.category === budgetUpdatingMutationProps.originalCategory
            ? budgetUpdatingMutationProps.updatedBudgetItem
            : budgetItem,
        );
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

    let defaultGroupItem: GroupItemEntity | undefined = undefined;

    const updatedBudgetItem: BudgetItemEntity = { ...formData, iconPath: formData.iconPath, timestamp: new Date() };

    if (!groupArray.map((groupItem) => groupItem.group).includes(updatedBudgetItem.group)) {
      defaultGroupItem = {
        group: updatedBudgetItem.group,
        colour: getRandomGroupColour(),
        timestamp: new Date(),
      };
    }

    budgetUpdatingMutation.mutate({
      originalCategory: oldBudgetBeingEdited.oldCategory,
      updatedBudgetItem: updatedBudgetItem,
      newGroupItem: defaultGroupItem,
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
