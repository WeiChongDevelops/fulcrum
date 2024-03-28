import { getWindowLocation } from "../../../util.ts";
import { useState } from "react";

/**
 * The lower navbar, used for navigation between the budget pages (Expense, Budget and Tools).
 */
export default function NavbarLower() {
  const [hoveredNavButton, setHoveredNavButton] = useState("");

  function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.target as HTMLButtonElement;
    setHoveredNavButton(button.id);
  }

  function handleMouseLeave() {
    setHoveredNavButton("");
  }

  return (
    <nav className="text-white font-bold z-10">
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-1 justify-around border-4 border-black bg-black">
          <button
            id="expenses"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`lower-navbar-button ${getWindowLocation() === "expenses" ? "bg-[#17423F]" : "bg-black"} border-2`}
            onClick={() => (window.location.href = "/expenses")}
          >
            <img
              src={`/src/assets/navbar-icons/expenses-icon-${getWindowLocation() === "expenses" ? "white" : "black"}.svg`}
              className={`w-6 transition-opacity duration-300 ${getWindowLocation() === "expenses" && hoveredNavButton === "expenses" && "opacity-0"}`}
              alt="Navigation icon"
            />
            <p className="mx-4">Expenses</p>
            <img
              src={`/src/assets/navbar-icons/expenses-icon-${getWindowLocation() === "expenses" ? "white" : "black"}.svg`}
              className={`w-6 transition-opacity duration-300 ${getWindowLocation() === "expenses" && hoveredNavButton === "expenses" && "opacity-0"}`}
              alt="Navigation icon"
            />
          </button>
          <button
            id="budget"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`lower-navbar-button ${getWindowLocation() === "budget" ? "bg-[#17423F]" : "bg-black"} border-y-2 border-x-4`}
            onClick={() => (window.location.href = "/budget")}
          >
            <img
              src={`/src/assets/navbar-icons/budget-icon-${getWindowLocation() === "budget" ? "white" : "black"}.svg`}
              className={`w-6 transition-opacity duration-300 ${getWindowLocation() === "budget" && hoveredNavButton === "budget" && "opacity-0"}`}
              alt="Navigation icon"
            />
            <p className="mx-4">Budget</p>
            <img
              src={`/src/assets/navbar-icons/budget-icon-${getWindowLocation() === "budget" ? "white" : "black"}.svg`}
              className={`w-6 transition-opacity duration-300 ${getWindowLocation() === "budget" && hoveredNavButton === "budget" && "opacity-0"}`}
              alt="Navigation icon"
            />
          </button>
          <button
            id="tools"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`lower-navbar-button ${getWindowLocation() === "tools" ? "bg-[#17423F]" : "bg-black"} border-2`}
            onClick={() => (window.location.href = "/tools")}
          >
            <img
              src={`/src/assets/navbar-icons/tools-icon-${getWindowLocation() === "tools" ? "white" : "black"}.svg`}
              className={`w-6 transition-opacity duration-300 ${getWindowLocation() === "tools" && hoveredNavButton === "tools" && "opacity-0"}`}
              alt="Navigation icon"
            />
            <p className="mx-4">Tools</p>
            <img
              src={`/src/assets/navbar-icons/tools-icon-${getWindowLocation() === "tools" ? "white" : "black"}.svg`}
              className={`w-6 transition-opacity duration-300 ${getWindowLocation() === "tools" && hoveredNavButton === "tools" && "opacity-0"}`}
              alt="Navigation icon"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
