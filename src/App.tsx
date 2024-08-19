import DashboardLayout from "./components/ui/common/dashboardLayout";
import AuthenticationPage from "./components/app/login/login";
import { Route, Routes } from "react-router-dom";
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
import MemberForm from "./components/admin/members/memberForm/form";
import Staff from "./components/admin/staff";
import StaffForm from "./components/admin/staff/staffForm/form";
import Coach from "./components/admin/coach";
import CoachForm from "./components/admin/coach/coachForm/Form";
import ExerciseForm from "./components/admin/exercise/exerciseform/form";
import Exercise from "./components/admin/exercise";
import MealPlans from "./components/admin/meal_plans";
import FoodsNutrition from "./components/admin/foods";
import WorkoutPlan from "./components/admin/workoutplan";
import withAuth from "./components/WithAuth";
import ResetPassword from "./components/app/reset_password";


function App() {
  const loading = useSelector((state: RootState) =>
    Object.values(state.api.queries).some(
      (query) => query && query.status === "pending"
    )
  );

  return (
    <>
      <Routes>
        <Route
          path="/"
          index
          element={withAuth(AuthenticationPage)({} as any)}
        />
        {/* <Route path="/reset_pasword/:token" element={<ResetPassword />}/> */}

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            {" "}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/members" element={<MemberPage />} />
            <Route path="/admin/system_settings" element={<SystemSettings />} />
            {/* <Route path="/admin/leads"  element={<Leads />} /> */}
            {/* <Route path="/admin/leads/addlead"  element={<LeadForm />} /> */}
            {/* <Route
              path="/admin/leads/editlead/:id"
              
              element={<LeadForm />}
            /> */}
            <Route path="/admin/facilities" element={<Facilities />} />
            <Route path="/admin/saleTaxes" element={<SaleTaxes />} />
            <Route path="/admin/incomeCategory" element={<IncomeCategory />} />
            <Route path="/admin/memberships" element={<Memberships />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/coach" element={<Coach />} />
            {/*<Route path="/admin/coach/addcoach"  element={<CoachForm />} />*/}
            {/*<Route
              path="/admin/coach/editcoach/:id"
              
              element={<CoachForm />}
            />*/}
            {/* <Route path="/admin/roles"  element={<RolesAndAccess />} /> */}
            <Route path="/admin/staff" element={<Staff />} />
            {/*<Route path="/admin/staff/addStaff"  element={<StaffForm />} />*/}
            {/*<Route
              path="/admin/staff/editstaff/:id"
              
              element={<StaffForm />}
            />*/}
            {/* <Route path="/admin/exercise" element={<Exercise />} /> */}
            {/* <Route
              path="/admin/exercise/addexercise"
              
              element={<ExerciseForm />}
            />
            <Route
              path="/admin/exercise/editexercise/:id"
              
              element={<ExerciseForm />}
            /> */}
            {/* <Route path="/admin/mealplans" element={<MealPlans />} />
            <Route path="/admin/foods" element={<FoodsNutrition />} /> */}
            {/* <Route path="/admin/workoutplans"  element={<WorkoutPlan />} /> */}
          </Route>
        </Route>
      </Routes>
      <Loader open={loading} />

      {/* </Routes> */}
    </>
  );
}

export default App;
