
interface FulcrumButtonProps {
    displayText: string;
    onClick?: () => void;
}
export default function FulcrumButton({displayText, onClick}: FulcrumButtonProps) {
    return (
        <button onClick={onClick} className="bg-[#17423f] font-bold rounded-xl mx-2 py-[0.6em] px-[1.2em]">{displayText}</button>
    )
}