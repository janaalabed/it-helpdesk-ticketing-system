import { useState, useEffect } from "react";

const token = localStorage.getItem("token");

export function Users() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  async function getRoles() {
    try {
      const response = await fetch("https://localhost:7010/api/lookups/roles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Network or parse error:", error);
    }
  }

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

  async function handleDelete(id) {
    try {
      const response = await fetch(`https://localhost:7010/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        getUsers(); // ← refresh list after delete
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
            {/* Name */}
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Role — fetched from API */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Role
              </label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="h-[38px] px-[12px] text-[13px] text-[#2D3E52] bg-white border border-[#E2E8F0] rounded-[6px] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select a Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end pt-[8px]">
              <button
                onClick={addUser}
                className="h-[38px] px-[20px] bg-[#06B6D4] hover:bg-[#22D3EE] text-white font-medium text-[13px] rounded-[6px] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2"
              >
                Add User
              </button>
            </div>
          </form>
        </section>

        {/* All Users Panel */}
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
                {/* Name & Email */}
                <div className="space-y-[2px]">
                  <p className="text-[14px] font-medium text-[#2D3E52]">
                    {user.fullName}
                  </p>
                  <p className="text-[13px] text-[#475569]">{user.email}</p>
                </div>

                {/* Role Badge */}
                <div className="mt-[8px] sm:mt-0">
                  <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-medium bg-[#ECFEFF] text-[#06B6D4] border border-[#06B6D4]/10">
                    {user.role || "No Role"}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(user.id)}
                  className="mt-[8px] sm:mt-0 h-[32px] px-[12px] text-[12px] font-medium text-[#DC2626] bg-[#FEE2E2] hover:bg-[#FCA5A5] rounded-[6px] transition-colors duration-150 border border-[#FCA5A5]"
                >
                  Delete
                </button>
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
