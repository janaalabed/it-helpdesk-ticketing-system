import { useState } from "react";

export function AdminDashboard() {
  const [Fullname, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [RoleId, setRole] = useState("");

  async function addUser() {
    const user = {
      Fullname,
      Email,
      Password,
      RoleId: parseInt(RoleId),
    };

    const token = localStorage.getItem("token");

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
        alert("user created successfully");
      } else {
        const errorText = await response.text();
        console.error("Status:", response.status, errorText);
        alert(`failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }
  return (
    <>
  
      <br />
      <h1>Welcome to admin dashboard</h1>
      <h1>Create new User</h1>
      <br />
      <label>Name</label>
      <input
        type="text"
        value={Fullname}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <label>Email</label>
      <input
        type="email"
        value={Email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label>Password</label>
      <input
        type="password"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <select value={RoleId} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select a Role</option>
        <option value="3">Employee</option>
        <option value="4">Manager</option>
        <option value="2">IT Support</option>
        <option value="1">Admin</option>
      </select>
      <button onClick={addUser}>Add User</button>
      <br />
      <br />
    </>
  );
}
