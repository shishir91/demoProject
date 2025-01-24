import React from "react";
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";

const SetPoints = ({ qrCodeUrl, setPoints, handlePointsChange }) => {
  console.log(qrCodeUrl);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 flex-col md:flex-row">
      {/* Points Selection */}
      <form
        className="flex m-10 w-full md:w-auto justify-center md:justify-start"
        onSubmit={handlePointsChange}
      >
        <input
          type="number"
          min={0}
          placeholder="Enter Points"
          onChange={(e) => setPoints(e.target.value)}
          className="bg-emerald-800 rounded-lg h-10 mr-1 text-gray-300"
        />
        <button
          type="submit"
          className="bg-stone-800 p-2 text-gray-300 rounded-lg ml-1"
        >
          Enter
        </button>
      </form>

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
            Simply scan the code below to earn points and redeem a reward in the
            process.
          </p>
        </div>

        {/* QR Code Section */}
        <div className="p-8 bg-slate-800 text-center">
          <div className="flex justify-center mb-4">
            <QRCode
              className="bg-white p-4 rounded-lg"
              size={256}
              style={{ height: "auto", maxWidth: "50%", width: "50%" }}
              value={qrCodeUrl}
            />
          </div>

          <p className="text-white text-sm mb-4">
            Please use a QR code reader on your device to earn your reward
            points
          </p>

          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <p>
              Need help? Please ask one of our friendly staff and they will be
              happy to assist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPoints;
