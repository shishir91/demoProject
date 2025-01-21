import React, { useRef, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/config.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const ref = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ email, password });
    try {
      const response = await api.post("/user/login", { email, password });
      console.log(response);
      if (response.data.success) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response.data.userData)
        );
        localStorage.setItem("token", response.data.token);

        // Dispatch custom event to notify App component
        window.dispatchEvent(new Event("auth-change"));

        // Navigate immediately
        const redirectPath =
          response.data.userData.role === "admin" ? "/dashboard" : "/store";
        navigate(redirectPath);

        // Show toast after navigation
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-10 py-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-10 py-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <p className="text-right text-sm text-gray-500">
            <a href="/" className="text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </p>
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-800 rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
