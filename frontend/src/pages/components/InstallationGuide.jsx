import React, { useState, useEffect } from "react";
import { Share, SquarePlus, ChevronRight, Store, X, EllipsisVertical } from "lucide-react";

const InstallationGuide = () => {
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [showGuide, setShowGuide] = useState(true); // State to handle visibility

  useEffect(() => {
    // Check if the user is on an Apple device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod|Macintosh/.test(userAgent) && !window.MSStream) {
      setIsAppleDevice(true);
    }
  }, []);

  // Close the guide
  const handleClose = () => setShowGuide(false);

  if (!showGuide) return null; // If guide is dismissed, don't render it

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 text-gray-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-center flex-1">
          {isAppleDevice
            ? "How to Install this app on iOS"
            : "How to Install this app on Android"}
        </h3>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {isAppleDevice ? (
        // Apple Device Layout
        <div className="flex items-center justify-center space-x-4">
          <div className="flex flex-col items-center text-center">
            <Share className="w-8 h-8 text-gray-500" />
            <p className="text-sm text-gray-600 mt-2">Tap Share</p>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400" />
          <div className="flex flex-col items-center text-center">
            <SquarePlus className="w-8 h-8 text-gray-500" />
            <p className="text-sm text-gray-600 mt-2">Add to Home Screen</p>
          </div>
        </div>
      ) : (
        // Android Device Layout
        <div className="flex items-center justify-center space-x-4">
          <div className="flex flex-col items-center text-center">
            <EllipsisVertical className="w-8 h-8 text-gray-500" />
            <p className="text-sm text-gray-600 mt-2">Tap Menu</p>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400" />
          <div className="flex flex-col items-center text-center">
            <SquarePlus className="w-8 h-8 text-gray-500" />
            <p className="text-sm text-gray-600 mt-2">Add to Home Screen</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallationGuide;
