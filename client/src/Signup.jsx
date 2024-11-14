import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const { VITE_API_URL } = import.meta.env;
function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignup() {
    try {
      const response = await fetch(`${VITE_API_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! You can now login.");
        navigate("/login");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gray-100 bg-gradient-to-b from-violet-900 via-indigo-800 to-blue-600">
      <div className="mx-auto w-4/5 max-w-lg rounded-lg bg-white p-8 shadow-md shadow-purple-600">
        <div id="signup-section">
          <h2 className="mb-4 text-center text-3xl font-semibold text-blue-600 md:text-4xl">
            SignUp
          </h2>
          <div className="mb-4">
            <label
              htmlFor="signup-username"
              className="mb-1 block font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              id="signup-username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="signup-email"
              className="mb-1 block font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              id="signup-email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="signup-password"
              className="mb-1 block font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              id="signup-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full rounded-md bg-green-600 py-2 font-bold text-white transition-colors duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-green-300"
            onClick={handleSignup}
            disabled={!username.trim() || !password.trim() || !email.trim()}
          >
            Signup
          </button>

          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signup;
