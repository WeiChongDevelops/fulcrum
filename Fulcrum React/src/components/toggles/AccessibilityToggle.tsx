import { useState, useEffect } from 'react';
import { handlePublicUserDataUpdating, PublicUserData, PublicUserDataUpdate } from "../../util.ts";
import { Dispatch, SetStateAction } from "react";

interface AccessibilityToggleProps {
    publicUserData: PublicUserData;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;
}

/**
 * A toggle for the user to choose between standard mode and accessibility mode (high contrast + greyscale).
 */
export default function AccessibilityToggle({ publicUserData, setPublicUserData }: AccessibilityToggleProps) {
    const [isAccessibilityMode, setIsAccessibilityMode] = useState(publicUserData.accessibilityEnabled);

    useEffect(() => {
        setIsAccessibilityMode(publicUserData.accessibilityEnabled);
    }, [publicUserData.accessibilityEnabled]);

    async function handleAccessibilityToggle() {
        const newIsAccessibilityMode = !isAccessibilityMode;
        setIsAccessibilityMode(newIsAccessibilityMode);
        setPublicUserData(curr => ({ ...curr, accessibilityEnabled: newIsAccessibilityMode }));

        const updatedPublicUserData: PublicUserDataUpdate = {
            currency: publicUserData.currency,
            darkModeEnabled: publicUserData.darkModeEnabled,
            accessibilityEnabled: newIsAccessibilityMode,
            profileIconFileName: publicUserData.profileIconFileName,
        };

        await handlePublicUserDataUpdating(updatedPublicUserData);

        sessionStorage.setItem("accessibilityMode", newIsAccessibilityMode.toString());
    }

    return (
        <div className={`flex flex-row justify-start w-20 rounded-3xl p-1 hover:cursor-pointer ${isAccessibilityMode ? "bg-[#3f4240] sun-glow" : "bg-[#17423F] rgb-glow"} `} onClick={handleAccessibilityToggle}>
            <div className={`rounded-full w-7 h-7 p-1 select-none transition-all ease-in-out ${isAccessibilityMode ? "toggle-right-shift bg-black" : "bg-white "}`}>
                <img src={`/src/assets/UI-icons/${isAccessibilityMode ? "contrast-mode" : "colour-mode"}.svg`} alt="Accessibility mode icon"/>
            </div>
        </div>
    );
}
