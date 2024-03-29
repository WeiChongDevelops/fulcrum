import { getWindowLocation } from "../../../util.ts";
import { useState } from "react";
import PageSelectionButton from "./PageSelectionButton.tsx";

interface NavbarLowerProps {
  darkModeEnabled: boolean;
}

/**
 * The lower navbar, used for navigation between the budget pages (Expense, Budget and Tools).
 */
export default function NavbarLower({ darkModeEnabled }: NavbarLowerProps) {
  const [hoveredNavButton, setHoveredNavButton] = useState("");

  return (
    <nav className="text-white font-bold z-10">
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-1 justify-around border-4 border-black bg-black">
          <PageSelectionButton
            darkModeEnabled={darkModeEnabled}
            hoveredNavButton={hoveredNavButton}
            setHoveredNavButton={setHoveredNavButton}
            fulcrumPage="expenses"
            windowLocation={getWindowLocation()}
          />
          <PageSelectionButton
            darkModeEnabled={darkModeEnabled}
            hoveredNavButton={hoveredNavButton}
            setHoveredNavButton={setHoveredNavButton}
            fulcrumPage="budget"
            windowLocation={getWindowLocation()}
          />
          <PageSelectionButton
            darkModeEnabled={darkModeEnabled}
            hoveredNavButton={hoveredNavButton}
            setHoveredNavButton={setHoveredNavButton}
            fulcrumPage="tools"
            windowLocation={getWindowLocation()}
          />
        </div>
      </div>
    </nav>
  );
}
