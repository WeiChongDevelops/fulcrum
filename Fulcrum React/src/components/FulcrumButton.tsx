
interface FulcrumButtonProps {
    displayText: string;
}
export default function FulcrumButton({displayText}: FulcrumButtonProps) {
    return (
        <button>{displayText}</button>
    )
}