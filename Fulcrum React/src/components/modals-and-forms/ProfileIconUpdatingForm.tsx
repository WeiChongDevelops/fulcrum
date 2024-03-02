import {Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addIconSelectionFunctionality,
    getPublicUserData,
    handlePublicUserDataUpdating,
    ProfileIconUpdatingFormData, PublicUserData, PublicUserDataUpdate,
    ToolsFormVisibility
} from "../../util.ts";
import FulcrumButton from "../other/FulcrumButton.tsx";
import ProfileIconSelector from "../selectors/ProfileIconSelector.tsx";
interface ProfileIconUpdatingFormProps {
    oldIconFileName: string
    setToolsFormVisibility: Dispatch<SetStateAction<ToolsFormVisibility>>;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;
    publicUserData: PublicUserData;
}

export default function ProfileIconUpdatingForm( { oldIconFileName, setToolsFormVisibility, publicUserData, setPublicUserData }: ProfileIconUpdatingFormProps) {
    const [formData, setFormData] = useState<ProfileIconUpdatingFormData>({
        iconPath: oldIconFileName
    })
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        addIconSelectionFunctionality(setFormData, "profile");
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function hideForm() {
        setToolsFormVisibility(current => ({...current, isUpdateProfileIconFormVisible: false}));
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            hideForm();
        }
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        hideForm();

        const updatedPublicUserData: PublicUserDataUpdate = {
            currency: publicUserData.currency,
            darkModeEnabled: publicUserData.darkModeEnabled,
            accessibilityEnabled: publicUserData.accessibilityEnabled,
            profileIconFileName: formData.iconPath
        }

        await handlePublicUserDataUpdating(updatedPublicUserData);

        getPublicUserData()
            .then(publicUserData => setPublicUserData(publicUserData))
    }

    useEffect (() => {
        const oldProfileIconSelectable = document.querySelector(`div[data-value="${oldIconFileName}"]`)
        oldProfileIconSelectable?.classList.add("selectedColour")
    }, [])

    return (
        <div ref={formRef} className="fulcrum-form">

            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <ProfileIconSelector/>
                <FulcrumButton displayText="Update Profile Icon" />
            </form>
        </div>
    );
}