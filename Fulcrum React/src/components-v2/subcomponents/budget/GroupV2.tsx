import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components-v2/ui/accordion.tsx";
import BudgetTileV2 from "@/components-v2/subcomponents/budget/BudgetTileV2.tsx";
import {
  BudgetItemEntity,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
  UserPreferences,
} from "@/utility/types.ts";
import { Dispatch, SetStateAction, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components-v2/ui/button.tsx";
import UpdateGroupFormV2 from "@/components-v2/subcomponents/budget/forms/UpdateGroupFormV2.tsx";
import CreateBudgetFormV2 from "@/components-v2/subcomponents/budget/forms/CreateBudgetFormV2.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { budgetSort, darkenColor, getCurrencySymbol, useEmail } from "@/utility/util.ts";
import TwoOptionModal from "@/components-v2/subcomponents/other/modal/TwoOptionModal.tsx";
import useDeleteGroup from "@/hooks/mutations/budget/useDeleteGroup.ts";
import Loader from "@/components-v2/subcomponents/other/Loader.tsx";
import ThreeOptionModal from "@/components-v2/subcomponents/other/modal/ThreeOptionModal.tsx";

interface GroupV2Props {
  group: GroupItemEntity;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
  groupNameOfNewItem: string;
  oldGroupBeingEdited: PreviousGroupBeingEdited;
  setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>;
  setOldGroupBeingEdited: Dispatch<SetStateAction<PreviousGroupBeingEdited>>;
  setLocalisedGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
}

export default function GroupV2({
  group,
  perCategoryExpenseTotalThisMonth,
  setOldBudgetBeingEdited,
  setOldGroupBeingEdited,
  oldGroupBeingEdited,
  oldBudgetBeingEdited,
  setLocalisedGroupArray,
}: GroupV2Props) {
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  const [accordionIsOpen, setAccordionIsOpen] = useState<string>("item-1");
  const { isPending, mutate: deleteGroup } = useDeleteGroup();

  const updateOldGroupBeingEdited = () => {
    setOldGroupBeingEdited({
      oldGroupName: group.group,
      oldColour: group.colour,
      oldId: group.id,
    });
  };
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: group.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: `${transition}, background-color 250ms ease-in-out`,
    touchAction: "none",
  };

  const handleValueChange = (value: string) => {
    setAccordionIsOpen(value);
  };

  const [showDeleteGroupOptionsDialog, setShowDeleteGroupOptionsDialog] = useState(false);
  const [showConfirmDeleteGroupDialog, setShowConfirmDeleteGroupDialog] = useState(false);
  const [showDeleteEmptyGroupDialog, setShowDeleteEmptyGroupDialog] = useState(false);

  const removeGroupFromLocalisedArray = (removedGroup: string) => {
    setLocalisedGroupArray((prevLocalisedGroupArray) =>
      prevLocalisedGroupArray.filter((groupItem) => groupItem.group !== removedGroup),
    );
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={
        "flex flex-row items-start gap-1 select-none rounded-xl relative overflow-hidden saturate-[250%] dark:saturate-[185%] brightness-[95%]"
      }
      style={{
        ...style,
        backgroundColor: userPreferences.darkModeEnabled ? darkenColor(group.colour, 70) : group.colour,
        display: "flex",
        userSelect: "none",
      }}
    >
      <Loader
        isLoading={isPending}
        isDarkMode={userPreferences.darkModeEnabled}
        positioning={"fixed bottom-[50vh] left-[50vw] z-[100]"}
      />
      <Accordion
        type="single"
        className={"rounded-xl w-[90%] z-30"}
        collapsible
        value={accordionIsOpen}
        onValueChange={handleValueChange}
      >
        <AccordionItem value={`item-${group.id}`}>
          <AccordionTrigger className={"px-7 select-none group-accordion-trigger"}>
            <p className={"font-medium text-base text-primary"} id={"tooltip-select-1"}>
              {group.group}
            </p>
          </AccordionTrigger>
          <AccordionContent className={"pt-2 pb-4 pl-6"}>
            <div className={"flex flex-row gap-5 justify-start items-center w-[109%] flex-wrap "}>
              {budgetArray.length > 0 &&
                budgetArray
                  .filter((budgetItem) => budgetItem.group === group.group)
                  .sort(budgetSort)
                  .map((filteredBudgetItem, index) => (
                    <div key={index}>
                      <BudgetTileV2
                        filteredBudgetItem={filteredBudgetItem}
                        oldBudgetBeingEdited={oldBudgetBeingEdited}
                        setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                        perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
                      />
                    </div>
                  ))}
              <CreateBudgetFormV2
                groupNameOfNewItem={group.group}
                currencySymbol={getCurrencySymbol(userPreferences.currency)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className={"absolute top-2 right-0 flex items-center"}>
        {group.group !== "Miscellaneous" && (
          <>
            <UpdateGroupFormV2
              oldGroupBeingEdited={oldGroupBeingEdited}
              setLocalisedGroupArray={setLocalisedGroupArray}
              updateOldGroupBeingEdited={updateOldGroupBeingEdited}
            />

            {budgetArray.find((budgetItem) => budgetItem.group === group.group) ? (
              <ThreeOptionModal
                dialogOpen={showDeleteGroupOptionsDialog}
                setDialogOpen={setShowDeleteGroupOptionsDialog}
                dialogTitle={`Keep the categories inside the group '${group.group}'?`}
                dialogDescription={"If you choose to keep the categories, they will be moved to 'Miscellaneous'."}
                leftButtonText={"Cancel"}
                leftButtonFunction={() => {
                  setShowDeleteGroupOptionsDialog(false);
                }}
                midButtonText={"Keep Categories"}
                midButtonFunction={() => {
                  setShowDeleteGroupOptionsDialog(false);
                  removeGroupFromLocalisedArray(group.group);
                  deleteGroup({
                    groupToDelete: group.group,
                    keepContainedCategories: true,
                  });
                }}
                rightButtonText={"Delete Categories"}
                rightButtonFunction={() => {
                  setShowDeleteGroupOptionsDialog(false);
                  setShowConfirmDeleteGroupDialog(true);
                }}
                buttonTriggerComponent={
                  <Button
                    asChild
                    variant={"ghost"}
                    className={"standard-edit-delete-button flex-justify-center px-2.5 py-0 rounded-[50%]"}
                  >
                    <div className={"edit-delete-button-icon-container origin-center transition-all"}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4 transition-all duration-200 ease-out"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </Button>
                }
              />
            ) : (
              <TwoOptionModal
                dialogOpen={showDeleteEmptyGroupDialog}
                setDialogOpen={setShowDeleteEmptyGroupDialog}
                dialogTitle={`Delete category group '${group.group}'?`}
                leftButtonText={"Cancel"}
                leftButtonFunction={() => {
                  setShowDeleteEmptyGroupDialog(false);
                }}
                rightButtonText={"Delete"}
                rightButtonFunction={() => {
                  setShowDeleteEmptyGroupDialog(false);
                  removeGroupFromLocalisedArray(group.group);
                  deleteGroup({
                    groupToDelete: group.group,
                    keepContainedCategories: false,
                  });
                }}
                buttonTriggerComponent={
                  <Button
                    variant={"ghost"}
                    className={"standard-edit-delete-button flex-justify-center px-2.5 py-0 rounded-[50%]"}
                  >
                    <div className={"edit-delete-button-icon-container origin-center transition-all"}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4 transition-all duration-200 ease-out"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </Button>
                }
              />
            )}
            <TwoOptionModal
              dialogOpen={showConfirmDeleteGroupDialog}
              setDialogOpen={setShowConfirmDeleteGroupDialog}
              dialogTitle={`Delete all categories and expenses for '${group.group}'?`}
              leftButtonText={"Cancel"}
              leftButtonFunction={() => {
                setShowConfirmDeleteGroupDialog(false);
              }}
              rightButtonText={"Delete"}
              rightButtonFunction={() => {
                setShowConfirmDeleteGroupDialog(false);
                removeGroupFromLocalisedArray(group.group);
                deleteGroup({
                  groupToDelete: group.group,
                  keepContainedCategories: false,
                });
              }}
            />
          </>
        )}
        <div
          className={"z-10 font-bold size-6 mb-3 mr-5 hover:scale-110 hover:-translate-y-[1px] origin-center transition-all"}
          onMouseDown={() => setAccordionIsOpen("")}
          {...listeners}
        >
          <p className={"text-2xl"}>:::</p>
        </div>
      </div>
    </div>
  );
}
