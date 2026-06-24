import { useState, useEffect } from "react";
import { Filters } from "../components/Filters";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const token = localStorage.getItem("token");

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
    case "critical":
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

// ─── Modal ───────────────────────────────────────────────────────────────────
function TicketModal({ ticket, onClose }) {
  if (!ticket) return null;

  const isHighPriority = ["high", "urgent", "critical"].includes(
    ticket.priority?.toLowerCase(),
  );

  return (
    // backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2A38]/40 px-[16px]"
      onClick={onClose}
    >
      {/* modal panel */}
      <div
        className="relative w-full max-w-lg bg-white rounded-[12px] border border-[#E2E8F0] shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close on inner click
      >
        {/* cyan accent top bar for high priority */}
        {isHighPriority && <div className="h-[3px] w-full bg-[#06B6D4]" />}

        {/* header */}
        <div className="flex items-start justify-between gap-3 px-[20px] pt-[20px] pb-[14px] border-b border-[#E2E8F0]">
          <div className="min-w-0">
            <span className="text-[11px] font-mono text-[#94A3B8] block mb-[4px]">
              {ticket.referenceNo || `#${ticket.id}`}
            </span>
            <h2 className="text-[16px] font-medium text-[#2D3E52] leading-snug">
              {ticket.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#475569] transition-colors text-[18px] leading-none"
          >
            ×
          </button>
        </div>

        {/* body */}
        <div className="px-[20px] py-[16px] space-y-[16px]">
          {/* badges row */}
          <div className="flex flex-wrap gap-[6px]">
            <span
              className={`text-[11px] px-[8px] py-[3px] rounded-full font-medium uppercase tracking-wider ${getStatusStyles(ticket.status)}`}
            >
              {ticket.status}
            </span>
            <span
              className={`text-[11px] px-[8px] py-[3px] rounded-full uppercase tracking-wider ${getPriorityStyles(ticket.priority)}`}
            >
              {ticket.priority} Priority
            </span>
            <span className="text-[11px] px-[8px] py-[3px] rounded-full bg-[#F1F5F9] text-[#475569] uppercase tracking-wider">
              {ticket.category}
            </span>
          </div>

          {/* description */}
          <div>
            <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-[6px]">
              Description
            </p>
            <p className="text-[13px] text-[#475569] leading-relaxed">
              {ticket.description || "No description provided."}
            </p>
          </div>

          {/* people */}
          <div className="grid grid-cols-2 gap-[12px]">
            <div className="bg-[#F8FAFC] rounded-[6px] p-[10px]">
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-[2px]">
                Submitted By
              </p>
              <p className="text-[13px] font-medium text-[#2D3E52] truncate">
                {ticket.submittedByUser || "—"}
              </p>
            </div>
            <div className="bg-[#F8FAFC] rounded-[6px] p-[10px]">
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-[2px]">
                Assigned To
              </p>
              <p className="text-[13px] font-medium text-[#2D3E52] truncate">
                {ticket.assignedToUser || "Unassigned"}
              </p>
            </div>
          </div>

          {/* timestamps */}
          <div className="flex justify-between text-[11px] text-[#94A3B8] pt-[4px] border-t border-[#F1F5F9]">
            <span>Created: {formatDate(ticket.createdAt)}</span>
            {ticket.updatedAt && (
              <span>Updated: {formatDate(ticket.updatedAt)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null); // ← modal state

  useEffect(() => {
    getTickets();
  }, [selectedCategory, selectedPriority, selectedStatus]);

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedPriority) params.append("priority", selectedPriority);
    if (selectedStatus) params.append("status", selectedStatus);
    const query = params.toString();
    return query
      ? `https://localhost:7010/api/ticket?${query}`
      : `https://localhost:7010/api/ticket`;
  };

  const getTickets = async () => {
    try {
      const response = await fetch(buildUrl(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Network or parse error:", error);
    }
  };

  return (
    <>
      {/* Modal */}
      <TicketModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Filters */}
      <div className="mb-[16px]">
        <Filters
          selectedCategory={selectedCategory}
          selectedPriority={selectedPriority}
          selectedStatus={selectedStatus}
          onCategoryChange={setSelectedCategory}
          onPriorityChange={setSelectedPriority}
          onStatusChange={setSelectedStatus}
        />
      </div>

      {/* Ticket count */}
      <p className="text-[11px] text-[#94A3B8] mb-[10px]">
        {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
      </p>

      {/* Ticket rows */}
      <div className="flex flex-col gap-[6px]">
        {tickets.map((ticket) => {
          const isHighPriority = ["high", "urgent", "critical"].includes(
            ticket.priority?.toLowerCase(),
          );

          return (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`flex items-center justify-between gap-3 bg-white border border-[#E2E8F0] rounded-[5px] px-[16px] py-[12px] cursor-pointer hover:border-[#06B6D4] hover:shadow-sm transition-all duration-150
                ${isHighPriority ? "border-l-[3px] border-l-[#06B6D4]" : ""}`}
            >
              {/* left: ref + title */}
              <div className="flex items-center gap-[12px] min-w-0">
                <span className="text-[11px] font-mono text-[#94A3B8] flex-shrink-0 hidden sm:block">
                  {ticket.referenceNo || `#${ticket.id}`}
                </span>
                <p className="text-[13px] font-medium text-[#2D3E52] truncate">
                  {ticket.title}
                </p>
              </div>

              {/* right: badges + date */}
              <div className="flex items-center gap-[8px] flex-shrink-0">
                <span
                  className={`hidden sm:inline-flex text-[11px] px-[8px] py-[2px] rounded-full font-medium uppercase tracking-wider ${getPriorityStyles(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>
                <span
                  className={`inline-flex text-[11px] px-[8px] py-[2px] rounded-full font-medium uppercase tracking-wider ${getStatusStyles(ticket.status)}`}
                >
                  {ticket.status}
                </span>
                <span className="hidden md:block text-[11px] text-[#94A3B8]">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>
            </div>
          );
        })}

        {tickets.length === 0 && (
          <p className="text-[13px] text-[#94A3B8] text-center py-[40px]">
            No tickets found.
          </p>
        )}
      </div>
    </>
  );
}
