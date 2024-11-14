import { useCallback, useEffect, useState } from "react";
import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiRecycleFill } from "react-icons/ri";
import { SiCanva } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";

const { VITE_API_URL } = import.meta.env;
export function SavedPasswords() {
  const token = localStorage.getItem("token");
  const [passwords, setPasswords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPasswordId, setCurrentPasswordId] = useState(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [shownPasswords, setShownPasswords] = useState([]);
  const navigate = useNavigate();

  const loadPasswords = useCallback(
    async function () {
      try {
        const response = await fetch(`${VITE_API_URL}/passwords`, {
          method: "GET",
          headers: { Authorization: token },
        });
        const passwordsData = await response.json();
        if (response.ok) {
          setPasswords(passwordsData);
          setShownPasswords([]);
        } else {
          alert(passwordsData.error);
        }
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) navigate("/");
    loadPasswords();
  }, [loadPasswords, token, navigate]);

  function getIcon(website) {
    const lowerCaseWebsite = website.toLowerCase();
    if (lowerCaseWebsite.includes("youtube"))
      return <FaYoutube className="text-red-600" />;
    if (lowerCaseWebsite.includes("facebook"))
      return <FaFacebook className="text-blue-600" />;
    if (lowerCaseWebsite.includes("instagram"))
      return <FaInstagram className="text-pink-600" />;
    if (lowerCaseWebsite.includes("linkedin"))
      return <FaLinkedin className="text-blue-700" />;
    if (lowerCaseWebsite.includes("twitter"))
      return <FaTwitter className="text-blue-400" />;
    if (
      lowerCaseWebsite.includes("email") ||
      lowerCaseWebsite.includes("gmail")
    )
      return <FaEnvelope className="text-red-600" />;
    if (lowerCaseWebsite.includes("canva"))
      return <SiCanva className="text-teal-500" />;
    return <FaGlobe className="text-gray-600" />;
  }

  function openPasswordModal(id) {
    setCurrentPasswordId(id);
    setModalOpen(true);
  }

  async function verifyPassword() {
    try {
      const response = await fetch(`${VITE_API_URL}/verify-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ password: loginPassword }),
      });
      const result = await response.json();

      if (response.ok && result.verified) {
        setShownPasswords((pass) => [...pass, currentPasswordId]);
        setCurrentPasswordId(null);
        setLoginPassword("");
        setModalOpen(false);
      } else {
        alert("Incorrect login password!");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  async function regeneratePassword(id) {
    const loginPass = prompt(
      "Please enter your login password to regenerate this password:",
    );
    if (!loginPass) return;

    try {
      const response = await fetch(`${VITE_API_URL}/passwords/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginPassword: loginPass }),
      });

      if (response.ok) {
        alert("Password regenerated successfully");
        loadPasswords();
      } else {
        alert("Password regeneration failed");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  async function deletePassword(id) {
    try {
      const response = await fetch(`${VITE_API_URL}/passwords/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (response.ok) {
        alert("Password deleted successfully");
        loadPasswords();
      } else {
        alert("Password deletion failed");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-700 via-pink-600 to-pink-900 p-6">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-10 text-center text-3xl font-bold text-blue-500">
          Saved Passwords
        </h1>

        <div id="password-list" className="max-h-[30rem] overflow-auto">
          {passwords.map((p) => (
            <div
              key={p._id}
              className="mb-4 flex flex-col flex-wrap items-center space-y-4 rounded-lg border-l-4 border-blue-600 bg-gray-100 p-4 shadow-sm"
            >
              <div className="flex w-full flex-row flex-wrap items-center justify-between space-x-4">
                <div className="flex items-center">
                  <span className="mr-2">{getIcon(p.website)}</span>
                  <strong>{p.website}</strong>
                </div>
                <span className="password-field" id={`password-${p._id}`}>
                  {shownPasswords.includes(p._id) ? p.password : "••••••••"}
                </span>
                <button
                  onClick={() => openPasswordModal(p._id)}
                  className="mx-auto rounded-md border border-gray-600 px-2 py-1 text-sm font-medium text-gray-600 hover:border-white hover:bg-blue-600 hover:text-white"
                >
                  Show
                </button>
              </div>
              <div className="flex w-4/5 items-center justify-around">
                <button onClick={() => regeneratePassword(p._id)}>
                  <RiRecycleFill className="text-2xl text-green-600 hover:text-green-800" />
                </button>
                <button onClick={() => deletePassword(p._id)}>
                  <MdDelete className="text-2xl text-red-600 hover:text-red-800" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center transition-all duration-200 hover:scale-105">
          <Link to="/manager" className="text-blue-500 hover:text-blue-700">
            ↩️ Go Back
          </Link>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-4/5 max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h5 className="mb-4 text-lg font-bold">Enter Login Password</h5>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your login password"
                className="mb-4 w-full rounded-md border p-2 focus:border-2 focus:border-blue-600 focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setLoginPassword("");
                  }}
                  className="mr-2 rounded bg-gray-500 px-3 py-1 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyPassword}
                  className="rounded bg-blue-500 px-3 py-1 text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
