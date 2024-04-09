import { currencyOptions, EmailContext, handlePublicUserDataUpdating, PublicUserData } from "../../../util.ts";
import FulcrumButton from "../other/FulcrumButton.tsx";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CurrencySelectorProps {
  publicUserData: PublicUserData;
}

/**
 * A visual selector for the user to choose the application's currency. Does not perform conversion.
 */
export default function CurrencySelector({ publicUserData }: CurrencySelectorProps) {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  const publicUserDataUpdatingMutation = useMutation({
    mutationKey: ["publicUserData", email],
    mutationFn: (updatedPublicUserData: PublicUserData) => handlePublicUserDataUpdating(updatedPublicUserData),
    onMutate: async (updatedPublicUserData: PublicUserData) => {
      await queryClient.cancelQueries({ queryKey: ["publicUserData", email] });
      const publicUserDataBeforeOptimisticUpdate = queryClient.getQueryData(["publicUserData", email]);
      await queryClient.setQueryData(["publicUserData", email], updatedPublicUserData);
      return { publicUserDataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["publicUserData", email], context?.publicUserDataBeforeOptimisticUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicUserData", email] });
    },
  });

  async function handleCurrencySelection(e: React.MouseEvent) {
    const target = e.target as HTMLDivElement;
    const newCurrencySetting = target.innerText.slice(1);
    // setPublicUserData((prevPublicUserData) => ({
    //   ...prevPublicUserData,
    //   currency: newCurrencySetting,
    // }));

    const updatedPublicUserData: PublicUserData = { ...publicUserData, currency: newCurrencySetting };
    publicUserDataUpdatingMutation.mutate(updatedPublicUserData);
    // await handlePublicUserDataUpdating(updatedPublicUserData);
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
