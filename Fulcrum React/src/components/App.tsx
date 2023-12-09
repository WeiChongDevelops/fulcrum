import '../css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./Auth/Register.tsx";
import Login from "./Auth/Login.tsx";
import Expenses from "./Expenses/Expenses.tsx";
import Budget from "./Budget/Budget.tsx";

export default function App() {

    return (
        <Router>
            <Routes>
                <Route path="/login" Component={Login} />
                <Route path="/register" Component={Register} />
                <Route path="/app/expenses" Component={Expenses} />
                <Route path="/app/budget" Component={Budget} />
            </Routes>
        </Router>
    )
}
