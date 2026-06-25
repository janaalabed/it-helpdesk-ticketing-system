import { useEffect, useState } from "react";

const API_URL = "https://localhost:7010/api/Tickets";
const EMPLOYEE_ID = localStorage.getItem("userId");

export function EmployeeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: 1,
    priorityId: 3,
    statusId: 2,
  });

  async function loadTickets() {
  const response = await fetch(API_URL);
  const text = await response.text();

  if (!response.ok) {
    console.error("GET tickets failed:", response.status, text);
    alert("Could not load tickets");
    return;
  }

  const data = JSON.parse(text);
  setTickets(data);
}

  useEffect(() => {
    loadTickets();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const newTicket = {
      title: form.title,
      description: form.description,
      submittedBy: EMPLOYEE_ID,
      assignedTo: "0e96f07d-2b38-4be7-beb2-9440158cf652",
      categoryId: Number(form.categoryId),
      priorityId: Number(form.priorityId),
      statusId: Number(form.statusId),
    };

    const response = await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(newTicket),
});

    if (response.ok) {
  setForm({
    title: "",
    description: "",
    categoryId: 1,
    priorityId: 3,
    statusId: 2,
  });
    loadTickets();
    } else {
    const errorText = await response.text();
    console.error("POST ticket failed:", response.status, errorText);
    alert("Could not create ticket");
    }
}
async function deleteTicket(id) {
  const confirmDelete = window.confirm("Delete this ticket?");
  if (!confirmDelete) return;

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (response.ok) {
    loadTickets();
  } else {
    alert("Could not delete ticket");
  }
}
async function updateTicket(ticket) {
  const newTitle = window.prompt("Edit title:", ticket.title);
  if (!newTitle) return;

  const newDescription = window.prompt("Edit description:", ticket.description);
  if (!newDescription) return;

  const updatedTicket = {
    ...ticket,
    title: newTitle,
    description: newDescription,
    submittedBy: ticket.submittedBy,
    assignedTo: ticket.assignedTo,
    categoryId: ticket.categoryId,
    priorityId: ticket.priorityId,
    statusId: ticket.statusId,
  };

  const response = await fetch(`${API_URL}/${ticket.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedTicket),
  });

  if (response.ok) {
    loadTickets();
  } else {
    const errorText = await response.text();
    console.error("PUT ticket failed:", response.status, errorText);
    alert("Could not update ticket");
  }
}
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-slate-900">
          Employee Ticket Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Create and track your IT support tickets.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-lg border border-slate-200 bg-white p-4"
      >
        <h2 className="mb-4 text-sm font-medium text-slate-800">
          Create New Ticket
        </h2>

        <div className="mb-3">
          <label className="mb-1 block text-xs text-slate-500">Title</label>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs text-slate-500">
            Description
          </label>
          <textarea
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            rows="3"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="1">Hardware</option>
            <option value="2">Software</option>
            <option value="3">Network</option>
          </select>

          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.priorityId}
            onChange={(e) => setForm({ ...form, priorityId: e.target.value })}
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>

          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.statusId}
            onChange={(e) => setForm({ ...form, statusId: e.target.value })}
          >
            <option value="1">Open</option>
            <option value="2">In Progress</option>
            <option value="3">Resolved</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white"
        >
          Submit Ticket
        </button>
      </form>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-sm font-medium text-slate-800">My Tickets</h2>

    </div>

        <div className="divide-y divide-slate-200">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-4">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-900">
                  {ticket.title}
                </h3>
                <span className="text-xs text-slate-500">
                  {ticket.referenceNo}
                </span>
              </div>
              <p className="text-sm text-slate-600">{ticket.description}</p>
              <div className="mt-2 text-xs text-slate-500">
                Category: {ticket.categoryId} | Priority: {ticket.priorityId} |
                Status: {ticket.statusId}
              </div>
              <button
                type="button"
                onClick={() => updateTicket(ticket)}
                className="mt-3 mr-2 rounded-md border border-blue-300 px-3 py-1 text-xs text-blue-600"
            >
                Edit
            </button>
              <button
                type="button"
                onClick={() => deleteTicket(ticket.id)}
                className="mt-3 rounded-md border border-red-300 px-3 py-1 text-xs text-red-600"
              >
                Delete
                </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}