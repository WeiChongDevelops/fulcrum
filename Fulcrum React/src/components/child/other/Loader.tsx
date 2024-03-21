import RotateLoader from "react-spinners/RotateLoader";
import {loaderCssOverride} from "../../../util.ts";

interface LoaderProps {
    isLoading: boolean;
    isDarkMode: boolean;
    flexPosition?: boolean
}

/**
 * A small animation that displays while the app is loading.
 */
export default function Loader({ isLoading, isDarkMode, flexPosition }: LoaderProps) {
    return (
        <div className={flexPosition ? "flex justify-center items-center mt-12" : "absolute top-[45vh] left-[50vw]"}>
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