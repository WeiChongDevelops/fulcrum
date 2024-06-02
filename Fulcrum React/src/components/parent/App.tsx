import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Register from "../child/auth/Register.tsx";
import Login from "../child/auth/Login.tsx";
import Budget from "../child/budget/Budget.tsx";
import Fulcrum from "./Fulcrum.tsx";
import Tools from "../child/tools/Tools.tsx";
import "../../css/App.css";
import About from "../child/home/subpages/about/About.tsx";
import Contact from "../child/home/subpages/Contact.tsx";
import Pricing from "../child/home/subpages/Pricing.tsx";
import Home from "../child/home/Home.tsx";
import { useGlobalAppData } from "@/hooks/queries/useGlobalAppData.ts";
import Loader from "../child/other/Loader.tsx";
import FulcrumErrorPage from "../child/other/FulcrumErrorPage.tsx";
import { EmailContext, LocationContext } from "@/utility/util.ts";
import { ErrorBoundary } from "../child/other/ErrorBoundary.tsx";
import { Toaster } from "sonner";
import OAuthRedirect from "../child/auth/OAuthRedirect.tsx";
import PrivacyPolicy from "../child/other/PrivacyPolicy.tsx";
import Expenses from "../child/expenses/Expenses.tsx";
import FAQs from "../child/home/subpages/FAQ/FAQs.tsx";
import ComeOnMark from "../child/other/ComeOnMark.tsx";
import Wall from "../temp/Wall.tsx";
import ExpensesV2 from "@/components-v2/pages/ExpensesV2.tsx";
import FulcrumV2 from "../../components-v2/root/FulcrumV2.tsx";
import { useEffect, useRef, useState } from "react";
import RecurringExpenses from "@/components/child/tools/recurring-expenses/RecurringExpenses.tsx";
import RecurringExpensesV2 from "@/components-v2/pages/RecurringExpensesV2.tsx";
import SettingsV2 from "@/components-v2/pages/SettingsV2.tsx";
import BudgetV2 from "@/components-v2/pages/BudgetV2.tsx";
import Playground from "@/components-v2/subcomponents/budget/Playground.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import Maintenance from "@/components-v2/pages/Maintenance.tsx";

/**
 * The main application component, handling shared data retrieval, routing and rendering.
 */
export default function App() {
  // window.console.log = () => {};

  const homePaths = ["/", "/home"];

  const {
    email,
    budgetArray,
    groupArray,
    expenseArray,
    recurringExpenseArray,
    blacklistedExpenseArray,
    userPreferences,
    profileImageURL,
    categoryToIconAndColourMap,
    perCategoryExpenseTotalThisMonth,
    setPerCategoryExpenseTotalThisMonth,
    isAnyLoading,
    isAnyError,
    isAllSuccess,
    errors,
  } = useGlobalAppData();

  const location = useLocation();

  if (isAnyError) {
    return <FulcrumErrorPage errors={errors} />;
  }

  if (isAnyLoading) {
    return <Loader isLoading={isAnyLoading} isDarkMode={false} />;
  }

  return (
    <ErrorBoundary>
      <EmailContext.Provider value={email!}>
        <LocationContext.Provider value={location}>
          <Toaster richColors />
          <Routes>
            {homePaths.map((path) => (
              <Route key={path} path={path} element={<Home />}>
                <Route index element={<Navigate replace to="about" />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="faq" element={<FAQs />} />
              </Route>
            ))}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oAuthSuccess" element={<OAuthRedirect />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/whatintheworldwereyouthinkingmark" element={<ComeOnMark />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/app/" element={<FulcrumV2 userPreferences={userPreferences} isAnyLoading={isAnyLoading} />}>
              {/*<Route path="/app/" element={<Fulcrum userPreferences={userPreferences} isAnyLoading={isAnyLoading} />}>*/}
              {/*  <Route index element={<Navigate replace to="budget" />} />*/}
              {/*<Route*/}
              {/*  path="expenses"*/}
              {/*  element={*/}
              {/*    <Expenses*/}
              {/*      userPreferences={userPreferences}*/}
              {/*      expenseArray={expenseArray}*/}
              {/*      budgetArray={budgetArray}*/}
              {/*      groupArray={groupArray}*/}
              {/*      categoryToIconAndColourMap={categoryToIconAndColourMap}*/}
              {/*      recurringExpenseArray={recurringExpenseArray}*/}
              {/*      blacklistedExpenseArray={blacklistedExpenseArray}*/}
              {/*    />*/}
              {/*  }*/}
              {/*/>*/}
              {/*<Route*/}
              {/*  path="budget"*/}
              {/*  element={*/}
              {/*    <Budget*/}
              {/*      userPreferences={userPreferences}*/}
              {/*      expenseArray={expenseArray}*/}
              {/*      budgetArray={budgetArray}*/}
              {/*      groupArray={groupArray}*/}
              {/*    />*/}
              {/*  }*/}
              {/*/>*/}
              {/*<Route*/}
              {/*  path="tools"*/}
              {/*  element={*/}
              {/*    <Tools*/}
              {/*      userPreferences={userPreferences}*/}
              {/*      expenseArray={expenseArray}*/}
              {/*      budgetArray={budgetArray}*/}
              {/*      groupArray={groupArray}*/}
              {/*      recurringExpenseArray={recurringExpenseArray}*/}
              {/*      categoryToIconAndColourMap={categoryToIconAndColourMap}*/}
              {/*    />*/}
              {/*  }*/}
              {/*/>*/}
              <Route
                path="expenses"
                element={<ExpensesV2 perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth} />}
              />
              <Route
                path="recurring"
                element={<RecurringExpensesV2 perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth} />}
              />
              <Route path="settings" element={<SettingsV2 />} />
              <Route
                path="budget"
                element={
                  <BudgetV2
                    perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
                    setPerCategoryExpenseTotalThisMonth={setPerCategoryExpenseTotalThisMonth}
                  />
                }
              />
              {/*<Route*/}
              {/*  path="tools"*/}
              {/*  element={*/}
              {/*    <ToolsV2*/}
              {/*      userPreferences={userPreferences}*/}
              {/*      expenseArray={expenseArray}*/}
              {/*      budgetArray={budgetArray}*/}
              {/*      groupArray={groupArray}*/}
              {/*      recurringExpenseArray={recurringExpenseArray}*/}
              {/*      categoryToIconAndColourMap={categoryToIconAndColourMap}*/}
              {/*    />*/}
              {/*  }*/}
              {/*/>*/}
            </Route>
            <Route path="/3753b177" element={<Wall user={"Louise"} />} />
            <Route path="/11e2e386" element={<Wall user={"Saaiq"} />} />
            <Route path="/86419f8c" element={<Wall user={"Colin"} />} />
            <Route path="/7763fcm3" element={<Wall user={"Matthew"} />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LocationContext.Provider>
      </EmailContext.Provider>
    </ErrorBoundary>
  );
}
