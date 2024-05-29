import { UserPreferences } from "@/utility/types.ts";
import { useContext, useEffect, useState } from "react";
import useUpdateUserPreferences from "@/hooks/mutations/other/useUpdateUserPreferences.ts";
import { LocationContext } from "@/utility/util.ts";

interface AccessibilityV2ToggleProps {
  userPreferences: UserPreferences;
}

/**
 * A toggle for the user to choose between standard mode and accessibility mode (high contrast + greyscale).
 */
export default function AccessibilityToggleV2({ userPreferences }: AccessibilityV2ToggleProps) {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(userPreferences.accessibilityEnabled);
  const { mutate: updateUserPreferences } = useUpdateUserPreferences();
  const routerLocation = useContext(LocationContext);

  async function handleAccessibilityToggle() {
    const newIsAccessibilityMode = !isAccessibilityMode;
    setIsAccessibilityMode(newIsAccessibilityMode);

    const updatedUserPreferences: UserPreferences = { ...userPreferences, accessibilityEnabled: newIsAccessibilityMode };
    updateUserPreferences(updatedUserPreferences);
  }

  useEffect(() => {
    setIsAccessibilityMode(userPreferences.accessibilityEnabled);
  }, [userPreferences.accessibilityEnabled, routerLocation]);

  return (
    <div
      className={`flex flex-row justify-start w-14 rounded-3xl p-1 hover:cursor-pointer ${isAccessibilityMode ? "bg-[#3f4240] sun-glow" : "bg-[#17423F] rgb-glow"} `}
      onClick={handleAccessibilityToggle}
    >
      <div
        className={`rounded-full size-5 p-1 select-none transition-all ease-in-out ${isAccessibilityMode ? "toggle-right-shift bg-black" : "bg-white "}`}
      >
        <img
          src={`/static/assets-v2/UI-icons/${isAccessibilityMode ? "contrast-mode" : "colour-mode"}.svg`}
          alt="Accessibility mode icon"
        />
      </div>
    </div>
  );
}
