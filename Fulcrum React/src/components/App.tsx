import '../css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./Auth/Register.tsx";
import Login from "./Auth/Login.tsx";
import Budget from "./Budget/Budget.tsx";
import Navbar from "./Other/Navbar.tsx";
import Expense from "./Expenses/Expense.tsx";

export default function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navbar/>} >
                    <Route path="login" element={<Login/>} />
                    <Route path="register" element={<Register/>} />
                    <Route path="expenses" element={<Expense/>} />
                    <Route path="budget" element={<Budget/>} />
                </Route>
            </Routes>
        </Router>
    );
}