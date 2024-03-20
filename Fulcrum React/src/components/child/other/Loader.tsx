import RotateLoader from "react-spinners/RotateLoader";
import {loaderCssOverride} from "../../../util.ts";

interface LoaderProps {
    isLoading: boolean;
    isDarkMode: boolean;
    independentPosition?: boolean
}

/**
 * A small animation that displays while the app is loading.
 */
export default function Loader({ isLoading, isDarkMode, independentPosition }: LoaderProps) {
    return (
        <div className={independentPosition ? "absolute top-[45vh] left-[50vw]" : "flex justify-center items-center mt-12"}>
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