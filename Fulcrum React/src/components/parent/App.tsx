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
import FulcrumErrorPage from "../child/other/FulcrumErrorPage.tsx";
import { EmailContext } from "../../util.ts";

/**
 * The main application component, handling shared data retrieval, routing and rendering.
 */
export default function App() {
  const {
    email,
    budgetArray,
    groupArray,
    expenseArray,
    recurringExpenseArray,
    blacklistedExpenseArray,
    publicUserData,
    categoryDataMap,
    isAnyLoading,
    isAnyError,
    errors,
  } = useGlobalAppData();

  if (isAnyError) {
    return <FulcrumErrorPage errors={errors} />;
  }

  if (isAnyLoading) {
    return <Loader isLoading={isAnyLoading} isDarkMode={false} />;
  }

  return (
    <EmailContext.Provider value={email}>
      <Router>
        <Routes>
          <Route path="/home/" element={<Home />}>
            <Route index element={<Navigate replace to="about" />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="pricing" element={<Pricing />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app/" element={<Fulcrum publicUserData={publicUserData} />}>
            <Route index element={<Navigate replace to="budget" />} />
            <Route
              path="expenses"
              element={
                <Expenses
                  publicUserData={publicUserData}
                  expenseArray={expenseArray}
                  budgetArray={budgetArray}
                  groupArray={groupArray}
                  categoryDataMap={categoryDataMap}
                  recurringExpenseArray={recurringExpenseArray}
                  blacklistedExpenseArray={blacklistedExpenseArray}
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
                />
              }
            />
            <Route
              path="tools"
              element={
                <Tools
                  publicUserData={publicUserData}
                  expenseArray={expenseArray}
                  budgetArray={budgetArray}
                  groupArray={groupArray}
                  recurringExpenseArray={recurringExpenseArray}
                  categoryDataMap={categoryDataMap}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </EmailContext.Provider>
  );
}
