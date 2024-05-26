import { Switch } from "@/components-v2/ui/switch.tsx";
import { useContext, useEffect, useState } from "react";
import { PublicUserData } from "@/utility/types.ts";
import { cn } from "@/lib/utils.ts";
import useUpdatePublicUserData from "@/hooks/mutations/other/useUpdatePublicUserData.ts";
import { LocationContext } from "@/utility/util.ts";

interface AccessibilityToggleProps {
  publicUserData: PublicUserData;
  hideDescriptor?: boolean;
  className?: string;
}

export default function AccessibilityToggle({
  publicUserData,
  hideDescriptor = false,
  className,
}: AccessibilityToggleProps) {
  const [accessibilityOn, setAccessibilityOn] = useState(publicUserData.darkModeEnabled);
  const { mutate: updatePublicUserData } = useUpdatePublicUserData();
  const routerLocation = useContext(LocationContext);

  useEffect(() => {
    setAccessibilityOn(publicUserData.accessibilityEnabled);
  }, [publicUserData.darkModeEnabled, routerLocation]);

  const handleToggleChange = () => {
    setAccessibilityOn(!accessibilityOn);
    const updatedPublicUserData: PublicUserData = { ...publicUserData, accessibilityEnabled: !accessibilityOn };
    updatePublicUserData(updatedPublicUserData);
  };

  return (
    <div className={cn("flex flex-row justify-start items-center gap-3.5 font-semibold text-white mt-auto", className)}>
      {accessibilityOn ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      )}
      {!hideDescriptor && <p>Accessibility</p>}
      <Switch checked={accessibilityOn} onCheckedChange={handleToggleChange} className={"shadow"} />
    </div>
  );
}
