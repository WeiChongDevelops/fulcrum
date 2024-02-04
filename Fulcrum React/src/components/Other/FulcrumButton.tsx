
interface FulcrumButtonGreenProps {
    displayText: string;
    onClick?: ()=>void;
    optionalTailwind? : string;
    backgroundColour? : "red" | "green" | "grey" | "white";
    id? : string;
}
export default function FulcrumButton({ displayText, onClick, optionalTailwind, backgroundColour, id }: FulcrumButtonGreenProps) {

    const backgroundStyles = (() => {
        switch (backgroundColour) {
            case("green"):
                return "#17423f";
            case("red"):
                return "#ff3f3f";
            case("grey"):
                return "#3f4240";
            case("white"):
                return "white";
            default:
                return "#17423f"
        }
    } )

    return (
        <button onClick={onClick} className={`font-bold rounded-xl mx-2 py-[0.6em] px-[1.2em] hover:opacity-90 
        ${optionalTailwind}`}
                style={{backgroundColor: backgroundStyles(), color: backgroundStyles() === "white" ? "black" : "white"}}
                id={id}
        >{displayText}</button>
    )
}