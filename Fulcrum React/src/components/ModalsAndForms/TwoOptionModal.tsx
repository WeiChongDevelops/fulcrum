import {Dispatch, SetStateAction, useEffect, useRef} from "react";
import {BudgetModalVisibility, ExpenseModalVisibility, RecurringExpenseModalVisibility} from "../../util.ts";
import FulcrumButton from "../Other/FulcrumButton.tsx";

interface TwoOptionModalProps {
    optionOneText: string;
    optionOneFunction: ()=>void;
    optionTwoText: string;
    optionTwoFunction: ()=>void;
    setModalFormVisibility: Dispatch<SetStateAction<BudgetModalVisibility>> | Dispatch<SetStateAction<ExpenseModalVisibility>>  | Dispatch<SetStateAction<RecurringExpenseModalVisibility>>
    isVisible: string;
    title: string;
}

export default function TwoOptionModal( { optionOneText, optionOneFunction, optionTwoText, optionTwoFunction, setModalFormVisibility, isVisible, title }: TwoOptionModalProps) {

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setModalFormVisibility((current: any) => ({...current, [`${isVisible}`]: false}))
        }
    };

    return (
        <div className="fulcrum-modal" ref={formRef}>
            <FulcrumButton onClick={() => {
                setModalFormVisibility((current: any) => ({...current, [`${isVisible}`]: false}))
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <h2 className="mt-8 mx-4">{title}</h2>

            <div className="flex flex-row justify-between mt-12">
                <FulcrumButton displayText={optionOneText} onClick={optionOneFunction} optionalTailwind={"mx-2"} backgroundColour={"green"}/>
                <FulcrumButton displayText={optionTwoText} onClick={optionTwoFunction} optionalTailwind={"mx-2"} backgroundColour={"red"}/>
            </div>
        </div>
    );
}

