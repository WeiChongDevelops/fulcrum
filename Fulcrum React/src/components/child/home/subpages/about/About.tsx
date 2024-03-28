import UpperCopy from "./UpperCopy.tsx";
import MidCopy from "./MidCopy.tsx";
import LowerCopy from "./LowerCopy.tsx";

/**
 * The About section of the Fulcrum homepage.
 */
export default function About() {
  return (
    <div className={"bg-[#e0eddf] relative"}>
      <UpperCopy />
      <MidCopy />
      <LowerCopy />
    </div>
  );
}
