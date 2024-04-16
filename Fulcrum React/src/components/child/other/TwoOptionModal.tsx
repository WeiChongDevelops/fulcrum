import { useEffect, useRef } from "react";
import { addFormExitListeners } from "../../../utility/util.ts";
import FulcrumButton from "./FulcrumButton.tsx";
import {
  BudgetModalVisibility,
  ExpenseModalVisibility,
  RecurringExpenseModalVisibility,
  SetModalVisibility,
  SettingsModalVisibility,
} from "../../../utility/types.ts";

interface TwoOptionModalProps {
  optionOneText: string;
  optionOneFunction: () => void;
  optionTwoText: string;
  optionTwoFunction: () => void;
  setModalVisibility:
    | SetModalVisibility<BudgetModalVisibility>
    | SetModalVisibility<ExpenseModalVisibility>
    | SetModalVisibility<RecurringExpenseModalVisibility>
    | SetModalVisibility<SettingsModalVisibility>;
  isVisible: string;
  title: string;
}

/**
 * A modal that allows the user to choose between two options.
 */
export default function TwoOptionModal({
  optionOneText,
  optionOneFunction,
  optionTwoText,
  optionTwoFunction,
  setModalVisibility,
  isVisible,
  title,
}: TwoOptionModalProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);
  const hideForm = () => {
    setModalVisibility((current: any) => ({
      ...current,
      [`${isVisible}`]: false,
    }));
  };

  useEffect(() => {
    rightButtonRef.current?.focus();
    const removeFormExitEventListeners = addFormExitListeners(hideForm, formRef);
    return () => {
      removeFormExitEventListeners();
    };
  }, []);

  return (
    <div className="fulcrum-modal" ref={formRef}>
      <FulcrumButton
        onClick={() => {
          setModalVisibility((current: any) => ({
            ...current,
            [`${isVisible}`]: false,
          }));
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <h2 className="mt-8 mx-4 text-xl">{title}</h2>

      <div className="flex flex-row justify-between mt-12 w-full">
        <FulcrumButton
          displayText={optionOneText}
          onClick={optionOneFunction}
          optionalTailwind={"mx-2 w-1/2"}
          backgroundColour={"green"}
          id={"left-button"}
        />
        <FulcrumButton
          displayText={optionTwoText}
          onClick={optionTwoFunction}
          optionalTailwind={"mx-2 w-1/2"}
          backgroundColour={"red"}
          id={"right-button"}
          refObject={rightButtonRef}
        />
      </div>
    </div>
  );
}
