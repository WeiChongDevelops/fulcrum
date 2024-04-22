import { changeFormOrModalVisibility, EmailContext } from "../../../../utility/util.ts";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import ProfileIconUpdatingForm from "./ProfileIconUpdatingForm.tsx";
import { OpenToolsSection, PublicUserData, ToolsFormVisibility } from "../../../../utility/types.ts";
import { handleUserLogout } from "../../../../utility/api.ts";

interface ToolsHomeProps {
  publicUserData: PublicUserData;
  setOpenToolsSection: Dispatch<SetStateAction<OpenToolsSection>>;
}

/**
 * The home component for the tools page.
 */

export default function ToolsHome({ publicUserData, setOpenToolsSection }: ToolsHomeProps) {
  const [toolsFormVisibility, setToolsFormVisibility] = useState<ToolsFormVisibility>({
    isUpdateProfileIconFormVisible: false,
  });
  const [isChangeIconMessageVisible, setIsChangeIconMessageVisible] = useState(false);

  function handleMouseEnter() {
    setIsChangeIconMessageVisible(true);
  }

  function handleMouseLeave() {
    setIsChangeIconMessageVisible(false);
  }

  function openProfileIconSelector() {
    setIsChangeIconMessageVisible(false);
    changeFormOrModalVisibility(setToolsFormVisibility, "isUpdateProfileIconFormVisible", true);
  }

  function openSettings() {
    setOpenToolsSection("settings");
  }

  function openRecurringExpenses() {
    setOpenToolsSection("recurring");
  }

  const email = useContext(EmailContext);

  return (
    <div className="tools flex flex-col justify-center items-center bg-[#455259] p-10">
      <div
        className="profile-icon-display mb-2"
        onClick={openProfileIconSelector}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={`/src/assets/profile-icons/${publicUserData.profileIconFileName.slice(0, -4)}-white.svg`}
          alt="Profile image"
        />
        {isChangeIconMessageVisible && <b className={"absolute z-4 mt-[87.5%] text-xs"}>Change Icon</b>}
      </div>
      <p className={"font-bold text-2xl text-white mb-5"}>{email}</p>
      <div>
        <FulcrumButton displayText={"Sign Out"} backgroundColour={"white"} onClick={handleUserLogout} />
      </div>

      {toolsFormVisibility.isUpdateProfileIconFormVisible && (
        <div className="absolute w-[80vw] h-[80vh] bg-transparent z-3"></div>
      )}

      <div className="tools-tile-container">
        <div
          className="tools-tile tools-tile-interactive bg-[#D1B1B1] text-black text-3xl hover:cursor-pointer"
          onClick={openSettings}
        >
          <div className="tools-text-container">
            <p>Settings</p>
          </div>

          <img src="/src/assets/UI-icons/tools-settings-icon-black.svg" alt="Settings icon" />
        </div>
        <div
          className="tools-tile tools-tile-interactive bg-[#B1D1CF] text-black text-lg leading-[1] hover:cursor-pointer"
          onClick={openRecurringExpenses}
        >
          <div className="tools-text-container">
            <p>Recurring Expenses</p>
          </div>
          <img src="/src/assets/UI-icons/tools-recurring-icon-black.svg" alt="Recurrence icon" />
        </div>
        <div className="tools-tile bg-[#B1C5D1] text-black text-xl leading-7 hover:cursor-not-allowed">
          <div className="tools-text-container">
            <p>Coming Soon</p>
          </div>
          <img src="/src/assets/UI-icons/tools-hardhat-icon.svg" alt="Tools icon" />
        </div>
      </div>

      {toolsFormVisibility.isUpdateProfileIconFormVisible && (
        <ProfileIconUpdatingForm
          oldIconFileName={publicUserData.profileIconFileName}
          publicUserData={publicUserData}
          setToolsFormVisibility={setToolsFormVisibility}
        />
      )}
    </div>
  );
}
