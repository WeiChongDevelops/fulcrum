import {useEffect, useRef, useState} from "react";

interface InfoTileProps {
    initialDisplayText: string
    hoverDisplayText: string
    backgroundColour: string
}

export default function InfoTile( { initialDisplayText, hoverDisplayText, backgroundColour }: InfoTileProps) {

    const tileRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                console.log("HI")
                if (entry.isIntersecting) {
                    entry.target.classList.add("show-tile");
                } else {
                    entry.target.classList.remove("show-tile");
                }
            });
        })
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
        <div className={"single-tile-container hide-tile mx-8"} ref={tileRef}>
            <div className={"mid-copy-animation-tile relative text-black"} style={{backgroundColor: backgroundColour}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className={`absolute ${isHovered ? "hidden" : "block"}`}>
                    <p>{initialDisplayText}</p>
                </div>
                <div className={`absolute p-5 ${isHovered ? "block" : "hidden"}`}>
                    <p>{hoverDisplayText}</p>
                </div>
            </div>
        </div>
    );
}