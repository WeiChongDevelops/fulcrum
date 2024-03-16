import {useEffect} from "react";
import InfoTile from "./InfoTile.tsx";

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
                <InfoTile initialDisplayText={"Simplify Your Finances"} hoverDisplayText={"No confusing UI or features - nothing more or less than what you need."} backgroundColour={"#84cbe3"}/>
                <InfoTile initialDisplayText={"Adapt Your Finances"} hoverDisplayText={"Flexible budgets designed to change alongside you."} backgroundColour={"#4682B4"}/>
                <InfoTile initialDisplayText={"Understand Your Finances"} hoverDisplayText={"Finally figure out where that paycheck keeps disappearing off to."} backgroundColour={"#00008B"}/>
            </div>
            <div className={"flex flex-row justify-center items-center"}>
                <div className={"rounded-full bg-red-500 h-3 w-3"}></div>
                <div className={"rounded-full bg-red-500 h-3 w-3 mx-4"}></div>
                <div className={"rounded-full bg-red-500 h-3 w-3"}></div>
            </div>
        </div>
    );
}