import '../css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./Auth/Register.tsx";
import Login from "./Auth/Login.tsx";
import Budget from "./Budget/Budget.tsx";
import Fulcrum from "./Other/Fulcrum.tsx";
import Expenses from "./Expenses/Expenses.tsx";
import Tools from "./Tools/Tools.tsx";
import {useEffect, useState} from "react";
import {checkForUser, getPublicUserData, PublicUserData} from "../util.ts";
import Home from "./Home/Home.tsx";
export default function App() {

    const sessionStoredProfileIcon = sessionStorage.getItem("profileIcon");
    const sessionStoredDarkMode = sessionStorage.getItem("darkMode");
    const sessionStoredAccessibilityMode = sessionStorage.getItem("accessibilityMode");
    const sessionStoredEmail = sessionStorage.getItem("email");

    const [publicUserData, setPublicUserData] = useState<PublicUserData>({
        createdAt: new Date(),
        currency: "AUD",
        darkModeEnabled: sessionStoredDarkMode ? sessionStoredDarkMode === "true" : false,
        accessibilityEnabled: sessionStoredAccessibilityMode ? sessionStoredAccessibilityMode === "true" : false,
        profileIconFileName: sessionStoredProfileIcon ? sessionStoredProfileIcon : "profile-icon-default.svg"
    })
    const [email, setEmail] = useState(sessionStoredEmail ? sessionStoredEmail : "");

    useEffect(() => {
        checkForUser()
            .then( () => {
                    !!email && getPublicUserData()
                        .then(results => setPublicUserData(results))
                        .then(() => console.log(email))
                }
            )
    }, []);

    useEffect(() => {
        publicUserData && sessionStorage.setItem("profileIcon", publicUserData.profileIconFileName)
    }, [publicUserData]);

    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/" element={<Fulcrum publicUserData={publicUserData} setPublicUserData={setPublicUserData} email={email} setEmail={setEmail}/>} >
                    <Route path="expenses" element={<Expenses publicUserData={publicUserData} setPublicUserData={setPublicUserData}/>} />
                    <Route path="budget" element={<Budget/>} />
                    <Route path="tools" element={<Tools publicUserData={publicUserData} setPublicUserData={setPublicUserData}/>} />
                </Route>
            </Routes>
        </Router>
    );
}