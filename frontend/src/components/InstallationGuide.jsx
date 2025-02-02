import React from "react";
import {
  Share,
  SquarePlus,
  ChevronRight,
  Store,
  X,
  EllipsisVertical,
} from "lucide-react";
import PropTypes from "prop-types";

const InstallationGuide = ({ showGuide, setShowGuide }) => {
  if (!showGuide) return null; // Don't render if guide is hidden

  // Close the guide
  const handleClose = () => setShowGuide(false);

  // Detect Apple Device
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isAppleDevice =
    /iPad|iPhone|iPod|Macintosh/.test(userAgent) && !window.MSStream;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center relative animate-fadeIn">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-lg font-semibold mb-6">
          {isAppleDevice
            ? "How to Install this App on iOS"
            : "How to Install this App on Android"}
        </h3>

        {isAppleDevice ? (
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center text-center">
              <Share className="w-8 h-8 text-gray-600" />
              <p className="text-sm text-gray-600 mt-2">Tap Share</p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
            <div className="flex flex-col items-center text-center">
              <SquarePlus className="w-8 h-8 text-gray-600" />
              <p className="text-sm text-gray-600 mt-2">Add to Home Screen</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center text-center">
              <EllipsisVertical className="w-8 h-8 text-gray-600" />
              <p className="text-sm text-gray-600 mt-2">Tap Menu</p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
            <div className="flex flex-col items-center text-center">
              <SquarePlus className="w-8 h-8 text-gray-600" />
              <p className="text-sm text-gray-600 mt-2">Add to Home Screen</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

InstallationGuide.propTypes = {
  showGuide: PropTypes.bool.isRequired,
  setShowGuide: PropTypes.func.isRequired,
};

export default InstallationGuide;
