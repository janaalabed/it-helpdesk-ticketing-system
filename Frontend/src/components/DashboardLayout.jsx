import { Outlet } from "react-router-dom";
import { SideBar } from "./SideBar";

export function DashboardLayout() {
  const role = localStorage.getItem("role");

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      {/* Sidebar — fixed, never re-mounts */}
      <SideBar role={role} />

      {/* Content area  */}
      <main className="ml-[210px] flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* active link's page renders here */}
      </main>
    </div>
  );
}
