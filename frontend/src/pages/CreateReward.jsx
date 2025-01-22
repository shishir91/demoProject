import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  FileEdit,
  Mail,
  LayoutDashboard,
  HelpCircle,
  Activity,
  Save,
  Award,
  Calendar,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/config";
import CustomizeRewardTemplate from "../components/rewardComponents/CustomizeRewardTemplate";
import RewardTemplate from "../components/rewardComponents/RewardTemplate";

const CreateReward = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [stores, setStores] = useState([]);
  const [reward, setReward] = useState({});
  const [formData, setFormData] = useState({});
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");
  console.log(location);

  //Customize Template
  const [templateData, setTemplateData] = useState({
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Latte_and_dark_coffee.jpg/1200px-Latte_and_dark_coffee.jpg",
    bgColor: "#111827",
    textColor: "#10B981",
    buttonColor: "#1F2937",
  });

  useEffect(() => {
    if (location.state) {
      setReward(location.state);
    }
  }, [location.state]);
  // Handle updating state dynamically
  const handleUpdate = (field, value) => {
    setTemplateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  //Save Template
  const handleSaveTemplate = async (e) => {
    try {
      const response = await api.put(
        `/reward/editReward/${location.state.store}?rewardId=${reward._id}`,
        { template: { ...templateData } },
        { headers: { token } }
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => navigate("/reward"),
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        autoClose: 1000,
        theme: "colored",
      });
    }
  };

  //Create Reward
  const getStoresAdmin = async () => {
    try {
      const response = await api.get("/store", { headers: { token } });
      if (response.data.success) {
        console.log(response);

        setStores(response.data.stores);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getStoresClient = async () => {
    try {
      const response = await api.get("/store/myStores", { headers: { token } });
      if (response.data.success) {
        console.log(response);

        setStores(response.data.store);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user.role == "admin") {
      getStoresAdmin();
    } else {
      getStoresClient();
    }
  }, []);
  useEffect(() => {
    if (stores.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        store: stores[0]._id,
        evergreen: false,
      }));
    }
  }, [stores]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.expiry === false) {
        setFormData((prev) => ({
          ...prev,
          expiryDate: undefined,
        }));
      }
      const response = await api.post(
        `/reward/createReward?storeId=${formData.store}`,
        { ...formData },
        { headers: { token } }
      );
      console.log(response);
      if (response.data.success) {
        setReward(response.data.reward);
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () =>
            navigate("/reward/createReward/customize", {
              state: { ...response.data.reward },
            }),
        });
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-800 text-gray-300 p-6 sm:ml-64 mt-7 mr-7 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 text-emerald-400 mb-6">
        <div className="flex items-center gap-2 text-emerald-400">
          <PlusCircle size={20} />
          <h1 className="text-xl font-medium">CREATE NEW REWARD</h1>
        </div>
        <button
          onClick={() => navigate("/reward")}
          className="flex items-center gap-2 px-4 py-2 ml-auto bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 rounded-lg"
        >
          <LayoutDashboard size={18} />
          <span>Reward Dashboard</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-700 mb-8">
        <button
          className={`flex items-center gap-2 px-4 py-2 ${
            status === "create"
              ? "border-b-2 border-emerald-400 text-emerald-400"
              : ""
          }`}
        >
          <Award size={18} />
          <span>Reward Details</span>
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 ${
            status === "customize"
              ? "border-b-2 border-emerald-400 text-emerald-400"
              : ""
          }`}
        >
          <FileEdit size={18} />
          <span>Customize Template</span>
        </button>
      </div>

      {/* Create Form */}
      <form>
        {status == "create" && (
          <div className="max-w-4xl space-y-6">
            {/* Store Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-gray-400">Select Store</label>
                <span className="text-red-500">*</span>
                <HelpCircle size={16} className="text-gray-500" />
              </div>
              <select
                onChange={handleChange}
                name="store"
                className="w-full bg-[#2A1F1F] rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                {stores.length > 0 ? (
                  stores.map((store) => (
                    <option value={store._id} key={store._id}>
                      {store.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No stores available</option>
                )}
              </select>
            </div>

            {/* Schedule Reward */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-gray-400">Schedule Reward</label>
                <HelpCircle size={16} className="text-gray-500" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="expiry"
                    required
                    className="w-4 h-4 rounded-full border"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expiry: false,
                      }))
                    }
                  />
                  <span>Never Expire</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="expiry"
                    className="w-4 h-4 rounded-full border"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expiry: true,
                      }))
                    }
                  />
                  <span>Validity</span>
                </label>
              </div>
            </div>
            {/* Expiry Date */}
            {formData.expiry && formData.expiry == true && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-gray-400">Expiry Date</label>
                  <span className="text-red-500">*</span>
                  <HelpCircle size={16} className="text-gray-500" />
                </div>
                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="date"
                    placeholder="Enter Expiry Date"
                    name="expiryDate"
                    onChange={handleChange}
                    required
                    className="w-full bg-[#2A1F1F] rounded-lg pl-10 p-3 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>
            )}

            {/* Reward Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-gray-400">Reward Name</label>
                <span className="text-red-500">*</span>
                <HelpCircle size={16} className="text-gray-500" />
              </div>
              <div className="relative">
                <Award
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Enter Reward Name"
                  name="name"
                  required
                  onChange={handleChange}
                  className="w-full bg-[#2A1F1F] rounded-lg pl-10 p-3 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Reward Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-gray-400">Reward Description</label>
                <HelpCircle size={16} className="text-gray-500" />
              </div>
              <textarea
                placeholder="Reward Description"
                name="description"
                required
                onChange={handleChange}
                className="w-full bg-[#2A1F1F] rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            {/* Customer Redeem Validity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-gray-400">
                  Customer Redeem Validity
                </label>
                <HelpCircle size={16} className="text-gray-500" />
              </div>
              <select
                onChange={handleChange}
                name="validity"
                className="w-full bg-[#2A1F1F] rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                <option selected value="instant">
                  Instant
                </option>
                {Array.from({ length: 365 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Reward Points */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-gray-400">Reward Points</label>
                <span className="text-red-500">*</span>
                <HelpCircle size={16} className="text-gray-500" />
              </div>
              <div className="relative">
                <Activity
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="number"
                  name="points"
                  required
                  onChange={handleChange}
                  placeholder="Enter Reward Points"
                  min={1}
                  className="w-full bg-[#2A1F1F] rounded-lg pl-10 p-3 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Evergreen Mode */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="evergreen"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    evergreen: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded bg-[#2A1F1F] border-gray-500"
              />
              <label className="text-gray-400">Evergreen Mode</label>
              <HelpCircle size={16} className="text-gray-500" />
            </div>

            {/* Save Button */}
            <button
              onClick={handelSubmit}
              className="flex items-center gap-2 bg-[#3A2F2F] text-white px-6 py-2 rounded-lg hover:bg-[#2A1F1F] transition-colors"
            >
              <Save size={18} />
              <span>Save</span>
            </button>
          </div>
        )}
      </form>

      {/* Customize Form */}
      {status == "customize" && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="max-w-lg w-full space-y-6">
            <CustomizeRewardTemplate
              templateData={templateData}
              handleUpdate={handleUpdate}
              handleSubmit={handleSaveTemplate}
            />
          </div>

          {/* Right: Preview */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md">
              <RewardTemplate {...templateData} {...reward} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReward;
