
interface FulcrumButtonGreenProps {
    displayText: string;
    onClick?: ()=>void;
    optionalTailwind? : string;
    backgroundColour? : "red" | "green" | "grey";
}
export default function FulcrumButton({ displayText, onClick, optionalTailwind, backgroundColour }: FulcrumButtonGreenProps) {

    const backgroundStyles = (() => {
        switch (backgroundColour) {
            case("green"):
                return "#17423f"
            case("red"):
                return "#ff3f3f"
            case("grey"):
                return "#3f4240"
            default:
                return "#17423f"
        }
    } )

    return (
        <button onClick={onClick} className={`font-bold rounded-xl mx-2 py-[0.6em] px-[1.2em] ${optionalTailwind}`} style={{backgroundColor: backgroundStyles()}}>{displayText}</button>
    )
}