import { useState, useEffect } from "react";

const token = localStorage.getItem("token");

export function Users() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);
  async function getUsers() {
    try {
      const response = await fetch("https://localhost:7010/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch users:", data);
        return;
      }

      setUsers(data);
    } catch (error) {
      console.error("Network or parse error:", error);
    }
  }

  async function addUser() {
    const user = {
      FullName: fullName,
      Email: email,
      Password: password,
      RoleId: parseInt(roleId),
    };

    try {
      const response = await fetch("https://localhost:7010/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert("User created successfully");
        setFullName("");
        setEmail("");
        setPassword("");
        setRoleId("");
        getUsers();
      } else {
        const errorText = await response.text();
        console.error("Status:", response.status, errorText);
        alert(`Failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-[16px] md:p-[24px] font-sans antialiased text-[#475569]">
      <div className="max-w-4xl mx-auto space-y-[24px]">
        {/* Create New User Panel */}
        <section className="bg-white rounded-[8px] border border-[#E2E8F0] p-[16px] md:p-[24px] shadow-sm">
          <h1 className="text-[20px] font-medium text-[#1E2A38] mb-[16px]">
            Create New User
          </h1>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 md:grid-cols-2 gap-[16px]"
          >
            {/* Name Input */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="h-[38px] px-[12px] text-[13px] text-[#2D3E52] bg-white border border-[#E2E8F0] rounded-[6px] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] placeholder-[#94A3B8] transition-colors"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="h-[38px] px-[12px] text-[13px] text-[#2D3E52] bg-white border border-[#E2E8F0] rounded-[6px] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] placeholder-[#94A3B8] transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-[38px] px-[12px] text-[13px] text-[#2D3E52] bg-white border border-[#E2E8F0] rounded-[6px] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] placeholder-[#94A3B8] transition-colors"
              />
            </div>

            {/* Role Select */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Role
              </label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="h-[38px] px-[12px] text-[13px] text-[#2D3E52] bg-white border border-[#E2E8F0] rounded-[6px] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="text-[#94A3B8]">
                  Select a Role
                </option>
                <option value="3">Employee</option>
                <option value="4">Manager</option>
                <option value="2">IT Support</option>
                <option value="1">Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end pt-[8px]">
              <button
                onClick={addUser}
                className="h-[38px] px-[20px] bg-[#06B6D4] hover:bg-[#22D3EE] text-white font-medium text-[13px] rounded-[6px] transition-colors duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2"
              >
                Add User
              </button>
            </div>
          </form>
        </section>

        {/* All Users Directory Panel */}
        <section className="bg-white rounded-[8px] border border-[#E2E8F0] p-[16px] md:p-[24px] shadow-sm">
          <h1 className="text-[20px] font-medium text-[#1E2A38] mb-[16px]">
            All Users
          </h1>

          <div className="space-y-[12px]">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-[14px] px-[16px] bg-white border border-[#E2E8F0] rounded-[6px] hover:border-[#06B6D4] transition-colors duration-150"
              >
                <div className="space-y-[2px]">
                  <p className="text-[14px] font-medium text-[#2D3E52]">
                    {user.fullName}
                  </p>
                  <p className="text-[13px] text-[#475569]">{user.email}</p>
                </div>

                <div className="mt-[8px] sm:mt-0">
                  <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-medium bg-[#ECFEFF] text-[#06B6D4] border border-[#06B6D4]/10">
                    {user.role || "No Role"}
                  </span>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <p className="text-[13px] text-[#94A3B8] text-center py-[24px]">
                No users found. Add a user above to get started.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
