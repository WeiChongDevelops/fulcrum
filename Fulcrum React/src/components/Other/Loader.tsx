import RotateLoader from "react-spinners/RotateLoader";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

interface LoaderProps {
    isLoading: boolean;
}

export default function Loader({ isLoading }: LoaderProps) {

    return (
        <div className="absolute top-1/2 left-1/2">
            <RotateLoader
                color={"black"}
                loading={isLoading}
                cssOverride={override}
                size={15}
                speedMultiplier={1}
            />
        </div>
    );
}