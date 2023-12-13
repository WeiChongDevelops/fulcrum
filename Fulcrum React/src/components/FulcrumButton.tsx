
interface FulcrumButtonProps {
    displayText: string;
    onClick?: () => void;
}
export default function FulcrumButton({displayText, onClick}: FulcrumButtonProps) {
    return (
        <button onClick={onClick}>{displayText}</button>
    )
}