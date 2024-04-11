import { useEffect, useRef } from "react";
import {
  BudgetModalVisibility,
  ExpenseModalVisibility,
  RecurringExpenseModalVisibility,
  SetModalVisibility,
  SettingsModalVisibility,
} from "../../../util.ts";
import FulcrumButton from "./FulcrumButton.tsx";

interface ThreeOptionModalProps {
  optionOneText: string;
  optionOneFunction: () => void;
  optionTwoText: string;
  optionTwoFunction: () => void;
  optionThreeText: string;
  optionThreeFunction: () => void;
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
export default function ThreeOptionModal({
  optionOneText,
  optionOneFunction,
  optionTwoText,
  optionTwoFunction,
  optionThreeText,
  optionThreeFunction,
  setModalVisibility,
  isVisible,
  title,
}: ThreeOptionModalProps) {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setModalVisibility((current: any) => ({
        ...current,
        [`${isVisible}`]: false,
      }));
    }
  };

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

      <div className="flex flex-row justify-between mt-12">
        <FulcrumButton
          displayText={optionOneText}
          onClick={optionOneFunction}
          optionalTailwind={"w-[30%] text-sm"}
          backgroundColour={"green"}
          id={"left-button"}
        />
        <FulcrumButton
          displayText={optionTwoText}
          onClick={optionTwoFunction}
          optionalTailwind={"mx-2 w-[30%] text-sm"}
          backgroundColour={"green"}
          id={"centre-button"}
        />
        <FulcrumButton
          displayText={optionThreeText}
          onClick={optionThreeFunction}
          optionalTailwind={"w-[30%] text-sm"}
          backgroundColour={"red"}
          id={"right-button"}
        />
      </div>
    </div>
  );
}
