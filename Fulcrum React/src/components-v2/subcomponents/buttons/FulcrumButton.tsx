import { RefObject } from "react";
import { cn } from "@/utility/util.ts";

interface FulcrumButtonProps {
  displayText: string;
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  optionalTailwind?: string;
  backgroundColour?: "red" | "green" | "grey" | "white";
  id?: string;
  hoverShadow?: boolean;
  refObject?: RefObject<HTMLButtonElement>;
}

/**
 * A customisable button used throughout Fulcrum.
 */
export default function FulcrumButton({
  displayText,
  onClick,
  optionalTailwind,
  backgroundColour,
  id,
  hoverShadow,
  refObject,
}: FulcrumButtonProps) {
  const backgroundStyles = () => {
    switch (backgroundColour) {
      case "green":
        return "#17423f";
      case "red":
        return "#ff3f3f";
      case "grey":
        return "#3f4240";
      case "white":
        return "white";
      default:
        return "#17423f";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "fulcrum-button font-bold rounded-xl py-[0.4em] px-[1.4em] text-center hover:opacity-90",
        hoverShadow &&
          "transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[6px_6px_0px_black]",
        optionalTailwind,
      )}
      style={{
        backgroundColor: backgroundStyles(),
        color: backgroundStyles() === "white" ? "black" : "white",
      }}
      id={id}
      ref={refObject}
    >
      {displayText}
    </button>
  );
}
