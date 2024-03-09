import {currencyOptions, handlePublicUserDataUpdating, PublicUserData, PublicUserDataUpdate} from "../../../util.ts";
import FulcrumButton from "../other/FulcrumButton.tsx";
import {Dispatch, SetStateAction} from "react";

interface CurrencySelectorProps {
    publicUserData: PublicUserData;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;
}

/**
 * A visual selector for the user to choose the application's currency. Does not perform conversion.
 */
export default function CurrencySelector({ publicUserData, setPublicUserData }: CurrencySelectorProps) {

    async function handleCurrencySelection(e: React.MouseEvent) {
        const target = e.target as HTMLDivElement;
        const newCurrencySetting = target.innerText.slice(1)
        setPublicUserData(curr => ({...curr, currency: newCurrencySetting}))

        const updatedPublicUserData: PublicUserDataUpdate = {
            currency: newCurrencySetting,
            profileIconFileName: publicUserData.profileIconFileName,
            darkModeEnabled: publicUserData.darkModeEnabled,
            accessibilityEnabled: publicUserData.accessibilityEnabled
        }
        await handlePublicUserDataUpdating(updatedPublicUserData)
    }

    return (
        <div className={"currency-selector font-bold text-3xl w-[80%] mt-6"}>
            {currencyOptions.map((currencyOption, key) => {
                return <FulcrumButton
                    displayText={currencyOption.symbol}
                    backgroundColour={publicUserData.currency === currencyOption.code ? "grey" : "white"}
                    onClick={handleCurrencySelection}
                    optionalTailwind={`w-32 mb-4 p-2 text-md ${publicUserData.currency === currencyOption.code && "outline"}`}
                    key={key}/>
            })}
        </div>
    );
}