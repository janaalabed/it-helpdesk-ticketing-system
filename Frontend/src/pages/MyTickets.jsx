import { useState } from "react";
import { useEffect } from "react";
export function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    getTicketById();
  }, []);

  async function getTicketById() {
    try {
      const response = await fetch(
        "https://localhost:7010/api/ticket/myTickets",
        {
          method: "Get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      console.log(data);
      setTickets(data);
    } catch (error) {
      console.error("Network or parse error:", error);
    }
  }

  return (
    <>
      {/* Page Heading: 20px | Weight 500 | Slate-900 */}
      <h1 className="text-[20px] font-medium text-[#1E2A38] mb-6">
        welcome to Tickets page
      </h1>

      {/* Responsive Grid Container */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => {
          // Apply left accent border in Cyan for highest priority statistics/tickets
          const isHighPriority =
            ticket.priority?.toLowerCase() === "high" ||
            ticket.priority?.toLowerCase() === "urgent" ||
            ticket.priority?.toLowerCase() === "critical";

          // Dynamic Semantic Status Color mapping matching the design spec
          const statusStyles =
            {
              open: "bg-[#ECFEFF] text-[#06B6D4]", // Cyan
              "in progress": "bg-[#FEF3C7] text-[#D97706]", // Amber
              pending: "bg-[#F3E8FF] text-[#7C3AED]", // Violet
              resolved: "bg-[#DCFCE7] text-[#16A34A]", // Green
              critical: "bg-[#FEE2E2] text-[#DC2626]", // Red
              closed: "bg-[#FEE2E2] text-[#DC2626]", // Red
            }[ticket.status?.toLowerCase()] || "bg-[#F1F5F9] text-[#475569]";

          // Dynamic Semantic Priority Color mapping matching status color rules
          const priorityStyles =
            {
              low: "bg-[#F1F5F9] text-[#475569]", // Neutral Slate
              medium: "bg-[#FEF3C7] text-[#D97706]", // Warning Amber
              normal: "bg-[#FEF3C7] text-[#D97706]", // Warning Amber
              high: "bg-[#FEE2E2] text-[#DC2626] font-semibold", // Alarm Red
              urgent: "bg-[#FEE2E2] text-[#DC2626] font-semibold", // Alarm Red
              critical: "bg-[#FEE2E2] text-[#DC2626] font-semibold", // Alarm Red
            }[ticket.priority?.toLowerCase()] || "bg-[#F1F5F9] text-[#2D3E52]";

          return (
            <div
              key={ticket.id}
              className={`flex flex-col justify-between bg-white rounded-[8px] border border-[#E2E8F0] p-[14px] shadow-sm transition-all hover:shadow-md ${
                isHighPriority ? "border-l-[4px] border-l-[#06B6D4]" : ""
              }`}
            >
              <div>
                {/* Upper Metadata Row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  {/* Muted / Label: 11px | Weight 400 | Slate-500 */}
                  <span className="text-[11px] font-normal text-[#94A3B8] tracking-wider font-mono">
                    {ticket.referenceNo}
                  </span>
                  {/* Semantic Status Badge */}
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${statusStyles}`}
                  >
                    {ticket.status}
                  </span>
                </div>

                {/* Title - Section Heading (H2): 14px | Weight 500 | Slate-800 */}
                <h2 className="text-[14px] font-medium text-[#2D3E52] mb-1 line-clamp-1">
                  {ticket.title}
                </h2>

                {/* Description - Body Text: 13px | Weight 400 | Slate-700 */}
                <p className="text-[13px] font-normal text-[#475569] line-clamp-2 mb-4 leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              {/* Bottom Panel Block */}
              <div className="mt-auto pt-3 border-t border-[#F1F5F9] space-y-2.5">
                {/* Badges Layout Row */}
                <div className="flex flex-wrap gap-1.5">
                  {/* Dynamic Priority Indicator */}
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded uppercase tracking-wide ${priorityStyles}`}
                  >
                    {ticket.priority} Priority
                  </span>
                  {/* Category Indicator */}
                  <span className="text-[11px] font-normal px-2 py-0.5 bg-[#F1F5F9] text-[#475569] rounded uppercase tracking-wide">
                    {ticket.category}
                  </span>
                </div>

                {/* Creator & Timeline Footer Panel */}
                <div className="flex flex-col gap-1 text-[11px] text-[#94A3B8]">
                  <div className="flex justify-between items-center">
                    <span>
                      By:{" "}
                      <strong className="font-medium text-[#475569]">
                        {ticket.submittedByUser}
                      </strong>
                    </span>
                    <span>Created: {ticket.createdAt}</span>
                  </div>
                  {ticket.updatedAt && (
                    <div className="text-right text-[10px] italic">
                      Updated: {ticket.updatedAt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
