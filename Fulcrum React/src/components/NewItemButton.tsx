
interface NewItemButtonProps {
    itemType: string;
}
export default function NewItemButton({itemType}: NewItemButtonProps) {
    return (
        <button>{itemType}</button>
    )
}