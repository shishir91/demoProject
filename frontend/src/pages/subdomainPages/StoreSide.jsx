import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/config";
import SetPoints from "../../components/storeSide/SetPoints";
import NewCustomer from "../../components/storeSide/NewCustomer";
import { QrCode } from "lucide-react";
import PinInput from "../../components/storeSide/PinInput";
import StoreSidebar from "../../components/storeSide/StoreSidebar";

const StoreSide = (subdomain) => {
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [verified, setVerified] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const newQR = `http://${subdomain.url}.samparka.co/`;

  useEffect(() => {
    setLoading(true);
    getPointsDetail();
    setLoading(false);
  }, []);

  const getPointsDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/store/getPointsDetail/${subdomain.url}`);
      if (response.data.success) {
        setQrCodeUrl(
          `https://${subdomain.url}.samparka.co/loyality/${response.data.points._id}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePointsChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(`/store/changePoints/${subdomain.url}`, {
        points,
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,
          
          onAutoClose: window.location.reload(),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
    try {
      const pinString = pin.join("");
      console.log(pinString);
      const response = await api.post(`/store//verifyPIN/${subdomain.url}`, {
        pin: pinString,
      });
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,
          
          onAutoClose: () => setVerified(true),
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
    }
  };

  if (!verified) {
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
  } else {
    return (
      <div className="sm:ml-56  min-h-screen">
        <StoreSidebar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-200 p-6">
          {loading && <LoadingSpinner />}
          {/* <div className="mb-4">
            <select
              name="new"
              id="new"
              className="bg-gray-400 text-gray-700 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              onChange={(e) => setIsNew(e.target.value)}
            >
              <option value="false">Old</option>
              <option value="true">New</option>
            </select>
          </div> */}

          {/* {isNew === "true" ? (
            <NewCustomer qrCodeUrl={newQR} />
          ) : ( */}
          <SetPoints
            qrCodeUrl={qrCodeUrl}
            setPoints={setPoints}
            handlePointsChange={handlePointsChange}
          />
          {/* )} */}
        </main>
      </div>
    );
  }
};

export default StoreSide;
