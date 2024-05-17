import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";
import BudgetTileV2 from "@/components-v2/subcomponents/budget/BudgetTileV2.tsx";
import AddNewBudgetToGroupButtonV2 from "@/components-v2/subcomponents/budget/AddNewBudgetToGroupButtonV2.tsx";
import {
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button.tsx";
import { changeFormOrModalVisibility } from "@/utility/util.ts";

interface GroupV2Props {
  group: GroupItemEntity;
  budgetArray: BudgetItemEntity[];
  publicUserData: PublicUserData;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  setBudgetModalVisibility: SetModalVisibility<BudgetModalVisibility>;
  setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>;
  setCategoryToDelete: Dispatch<SetStateAction<string>>;
  setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;
  groupNameOfNewItem: string;
}

export default function GroupV2({
  group,
  budgetArray,
  publicUserData,
  perCategoryExpenseTotalThisMonth,
  setBudgetFormVisibility,
  setBudgetModalVisibility,
  setOldBudgetBeingEdited,
  setCategoryToDelete,
  setGroupNameOfNewItem,
  groupNameOfNewItem,
}: GroupV2Props) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateGroupVisible", true);
  };

  return (
    <Accordion
      type="single"
      className="rounded-xl"
      style={{ backgroundColor: group.colour, color: group.group === "Miscellaneous" ? "white" : "black" }}
      collapsible
    >
      <AccordionItem value={`item`}>
        <AccordionTrigger className={"px-8"}>
          <p className={"font-bold text-lg"}>{group.group}</p>
          <Button className={"ml-auto mr-4"} onClick={handleEditClick}>
            Edit
          </Button>
        </AccordionTrigger>
        <AccordionContent className={"pt-4 pl-4 pr-2"}>
          <div className={"flex flex-row gap-4 justify-start items-center flex-wrap"}>
            {!!budgetArray &&
              budgetArray
                .filter((budgetItem) => budgetItem.group === group.group)
                .map((filteredBudgetItem, index) => (
                  <div key={index}>
                    <BudgetTileV2
                      filteredBudgetItem={filteredBudgetItem}
                      publicUserData={publicUserData}
                      perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
                      setBudgetFormVisibility={setBudgetFormVisibility}
                      setBudgetModalVisibility={setBudgetModalVisibility}
                      setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                      setCategoryToDelete={setCategoryToDelete}
                    />
                  </div>
                ))}
            <AddNewBudgetToGroupButtonV2
              setGroupNameOfNewItem={setGroupNameOfNewItem}
              groupNameOfNewItem={groupNameOfNewItem}
              setBudgetFormVisibility={setBudgetFormVisibility}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
