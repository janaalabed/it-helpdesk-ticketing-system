import { useState } from "react";

const token = localStorage.getItem("token");

export function Profile() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  async function changePassword() {
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
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmedPassword,
        }),
      });

      if (response.ok) {
        alert("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmedPassword("");
      } else {
        const error = await response.text();
        alert(`Failed: ${error}`);
      }
    } catch (error) {
      console.error("Network or parse error:", error);
      alert("Server error");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-[16px] md:p-[24px] font-sans antialiased">
      <div className="max-w-lg mx-auto space-y-[24px]">
        {/* Page Heading */}
        <h1 className="text-[20px] font-medium text-[#1E2A38]">
          Profile Settings
        </h1>

        {/* Change Password Card */}
        <section className="bg-white rounded-[8px] border border-[#E2E8F0] p-[16px] md:p-[24px]">
          {/* Section Heading */}
          <div className="mb-[20px] pb-[14px] border-b border-[#E2E8F0]">
            <h2 className="text-[14px] font-medium text-[#2D3E52]">
              Change Password
            </h2>
            <p className="text-[13px] text-[#94A3B8] mt-[4px]">
              Make sure your new password is at least 8 characters.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-[16px]"
          >
            {/* Current Password */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="h-[38px] px-[12px] text-[13px] text-[#2D3E52] bg-white border border-[#E2E8F0] rounded-[6px] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] placeholder-[#94A3B8] transition-colors"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-[#F1F5F9]" />

            {/* New Password */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="h-[38px] px-[12px] text-[13px] text-[#2D3E52] bg-white border border-[#E2E8F0] rounded-[6px] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] placeholder-[#94A3B8] transition-colors"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                placeholder="••••••••"
                className={`h-[38px] px-[12px] text-[13px] text-[#2D3E52] bg-white border rounded-[6px] focus:outline-none focus:ring-1 placeholder-[#94A3B8] transition-colors
                  ${
                    confirmedPassword && newPassword !== confirmedPassword
                      ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]"
                      : "border-[#E2E8F0] focus:border-[#06B6D4] focus:ring-[#06B6D4]"
                  }`}
              />
              {/* inline mismatch hint */}
              {confirmedPassword && newPassword !== confirmedPassword && (
                <p className="text-[11px] text-[#DC2626]">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-[8px]">
              <button
                onClick={changePassword}
                className="h-[38px] px-[20px] bg-[#06B6D4] hover:bg-[#22D3EE] text-white font-medium text-[13px] rounded-[6px] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2"
              >
                Update Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
