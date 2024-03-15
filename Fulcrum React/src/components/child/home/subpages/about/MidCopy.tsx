import {useEffect, useState} from "react";
import {addHomepageAnimations} from "../../../../../util.ts";

export default function MidCopy() {

    const [activeTiles, setActiveTiles] = useState({
        tile1: false,
        tile2: false,
        tile3: false
    });

    useEffect(() => {
        addHomepageAnimations();
    }, []);

    function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLDivElement;
        const initialDisplay = target.firstChild! as HTMLDivElement;
        const hoverDisplay = target.children[1] as HTMLDivElement;
        initialDisplay.style.display = "none";
        hoverDisplay.classList.remove("hidden");
    }

    function handleMouseLeave (e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLDivElement;
        const initialDisplay = target.firstChild! as HTMLDivElement;
        const hoverDisplay = target.children[1] as HTMLDivElement;
        console.log(hoverDisplay)
        initialDisplay.style.display = "block";
        hoverDisplay.classList.add("hidden");
    }

    return (
        <div className={"relative z-20 top-[25vw] h-0 mid-copy-container"}>
            <div className={"flex flex-row justify-center items-center mb-20"}>
                <div className={"single-tile-container"}>
                    <div className={"mid-copy-animation-tile hide-tile relative"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <div className={"absolute"}>Initial Display</div>
                        <div className={"absolute hidden"}>Hover Display</div>
                    </div>
                </div>
                <div className={"single-tile-container mx-[8vw]"}>
                    <div className={"mid-copy-animation-tile hide-tile relative"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <div className={"absolute"}>Initial Display</div>
                        <div className={"absolute hidden"}>Hover Display</div>
                    </div>
                </div>
                <div className={"single-tile-container"}>
                    <div className={"mid-copy-animation-tile hide-tile relative"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <div className={"absolute"}>Initial Display</div>
                        <div className={"absolute hidden"}>Hover Display</div>
                    </div>
                </div>
            </div>
            <div className={"flex flex-row justify-center items-center"}>
                <div className={"rounded-full bg-red-500 h-3 w-3"}></div>
                <div className={"rounded-full bg-red-500 h-3 w-3 mx-4"}></div>
                <div className={"rounded-full bg-red-500 h-3 w-3"}></div>
            </div>
        </div>
    );
}