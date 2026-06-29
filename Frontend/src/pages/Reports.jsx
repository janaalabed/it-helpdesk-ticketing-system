import { useEffect, useState } from "react";

export function Reports() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function loadSummary() {
      const response = await fetch("https://localhost:7010/api/Reports/summary");
      const data = await response.json();
      setSummary(data);
    }

    loadSummary();
  }, []);

  if (!summary) {
    return <p className="p-6">Loading reports...</p>;
  }

  const resolutionRate =
    summary.totalTickets > 0
      ? Math.round((summary.resolvedTickets / summary.totalTickets) * 100)
      : 0;

  const openRate =
    summary.totalTickets > 0
      ? Math.round((summary.openTickets / summary.totalTickets) * 100)
      : 0;

  const highPriorityRate =
    summary.totalTickets > 0
      ? Math.round((summary.highPriorityTickets / summary.totalTickets) * 100)
      : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor ticket performance, workload, and support priorities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <ReportCard title="Total Tickets" value={summary.totalTickets} />
        <ReportCard title="Open Tickets" value={summary.openTickets} />
        <ReportCard title="Resolved Tickets" value={summary.resolvedTickets} />
        <ReportCard title="High Priority" value={summary.highPriorityTickets} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">
            Ticket Breakdown
          </h2>

          <ProgressRow label="Open Tickets" value={openRate} />
          <ProgressRow label="Resolved Tickets" value={resolutionRate} />
          <ProgressRow label="High Priority Tickets" value={highPriorityRate} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">
            Quick Insights
          </h2>

          <ul className="space-y-3 text-sm text-slate-600">
            <li>{openRate}% of all tickets are currently open.</li>
            <li>{resolutionRate}% of tickets have been resolved.</li>
            <li>{highPriorityRate}% of tickets are marked as high priority.</li>
            <li>
              Managers can use this page to monitor workload and spot urgent
              support issues.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, value }) {
  const colors = {
    "Total Tickets": "text-blue-600",
    "Open Tickets": "text-amber-500",
    "Resolved Tickets": "text-green-600",
    "High Priority": "text-red-600",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-sm text-slate-500">{title}</p>

      <h2 className={`mt-3 text-3xl font-bold ${colors[title]}`}>
        {value}
      </h2>
    </div>
  );
}

function ProgressRow({ label, value }) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-cyan-500"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}