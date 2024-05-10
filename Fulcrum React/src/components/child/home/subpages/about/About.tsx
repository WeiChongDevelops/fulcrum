import UpperCopy from "./UpperCopy.tsx";
import MidCopy from "./MidCopy.tsx";
import LowerCopy from "./LowerCopy.tsx";
import { useContext, useEffect, useRef, useState } from "react";
import { LocationContext } from "../../../../../utility/util.ts";

/**
 * The About section of the Fulcrum homepage.
 */
export default function About() {
  const [showArrow, setShowArrow] = useState(true);
  const scrollHideRef = useRef<HTMLDivElement>(null);
  const routerLocation = useContext(LocationContext);

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
      <img
        src="/static/assets/homepage-assets/scroll-arrow.svg"
        className={`fixed top-[95vh] bouncy-arrow left-[50vw] w-[2vw] h-[2vw] z-50 opacity-75 ${showArrow ? "block" : "hidden"}`}
        alt={"scroll indicator"}
      ></img>
      <UpperCopy />
      <MidCopy />
      <LowerCopy />
      <div ref={scrollHideRef}></div>
    </div>
  );
}
