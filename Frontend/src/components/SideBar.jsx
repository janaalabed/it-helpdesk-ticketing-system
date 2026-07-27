import { Links } from "../config/navConfig";
import { useNavigate, useLocation } from "react-router-dom";

export function SideBar({ role }) {
  const navigate = useNavigate();
  const location = useLocation(); // tracks current URL

  const filteredLinks = Links.filter((link) =>
    link.allowedRoles.includes(role),
  );

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[210px] bg-[#1E2A38] flex flex-col justify-between font-sans border-r border-[#475569]">
      <div className="px-4 py-[14px] border-b border-[#2D3E52]">
        <h1 className="text-[20px] font-medium text-[#22D3EE] m-0">
          IT Help Desk
        </h1>
      </div>

      <nav className="flex-1 pt-[14px] flex flex-col gap-1">
        {filteredLinks.map((link) => {
          const isActive = location.pathname === link.path; // derived from URL
          return (
            <div key={link.path} className="w-full">
              <button
                onClick={() => navigate(link.path)}
                className={`w-full px-4 py-3 text-[13px] font-normal text-left border-y-0 border-r-0 cursor-pointer transition-all duration-200 outline-none
                  ${
                    isActive
                      ? "text-[#06B6D4] border-l-3 border-[#06B6D4] bg-[rgba(6,182,212,0.05)]"
                      : "text-[#94A3B8] border-l-3 border-transparent bg-transparent"
                  }`}
              >
                {link.label}
              </button>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2D3E52] bg-black/10 flex flex-col gap-3">
        <span className="text-[11px] font-normal text-[#94A3B8]">
          Logged in as:{" "}
          <span className="capitalize text-white font-medium">{role}</span>
        </span>
        <button
          onClick={handleLogout}
          className="w-full py-2 text-[12px] font-normal text-center text-[#94A3B8] hover:text-white bg-transparent hover:bg-white/5 border border-[#475569] rounded-[6px] cursor-pointer transition-all duration-200 outline-none"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
