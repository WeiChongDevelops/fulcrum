
interface FulcrumButtonProps {
    displayText: string;
    onClick?: () => void;
}
export default function FulcrumButton({displayText, onClick}: FulcrumButtonProps) {
    return (
        <button onClick={onClick} className="bg-[#efefef] font-bold">{displayText}</button>
    )
}