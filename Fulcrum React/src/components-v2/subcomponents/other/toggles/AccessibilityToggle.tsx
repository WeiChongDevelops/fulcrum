import { Switch } from "@/components-v2/ui/switch.tsx";
import { useContext, useEffect, useState } from "react";
import { UserPreferences } from "@/utility/types.ts";
import useUpdateUserPreferences from "@/hooks/mutations/other/useUpdateUserPreferences.ts";
import { cn, LocationContext, useEmail } from "@/utility/util.ts";
import { CircleHalf, Palette } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";

interface AccessibilityToggleProps {
  hideDescriptor?: boolean;
  className?: string;
}

export default function AccessibilityToggle({ hideDescriptor = false, className }: AccessibilityToggleProps) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  const [accessibilityOn, setAccessibilityOn] = useState(userPreferences.darkModeEnabled);
  const { mutate: updateUserPreferences } = useUpdateUserPreferences();
  const routerLocation = useContext(LocationContext);

  useEffect(() => {
    setAccessibilityOn(userPreferences.accessibilityEnabled);
  }, [userPreferences.darkModeEnabled, routerLocation]);

  const handleToggleChange = () => {
    setAccessibilityOn(!accessibilityOn);
    const updatedUserPreferences: UserPreferences = { ...userPreferences, accessibilityEnabled: !accessibilityOn };
    updateUserPreferences(updatedUserPreferences);
  };

  return (
    <div className={cn("flex flex-row justify-start items-center gap-3.5 font-semibold text-white", className)}>
      {accessibilityOn ? <CircleHalf size={"1.5rem"} /> : <Palette size={"1.5rem"} />}
      {!hideDescriptor && <p>Accessibility</p>}
      <Switch checked={accessibilityOn} onCheckedChange={handleToggleChange} className={"shadow sun-glow"} />
    </div>
  );
}
