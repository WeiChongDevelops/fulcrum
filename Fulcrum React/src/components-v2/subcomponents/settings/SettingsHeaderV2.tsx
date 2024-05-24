import { Button } from "@/components-v2/ui/button.tsx";
import { PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";
import { useNavMenuIsOpen } from "@/utility/util.ts";

interface SettingsHeaderV2 {
  publicUserData: PublicUserData;
}

export default function SettingsHeaderV2({ publicUserData }: SettingsHeaderV2) {
  const navMenuOpen = useNavMenuIsOpen();
  return (
    <div
      className={`fixed flex flex-row z-40 gap-4 justify-start items-center self-end bg-gray-400 ${navMenuOpen ? "w-[calc(100vw-14rem)]" : "w-[calc(100vw-5rem)]"} h-[6vh]`}
    >
      <div className={"flex flex-row justify-center items-center gap-4 ml-auto mr-2"}>
        <p className={"mx-8 font-bold text-xl"}>Settings</p>
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button>Help</Button>
      </div>
    </div>
  );
}
