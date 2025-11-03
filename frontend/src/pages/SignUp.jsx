"use client";

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Origami, Check, X } from "lucide-react";
import login from "../assets/login.jpg";
import { UserContext } from "@/context/UserContext";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // ✅ Password validation rules
  const requirements = [
    { label: "At least one lowercase letter", valid: /[a-z]/.test(password) },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "At least one number", valid: /\d/.test(password) },
    { label: "Minimum 8 characters", valid: password.length >= 8 },
  ];

  const isPasswordValid = requirements.every((req) => req.valid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please meet all password requirements before signing up.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        email,
        password,
      });

      const { token, user } = response.data;
      updateUser({ ...user, token });
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* LEFT FORM */}
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center p-8 md:p-12 bg-white relative">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Origami className="h-10 w-10 mx-auto text-blue-700" />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign up for an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Validation */}
            {password && (
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Password must contain:
                </h4>
                <ul className="space-y-1">
                  {requirements.map((req, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 ${
                        req.valid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {req.valid ? <Check size={16} /> : <X size={16} />}
                      <span>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white transition ${
                isPasswordValid
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold underline text-indigo-600 hover:text-indigo-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <img
          src={login}
          alt="Sign Up"
          className="h-screen w-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignUp;
