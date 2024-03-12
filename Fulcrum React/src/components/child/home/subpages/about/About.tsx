import UpperCopy from "./UpperCopy.tsx";
import MidCopy from "./MidCopy.tsx";
import LowerCopy from "./LowerCopy.tsx";

/**
 * The Fulcrum homepage.
 */
export default function About() {
    return (
        <div className={"bg-[#e0eddf]"}>
            <UpperCopy/>
            <MidCopy/>
            <LowerCopy/>
        </div>
    );
}