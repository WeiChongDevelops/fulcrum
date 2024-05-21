import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components-v2/ui/accordion.tsx";
import BudgetTileV2 from "@/components-v2/subcomponents/budget/BudgetTileV2.tsx";
import AddNewBudgetToGroupButtonV2 from "@/components-v2/subcomponents/budget/AddNewBudgetToGroupButtonV2.tsx";
import {
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { Dispatch, SetStateAction, useState } from "react";
import { changeFormOrModalVisibility } from "@/utility/util.ts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components-v2/ui/button.tsx";
import UpdateGroupFormV2 from "@/components-v2/subcomponents/budget/forms/UpdateGroupFormV2.tsx";

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
  setOldGroupBeingEdited: Dispatch<SetStateAction<PreviousGroupBeingEdited>>;
  setGroupToDelete: Dispatch<SetStateAction<string>>;
}

export default function GroupV2({
  group,
  budgetArray,
  publicUserData,
  perCategoryExpenseTotalThisMonth,
  setBudgetFormVisibility,
  setBudgetModalVisibility,
  setOldBudgetBeingEdited,
  setOldGroupBeingEdited,
  setCategoryToDelete,
  setGroupNameOfNewItem,
  groupNameOfNewItem,
  setGroupToDelete,
}: GroupV2Props) {
  const [accordionIsOpen, setAccordionIsOpen] = useState<string>();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOldGroupBeingEdited({
      oldGroupName: group.group,
      oldColour: group.colour,
      oldId: group.id,
    });
    changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateGroupVisible", true);
  };
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGroupToDelete(group.group);
    changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmGroupDeletionModalVisible", true);
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
      className={"flex flex-row items-center gap-1 select-none rounded-xl transition-colors ease-out"}
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
          </AccordionTrigger>
          <AccordionContent className={"py-4 pl-6 pr-2"}>
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
      {/*<Button*/}
      {/*  variant={"ghost"}*/}
      {/*  onClick={handleEditClick}*/}
      {/*  className={"standard-edit-delete-button flex-justify-center px-2.5 py-0 rounded-[50%]"}*/}
      {/*>*/}
      {/*  <div className={"origin-center transition-all"}>*/}
      {/*    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">*/}
      {/*      <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />*/}
      {/*    </svg>*/}
      {/*  </div>*/}
      {/*</Button>*/}
      <Button
        variant={"ghost"}
        onClick={handleDeleteClick}
        className={"standard-edit-delete-button flex-justify-center px-2.5 py-0 rounded-[50%]"}
      >
        <div className={"origin-center transition-all"}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </Button>
      <div
        // className={"grid font-bold text-2xl place-items-baseline size-6 hover:scale-110 origin-center transition-all"}
        className={"font-bold size-6 mb-3.5 mr-4 hover:scale-110 hover:-translate-y-[1px] origin-center transition-all"}
        onMouseDown={() => setAccordionIsOpen("")}
        {...listeners}
      >
        <p className={"text-2xl"}>:::</p>
      </div>
    </div>
  );
}
