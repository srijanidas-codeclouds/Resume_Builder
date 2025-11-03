import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("loading");
  const [countdown, setCountdown] = useState(10); // seconds until redirect

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axiosInstance.post(
          API_PATHS.AUTH.VERIFY,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setMessage(response.data.message || "Email verified successfully!");
        setStatus("success");
      } catch (error) {
        console.error("Verification failed:", error);
        setMessage(
          error.response?.data?.message ||
            "Verification failed. Please try again or request a new link."
        );
        setStatus("error");
      }
    };

    if (token) verifyEmail();
    else {
      setStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [token]);

  // ⏳ Start redirect timer when verification succeeds
  useEffect(() => {
    if (status === "success") {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate("/signin");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, navigate]);

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl w-full max-w-md transition-all duration-300">
        {/* Dynamic Icon */}
        <div className="flex justify-center mb-4">
          {status === "loading" && (
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle className="h-12 w-12 text-green-500 animate-bounce" />
          )}
          {status === "error" && (
            <XCircle className="h-12 w-12 text-red-500 animate-pulse" />
          )}
        </div>

        {/* Message */}
        <h2
          className={`text-lg font-semibold ${
            status === "loading"
              ? "text-gray-700"
              : status === "success"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </h2>

        {/* Countdown redirect message */}
        {status === "success" && (
          <p className="mt-2 text-sm text-gray-500">
            Redirecting to sign in in {countdown} seconds...
          </p>
        )}

        {/* Manual back to sign-in */}
        {status !== "loading" && (
          <button
            onClick={() => navigate("/signin")}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-500 transition"
          >
            Go to Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
