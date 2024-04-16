import { currencyOptions } from "../../../utility/util.ts";
import FulcrumButton from "../other/FulcrumButton.tsx";
import useUpdatePublicUserData from "../../../hooks/mutations/other/useUpdatePublicUserData.ts";
import { PublicUserData } from "../../../utility/types.ts";

interface CurrencySelectorProps {
  publicUserData: PublicUserData;
}

/**
 * A visual selector for the user to choose the application's currency. Does not perform conversion.
 */
export default function CurrencySelector({ publicUserData }: CurrencySelectorProps) {
  const { mutate: updatePublicUserData } = useUpdatePublicUserData();

  async function handleCurrencySelection(e: React.MouseEvent) {
    const target = e.target as HTMLDivElement;
    const newCurrencySetting = target.innerText.slice(1);

    const updatedPublicUserData: PublicUserData = { ...publicUserData, currency: newCurrencySetting };
    updatePublicUserData(updatedPublicUserData);
  }

  return (
    <div className={"currency-selector"}>
      {currencyOptions.map((currencyOption, key) => {
        return (
          <FulcrumButton
            displayText={currencyOption.symbol}
            backgroundColour={publicUserData.currency === currencyOption.code ? "grey" : "white"}
            onClick={handleCurrencySelection}
            optionalTailwind={`w-32 px-2 text-md ${publicUserData.currency === currencyOption.code && "outline"}`}
            hoverShadow={true}
            key={key}
          />
        );
      })}
    </div>
  );
}
