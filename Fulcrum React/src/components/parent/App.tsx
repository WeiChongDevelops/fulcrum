import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Register from "../child/auth/Register.tsx";
import Login from "../child/auth/Login.tsx";
import Budget from "../child/budget/Budget.tsx";
import Fulcrum from "./Fulcrum.tsx";
import Expenses from "../child/expenses/Expenses.tsx";
import Tools from "../child/tools/Tools.tsx";
import { useEffect, useMemo, useState } from "react";
import { CategoryToIconGroupAndColourMap, getGroupAndColourMap } from "../../util.ts";
import "../../css/App.css";
import About from "../child/home/subpages/about/About.tsx";
import Contact from "../child/home/subpages/Contact.tsx";
import Pricing from "../child/home/subpages/Pricing.tsx";
import Home from "../child/home/Home.tsx";
import { useGlobalAppData } from "../../hooks/useGlobalAppData.ts";

/**
 * The main application component, handling shared data retrieval, routing and rendering.
 */
export default function App() {
  const sessionStoredEmail = sessionStorage.getItem("email");
  const [email, setEmail] = useState(sessionStoredEmail ? sessionStoredEmail : "");
  const [categoryDataMap, setCategoryDataMap] = useState<CategoryToIconGroupAndColourMap>(new Map());
  const [error, setError] = useState("");

  const {
    publicUserData,
    setPublicUserData,
    expenseArray,
    setExpenseArray,
    budgetArray,
    setBudgetArray,
    groupArray,
    setGroupArray,
    recurringExpenseArray,
    setRecurringExpenseArray,
    blacklistedExpenseArray,
    setBlacklistedExpenseArray,
  } = useGlobalAppData({ email, setCategoryDataMap, setError });

  useEffect(() => {
    if (publicUserData) {
      sessionStorage.setItem("profileIconFileName", publicUserData.profileIconFileName);
      sessionStorage.setItem("darkModeEnabled", publicUserData.darkModeEnabled.toString());
      sessionStorage.setItem("accessibilityEnabled", publicUserData.accessibilityEnabled.toString());
    }
  }, [publicUserData]);

  useMemo(() => {
    const updateCategoryDataMap = async () => {
      groupArray.length !== 0 &&
        budgetArray.length !== 0 &&
        setCategoryDataMap(await getGroupAndColourMap(budgetArray, groupArray));
    };
    updateCategoryDataMap();
  }, [budgetArray, groupArray]);

  return (
    <Router>
      <Routes>
        <Route path="/home/" element={<Home />}>
          <Route index element={<Navigate replace to="about" />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>
        <Route path="/login" element={<Login setEmail={setEmail} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Fulcrum
              publicUserData={publicUserData}
              setPublicUserData={setPublicUserData}
              email={email}
              setEmail={setEmail}
            />
          }
        >
          <Route index element={<Navigate replace to="budget" />} />
          <Route
            path="expenses"
            element={
              <Expenses
                publicUserData={publicUserData}
                expenseArray={expenseArray}
                budgetArray={budgetArray}
                groupArray={groupArray}
                setExpenseArray={setExpenseArray}
                setBudgetArray={setBudgetArray}
                categoryDataMap={categoryDataMap}
                recurringExpenseArray={recurringExpenseArray}
                setRecurringExpenseArray={setRecurringExpenseArray}
                blacklistedExpenseArray={blacklistedExpenseArray}
                setBlacklistedExpenseArray={setBlacklistedExpenseArray}
                error={error}
                setError={setError}
              />
            }
          />
          <Route
            path="budget"
            element={
              <Budget
                publicUserData={publicUserData}
                expenseArray={expenseArray}
                budgetArray={budgetArray}
                groupArray={groupArray}
                setBudgetArray={setBudgetArray}
                setGroupArray={setGroupArray}
                error={error}
                setError={setError}
              />
            }
          />
          <Route
            path="tools"
            element={
              <Tools
                publicUserData={publicUserData}
                setPublicUserData={setPublicUserData}
                expenseArray={expenseArray}
                budgetArray={budgetArray}
                groupArray={groupArray}
                setExpenseArray={setExpenseArray}
                setBudgetArray={setBudgetArray}
                recurringExpenseArray={recurringExpenseArray}
                setRecurringExpenseArray={setRecurringExpenseArray}
                setBlacklistedExpenseArray={setBlacklistedExpenseArray}
                categoryDataMap={categoryDataMap}
                error={error}
                setError={setError}
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
