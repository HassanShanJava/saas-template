import DashboardLayout from "./components/ui/common/dashboardLayout";
import AuthenticationPage from "./components/app/login/login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import SystemSettings from "./components/admin/system_settings";
import Leads from "./components/admin/leads";
import LeadForm from "./components/admin/leads/leadform/form";
import Credits from "./components/admin/credits";
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
import FileUploadComponent from "./components/admin/test/FileUploadComponent";
import DynamicForm from "./components/admin/test/DynamicForm";
import MealPlans from "./components/admin/meal_plans";
import FoodsNutrition from "./components/admin/foods";
import TimeInputsForm from "./components/admin/test/Timebox";
import FileUpload from "./components/admin/test/ImageUpload";
import WorkoutPlan from "./components/admin/workoutplan";
import UseForm from "./components/admin/test/imageUploadcomponent";
function App() {
  const loading = useSelector((state: RootState) =>
    Object.values(state.api.queries).some(
      (query) => query && query.status === "pending"
    )
  );
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/test" element={<UseForm />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="/admin/dashboard" index element={<Dashboard />} />
            <Route path="/admin/members" index element={<MemberPage />} />
            <Route
              path="/admin/system_settings"
              index
              element={<SystemSettings />}
            />
            {/* <Route path="/admin/leads" index element={<Leads />} />
            <Route path="/admin/leads/addlead" index element={<LeadForm />} /> */}
            {/* <Route
              path="/admin/leads/editlead/:id"
              index
              element={<LeadForm />}
            /> */}
            <Route path="/admin/credits" index element={<Credits />} />
            <Route path="/admin/saleTaxes" index element={<SaleTaxes />} />
            <Route
              path="/admin/incomeCategory"
              index
              element={<IncomeCategory />}
            />
            <Route path="/admin/memberships" index element={<Memberships />} />
            <Route path="/admin/events" index element={<Events />} />
            <Route path="/admin/coach" index element={<Coach />} />
            <Route path="/admin/coach/addcoach" index element={<CoachForm />} />
            <Route
              path="/admin/coach/editcoach/:id"
              index
              element={<CoachForm />}
            />
            <Route path="/admin/roles" index element={<RolesAndAccess />} />
            <Route path="/admin/staff" index element={<Staff />} />
            <Route path="/admin/staff/addStaff" index element={<StaffForm />} />
            <Route
              path="/admin/staff/editstaff/:id"
              index
              element={<StaffForm />}
            />
            {/* <Route path="/admin/exercise" index element={<Exercise />} />
            <Route
              path="/admin/exercise/addexercise"
              index
              element={<ExerciseForm />}
            />
            <Route
              path="/admin/exercise/editexercise/:id"
              index
              element={<ExerciseForm />}
            /> */}
            {/* <Route path="/admin/mealplans" index element={<MealPlans />} />
            <Route path="/admin/foods" index element={<FoodsNutrition />} />
            <Route path="/admin/workoutplans" index element={<WorkoutPlan />} /> */}
          </Route>
        </Route>
      </Routes>
      <Loader open={loading} />

      {/* </Routes> */}
    </>
  );
}

export default App;
