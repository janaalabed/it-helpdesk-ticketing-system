import { AdminDashboard } from "../components/AdminDash/AdminDash";
import { EmployeeDashboard } from "../components/EmployeeDash/EmployeeDash";
import { ManagerDashboard } from "../components/ManagerDash/ManagerDash";
import { ItSupportDashboard } from "../components/ItSupportDash/ItSupportDash";

export function DashboardPage() {
  const role = localStorage.getItem("role");
  return (
    <>
      <div>
        {role === "Admin" && <AdminDashboard role={role} />}
        {role === "Employee" && <EmployeeDashboard role={role} />}
        {role === "Manager" && <ManagerDashboard role={role} />}
        {role === "IT Support Agent" && <ItSupportDashboard role={role} />}
      </div>
    </>
  );
}
