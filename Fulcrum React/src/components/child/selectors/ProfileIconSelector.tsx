import {profileIconArray} from "../../../util.ts";
import "../../../css/Tools.css"

/**
 * A visual selector for the user to choose a profile icon.
 */
export default function ProfileIconSelector() {
    return (
        <div id="icon-selector" className="my-2">
            {profileIconArray.map((profileIconName, key) => {
                return <button data-value={profileIconName} className={"profile-icon-selectable"} key={key}>
                    <img src={`/src/assets/profile-icons/${profileIconName.slice(0, -4)}-white.svg`} alt="Profile icon option"/>
                </button>
            })}
        </div>
    );
}
