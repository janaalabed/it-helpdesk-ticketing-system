import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import { Profile } from "./pages/Profile";
import { NewTicket } from "./pages/NewTicket";
import { Tickets } from "./pages/Tickets";
import { Users } from "./pages/Users";
import { MyTickets } from "./pages/MyTickets";
import { Reports } from "./pages/Reports";
import { Notifications } from "./pages/Notifications";
import { Settings } from "./pages/Settings";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { DashboardPage } from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* DashboardLayout wraps all dashboard pages */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} /> {/* ← no path here */}
        <Route path="NewTicket" element={<NewTicket />} />
        <Route path="Tickets" element={<Tickets />} />
        <Route path="MyTickets" element={<MyTickets />} />
        <Route path="Notifications" element={<Notifications />} />
        <Route path="Users" element={<Users />} />
        <Route path="Reports" element={<Reports />} />
        <Route path="KnowledgeBase" element={<KnowledgeBase />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
