import '../css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./Auth/Register.tsx";
import Login from "./Auth/Login.tsx";
import Budget from "./Budget/Budget.tsx";
import Navbar from "./Other/Navbar.tsx";
import Expense from "./Expenses/Expense.tsx";
import Tools from "./Tools/Tools.tsx";
import {useEffect, useState} from "react";
import {getPublicUserData, PublicUserData} from "../util.ts";

export default function App() {

    const sessionStoredProfileIcon = sessionStorage.getItem("profileIcon");
    const [publicUserData, setPublicUserData] = useState<PublicUserData>({
        createdAt: new Date(),
        currency: "",
        darkModeEnabled: false,
        accessibilityEnabled: false,
        profileIconFileName: sessionStoredProfileIcon ? sessionStoredProfileIcon : "profile-icon-default.svg"
    })
    useEffect(() => {

        getPublicUserData()
            .then(results => setPublicUserData(results));
    }, []);
    useEffect(() => {
        sessionStorage.setItem("profileIcon", publicUserData.profileIconFileName)
    }, [publicUserData]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navbar publicUserData={publicUserData}/>} >
                    <Route path="login" element={<Login/>} />
                    <Route path="register" element={<Register/>} />
                    <Route path="expenses" element={<Expense/>} />
                    <Route path="budget" element={<Budget/>} />
                    <Route path="tools" element={<Tools publicUserData={publicUserData} setPublicUserData={setPublicUserData}/>} />
                </Route>
            </Routes>
        </Router>
    );
}