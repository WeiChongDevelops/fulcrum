import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components-v2/ui/accordion.tsx";
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
import { Dispatch, SetStateAction, useState } from "react";
import { changeFormOrModalVisibility } from "@/utility/util.ts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const [accordionIsOpen, setAccordionIsOpen] = useState<string>();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateGroupVisible", true);
  };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    animateLayoutChanges: () => false,
    id: group.id,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    touchAction: "none",
  };

  const handleValueChange = (value: string) => {
    setAccordionIsOpen(value);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        ...style,
        backgroundColor: group.colour,
        color: group.group === "Miscellaneous" ? "white" : "black",
        display: "flex",
        userSelect: "none",
      }}
      className={"flex select-none rounded-xl"}
    >
      <Accordion
        type="single"
        className={"rounded-xl w-[95%]"}
        collapsible
        value={accordionIsOpen}
        onValueChange={handleValueChange}
      >
        <AccordionItem value={`item-${group.id}`}>
          <AccordionTrigger className={"px-8 select-none"}>
            <p className={"font-bold text-lg"}>{group.group}</p>
            <div className={"mr-auto ml-4"} onClick={handleEditClick}>
              Edit
            </div>
          </AccordionTrigger>
          <AccordionContent className={"pt-4 pl-6 pr-2"}>
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
      <div
        className={"grid font-bold text-2xl place-items-baseline mt-3 size-6 hover:scale-110 origin-center transition-all"}
        onMouseDown={() => setAccordionIsOpen("")}
        {...listeners}
      >
        <p className={" "}>:::</p>
      </div>
    </div>
  );
}
