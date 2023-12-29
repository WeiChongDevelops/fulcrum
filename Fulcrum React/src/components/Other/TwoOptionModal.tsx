import {Dispatch, MouseEventHandler, SetStateAction, useEffect, useRef} from "react";

interface TwoOptionModalProps {
    optionOneText: string;
    optionOneFunction: MouseEventHandler<HTMLButtonElement>
    optionTwoText: string;
    optionTwoFunction: MouseEventHandler<HTMLButtonElement>
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export default function TwoOptionModal( { optionOneText, optionOneFunction, optionTwoText, optionTwoFunction, setVisible }: TwoOptionModalProps) {

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setVisible(false);
        }
    };

    return (
        <div className="budget-modal" ref={formRef}>
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

