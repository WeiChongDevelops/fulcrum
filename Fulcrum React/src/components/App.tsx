import '../css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./Auth/Register.tsx";
import Login from "./Auth/Login.tsx";
import Expenses from "./Expenses/Expenses.tsx";
import Budget from "./Budget/Budget.tsx";
import Navbar from "./Other/Navbar.tsx";

export default function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navbar/>} >
                    <Route path="login" element={<Login/>} />
                    <Route path="register" element={<Register/>} />
                    <Route path="expenses" element={<Expenses/>} />
                    <Route path="budget" element={<Budget/>} />
                </Route>
            </Routes>
        </Router>
    );
}
