import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { VITE_API_URL } = import.meta.env;
function GenerateOTP() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("username");
  const navigate = useNavigate();

  async function getOtp() {
    try {
      const response = await fetch(`${VITE_API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert("OTP Sent");
        setMode("otp");
      } else {
        console.log(result);
        alert(result.error);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  async function checkOtp() {
    try {
      const response = await fetch(`${VITE_API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert("OTP is verified!");
        setMode("password");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  async function changePassword() {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      const response = await fetch(`${VITE_API_URL}/user/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Password Changed");
        setMode("username");
        navigate("/login");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gray-100 bg-gradient-to-b from-violet-900 via-indigo-800 to-blue-600">
      <div
        id="otp-section"
        className="mx-auto w-4/5 max-w-lg rounded-lg bg-white p-8 shadow-md shadow-purple-600"
      >
        <div className="mb-8 flex w-full rounded-lg text-center text-xs font-semibold text-blue-600 md:text-lg">
          <h2
            className={`w-1/3 rounded-lg py-2 ${mode === "username" ? "bg-blue-600 text-white" : "text-blue-600"}`}
          >
            Username
          </h2>
          <h2
            className={`w-1/3 rounded-lg py-2 ${mode === "otp" ? "bg-blue-600 text-white" : "text-blue-600"}`}
          >
            OTP
          </h2>
          <h2
            className={`w-1/3 rounded-lg py-2 ${mode === "password" ? "bg-blue-600 text-white" : "text-blue-600"}`}
          >
            Password
          </h2>
        </div>
        {mode === "username" && (
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-1 block font-semibold text-gray-800"
            >
              Enter Username
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
          </div>
        )}
        {mode === "otp" && (
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="mb-1 block font-semibold text-gray-800"
            >
              Enter 6 digit OTP
            </label>

            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Your OTP"
            />
          </div>
        )}
        {mode === "password" && (
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1 block font-semibold text-gray-800"
            >
              Enter New Password
            </label>

            <input
              type="password"
              className="mb-4 w-full rounded-md border border-gray-300 p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your new password"
            />
            <label
              htmlFor="confirm-password"
              className="mb-1 block font-semibold text-gray-800"
            >
              Confirm Password
            </label>

            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
        )}

        <button
          className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
          onClick={
            mode == "username"
              ? getOtp
              : mode === "otp"
                ? checkOtp
                : changePassword
          }
        >
          {mode === "username"
            ? "Get OTP"
            : mode === "otp"
              ? "Check OTP"
              : "Change Password"}
        </button>
      </div>
    </main>
  );
}

export default GenerateOTP;
