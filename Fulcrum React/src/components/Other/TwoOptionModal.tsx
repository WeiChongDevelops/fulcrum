import {Dispatch, MouseEventHandler, SetStateAction} from "react";

interface TwoOptionModalProps {
    optionOneText: string;
    optionOneFunction: MouseEventHandler<HTMLButtonElement>
    optionTwoText: string;
    optionTwoFunction: MouseEventHandler<HTMLButtonElement>
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export default function TwoOptionModal( { optionOneText, optionOneFunction, optionTwoText, optionTwoFunction, setVisible }: TwoOptionModalProps) {
    return (
        <div className="budget-modal">
            <button className="ml-auto mb-auto" onClick={(e) => {
                e.preventDefault();
                setVisible(false);
            }}>Cancel</button>

            <h2 className="mt-8">Deleting Group</h2>

            <div className="flex flex-row justify-between mt-12">
                <button onClick={optionOneFunction}>{optionOneText}</button>
                <button onClick={optionTwoFunction}>{optionTwoText}</button>
            </div>
        </div>
    );
}

