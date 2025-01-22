import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoyalityCard from "../components/LoyalityCardComponent";
import LoadingSpinner from "../components/LoadingSpinner";
import image from "/unnamed.jpg";
import api from "../api/config";
import { toast } from "react-toastify";

const CustomizeLoyaltyCard = () => {
  const location = useLocation();
  const store = location.state?.store;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  console.log(store.loyaltyCard);

  const [cardData, setCardData] = useState({
    ...store.loyaltyCard,
    store: store.name,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(
        `/store/editStore?storeId=${store._id}`,
        { loyaltyCard: { ...cardData } },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => navigate("/store"),
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (cardData.logo) URL.revokeObjectURL(cardData.logo);
      if (cardData.customStamp) URL.revokeObjectURL(cardData.customStamp);
    };
  }, []);

  return (
    <div className="p-4 sm:ml-60 text-white min-h-screen">
      {loading && <LoadingSpinner />}
      <h1 className="text-2xl font-bold text-green-300 mb-6">
        STORE: {store.name}
      </h1>
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="lg:w-1/2 bg-stone-800 p-6 rounded-lg shadow-lg mb-8 lg:mb-0 h-full">
          <h1 className="text-xl font-bold text-green-300 mb-4">
            Customize Your Loyalty Card
          </h1>
          <form className="space-y-4">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-stone-400 mb-1">
                Upload Logo
              </label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    logo: URL.createObjectURL(e.target.files[0]),
                  }))
                }
                className="w-full px-4 py-2 rounded-lg bg-stone-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>
            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-stone-400 mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="bgColor"
                  value={cardData.bgColor}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 text-sm text-stone-300 bg-stone-900 border border-stone-600 rounded-lg"
                />
                <input
                  type="color"
                  name="bgColor"
                  value={cardData.bgColor}
                  onChange={handleChange}
                  className="h-10 w-10 rounded-lg bg-stone-900 border border-stone-600"
                />
              </div>
            </div>
            {/* Card Color */}
            <div>
              <label className="block text-sm font-medium text-stone-400 mb-1">
                Card Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="cardColor"
                  value={cardData.cardColor}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 text-sm text-stone-300 bg-stone-900 border border-stone-600 rounded-lg"
                />
                <input
                  type="color"
                  name="cardColor"
                  value={cardData.cardColor}
                  onChange={handleChange}
                  className="h-10 w-10 rounded-lg bg-stone-900 border border-stone-600"
                />
              </div>
            </div>
            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-stone-400 mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="textColor"
                  value={cardData.textColor}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 text-sm text-stone-300 bg-stone-900 border border-stone-600 rounded-lg"
                />
                <input
                  type="color"
                  name="textColor"
                  value={cardData.textColor}
                  onChange={handleChange}
                  className="h-10 w-10 rounded-lg bg-stone-900 border border-stone-600"
                />
              </div>
            </div>
            {/* Stamp Color */}
            <div>
              <label className="block text-sm font-medium text-stone-400 mb-1">
                Stamp Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="stampColor"
                  value={cardData.stampColor}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 text-sm text-stone-300 bg-stone-900 border border-stone-600 rounded-lg"
                />
                <input
                  type="color"
                  name="stampColor"
                  value={cardData.stampColor}
                  onChange={handleChange}
                  className="h-10 w-10 rounded-lg bg-stone-900 border border-stone-600"
                />
              </div>
            </div>
            {/* Stamp Icon */}
            <div>
              <label className="block text-sm font-medium text-stone-400 mb-1">
                Choose Icon
              </label>
              <select
                name="stamp"
                value={cardData.stamp}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-stone-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option value="smile">Smile</option>
                <option value="thumbsUp">Thumbs Up</option>
                <option value="coffee">Coffee</option>
              </select>
            </div>
            {/* Custom Icon */}
            <div>
              <label className="block text-sm font-medium text-stone-400 mb-1">
                Upload Custom Icon
              </label>
              <input
                type="file"
                name="customStamp"
                accept="image/*"
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    customStamp: URL.createObjectURL(e.target.files[0]),
                  }))
                }
                className="w-full px-4 py-2 rounded-lg bg-stone-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
            >
              Save
            </button>
          </form>
        </div>
        <div className="lg:w-1/2 bg-stone-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-green-300 mb-4">
            Live Preview
          </h2>
          <LoyalityCard {...cardData} />
        </div>
      </div>
    </div>
  );
};

export default CustomizeLoyaltyCard;
