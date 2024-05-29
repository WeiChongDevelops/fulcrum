import { currencyOptions } from "../../../utility/util.ts";
import FulcrumButton from "../buttons/FulcrumButton.tsx";
import useUpdateUserPreferences from "../../../hooks/mutations/other/useUpdateUserPreferences.ts";
import { UserPreferences } from "../../../utility/types.ts";

interface CurrencySelectorProps {
  userPreferences: UserPreferences;
}

/**
 * A visual selector for the user to choose the application's currency. Does not perform conversion.
 */
export default function CurrencySelector({ userPreferences }: CurrencySelectorProps) {
  return <></>;
  // const { mutate: updateUserPreferences } = useUpdateUserPreferences();
  //
  // async function handleCurrencySelection(e: React.MouseEvent) {
  //   const target = e.target as HTMLDivElement;
  //   const newCurrencySetting = target.innerText.slice(1);
  //
  //   const updatedUserPreferences: UserPreferences = { ...userPreferences, currency: newCurrencySetting };
  //   updateUserPreferences(updatedUserPreferences);
  // }
  //
  // return (
  //   <div className={"currency-selector"}>
  //     {currencyOptions.map((currencyOption, key) => {
  //       return (
  //         <FulcrumButton
  //           displayText={currencyOption.symbol}
  //           backgroundColour={userPreferences.currency === currencyOption.code ? "grey" : "white"}
  //           onClick={handleCurrencySelection}
  //           optionalTailwind={`w-32 px-2 text-md ${userPreferences.currency === currencyOption.code && "outline"}`}
  //           hoverShadow={true}
  //           key={key}
  //         />
  //       );
  //     })}
  //   </div>
  // );
}
