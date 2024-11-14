import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const { VITE_API_URL } = import.meta.env;
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const response = await fetch(`${VITE_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/manager");
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
        <div id="login-section">
          <h2 className="mb-4 text-center text-3xl font-semibold text-blue-600 md:text-4xl">
            Login
          </h2>
          <div className="mb-4">
            <label
              htmlFor="login-username"
              className="mb-1 block font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              id="login-username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="login-password"
              className="mb-1 block font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              id="login-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="text-md w-full rounded-md bg-blue-600 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-blue-300"
            onClick={handleLogin}
            disabled={!username.trim() || !password.trim()}
          >
            Login
          </button>

          <div className="mt-4 space-y-2 text-center">
            <p className="text-gray-700">
              Don&apos;t have an account?{" "}
              <Link to={"/signup"} className="text-blue-600 hover:underline">
                Signup here
              </Link>
            </p>
            <p>
              <Link to={"/forgot"} className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
