import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const { VITE_API_URL } = import.meta.env;
function Manager() {
  const [website, setWebsite] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  function generatePassword() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let generatedPassword = "";
    for (let i = 0; i < 12; i++) {
      generatedPassword += chars.charAt(
        Math.floor(Math.random() * chars.length),
      );
    }
    setPassword(generatedPassword);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  async function handleSave() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${VITE_API_URL}/passwords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ website, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Password saved successfully");
        setPassword("");
        setWebsite("");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-rose-700 via-pink-600 to-pink-900">
      <div className="w-4/5 max-w-xl rounded-lg bg-white p-10 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-500">
          Password Manager
        </h1>

        <div className="mb-6">
          <label htmlFor="website" className="mb-1 block font-semibold">
            Website
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Enter website"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="mb-1 block font-semibold">
            Password
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col flex-wrap items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <button
              className="w-full transform rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-blue-700 md:w-auto"
              onClick={generatePassword}
            >
              🔒 Generate Password
            </button>
            <button
              className="w-full transform rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-green-600 md:w-auto"
              onClick={handleSave}
            >
              💾 Save Password
            </button>
          </div>

          <div className="text-center">
            <Link
              className="rounded-lg bg-teal-500 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-teal-600"
              to="/passwords"
            >
              📂 View Saved Passwords
            </Link>
          </div>

          <button
            className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <footer className="absolute bottom-2 text-center text-sm text-gray-400">
        <p>&copy; 2024 Password Manager. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default Manager;
