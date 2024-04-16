import { FormEvent, useEffect, useRef, useState } from "react";
import { addIconSelectionFunctionality, changeFormOrModalVisibility } from "../../../../utility/util.ts";
import FulcrumButton from "../../other/FulcrumButton.tsx";
import ProfileIconSelector from "../../selectors/ProfileIconSelector.tsx";
import useUpdatePublicUserData from "../../../../hooks/mutations/other/useUpdatePublicUserData.ts";
import {
  ProfileIconUpdatingFormData,
  PublicUserData,
  SetFormVisibility,
  ToolsFormVisibility,
} from "../../../../utility/types.ts";
interface ProfileIconUpdatingFormProps {
  oldIconFileName: string;
  setToolsFormVisibility: SetFormVisibility<ToolsFormVisibility>;
  publicUserData: PublicUserData;
}

/**
 * A form for choosing a profile icon.
 */
export default function ProfileIconUpdatingForm({
  oldIconFileName,
  setToolsFormVisibility,
  publicUserData,
}: ProfileIconUpdatingFormProps) {
  const [formData, setFormData] = useState<ProfileIconUpdatingFormData>({
    iconPath: oldIconFileName,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: updatePublicUserData } = useUpdatePublicUserData();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    const removeIconEventListeners = addIconSelectionFunctionality(setFormData, "profile");
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      removeIconEventListeners();
    };
  }, []);

  function hideForm() {
    changeFormOrModalVisibility(setToolsFormVisibility, "isUpdateProfileIconFormVisible", false);
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();

    const updatedPublicUserData: PublicUserData = { ...publicUserData, profileIconFileName: formData.iconPath };
    updatePublicUserData(updatedPublicUserData);
  }

  return (
    <div ref={formRef} className="fulcrum-form">
      <FulcrumButton
        onClick={() => {
          hideForm();
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      />
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <ProfileIconSelector />
        <FulcrumButton displayText="Update Profile Icon" />
      </form>
    </div>
  );
}
