import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log("Verifying token:", token);

        const response = await axiosInstance.post("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        });
        console.log("Calling:", `${API_PATHS.AUTH.VERIFY}`);
        console.log("Header:", `Bearer ${token}`);
        console.log(response);


        setMessage(response.data.message || "Email verified successfully!");
        setStatus("success");

        // Redirect to login after 2 seconds
        setTimeout(() => navigate("/signin"), 2000);
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed. Please try again."
        );
      }
    };

    if (token) verifyEmail();
    else {
      setStatus("error");
      setMessage("Invalid verification link");
    }
  }, [token, navigate]);

  return (
    <div className="flex h-screen justify-center items-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
        {status === "loading" && (
          <h2 className="text-lg font-semibold text-gray-600 animate-pulse">
            {message}
          </h2>
        )}
        {status === "success" && (
          <h2 className="text-lg font-semibold text-green-600">{message}</h2>
        )}
        {status === "error" && (
          <h2 className="text-lg font-semibold text-red-600">{message}</h2>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
