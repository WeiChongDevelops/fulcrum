interface AddNewGroupButtonProps {
  isDarkMode: boolean;
}

/**
 * Button to create a new budget category group.
 */
export default function AddNewGroupButton({ isDarkMode }: AddNewGroupButtonProps) {
  return (
    <button
      className={`w-full h-16 mb-2 rounded-xl border-2 border-dashed border-black hover:rounded-md hover:bg-[#DEDEDE33] transition-all duration-200 ease-out ${isDarkMode && "create-expense-button-dark"}`}
    >
      <p className="text-2xl font-bold">+</p>
    </button>
  );
}
