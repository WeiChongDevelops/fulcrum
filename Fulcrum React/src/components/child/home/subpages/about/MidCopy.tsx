import {useEffect} from "react";
import InfoTile from "./InfoTile.tsx";

/**
 * Mid-page component displaying sales copy on interactive tiles for key benefits.
 */
export default function MidCopy() {

    useEffect(() => {
        function addHomepageAnimations(): void {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show-tile");
                    } else {
                        entry.target.classList.remove("show-tile");
                    }
                });
            })
            const tiles = document.querySelectorAll(".single-tile-container");
            tiles.forEach(tile => observer.observe(tile))
        }
        addHomepageAnimations();
    }, []);

    return (
        <div className={"relative z-20 top-[25vw] h-0 mid-copy-container"}>
            <div className={"flex flex-row justify-center items-center mb-20"}>
                <InfoTile initialDisplayText={"Simplify Your Finances"}
                          hoverDisplayText={"No confusing UI or features - nothing more or less than what you need."}
                          backgroundColour={"#84cbe3"}
                          iconPathFront={"/src/assets/homepage-assets/tile-icon-simplify-front.svg"}
                          iconPathBack={"/src/assets/homepage-assets/tile-icon-simplify-back.svg"}/>
                <InfoTile initialDisplayText={"Adapt Your Finances"}
                          hoverDisplayText={"Flexible budgets designed to change alongside you."}
                          backgroundColour={"#3d97e1"}
                          iconPathFront={"/src/assets/homepage-assets/tile-icon-adapt-front.svg"}
                          iconPathBack={"/src/assets/homepage-assets/tile-icon-adapt-back.svg"}/>
                <InfoTile initialDisplayText={"Master Your Finances"}
                          hoverDisplayText={"Finally figure out where that paycheck keeps disappearing off to."}
                          backgroundColour={"#29297b"}
                          textColor={"white"}
                          iconPathFront={"/src/assets/homepage-assets/tile-icon-master-front.svg"}
                          iconPathBack={"/src/assets/homepage-assets/tile-icon-master-back.svg"}/>
            </div>
            <div className={"flex flex-row justify-center items-center"}>
                <div className={"rounded-full bg-[#282d33] h-2 w-2"}></div>
                <div className={"rounded-full bg-[#282d33] h-2 w-2 mx-3"}></div>
                <div className={"rounded-full bg-[#282d33] h-2 w-2"}></div>
            </div>
        </div>
    );
}