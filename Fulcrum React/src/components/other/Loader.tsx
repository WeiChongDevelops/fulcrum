import RotateLoader from "react-spinners/RotateLoader";
import {loaderCssOverride} from "../../util.ts";

interface LoaderProps {
    isLoading: boolean;
    isDarkMode: boolean;
}

export default function Loader({ isLoading, isDarkMode }: LoaderProps) {
    return (
        <div className="absolute top-[50vh] left-[50vw]">
            <RotateLoader
                color={isDarkMode ? "#F1F5F9" : "black"}
                loading={isLoading}
                cssOverride={loaderCssOverride}
                size={15}
                speedMultiplier={1}
            />
        </div>
    );
}