import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Register from "../child/auth/Register.tsx";
import Login from "../child/auth/Login.tsx";
import Budget from "../child/budget/Budget.tsx";
import Fulcrum from "./Fulcrum.tsx";
import Expenses from "../child/expenses/Expenses.tsx";
import Tools from "../child/tools/Tools.tsx";
import "../../css/App.css";
import About from "../child/home/subpages/about/About.tsx";
import Contact from "../child/home/subpages/Contact.tsx";
import Pricing from "../child/home/subpages/Pricing.tsx";
import Home from "../child/home/Home.tsx";
import { useGlobalAppData } from "../../hooks/useGlobalAppData.ts";
import Loader from "../child/other/Loader.tsx";

/**
 * The main application component, handling shared data retrieval, routing and rendering.
 */
export default function App() {
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
    email,
    setEmail,
    categoryDataMap,
    isLoading,
    isError,
    error,
  } = useGlobalAppData();

  if (isLoading) {
    return <Loader isLoading={isLoading} isDarkMode={false} />;
  }

  if (isError) {
    return (
      <div className={"flex flex-col justify-center items-center h-screen gap-14 text-black font-bold"}>
        <p>There's been an error. Please try again later or reach through the contact form.</p>
        {error && <p>{error.toString()}</p>}
        <img src="/src/assets/fulcrum-logos/fulcrum-icon.png" className={"w-10 h-10"} alt="Fulcrum icon" />
      </div>
    );
  }

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
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
