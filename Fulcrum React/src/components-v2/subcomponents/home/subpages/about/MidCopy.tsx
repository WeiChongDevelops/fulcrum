import { useEffect } from "react";
import InfoTile from "./InfoTile.tsx";
import { useLocation } from "@/utility/util.ts";

/**
 * Mid-page component displaying sales copy on interactive tiles for key benefits.
 */
export default function MidCopy() {
  const routerLocation = useLocation();

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
    const tiles = document.querySelectorAll(".single-tile-container");
    tiles.forEach((tile) => observer.observe(tile));

    return () => observer.disconnect();
  }, [routerLocation]);

  return (
    <div className={"relative z-20 top-[25vw] h-0"}>
      <div className={"flex flex-row justify-center items-center mb-20"}>
        <InfoTile
          initialDisplayText={"Simplify Your Finances"}
          hoverDisplayText={"No confusing features. Nothing more or less than what you need."}
          backgroundColour={"#002E38"}
          iconPathFront={"/static/assets-v2/homepage-assets/tile-icon-simplify-front.svg"}
          iconPathBack={"/static/assets-v2/homepage-assets/tile-icon-simplify-back.svg"}
        />
        <InfoTile
          initialDisplayText={"Adapt Your Finances"}
          hoverDisplayText={"Flexible budgets designed to change alongside you."}
          backgroundColour={"#002E38"}
          iconPathFront={"/static/assets-v2/homepage-assets/tile-icon-adapt-front.svg"}
          iconPathBack={"/static/assets-v2/homepage-assets/tile-icon-adapt-back.svg"}
        />
        <InfoTile
          initialDisplayText={"Master Your Finances"}
          hoverDisplayText={"Finally figure out where last week's paycheck disappeared off to."}
          backgroundColour={"#002E38"}
          iconPathFront={"/static/assets-v2/homepage-assets/tile-icon-master-front.svg"}
          iconPathBack={"/static/assets-v2/homepage-assets/tile-icon-master-back.svg"}
        />
      </div>
      <div className={"divider-dots-container"}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
