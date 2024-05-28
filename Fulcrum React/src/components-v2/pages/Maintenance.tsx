import { HardHat } from "@phosphor-icons/react";

export default function Maintenance() {
  return (
    <div className={"flex flex-col justify-center items-center h-screen w-screen"}>
      <HardHat size={36} weight={"bold"} />
      <p className={"text-xl font-medium my-4"}>
        Fulcrum is down for maintenance from 4:00am AWST May 22nd until 4:00am AWST June 3rd.
      </p>
      <p className={"text-sm font-extrabold"}>Thank you for your patience.</p>
      <img src="/static/assets-v2/fulcrum-logos/fulcrum-icon.png" alt="fulcrum icon" className={"w-5 my-8"} />
    </div>
  );
}
