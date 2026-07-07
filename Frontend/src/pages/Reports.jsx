import { useEffect, useState } from "react";
import jsPDF from "jspdf";

const token = localStorage.getItem("token");

export function Reports() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function loadSummary() {
      const response = await fetch(
        "https://localhost:7010/api/Reports/summary",
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      setSummary(data);
    }

    loadSummary();
  }, []);

  if (!summary) {
    return <p className="p-6 text-slate-500">Loading reports...</p>;
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

  const healthScore = Math.max(
    0,
    Math.min(
      100,
      100 -
        openRate -
        Math.round(highPriorityRate / 2) +
        Math.round(resolutionRate / 2),
    ),
  );

  function exportPdf() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Help Desk Reports Summary", 20, 20);

    doc.setFontSize(11);
    doc.text(`Total Tickets: ${summary.totalTickets}`, 20, 40);
    doc.text(`Open Tickets: ${summary.openTickets}`, 20, 50);
    doc.text(`Resolved Tickets: ${summary.resolvedTickets}`, 20, 60);
    doc.text(`High Priority Tickets: ${summary.highPriorityTickets}`, 20, 70);
    doc.text(`Support Health Score: ${healthScore}/100`, 20, 80);

    doc.text("Manager Insights:", 20, 100);
    doc.text(`- ${openRate}% of tickets are still open.`, 25, 110);
    doc.text(
      `- ${highPriorityRate}% of tickets require urgent attention.`,
      25,
      120,
    );
    doc.text(`- ${resolutionRate}% of tickets have been resolved.`, 25, 130);

    doc.save("helpdesk-report.pdf");
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
            Management Reports
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Support Performance Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A manager-facing report view for workload, urgency, exports, and
            AI-assisted categorization.
          </p>
        </div>

        <button
          type="button"
          onClick={exportPdf}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
        >
          Export PDF
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Support Health Score</p>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-6xl font-bold text-cyan-600">
              {healthScore}
            </span>
            <span className="mb-2 text-lg font-semibold text-slate-400">
              /100
            </span>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            Calculated from open workload, high-priority pressure, and
            resolution progress.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Manager Insights
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Simple interpretation of the current ticket report.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Insight
              title="Open Workload"
              text={`${openRate}% of tickets are still open.`}
            />
            <Insight
              title="Urgency Level"
              text={`${highPriorityRate}% are high priority.`}
            />
            <Insight
              title="Resolution Rate"
              text={`${resolutionRate}% of tickets are resolved.`}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            AI Categorization Preview
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Suggested AI categories based on current support patterns.
          </p>

          <div className="mt-5 space-y-3">
            <AiCategory
              label="Hardware"
              confidence="High"
              reason="Many tickets mention laptops, printers, or physical devices."
            />
            <AiCategory
              label="Network"
              confidence="Medium"
              reason="Some tickets may involve VPN, Wi-Fi, or connectivity issues."
            />
            <AiCategory
              label="Access & Login"
              confidence="Medium"
              reason="Useful for password, account, and authentication-related requests."
            />
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-800">
            Export & AI Features
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Current and upcoming report capabilities.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge text="PDF Export Ready" />
            <Badge text="Excel Export Next" />
            <Badge text="AI Categorization Preview" />
            <Badge text="AI Priority Detection Later" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Insight({ title, text }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-sm text-slate-700">{text}</p>
    </div>
  );
}

function AiCategory({ label, confidence, reason }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
          {confidence} confidence
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">{reason}</p>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
      {text}
    </span>
  );
}
