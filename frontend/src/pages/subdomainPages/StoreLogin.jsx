import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import PinInput from "../../components/storeSide/PinInput";
import { QrCode } from "lucide-react";
import { toast } from "sonner";
import api from "../../api/config";
import { useNavigate } from "react-router-dom";

const StoreLogin = (subdomain) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setIsLoading] = useState(false);
  const token = localStorage.getItem("storeToken");
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (token) {
      navigate("/store/points");
    }
  }, [token]);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus(); // Move to next field
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus(); // Move back on delete
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      const pinString = pin.join("");
      console.log(pinString);
      const response = await api.post(`/store/verifyPIN/${subdomain.url}`, {
        pin: pinString,
      });
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("storeToken", response.data.token);
        toast.success(response.data.message, {
          duration: 1000,
          onAutoClose: () => navigate("/store/points"),
        });
      } else {
        toast.error(response.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-200">
      {loading && <LoadingSpinner />}
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 flex-col md:flex-row">
        {/* Main */}
        <div className="max-w-md w-full bg-white rounded-lg overflow-hidden shadow-xl flex-grow md:max-w-lg">
          {/* Header Section */}
          <div className="bg-emerald-500 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-300 p-2 rounded-lg">
                <QrCode className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              SCAN TO REDEEM A REWARD
            </h2>
            <p className="text-white text-sm">
              Simply scan the code below to earn points and redeem a reward in
              the process.
            </p>
          </div>

          {/* PIN Code Section */}
          <div className="p-8 bg-slate-800 text-center">
            <p className="text-white text-sm mb-4">
              Please enter the 4 digit PIN code to proceed.
            </p>
            <PinInput
              pin={pin}
              handleChange={handleChange}
              handleKeyDown={handleKeyDown}
              handleSubmit={handleSubmit}
              inputRefs={inputRefs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLogin;
