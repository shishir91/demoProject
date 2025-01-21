import React, { useEffect } from "react";
import "../../components/css/loyalityCard.css";
import {
  ThumbsUp,
  Smile,
  BookmarkPlus,
  Award,
  Star,
  Coffee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import samparka from "/SAMPARKA.png";
import image from "/unnamed.jpg";
// import PointsConfirmation from "./PointConfirmation";
import InstallationGuide from "../../components/InstallationGuide";

const LoyalityCard = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 h-screen">
      {/* Container Div with customizable background color */}
      <div className="p-8 text-white rounded-2xl shadow-lg flex flex-col items-center space-y-6 bg-white">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <div className="w-20 h-20 flex items-center justify-center">
            <img src={image} alt="" />
          </div>

          {/* Title */}
          <h1 className="text-lg font-bold text-gray-700">Your Store Name</h1>
        </div>

        {/* Grid Section */}

        <div className="bg-gray-200 p-8 rounded-3xl shadow-xl">
          <div className="grid grid-cols-4 grid-rows-2 gap-3">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className={`
                relative w-14 h-14 rounded-xl flex items-center justify-center shadow-xl
                ${
                  index < 1
                    ? "bg-green-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    : "bg-green-800/40"
                }
              `}
              >
                <>
                  {/* Glow effect for active stamps */}
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm" />
                  {/* Icon container */}
                  <div className="relative z-10">
                    <Coffee className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                </>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Points */}
        <div className="w-100">
          <div className="flex justify-between">
            <p className="text-gray-700 text-m text-center font-bold left-0 mr-10">
              Service
            </p>
            <p className="text-gray-700 text-m text-center font-bold right-0 ml-10">
              Balance
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 text-sm text-center mr-10">
              Earned Stamps:
            </p>
            <p className="text-gray-700 text-sm text-center ml-10">1</p>
          </div>
        </div>

        {/* Main Text */}
        {/* <p className="text-gray-700 text-lg font-semibold">Add Text</p> */}

        <div className="flex flex-col items-center justify-center text-center">
          {/* View Rewards Button */}
          <button
            onClick={() => {
              console.log("Button Clicked");
              navigate("/rewards");
            }}
            className="flex items-center space-x-2 px-6 py-2 bg-gray-200 hover:bg-gray-400 rounded-lg text-green-100 transition"
          >
            <Award className="w-5 h-5 text-green-800" />
            <span className="text-green-800">View Rewards</span>
          </button>

          {/* Reservation Button */}
          <button
            onClick={() => {
              console.log("Button Clicked");
              navigate("/reservation");
            }}
            className="flex items-center space-x-2 px-6 py-2 mt-3 bg-gray-200 hover:bg-gray-400 rounded-lg text-green-100 transition"
          >
            <BookmarkPlus className="w-5 h-5 text-green-800" />
            <span className="text-green-800">Reservation</span>
          </button>
        </div>

        {/* Footer Text */}
        <a href="https://www.samparka.info/" target="_blank" className="flex">
          <p className="text-gray-700 text-sm text-center mt-1 mr-1">
            Powered By
          </p>
          <img src={samparka} width={100} />
        </a>
      </div>
      <div className="relative">
        {/* Install Banner */}
        <InstallationGuide />
      </div>
    </div>
  );
};

export default LoyalityCard;
