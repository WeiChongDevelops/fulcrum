import '../css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./Auth/Register.tsx";
import Login from "./Auth/Login.tsx";
import Expenses from "./Expenses/Expenses.tsx";
import Budget from "./Budget/Budget.tsx";
import Navbar from "./Other/Navbar.tsx";
import {useState} from "react";

export default function App() {



    const [email, setEmail] = useState<string>("");

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navbar email={email} setEmail={setEmail}/>} >
                    <Route path="login" element={<Login/>} />
                    <Route path="register" element={<Register/>} />
                    <Route path="expenses" element={<Expenses/>} />
                    <Route path="budget" element={<Budget/>} />
                </Route>
            </Routes>
        </Router>
    );
}
