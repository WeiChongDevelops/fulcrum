
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "../child/auth/Register.tsx";
import Login from "../child/auth/Login.tsx";
import Budget from "../child/budget/Budget.tsx";
import Fulcrum from "./Fulcrum.tsx";
import Expenses from "../child/expenses/Expenses.tsx";
import Tools from "../child/tools/tools-home/Tools.tsx";
import {useEffect, useState} from "react";
import {
    BudgetItemEntity, CategoryToIconGroupAndColourMap,
    ExpenseItemEntity,
    getBudgetList,
    getExpenseList, getGroupAndColourMap,
    getGroupList,
    getPublicUserData, GroupItemEntity,
    PublicUserData
} from "../../util.ts";
import '../../css/App.css'
import About from "../child/home/about/About.tsx";
import Contact from "../child/home/subpages/Contact.tsx";
import Pricing from "../child/home/subpages/Pricing.tsx";

/**
 * The main application component, handling shared data retrieval, routing and rendering.
 */
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

    const [error, setError] = useState("");

    useEffect(() => {
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
            .catch(() => setError("We’re unable to load your data right now. Please try again later."))
    },[]);

    useEffect(() => {
        publicUserData && sessionStorage.setItem("profileIcon", publicUserData.profileIconFileName)
    }, [publicUserData]);

    return (
        <Router>
            <Routes>
                <Route path="/home" element={<About/>}>
                    <Route path="/about" element={<About/>} />
                    <Route path="/contact" element={<Contact/>} />
                    <Route path="/pricing" element={<Pricing/>} />
                </Route>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/" element={<Fulcrum publicUserData={publicUserData} setPublicUserData={setPublicUserData} email={email} setEmail={setEmail}/>} >
                    <Route path="expenses" element={<Expenses publicUserData={publicUserData}
                                                              expenseArray={expenseArray}
                                                              budgetArray={budgetArray}
                                                              groupArray={groupArray}
                                                              setExpenseArray={setExpenseArray}
                                                              setBudgetArray={setBudgetArray}
                                                              categoryDataMap={categoryDataMap}
                                                              error={error}
                                                              setError={setError}/>} />
                    <Route path="budget" element={<Budget publicUserData={publicUserData}
                                                          expenseArray={expenseArray}
                                                          budgetArray={budgetArray}
                                                          groupArray={groupArray}
                                                          setBudgetArray={setBudgetArray}
                                                          setGroupArray={setGroupArray}
                                                          error={error}
                                                          setError={setError}/> }/>
                    <Route path="tools" element={<Tools publicUserData={publicUserData}
                                                        setPublicUserData={setPublicUserData}
                                                        budgetArray={budgetArray}
                                                        groupArray={groupArray}
                                                        setExpenseArray={setExpenseArray}
                                                        setBudgetArray={setBudgetArray}
                                                        categoryDataMap={categoryDataMap}
                                                        error={error}
                                                        setError={setError}/>} />
                </Route>
            </Routes>
        </Router>
    );
}