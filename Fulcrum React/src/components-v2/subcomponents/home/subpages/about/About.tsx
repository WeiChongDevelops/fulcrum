import UpperCopy from "./UpperCopy.tsx";
import MidCopy from "./MidCopy.tsx";
import LowerCopy from "./LowerCopy.tsx";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/utility/util.ts";
import { CaretDown } from "@phosphor-icons/react";

/**
 * The About section of the Fulcrum homepage.
 */
export default function About() {
  const [showArrow, setShowArrow] = useState(true);
  const scrollHideRef = useRef<HTMLDivElement>(null);
  const routerLocation = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setShowArrow(!entry.isIntersecting);
      });
    });
    if (scrollHideRef.current) {
      observer.observe(scrollHideRef.current);
    }

    return () => {
      if (scrollHideRef.current) {
        observer.unobserve(scrollHideRef.current);
      }
    };
  }, [routerLocation]);

  return (
    <div className={"z-10 bg-[#e0eddf] relative"}>
      <CaretDown
        className={`fixed top-[95vh] bouncy-arrow left-1/2 z-50 opacity-75 ${showArrow ? "block" : "hidden"}`}
        size={30}
      />
      <UpperCopy />
      <MidCopy />
      <LowerCopy />
      <div ref={scrollHideRef}></div>
    </div>
  );
}
