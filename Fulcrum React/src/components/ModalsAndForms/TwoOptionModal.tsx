import {Dispatch, MouseEventHandler, SetStateAction, useEffect, useRef} from "react";
import {BudgetModalVisibility, ExpenseModalVisibility} from "../../util.ts";

interface TwoOptionModalProps {
    optionOneText: string;
    optionOneFunction: MouseEventHandler<HTMLButtonElement>;
    optionTwoText: string;
    optionTwoFunction: MouseEventHandler<HTMLButtonElement>;
    setModalFormVisibility: Dispatch<SetStateAction<BudgetModalVisibility>> | Dispatch<SetStateAction<ExpenseModalVisibility>>
    setVisible: string;
    title: string;
}

export default function TwoOptionModal( { optionOneText, optionOneFunction, optionTwoText, optionTwoFunction, setModalFormVisibility, setVisible, title }: TwoOptionModalProps) {

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setModalFormVisibility((current: any) => ({...current, [`${setVisible}`]: false}))
        }
    };

    return (
        <div className="budget-modal" ref={formRef}>
            <button className="ml-auto mb-auto" onClick={(e) => {
                e.preventDefault();
                setModalFormVisibility((current: any) => ({...current, [`${setVisible}`]: false}))
            }}>Cancel</button>

            <h2 className="mt-8 mx-4">{title}</h2>

            <div className="flex flex-row justify-between mt-12">
                <button onClick={optionOneFunction} className="mx-2">{optionOneText}</button>
                <button onClick={optionTwoFunction} className="mx-2">{optionTwoText}</button>
            </div>
        </div>
    );
}

