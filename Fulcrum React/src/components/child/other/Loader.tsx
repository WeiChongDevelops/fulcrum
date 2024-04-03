import RotateLoader from "react-spinners/RotateLoader";
import { loaderCssOverride } from "../../../util.ts";

interface LoaderProps {
  isLoading: boolean;
  isDarkMode: boolean;
  positioning?: string;
  size?: number;
}

/**
 * A small animation that displays while the app is loading.
 */
export default function Loader({ isLoading, isDarkMode, positioning, size }: LoaderProps) {
  return (
    <div className={positioning ? positioning : "absolute top-[45vh] left-[50vw]"}>
      <RotateLoader
        color={isDarkMode ? "#F1F5F9" : "black"}
        loading={isLoading}
        cssOverride={loaderCssOverride}
        size={size ? size : 12}
        speedMultiplier={1}
      />
    </div>
  );
}
