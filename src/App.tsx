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
import EventForm from "./components/admin/events/eventForm";
import ProtectedRoute from "./components/admin/protectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import IncomeCategory from "./components/admin/income_category";
import Memberships from "./components/admin/memberships";
import RolesAndAccess from "./components/admin/roles";

import Loader from "@/components/Loader";
import MemberPage from "./components/admin/members";
import MemberForm from "./components/admin/members/memberForm/form";

function App() {
	const loading = useSelector((state: RootState) => 
	Object.values(state.api.queries).some(query => query && query.status === 'pending'))
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="/admin/dashboard" index element={<Dashboard />} />
            <Route path="/admin/members" index element={<MemberPage />} />
            <Route
              path="/admin/system_settings"
              index
              element={<SystemSettings />}
            />
            <Route
              path="/admin/members/addmember"
              index
              element={<MemberForm />}
            />
            <Route
              path="/admin/members/editmember/:id"
              index
              element={<MemberForm />}
            />
            <Route path="/admin/leads" index element={<Leads />} />
            <Route path="/admin/leads/addlead" index element={<LeadForm />} />
            <Route path="/admin/leads/editlead/:id" index element={<LeadForm />} />
            <Route path="/admin/credits" index element={<Credits />} />
            <Route path="/admin/saleTaxes" index element={<SaleTaxes />} />
            <Route path="/admin/incomeCategory" index element={<IncomeCategory />} />
            <Route path="/admin/memberships" index element={<Memberships />} />
            <Route path="/admin/events" index element={<Events />} />
            <Route path="/admin/roles" index element={<RolesAndAccess />} />
            <Route
              path="/admin/events/addevents"
              index
              element={<EventForm />}
            />
          </Route>
        </Route>
      </Routes>
      <Loader open={loading} />

      {/* </Routes> */}
    </>
  );
}

export default App;
