import { Button } from "@/components/ui/button.tsx";
import { PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";

interface SettingsHeaderV2 {
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
  publicUserData: PublicUserData;
}

export default function SettingsHeaderV2({ navMenuOpen, toggleNavMenu, publicUserData }: SettingsHeaderV2) {
  return (
    <div className={"flex flex-row gap-4 justify-start items-center bg-green-500 w-full h-[6%]"}>
      {!navMenuOpen && <Button onClick={toggleNavMenu}>{">>"}</Button>}
      <div className={"flex flex-row justify-center items-center gap-4 ml-auto mr-2"}>
        <p className={"mx-8 font-bold text-xl"}>Settings</p>
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button>Help</Button>
      </div>
    </div>
  );
}
