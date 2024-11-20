import DashboardLayout from "./components/ui/common/dashboardLayout";
import AuthenticationPage from "./components/app/login/login";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import ProtectedRoute from "./components/admin/protectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import RolesAndAccess from "./components/admin/roles";
import Loader from "@/components/Loader";
import Staff from "./components/admin/staff";
import IdleLogoutHandler from "./components/Idle-Timer";
import NotFoundPage from "./components/PageNotFound";
import ResetPassword from "./components/app/reset_password";
import ForgotPasword from "./components/app/login/forgot_password";
import CreatePassword from "./components/app/reset_password/create-password";

import QRCodePage from "./components/app/qr_code_staff/qrcode-staff";
import PrivacyStatement from "./components/PrivacyStatement";
import TermsAndConditions from "./components/TermsAndConditions";

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
        <Route path="/create_password/:token" element={<CreatePassword />} />
        <Route path="/forgot_password" element={<ForgotPasword />} />
        <Route path="/qr-code" element={<QRCodePage />} />
        <Route path="/privacy-statement" element={<PrivacyStatement />} />
        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditions />}
        />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" index element={<AuthenticationPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />


            <Route path="/admin/roles" element={<RolesAndAccess />} />
            <Route path="/admin/staff" element={<Staff />} />

            <Route path="/notfound" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/notfound" replace />} />
          </Route>
        </Route>

      </Routes>
      <Loader open={loading} />
    </>
  );
}

export default App;
