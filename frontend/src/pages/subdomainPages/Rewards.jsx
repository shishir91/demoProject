import React, { useEffect, useState } from "react";
import { Info, ArrowLeft, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Rewards = () => {
  const [activeTab, setActiveTab] = useState("all");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate("/");
    }
  }, [token]);

  const [selectedReward, setSelectedReward] = useState(null); // State to track the selected reward

  const handleInfoClick = (index) => {
    // Toggle the description display for the clicked reward
    setSelectedReward((prev) => (prev === index ? null : index));
  };

  const rewardsData = [
    {
      points: 5,
      image:
        "data:image/jpeg;base64,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",
      name: "Gift Hampers",
      description: "Suprise Gift Hampers For Lucky Customers",
    },
    {
      points: 5,
      image:
        "data:image/jpeg;base64,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",
      name: "Free Coffee",
      description: "Free Cappuccino For Lucky Customers",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex items-center justify-center ">
        <div className="text-white p-6 w-full max-w-md justify-center bg-white rounded-xl shadow-xl border-3xl my-5">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-3 rounded-lg text-sm font-medium transition-colors
            ${
              activeTab === "all"
                ? "bg-[#275343] text-white"
                : "bg-[#275343]/20 text-teal-500"
            }`}
            >
              All Rewards
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`py-3 rounded-lg text-sm font-medium transition-colors
            ${
              activeTab === "my"
                ? "bg-[#275343] text-white"
                : "bg-[#275343]/20 text-teal-500"
            }`}
            >
              My Rewards
            </button>
          </div>

          {/* Rewards List */}
          {activeTab == "all" ? (
            <div className="space-y-4">
              {rewardsData.map((reward, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl border-3xl"
                >
                  {/* Points Header */}
                  <div className="bg-amber-900 px-4 py-2 flex justify-between items-center">
                    <div className="text-white font-medium flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      {reward.points} Points
                    </div>
                    <button
                      onClick={() => handleInfoClick(index)}
                      className="focus:outline-none"
                    >
                      <Info className="w-5 h-5 text-white/80" />
                    </button>
                  </div>

                  {/* Reward Image */}
                  <div className="aspect-[2/1] relative">
                    <img
                      src={reward.image}
                      alt="Reward"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Footer */}
                  <div className="p-4 flex flex-col">
                    <div className="flex justify-between items-center">
                      <button className="px-6 py-2 rounded-full bg-green-800 text-gray-200 text-sm font-medium">
                        Redeem
                      </button>
                      <span className="text-gray-600 text-sm font-bold">
                        {reward.name}
                      </span>
                    </div>

                    {/* Description */}
                    {selectedReward === index && (
                      <p className="mt-3 text-sm text-gray-500">
                        {reward.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-800 font-bold text-center">
              No Rewards Clamed
            </div>
          )}
          {/* Back Button */}
          <div className="bottom-4 left-4 right-4 my-6">
            <button
              onClick={() => navigate("/loyality")}
              className="w-full bg-green-800 text-teal-200 py-4 rounded-lg flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back To Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
