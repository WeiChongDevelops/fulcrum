import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Register from "@/components-v2/subcomponents/auth/Register.tsx";
import Login from "@/components-v2/subcomponents/auth/Login.tsx";
import "../../css/App.css";
import About from "@/components-v2/subcomponents/home/subpages/about/About.tsx";
import Contact from "@/components-v2/subcomponents/home/subpages/Contact.tsx";
import Pricing from "@/components-v2/subcomponents/home/subpages/Pricing.tsx";
import Home from "@/components-v2/pages/Home.tsx";
import { useGlobalAppData } from "@/hooks/queries/useGlobalAppData.ts";
import Loader from "../subcomponents/other/Loader.tsx";
import FulcrumErrorPage from "../subcomponents/other/FulcrumErrorPage.tsx";
import { EmailContext, LocationContext } from "@/utility/util.ts";
import { ErrorBoundary } from "../subcomponents/other/ErrorBoundary.tsx";
import { Toaster } from "sonner";
import OAuthRedirect from "@/components-v2/subcomponents/auth/OAuthRedirect.tsx";
import PrivacyPolicy from "../subcomponents/other/PrivacyPolicy.tsx";
import FAQs from "@/components-v2/subcomponents/home/subpages/FAQ/FAQs.tsx";
import ComeOnMark from "../subcomponents/other/ComeOnMark.tsx";
import Wall from "@/components-v2/temp/Wall.tsx";
import ExpensesV2 from "@/components-v2/pages/ExpensesV2.tsx";
import FulcrumV2 from "./FulcrumV2.tsx";
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

  if (isAnyLoading) {
    return <Loader isLoading={isAnyLoading} isDarkMode={false} />;
  }

  if (isAnyError) {
    return <FulcrumErrorPage errors={errors} />;
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
