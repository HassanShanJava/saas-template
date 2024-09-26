import DashboardLayout from "./components/ui/common/dashboardLayout";
import AuthenticationPage from "./components/app/login/login";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import SystemSettings from "./components/admin/system_settings";
import Leads from "./components/admin/leads";
import LeadForm from "./components/admin/leads/leadform/form";
import Facilities from "./components/admin/facilities";
import SaleTaxes from "./components/admin/sales_tax";
import Events from "./components/admin/events";
import ProtectedRoute from "./components/admin/protectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import IncomeCategory from "./components/admin/income_category";
import Memberships from "./components/admin/memberships";
import RolesAndAccess from "./components/admin/roles";
import Loader from "@/components/Loader";
import MemberPage from "./components/admin/members";
import Staff from "./components/admin/staff";
import Coach from "./components/admin/coach";
import Exercise from "./components/admin/exercise";
import MealPlans from "./components/admin/meal_plans";
import FoodsNutrition from "./components/admin/foods";
import WorkoutPlan from "./components/admin/workoutplan";
import IdleLogoutHandler from "./components/Idle-Timer";
import NotFoundPage from "./components/PageNotFound";
import ResetPassword from "./components/app/reset_password";
import WorkoutPlanForm from "./components/admin/workoutplan/workoutform/workout-form";
import WorkoutStep1 from "./components/admin/workoutplan/workoutform/workout-step-1";
import WorkoutStep2 from "./components/admin/workoutplan/workoutform/workout-step-2";
import ForgotPasword from "./components/app/login/forgot_password";


// pos
import Sell from "./components/admin/pos/sell";
import CounterManagement from "./components/admin/pos/counter_management";
import PaymentMethods from "./components/admin/pos/payment_methods";
import CashManagement from "./components/admin/pos/cash_management";
import Register from "./components/admin/pos/register";
import SaleHistory from "./components/admin/pos/sales_history";

function App() {
  const loading = useSelector((state: RootState) =>
    Object.values(state.api.queries).some(
      (query) => query && query.status === "pending"
    )
  );

  return (
    <>
      <IdleLogoutHandler />
      <Routes>
        <Route path="/reset_password/:token" element={<ResetPassword />} />
        <Route path="/forgot_password" element={<ForgotPasword />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" index element={<AuthenticationPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/members" element={<MemberPage />} />
            {/* <Route path="/admin/system_settings" element={<SystemSettings />} /> */}
            {/* <Route path="/admin/leads"  element={<Leads />} /> */}
            {/* <Route path="/admin/leads/addlead"  element={<LeadForm />} /> */}
            <Route path="/admin/facilities" element={<Facilities />} />
            <Route path="/admin/saleTaxes" element={<SaleTaxes />} />
            <Route path="/admin/incomeCategory" element={<IncomeCategory />} />
            <Route path="/admin/memberships" element={<Memberships />} />
            {/* <Route path="/admin/events" element={<Events />} /> */}
            <Route path="/admin/coach" element={<Coach />} />

            <Route path="/admin/roles" element={<RolesAndAccess />} />
            <Route path="/admin/staff" element={<Staff />} />
            <Route path="/admin/exercise" element={<Exercise />} />

            <Route path="/admin/mealplans" element={<MealPlans />} />
            <Route path="/admin/foods" element={<FoodsNutrition />} />
            <Route path="/admin/pos/sell" element={<Sell />} />
            <Route path="/admin/pos/salesHistory" element={<SaleHistory />} />
            <Route path="/admin/pos/register" element={<Register />} />
            <Route path="/admin/pos/cash" element={<CashManagement />} />
            <Route path="/admin/pos/paymentMethods" element={<PaymentMethods />} />
            <Route path="/admin/pos/counter" element={<CounterManagement />} />
            <Route path="/notfound" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/notfound" replace />} />
          </Route>
          <Route path="/notfound" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/notfound" replace />} />
        </Route>
      </Routes>
      <Loader open={loading} />
    </>
  );
}

export default App;
