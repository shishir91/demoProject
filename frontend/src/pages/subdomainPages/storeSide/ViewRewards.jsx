import { Award, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../../../components/LoadingSpinner";
import api from "../../../api/config";
import { useNavigate } from "react-router-dom";

const ViewRewards = (subdomain) => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("storeToken");
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/store/login");
    }
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/store/getRedeemedRewards/${subdomain.url}`
        );

        if (response.data.success) {
          setRewards(response.data.redeemedRewards);
        } else {
          toast.error(response.data.message, { duration: 2000 });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const claimReward = async (rewardId) => {
    setLoading(true);
    try {
      const response = await api.put(
        `/store/claimReward/${subdomain.url}?rewardID=${rewardId}`
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 1000,
          onAutoClose: () => window.location.reload(),
        });
      } else {
        toast.error(response.data.message, { duration: 2000 });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter((reward) =>
    [reward.reward.name, reward.customer.name, reward.customer.phone].some(
      (field) =>
        String(field || "")
          .toLowerCase()
          .includes(query.toLowerCase())
    )
  );

  return (
    <div className="bg-gray-200 pt-7">
      {loading && <LoadingSpinner />}
      <div className="bg-stone-800 min-h-screen p-4 sm:ml-64 bg rounded rounded-xl">
        <div className="flex items-center gap-20 text-gray-200 my-2">
          <div className="flex items-center">
            <Award className="w-6 h-6" />
            <h1 className="text-xl font-semibold">REDEEMED REWARD LIST</h1>
          </div>
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search by Reward Name, Customer Name or Phone Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#1E1B1A] text-emerald-400 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
        {/* User Table */}
        <div className="bg-[#1E1B1A] rounded-md shadow-md overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto min-w-max">
              <thead className="bg-stone-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-200 whitespace-nowrap">
                    Reward Name
                  </th>
                  <th className="px-4 py-2 text-left text-gray-200 whitespace-nowrap">
                    Redeemed By
                  </th>
                  <th className="px-4 py-2 text-left text-gray-200 whitespace-nowrap">
                    Phone Number
                  </th>
                  <th className="px-4 py-2 text-left text-gray-200 whitespace-nowrap">
                    Redeemed Date
                  </th>
                  <th className="px-4 py-2 text-left text-gray-200 whitespace-nowrap">
                    Expiry Date
                  </th>
                  <th className="px-4 py-2 text-left text-gray-200 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-gray-200 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRewards.length > 0 ? (
                  filteredRewards.map((reward) => (
                    <tr key={reward._id} className="border-t">
                      <td className="px-4 py-2 text-gray-300">
                        {reward.reward.name}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {reward.customer.name}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {reward.customer.phone}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {
                          new Date(reward.redeemDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {
                          new Date(reward.expiryDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        <span
                          className={`font-semibold ${
                            reward.status === "clamed" ||
                            reward.status === "pending"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {reward.status.charAt(0).toUpperCase() +
                            reward.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-300 flex gap-2">
                        {reward.status === "pending" && (
                          <button
                            onClick={() => claimReward(reward._id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                          >
                            Claimed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-2 text-center text-gray-400"
                    >
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRewards;
