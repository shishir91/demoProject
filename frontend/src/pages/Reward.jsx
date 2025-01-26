import React, { useEffect, useState } from "react";
import { Search, Settings, Plus, MoreVertical, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const Reward = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [rewards, setRewards] = useState([]);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  // Fetch stores based on user role
  const getStoresAdmin = async () => {
    try {
      const response = await api.get("/store", { headers: { token } });
      if (response.data.success) {
        setStores(response.data.stores);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const getStoresClient = async () => {
    try {
      const response = await api.get("/store/myStores", { headers: { token } });

      if (response.data.success) {
        setStores(response.data.stores);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const fetchData = async () => {
    try {
      if (user.role === "admin") {
        await getStoresAdmin();
      } else {
        await getStoresClient();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const getRewards = async (storeId) => {
    setLoading(true);
    try {
      const response = await api.get(`/reward/getRewards/${storeId}`, {
        headers: { token },
      });

      if (response.data.success) {
        setRewards(response.data.rewards);
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, [token]);

  return (
    <div className="p-4 sm:ml-60 mt-4 mr-4 min-h-screen bg-stone-800 text-gray-100 rounded rounded-xl">
      {loading && <LoadingSpinner />}
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6" />
            <h1 className="text-xl font-semibold text-emerald-500">
              REWARD LIST
            </h1>
          </div>
          <div className="bg-emerald-500/20 px-3 py-1 rounded-full">
            <span className="text-emerald-500">
              Total: {rewards ? rewards.length : 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-gray-400">Store:</div>
          <div className="text-emerald-500">
            <select
              name="store"
              id="store"
              onChange={(e) => getRewards(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-stone-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
            >
              <option disabled selected>
                Select Store
              </option>
              {stores &&
                stores.map((store) => (
                  <option value={store._id} key={store._id}>
                    {store.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search by Reward Name"
              className="w-full bg-[#1E1B1A] rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Reward Card */}
        <div
          onClick={() => navigate("/reward/createReward/create")}
          className="bg-[#1E1B1A] p-6 rounded-lg flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-stone-900 shadow-lg"
        >
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-4">
            <Plus size={24} className="text-gray-800" />
          </div>
          <span className="text-gray-400">Create New Reward</span>
        </div>

        {/* Reward Cards */}
        {rewards &&
          rewards.map((reward, index) => (
            <div
              key={index}
              className="bg-stone-900 p-4 rounded-lg relative shadow-lg"
            >
              <div className="absolute top-4 right-4">
                <button className="bg-emerald-500 text-emerald-900 px-3 py-1 rounded-lg text-sm hover:bg-emerald-500/70 transition-colors flex items-center gap-1">
                  Actions
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="w-full mx-auto">
                <img
                  src={reward.template.image}
                  alt="Coffee Shop Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-4 text-center">{reward.name}</div>
              {/* <div className="absolute bottom-4 right-4">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
            </div> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Reward;
