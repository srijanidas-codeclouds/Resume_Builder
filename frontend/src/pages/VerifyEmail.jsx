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
    const response = await axiosInstance.post(
        API_PATHS.AUTH.VERIFY,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

        console.log(response.data);


        setMessage(response.data.message || "Email verified successfully!");
        setStatus("success");

        if(status === "success"){
          setTimeout(() => navigate("/signin"), 20000);
        }
        // Redirect to login after 20 seconds
        
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
