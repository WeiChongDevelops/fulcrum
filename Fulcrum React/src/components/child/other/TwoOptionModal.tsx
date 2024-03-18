import {Dispatch, SetStateAction, useEffect, useRef} from "react";
import {
    BudgetModalVisibility,
    ExpenseModalVisibility,
    RecurringExpenseModalVisibility,
    SettingsModalVisibility
} from "../../../util.ts";
import FulcrumButton from "./FulcrumButton.tsx";

interface TwoOptionModalProps {
    optionOneText: string;
    optionOneFunction: ()=>void;
    optionTwoText: string;
    optionTwoFunction: ()=>void;
    setModalVisibility: Dispatch<SetStateAction<BudgetModalVisibility>>
        | Dispatch<SetStateAction<ExpenseModalVisibility>>
        | Dispatch<SetStateAction<RecurringExpenseModalVisibility>>
        | Dispatch<SetStateAction<SettingsModalVisibility>>;
    isVisible: string;
    title: string;
}

/**
 * A modal that allows the user to choose between two options.
 */
export default function TwoOptionModal( { optionOneText, optionOneFunction, optionTwoText, optionTwoFunction, setModalVisibility, isVisible, title }: TwoOptionModalProps) {

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.getElementById("right-button")?.focus()
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setModalVisibility((current: any) => ({...current, [`${isVisible}`]: false}))
        }
    };

    return (
        <div className="fulcrum-modal" ref={formRef}>
            <FulcrumButton onClick={() => {
                setModalVisibility((current: any) => ({...current, [`${isVisible}`]: false}))
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <h2 className="mt-8 mx-4 text-xl">{title}</h2>

            <div className="flex flex-row justify-between mt-12">
                <FulcrumButton displayText={optionOneText} onClick={optionOneFunction} optionalTailwind={"mx-2"} backgroundColour={"green"} id={"left-button"}/>
                <FulcrumButton displayText={optionTwoText} onClick={optionTwoFunction} optionalTailwind={"mx-2"} backgroundColour={"red"} id={"right-button"}/>
            </div>
        </div>
    );
}
