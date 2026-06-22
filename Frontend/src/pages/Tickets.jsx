import { useState } from "react";
import { useEffect } from "react";
import { Filters } from "../components/Filters";

const token = localStorage.getItem("token");

export function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

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
      <div>
        <Filters
          selectedCategory={selectedCategory}
          selectedPriority={selectedPriority}
          selectedStatus={selectedStatus}
          onCategoryChange={setSelectedCategory}
          onPriorityChange={setSelectedPriority}
          onStatusChange={setSelectedStatus}
        />
      </div>

      {/* Responsive Grid Container */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => {
          // Left accent border in Cyan for highest priority / critical statistics
          const isHighPriority =
            ticket.priority?.toLowerCase() === "high" ||
            ticket.priority?.toLowerCase() === "urgent" ||
            ticket.priority?.toLowerCase() === "critical";

          // Dynamic Semantic Status Color mapping matching the design spec
          const getStatusStyles = (status) => {
            switch (status?.toLowerCase()) {
              case "open":
                return "bg-[#ECFEFF] text-[#06B6D4]"; // Cyan
              case "in progress":
                return "bg-[#FEF3C7] text-[#D97706]"; // Amber
              case "pending":
                return "bg-[#F3E8FF] text-[#7C3AED]"; // Violet
              case "resolved":
                return "bg-[#DCFCE7] text-[#16A34A]"; // Green
              case "critical":
              case "closed":
                return "bg-[#FEE2E2] text-[#DC2626]"; // Red
              default:
                return "bg-[#F1F5F9] text-[#475569]"; // Fallback Slate
            }
          };

          const getPriorityStyles = (priority) => {
            switch (priority?.toLowerCase()) {
              case "low":
                return "bg-[#F1F5F9] text-[#475569]"; // Neutral Slate
              case "medium":
              case "normal":
                return "bg-[#FEF3C7] text-[#D97706]"; // Warning Amber
              case "high":
              case "urgent":
              case "critical":
                return "bg-[#FEE2E2] text-[#DC2626] font-semibold"; // Alarm Red
              default:
                return "bg-[#F1F5F9] text-[#2D3E52]";
            }
          };

          return (
            <>
              <div
                key={ticket.id}
                className={`flex flex-col justify-between rounded-[8px] border border-[#E2E8F0] bg-white p-[14px] shadow-sm transition-shadow hover:shadow-md ${
                  isHighPriority ? "border-l-[4px] border-l-[#06B6D4]" : ""
                }`}
              >
                <div>
                  {/* Header Meta: Reference No & Dynamic Semantic Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-[#94A3B8]">
                      {ticket.referenceNo || `#${ticket.id}`}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${getStatusStyles(ticket.status)}`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  {/* Title: Section Heading (H2) Rules applied */}
                  <h2 className="text-[14px] font-medium text-[#2D3E52] mb-1 truncate">
                    {ticket.title}
                  </h2>

                  {/* Description: Body Text Rules applied */}
                  <p className="text-[13px] font-normal text-[#475569] line-clamp-2 mb-4">
                    {ticket.description}
                  </p>
                </div>

                {/* Bottom Metadata Panel */}
                <div className="mt-auto pt-3 border-t border-[#F1F5F9] space-y-2">
                  {/* Dynamic Priority & Neutral Category Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded uppercase tracking-wider text-xs ${getPriorityStyles(ticket.priority)}`}
                    >
                      {ticket.priority} Priority
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 bg-[#F1F5F9] text-[#475569] rounded uppercase tracking-wider">
                      {ticket.category}
                    </span>
                  </div>

                  {/* User Layout Panel: Muted / Labels applied */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#94A3B8]">
                    <div>
                      <span className="block text-[10px] text-[#94A3B8] font-light uppercase">
                        Assigned To
                      </span>
                      <span className="font-medium text-[#475569] block truncate">
                        {ticket.assignedToUser || "Unassigned"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#94A3B8] font-light uppercase">
                        Submitted By
                      </span>
                      <span className="font-medium text-[#475569] block truncate">
                        {ticket.submittedByUser}
                      </span>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="flex justify-between items-center text-[10px] text-[#94A3B8] pt-1">
                    <span>Created: {ticket.createdAt}</span>
                    {ticket.updatedAt && (
                      <span>Updated: {ticket.updatedAt}</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
