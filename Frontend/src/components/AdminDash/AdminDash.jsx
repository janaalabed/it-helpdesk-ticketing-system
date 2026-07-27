import { useState, useEffect } from "react";

const token = localStorage.getItem("token");

// const formatDate = (dateStr) => {
//   if (!dateStr) return "—";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
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

export function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats();
  }, []);

  async function getStats() {
    try {
      const response = await fetch(
        "https://localhost:7010/api/admindashboard",
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

  if (!stats)
    return <p className="text-[13px] text-[#94A3B8] p-[16px]">Loading...</p>;

  return (
    <div className="space-y-[24px]">
      {/* Page Heading */}
      <h1 className="text-[20px] font-medium text-[#1E2A38]">
        Admin Dashboard
      </h1>

      {/* Users Section */}
      <section>
        <h2 className="text-[14px] font-medium text-[#2D3E52] mb-[12px]">
          Users
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[12px]">
          {[
            { label: "Total Users", value: stats.usersCount },
            { label: "Employees", value: stats.employeesCount },
            { label: "IT Support", value: stats.itSupportsCount },
            { label: "Managers", value: stats.managersCount },
            { label: "Admins", value: stats.adminsCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-[8px] border border-[#E2E8F0] px-[16px] py-[14px]"
            >
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-[6px]">
                {label}
              </p>
              <p className="text-[24px] font-medium text-[#2D3E52]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tickets Section */}
      <section>
        <h2 className="text-[14px] font-medium text-[#2D3E52] mb-[12px]">
          Tickets
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[12px]">
          {[
            {
              label: "Total",
              value: stats.ticketsCount,
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
              label: "Pending",
              value: stats.pendingTickets,
              color: "text-[#7C3AED]",
            },
            {
              label: "Resolved",
              value: stats.resolvedTickets,
              color: "text-[#16A34A]",
            },
            {
              label: "Closed",
              value: stats.closedTickets,
              color: "text-[#DC2626]",
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

      {/* Unassigned Alert */}
      {stats.unassignedTickets > 0 && (
        <div className="flex items-center gap-[10px] bg-[#FEF3C7] border border-[#D97706]/20 rounded-[8px] px-[16px] py-[12px]">
          <span className="text-[13px] font-medium text-[#D97706]">
            ⚠ {stats.unassignedTickets} unassigned{" "}
            {stats.unassignedTickets === 1 ? "ticket" : "tickets"} - assign an
            agent.
          </span>
        </div>
      )}

      {/* Tickets by Category */}
      <section>
        <h2 className="text-[14px] font-medium text-[#2D3E52] mb-[12px]">
          Tickets by Category
        </h2>
        <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden">
          {stats.ticketsByCategory.map((item, index) => {
            const percentage =
              stats.ticketsCount > 0
                ? Math.round((item.count / stats.ticketsCount) * 100)
                : 0;
            return (
              <div
                key={item.category}
                className={`flex items-center justify-between px-[16px] py-[12px] gap-[12px] ${
                  index !== stats.ticketsByCategory.length - 1
                    ? "border-b border-[#F1F5F9]"
                    : ""
                }`}
              >
                <span className="text-[13px] text-[#2D3E52] w-[120px] flex-shrink-0">
                  {item.category}
                </span>
                {/* progress bar */}
                <div className="flex-1 bg-[#F1F5F9] rounded-full h-[6px] overflow-hidden">
                  <div
                    className="h-full bg-[#06B6D4] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center gap-[8px] flex-shrink-0">
                  <span className="text-[13px] font-medium text-[#2D3E52] w-[24px] text-right">
                    {item.count}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] w-[32px] text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tickets by Priority */}
      <section>
        <h2 className="text-[14px] font-medium text-[#2D3E52] mb-[12px]">
          Tickets by Priority
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
          {stats.ticketsByPriority.map((item) => (
            <div
              key={item.priority}
              className="bg-white rounded-[8px] border border-[#E2E8F0] px-[16px] py-[14px]"
            >
              <span
                className={`text-[11px] px-[8px] py-[2px] rounded-full uppercase tracking-wider ${getPriorityStyles(item.priority)}`}
              >
                {item.priority}
              </span>
              <p className="text-[24px] font-medium text-[#2D3E52] mt-[8px]">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Tickets */}
      <section>
        <h2 className="text-[14px] font-medium text-[#2D3E52] mb-[12px]">
          Recent Tickets
        </h2>
        <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-[12px] px-[16px] py-[10px] border-b border-[#E2E8F0] bg-[#F8FAFC]">
            {["Reference", "Title", "Category", "Priority", "Status"].map(
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
          {/* Table rows */}
          {stats.recentTickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className={`grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-[12px] px-[16px] py-[12px] ${
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
