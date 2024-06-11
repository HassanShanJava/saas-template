
import DashboardLayout from "./components/ui/common/dashboardLayout";
import AuthenticationPage from "./components/app/login/login";
import {Route,Routes} from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import Client from "./components/admin/clients";
import SystemSettings from "./components/admin/system_settings";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="/admin/dashboard" index element={<Dashboard />} />
          <Route path="/admin/client" index element={<Client />} />
          <Route path="/admin/system_settings" index element={<SystemSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
