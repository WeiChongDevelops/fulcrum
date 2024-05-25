import { useEffect } from "react";
import { toast } from "sonner";

interface FulcrumErrorPage {
  errors: Error[];
}

export default function FulcrumErrorPage({ errors }: FulcrumErrorPage) {
  useEffect(() => {
    toast.loading("Redirecting...");
    setTimeout(() => {
      toast.dismiss();
      window.location.href = "/login";
    }, 5000);
  }, []);
  return (
    <div className={"flex flex-col justify-center items-center h-screen gap-14 text-black font-bold"}>
      <p>There's been an error. Please try again later or get in touch via the contact form.</p>
      <div className={"max-h-[25vh]"}>
        {errors &&
          errors.slice(0, 2).map((error, key) => (
            <div key={key}>
              <p className={"text-red-500"}>{error.message}</p>
              <p className={"text-gray-500 text-xs max-h-64"}>{error.stack}</p>
            </div>
          ))}
      </div>
      <img src="/static/assets-v2/fulcrum-logos/fulcrum-icon.png" className={"w-10 h-10"} alt="Fulcrum icon" />
    </div>
  );
}
