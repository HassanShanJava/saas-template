
import DashboardLayout from "./components/ui/common/dashboardLayout";
import AuthenticationPage from "./components/app/login/login";
import {Route,Routes} from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import Client from "./components/admin/clients";
import SystemSettings from "./components/admin/system_settings";
import Component from "./components/pagework/drawer";
import AddClientForm from "./components/admin/clients/clientForm/form";
import Leads from "./components/admin/leads";
import LeadForm from "./components/admin/leads/leadform/form";
import Events from "./components/admin/events";
import EventForm from "./components/admin/events/eventForm";

// import DrawerFunction from "./components/pagework/drawer";
// import DrawerExample from './components/pagework/index';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="/admin/dashboard" index element={<Dashboard />} />
          <Route path="/admin/client" index element={<Client />} />
          <Route
            path="/admin/system_settings"
            index
            element={<SystemSettings />}
          />
          <Route
            path="/admin/client/addclient"
            index
            element={<AddClientForm />}
          />
          <Route path="/admin/leads" index element={<Leads />} />
          <Route path="/admin/leads/addlead" index element={<LeadForm />} />
          <Route path="/admin/events" index element={<Events />} />
          <Route path="/admin/events/addevents" index element={<EventForm />} />
        </Route>

        <Route path="/sidebar" element={<Component />}></Route>
      </Routes>
    </>
  );
}

export default App;
