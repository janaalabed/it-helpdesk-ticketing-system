import { useEffect, useState } from "react";

export function ItSupportDashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      const response = await fetch("https://localhost:7010/api/ItSupportDashboard");
      const data = await response.json();
      setDashboard(data);
    }

    loadDashboard();
  }, []);

  if (!dashboard) {
    return <p className="p-6 text-slate-500">Loading IT support dashboard...</p>;
  }

  const priorities = [
    { label: "Critical", value: dashboard.critical },
    { label: "High", value: dashboard.high },
    { label: "Medium", value: dashboard.medium },
    { label: "Low", value: dashboard.low },
  ];

  const maxPriority = Math.max(...priorities.map((p) => p.value), 1);

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
          IT Support Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Welcome back, Ali 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is your assigned ticket workload and priority overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Assigned Tickets" value={dashboard.assigned} />
        <StatCard title="Currently Working" value={dashboard.working} />
        <StatCard title="Resolved Today" value={dashboard.resolvedToday} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">
          Priority Distribution
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Breakdown of your tickets by priority level.
        </p>

            <div className="mt-5 space-y-4">
          {priorities.map((priority) => (
            <div key={priority.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-slate-700">{priority.label}</span>
                <span className="text-slate-500">{priority.value}</span>
              </div>

              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-cyan-500"
                  style={{
                    width: `${(priority.value / maxPriority) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Today's Focus</h2>

        <p className="mt-1 text-sm text-slate-500">
          Recommended actions based on your current workload.
        </p>

        <div className="mt-5 space-y-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-medium text-slate-800">🚨 Critical Tickets</p>
            <p className="mt-1 text-sm text-slate-600">
              You currently have <strong>{dashboard.critical}</strong> critical ticket(s) requiring immediate attention.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-medium text-slate-800">⚡ Active Workload</p>
            <p className="mt-1 text-sm text-slate-600">
              <strong>{dashboard.working}</strong> ticket(s) are currently in progress.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-medium text-slate-800">📋 Assigned Queue</p>
            <p className="mt-1 text-sm text-slate-600">
              You have <strong>{dashboard.assigned}</strong> assigned ticket(s). Prioritize critical and high-priority requests first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-3 text-4xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}