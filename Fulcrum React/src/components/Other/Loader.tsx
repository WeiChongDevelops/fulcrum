import RotateLoader from "react-spinners/RotateLoader";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

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
                cssOverride={override}
                size={15}
                speedMultiplier={1}
            />
        </div>
    );
}