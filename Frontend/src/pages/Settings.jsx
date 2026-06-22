import { useState } from "react";

const token = localStorage.getItem("token");

export function Settings() {
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  async function changePassword() {
    const newPassword = {
      currentPassword,
      newPassword,
      confirmedPassword,
    };
    try {
      if (!currentPassword || !newPassword || !confirmedPassword) {
        alert("All fields are required");
        return;
      }
      if (newPassword !== confirmedPassword) {
        alert("Passwords do not match");
        return;
      }
      if (newPassword.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }
      const response = await fetch("https://localhost:7010/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPassword),
      });

      if (response.ok) {
        alert("Password updated successfully");
        setCurrentPassword("");
        setPassword("");
        setConfirmedPassword("");
      } else {
        const error = await response.text();
        alert(`Failed: ${error}`);
      }
    } catch (error) {
      console.error("Network or parse error:", error);
    }
  }

  return (
    <>
      <h1>welcome to Settings</h1>
      <form onSubmit={(e) => e.preventDefault}>
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
        <button onClick={() => changePassword}>Change Password</button>
      </form>
    </>
  );
}
