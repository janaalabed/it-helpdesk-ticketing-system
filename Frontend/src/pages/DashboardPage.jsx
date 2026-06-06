import { useNavigate } from "react-router-dom";
import { AdminDashboard } from "../components/AdminDash";
import { EmployeeDashboard } from "../components/EmployeeDash";
import { ManagerDashboard } from "../components/ManagerDash";
import { ItSupportDashboard } from "../components/ItSupportDash";

export function DashboardPage() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");

    }
    const role = localStorage.getItem("role");
    return (
  <div>

      {role === 'Admin' && (
        <>
         <AdminDashboard/>
        </>
      )}

      {role === 'Employee' && (
        <EmployeeDashboard/>

            )}
     {role === 'Manager' && (
        <ManagerDashboard/>

            )}
     {role === 'IT Support Agent' && (
               <ItSupportDashboard/>

      )}

      {/* shared by both */}
      <button border="1" onClick={handleLogout}>Logout</button> 
    </div>
    );
}