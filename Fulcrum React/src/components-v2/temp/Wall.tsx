import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface WallProps {
  user: string;
}

export default function Wall({ user }: WallProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLSpanElement>(null);
  const [effectCalled, setEffectCalled] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);

  useEffect(() => {
    function shiftCursorSpotlight(e: MouseEvent) {
      spotlightRef.current!.style.left = `${e.clientX}px`;
      spotlightRef.current!.style.top = `${e.clientY}px`;
    }
    setTimeout(() => {
      document.addEventListener("mousemove", shiftCursorSpotlight);
    }, 1000);

    return () => {
      document.removeEventListener("mousemove", shiftCursorSpotlight);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!effectCalled) {
      setEffectCalled(true);
      userRef.current?.classList.add("flash");
      setTimeout(() => {
        setLightsOn(true);
        toast.loading("Just kidding.");
        setTimeout(() => (window.location.href = "https://fulcrumfinance.app/"), 3300);
      }, 3850);
    }
  };

  return (
    <div
      className={`w-screen h-screen ${lightsOn ? "bg-white" : "bg-black"} transition-colors ease-out duration-700 overflow-hidden relative`}
    >
      <div
        className={`circle-spotlight animate-pulse ${lightsOn && "hidden"}`}
        style={{
          background: "radial-gradient(circle, #fcebb8, transparent 70%, transparent 100%)",
          width: "18vw",
          height: "18vw",
        }}
        ref={spotlightRef}
      ></div>

      <img
        src="/static/assets-v2/other-assets/web-tl.png"
        alt="?"
        className={"absolute -left-10 -top-10 w-[30vw] h-[30vw]"}
      />
      <img src="/static/assets-v2/other-assets/web-tr.png" alt="?" className={"absolute right-0 -top-2"} />
      <img
        src="/static/assets-v2/other-assets/web-bl.png"
        alt="?"
        className={"absolute -left-24 bottom-12 -rotate-90 max-w-[26vw]"}
      />
      <img src="/static/assets-v2/other-assets/web-br.png" alt="?" className={"absolute -right-8 -bottom-12 rotate-180"} />
      <p
        className={
          "font-serif text-black text-[4vw] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
        }
      >
        <span className={"animate-pulse text-[#191919]"}>I</span>'m in your walls,{" "}
        <span onMouseEnter={handleMouseEnter} ref={userRef}>
          {user}
        </span>
        .
      </p>
    </div>
  );
}
