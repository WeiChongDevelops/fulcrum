import '../css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./Auth/Register.tsx";
import Login from "./Auth/Login.tsx";
import Budget from "./Budget/Budget.tsx";
import Fulcrum from "./Other/Fulcrum.tsx";
import Expenses from "./Expenses/Expenses.tsx";
import Tools from "./Tools/Tools.tsx";
import {useEffect, useLayoutEffect, useState} from "react";
import {
    BudgetItemEntity, CategoryToIconGroupAndColourMap,
    ExpenseItemEntity,
    getBudgetList,
    getExpenseList, getGroupAndColourMap,
    getGroupList,
    getPublicUserData, GroupItemEntity,
    PublicUserData
} from "../util.ts";
import Home from "./Home/Home.tsx";
export default function App() {

    const sessionStoredProfileIcon = sessionStorage.getItem("profileIcon");
    const sessionStoredDarkMode = sessionStorage.getItem("darkMode");
    const sessionStoredAccessibilityMode = sessionStorage.getItem("accessibilityMode");
    const sessionStoredEmail = sessionStorage.getItem("email");

    const [email, setEmail] = useState(sessionStoredEmail ? sessionStoredEmail : "");

    const [publicUserData, setPublicUserData] = useState<PublicUserData>({
        createdAt: new Date(),
        currency: "AUD",
        darkModeEnabled: sessionStoredDarkMode ? sessionStoredDarkMode === "true" : false,
        accessibilityEnabled: sessionStoredAccessibilityMode ? sessionStoredAccessibilityMode === "true" : false,
        profileIconFileName: sessionStoredProfileIcon ? sessionStoredProfileIcon : "profile-icon-default.svg"
    })
    const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);

    const [categoryDataMap, setCategoryDataMap] = useState<CategoryToIconGroupAndColourMap>(new Map());


    useLayoutEffect(() => {
        async function retrieveGlobalAppData() {
            if (!!email) {
                const [publicUserDataRetrieved, expenseDataRetrieved, budgetDataRetrieved, groupDataRetrieved] = await Promise.all([
                    getPublicUserData(),
                    getExpenseList(),
                    getBudgetList(),
                    getGroupList()
                ]);

                setPublicUserData(publicUserDataRetrieved);
                setExpenseArray(expenseDataRetrieved);
                setBudgetArray(budgetDataRetrieved);
                setGroupArray(groupDataRetrieved);

                setCategoryDataMap(await getGroupAndColourMap(budgetDataRetrieved, groupDataRetrieved));
            }
        }
        retrieveGlobalAppData()
            .then(() => console.log("Global app data retrieval successful."))
            .catch(() => console.error("Global app data retrieval failed."))
    },[]);

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
                    <Route path="expenses" element={<Expenses publicUserData={publicUserData}
                                                              expenseArray={expenseArray}
                                                              budgetArray={budgetArray}
                                                              groupArray={groupArray}
                                                              setExpenseArray={setExpenseArray}
                                                              setBudgetArray={setBudgetArray}
                                                              setGroupArray={setGroupArray}
                                                              categoryDataMap={categoryDataMap}/>} />
                    <Route path="budget" element={<Budget publicUserData={publicUserData}
                                                          expenseArray={expenseArray}
                                                          budgetArray={budgetArray}
                                                          groupArray={groupArray}
                                                          setBudgetArray={setBudgetArray}
                                                          setGroupArray={setGroupArray}/> }/>
                    <Route path="tools" element={<Tools publicUserData={publicUserData}
                                                        setPublicUserData={setPublicUserData}
                                                        budgetArray={budgetArray}
                                                        groupArray={groupArray}
                                                        setExpenseArray={setExpenseArray}
                                                        setBudgetArray={setBudgetArray}
                                                        categoryDataMap={categoryDataMap}/>} />
                </Route>
            </Routes>
        </Router>
    );
}