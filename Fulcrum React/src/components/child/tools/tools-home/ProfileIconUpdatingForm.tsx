import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  addIconSelectionFunctionality,
  changeFormOrModalVisibility,
  LocationContext,
  useLocation,
} from "../../../../utility/util.ts";
import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import ProfileIconSelector from "../../selectors/ProfileIconSelector.tsx";
import useUpdateUserPreferences from "../../../../hooks/mutations/other/useUpdateUserPreferences.ts";
import {
  ProfileIconUpdatingFormData,
  UserPreferences,
  SetFormVisibility,
  ToolsFormVisibility,
} from "../../../../utility/types.ts";
interface ProfileIconUpdatingFormProps {
  oldIconFileName: string;
  setToolsFormVisibility: SetFormVisibility<ToolsFormVisibility>;
  userPreferences: UserPreferences;
}

/**
 * A form for choosing a profile icon.
 */
export default function ProfileIconUpdatingForm({
  oldIconFileName,
  setToolsFormVisibility,
  userPreferences,
}: ProfileIconUpdatingFormProps) {
  const [formData, setFormData] = useState<ProfileIconUpdatingFormData>({
    iconPath: oldIconFileName,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: updateUserPreferences } = useUpdateUserPreferences();
  const routerLocation = useLocation();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    const removeIconEventListeners = addIconSelectionFunctionality(setFormData, "profile");
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      removeIconEventListeners();
    };
  }, [routerLocation]);

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

    const updatedUserPreferences: UserPreferences = { ...userPreferences, profileIconFileName: formData.iconPath };
    updateUserPreferences(updatedUserPreferences);
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
