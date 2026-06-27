import { useState, useEffect } from "react";

const token = localStorage.getItem("token");

// const formatDate = (dateStr) => {
//   if (!dateStr) return "—";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "numeric", month: "short", year: "numeric",
//   });
// };

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "bg-[#ECFEFF] text-[#06B6D4]";
    case "in progress":
      return "bg-[#FEF3C7] text-[#D97706]";
    case "pending":
      return "bg-[#F3E8FF] text-[#7C3AED]";
    case "resolved":
      return "bg-[#DCFCE7] text-[#16A34A]";
    case "closed":
      return "bg-[#FEE2E2] text-[#DC2626]";
    default:
      return "bg-[#F1F5F9] text-[#475569]";
  }
};

const getPriorityStyles = (priority) => {
  switch (priority?.toLowerCase()) {
    case "low":
      return "bg-[#F1F5F9] text-[#475569]";
    case "medium":
    case "normal":
      return "bg-[#FEF3C7] text-[#D97706]";
    case "high":
    case "urgent":
    case "critical":
      return "bg-[#FEE2E2] text-[#DC2626] font-semibold";
    default:
      return "bg-[#F1F5F9] text-[#2D3E52]";
  }
};

export function EmployeeDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats();
  }, []);

  async function getStats() {
    try {
      const response = await fetch(
        "https://localhost:7010/api/employeedashboard",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Network or parse error:", error);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`https://localhost:7010/api/ticket/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh stats to reflect the deletion
        await getStats();
      } else {
        console.error("Failed to delete ticket:", response.status);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  if (!stats)
    return <p className="text-[13px] text-[#94A3B8] p-[16px]">Loading...</p>;

  return (
    <div className="space-y-[24px]">
      {/* Page Heading */}
      <h1 className="text-[20px] font-medium text-[#1E2A38]">My Dashboard</h1>

      {/* Stat Cards */}
      <section>
        <h2 className="text-[14px] font-medium text-[#2D3E52] mb-[12px]">
          My Tickets
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
          {[
            {
              label: "Total",
              value: stats.totalTickets,
              color: "text-[#2D3E52]",
            },
            {
              label: "Open",
              value: stats.openTickets,
              color: "text-[#06B6D4]",
            },
            {
              label: "In Progress",
              value: stats.inProgressTickets,
              color: "text-[#D97706]",
            },
            {
              label: "Resolved",
              value: stats.resolvedTickets,
              color: "text-[#16A34A]",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-[8px] border border-[#E2E8F0] px-[16px] py-[14px]"
            >
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-[6px]">
                {label}
              </p>
              <p className={`text-[24px] font-medium ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Submit Hint — always visible */}
      <div className="flex items-center justify-between bg-[#ECFEFF] border border-[#06B6D4]/20 rounded-[8px] px-[16px] py-[14px]">
        <p className="text-[13px] text-[#06B6D4] font-medium">
          Need help with something? Submit a new ticket and the IT team will get
          back to you.
        </p>

        <a
          href="/dashboard/NewTicket"
          className="flex-shrink-0 ml-[16px] h-[32px] px-[14px] bg-[#06B6D4] hover:bg-[#22D3EE] text-white text-[12px] font-medium rounded-[6px] flex items-center transition-colors duration-150"
        >
          Submit a Ticket
        </a>
      </div>

      {/* Recent Tickets Table */}
      {stats.totalTickets > 0 && (
        <section>
          <h2 className="text-[14px] font-medium text-[#2D3E52] mb-[12px]">
            Recent Tickets
          </h2>
          <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_auto] gap-[12px] px-[16px] py-[10px] border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {["Reference", "Title", "Category", "Priority", "Status", ""].map(
                (col) => (
                  <span
                    key={col}
                    className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider"
                  >
                    {col}
                  </span>
                ),
              )}
            </div>

            {/* Table Rows */}
            {stats.recentTickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className={`grid grid-cols-[1fr_2fr_1fr_1fr_1fr_auto] gap-[12px] px-[16px] py-[12px] ${
                  index !== stats.recentTickets.length - 1
                    ? "border-b border-[#F1F5F9]"
                    : ""
                }`}
              >
                <span className="text-[11px] font-mono text-[#94A3B8] self-center truncate">
                  {ticket.referenceNo}
                </span>
                <span className="text-[13px] font-medium text-[#2D3E52] self-center truncate">
                  {ticket.title}
                </span>
                <span className="text-[12px] text-[#475569] self-center truncate">
                  {ticket.category}
                </span>
                <div className="self-center">
                  <span
                    className={`text-[11px] px-[8px] py-[2px] rounded-full uppercase tracking-wider ${getPriorityStyles(ticket.priority)}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <div className="self-center">
                  <span
                    className={`text-[11px] px-[8px] py-[2px] rounded-full font-medium uppercase tracking-wider ${getStatusStyles(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div className="self-center">
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="text-[#94A3B8] hover:text-[#DC2626] transition-colors duration-150"
                    title="Delete ticket"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[15px] h-[15px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
