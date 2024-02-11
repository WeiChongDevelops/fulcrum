import {profileIconArray} from "../../../util.ts";
import "../../../css/Tools.css"

export default function ProfileIconSelector() {
    return (
        <div id="icon-selector" className="my-2">
            {profileIconArray.map((profileIconName, key) => {
                return <button data-value={profileIconName} className={"profile-icon-selectable"} key={key}>
                    <img src={`/src/assets/profile-icons/${profileIconName}`} alt="Profile icon option"/>
                </button>
            })}
        </div>
    );
}
