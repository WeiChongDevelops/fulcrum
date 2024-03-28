import { useEffect, useRef, useState } from "react";

interface InfoTileProps {
  initialDisplayText: string;
  hoverDisplayText: string;
  backgroundColour: string;
  textColor?: string;
  iconPathFront: string;
  iconPathBack: string;
}

/**
 * Interactive tile for displaying financial benefits of Fulcrum, providing further detail on hover.
 */
export default function InfoTile({
  initialDisplayText,
  hoverDisplayText,
  backgroundColour,
  textColor,
  iconPathFront,
  iconPathBack,
}: InfoTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show-tile");
        } else {
          entry.target.classList.remove("show-tile");
        }
      });
    });
    observer.observe(tileRef.current!);
    return () => observer.disconnect();
  }, []);

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  return (
    <div className={"single-tile-container hide-tile"} ref={tileRef}>
      <div
        className={"mid-copy-animation-tile"}
        style={{
          backgroundColor: backgroundColour,
          color: textColor ? textColor : "black",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`absolute flex flex-col justify-center items-center ${isHovered ? "hidden" : "block"}`}
        >
          <img
            src={iconPathFront}
            alt="Info tile icon"
            className={"w-16 h-auto mb-6"}
          />
          <b className={"lg:text-lg text-sm"}>{initialDisplayText}</b>
          <p className={"text-xs mt-2"}>(Hover/Tap to Learn More)</p>
        </div>
        <div
          className={`absolute flex flex-col justify-center items-center p-5 font-medium ${isHovered ? "block" : "hidden"}`}
        >
          <p className={"text-md"}>{hoverDisplayText}</p>
          <img
            src={iconPathBack}
            alt="Info tile icon"
            className={"w-6 h-auto mt-6"}
          />
        </div>
      </div>
    </div>
  );
}
