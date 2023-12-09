import '../css/App.css'
import Expenses from "./Expenses/Expenses.tsx";
import Budget from "./Budget/Budget.tsx";

export default function FulcrumApp() {

    return (
        <div className="flex flex-row justify-between align-middle">
            <Expenses/>
            <Budget/>
        </div>
    )
}
