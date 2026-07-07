import { useState, useEffect } from "react";

export function NewTicket() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priorityId: "",
    assignedTo: "",
  });
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    fetch("https://localhost:7010/api/lookups/categories", { headers })
      .then((res) => res.json())
      .then(setCategories);
    fetch("https://localhost:7010/api/lookups/priorities", { headers })
      .then((res) => res.json())
      .then(setPriorities);
    fetch("https://localhost:7010/api/lookups/assignable-users", { headers })
      .then((res) => res.json())
      .then(setAssignableUsers);
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("https://localhost:7010/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          categoryId: parseInt(formData.categoryId),
          priorityId: parseInt(formData.priorityId),
          assignedTo: formData.assignedTo || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({
          type: "success",
          text: `Success! Created reference: ${data.referenceNo}`,
        });
        setFormData({
          title: "",
          description: "",
          categoryId: "",
          priorityId: "",
        });
      } else {
        setMessage({
          type: "error",
          text: "Error creating ticket. Ensure all input choices are fully validated.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An unexpected system error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Canvas Background (Slate-50) & Container Padding
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-[14px] font-sans antialiased">
      {/* Card Wrapper matching design constraints (8px/12px corners, 0.5px border) */}
      <div className="mx-auto max-w-[500px] rounded-lg border-[0.5px] border-[#E2E8F0] bg-white p-6 shadow-sm">
        {/* Page Heading H1 (20px, Weight 500, Slate-900) */}
        <h1 className="mb-6 text-[20px] font-medium text-[#1E2A38]">
          Submit New Support Request
        </h1>

        {/* Messaging Layout (Alert uses Cyan-50 context or fallback status colors) */}
        {message && (
          <div
            className={`mb-[15px] p-[10px] rounded-[6px] text-[13px] border-[0.5px] ${
              message.type === "success"
                ? "bg-[#ECFEFF] text-[#06B6D4] border-[#06B6D4]"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-[15px]">
          {/* Input Group: Title */}
          <div>
            <label className="block text-[11px] font-medium text-[#475569] mb-1">
              Subject Summary Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., VPN connection dropping"
              className="w-full h-9 rounded-[6px] border-[0.5px] border-[#E2E8F0] px-3 text-[13px] text-[#2D3E52] placeholder-[#94A3B8] focus:border-[#06B6D4] focus:outline-none focus:ring-1 focus:ring-[#06B6D4]"
            />
          </div>

          {/* Input Group: Description */}
          <div>
            <label className="block text-[11px] font-medium text-[#475569] mb-1">
              Detailed Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the technical issue in detail..."
              className="w-full rounded-[6px] border-[0.5px] border-[#E2E8F0] p-3 text-[13px] text-[#2D3E52] placeholder-[#94A3B8] focus:border-[#06B6D4] focus:outline-none focus:ring-1 focus:ring-[#06B6D4] resize-none"
            />
          </div>

          {/* Input Group: Category Dropdown */}
          <div>
            <label className="block text-[11px] font-medium text-[#475569] mb-1">
              System Category *
            </label>
            <div className="relative">
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full h-9 rounded-[6px] border-[0.5px] border-[#E2E8F0] px-3 text-[13px] text-[#2D3E52] bg-white appearance-none focus:border-[#06B6D4] focus:outline-none focus:ring-1 focus:ring-[#06B6D4]"
              >
                <option value="" className="text-[#94A3B8]">
                  -- Choose Category --
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input Group: Priority Dropdown */}
          <div className="pb-1">
            <label className="block text-[11px] font-medium text-[#475569] mb-1">
              Priority Classification Urgency *
            </label>
            <div className="relative">
              <select
                name="priorityId"
                value={formData.priorityId}
                onChange={handleChange}
                required
                className="w-full h-9 rounded-[6px] border-[0.5px] border-[#E2E8F0] px-3 text-[13px] text-[#2D3E52] bg-white appearance-none focus:border-[#06B6D4] focus:outline-none focus:ring-1 focus:ring-[#06B6D4]"
              >
                <option value="" className="text-[#94A3B8]">
                  -- Choose Priority Level --
                </option>
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.level}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Input Group: Assigned To Dropdown */}
          <div>
            <label className="block text-[11px] font-medium text-[#475569] mb-1">
              Assign To
            </label>
            <div className="relative">
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full h-9 rounded-[6px] border-[0.5px] border-[#E2E8F0] px-3 text-[13px] text-[#2D3E52] bg-white appearance-none focus:border-[#06B6D4] focus:outline-none focus:ring-1 focus:ring-[#06B6D4]"
              >
                <option value="" className="text-[#94A3B8]">
                  -- Unassigned --
                </option>
                {assignableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Action Button (Cyan-500, Cyan-400 hover state, 6px radius) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-9 bg-[#06B6D4] hover:bg-[#22D3EE] active:bg-[#06B6D4] text-white font-medium text-[13px] rounded-[6px] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting Request..." : "File Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
