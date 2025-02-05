import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoyalityCard from "../components/LoyalityCardComponent";
import LoadingSpinner from "../components/LoadingSpinner";
import image from "/unnamed.jpg";
import api from "../api/config";
import { toast } from "sonner";
import L2 from "../components/L2";
import L1 from "../components/L1";

const CustomizeLoyaltyCard = () => {
  const location = useLocation();
  const store = location.state?.store;
  const token = localStorage.getItem("token");
  const [format, setFormat] = useState(store.loyaltyCard.format);
  const navigate = useNavigate();

  const [imageData, setImageData] = useState();
  const [cardData, setCardData] = useState({
    ...store.loyaltyCard,
    store: store.name,
    logo: store.logo,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();

    // Append each field to the FormData object
    formDataToSend.append("format", format);
    formDataToSend.append("totalShapes", cardData.totalShapes);
    formDataToSend.append("stampColor", cardData.stampColor);
    formDataToSend.append("cardColor", cardData.cardColor);
    formDataToSend.append("textColor", cardData.textColor);
    formDataToSend.append("stamp", cardData.stamp);

    // Append the file (image)
    if (imageData) {
      formDataToSend.append("image", imageData);
    }
    try {
      const response = await api.put(
        `/store/customizeLoyaltyCard?storeId=${store._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,
          
          onAutoClose: () => navigate("/store"),
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
      <div>
        <span>Choose Card Format: </span>
        <select
          onChange={(e) => setFormat(e.target.value)}
          value={format}
          className="flex-1 px-3 py-2 mb-2 text-sm text-stone-300 bg-stone-900 border border-stone-600 rounded-lg"
        >
          <option value="L1">L1</option>
          <option value="L2">L2</option>
        </select>
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="lg:w-1/2 bg-stone-800 p-6 rounded-lg shadow-lg mb-8 lg:mb-0 h-full">
          <h1 className="text-xl font-bold text-green-300 mb-4">
            Customize Your Loyalty Card
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            {format == "L2" && (
              // {/* Number of Stamps */}
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1">
                  Number of Stamps
                </label>
                <div className="flex items-center gap-2">
                  <select
                    type="text"
                    name="totalShapes"
                    value={cardData.totalShapes}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-sm text-stone-300 bg-stone-900 border border-stone-600 rounded-lg"
                  >
                    <option disabled>Select Number of Stamps</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                  </select>
                </div>
              </div>
            )}
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
            {format == "L2" && (
              // {/* Stamp Color */}
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
            )}
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
                <option value="">None</option>
                <option value="coffee" selected>
                  Coffee
                </option>
                <option value="smile">Smile</option>
                <option value="thumbsUp">Thumbs Up</option>
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
                onChange={(e) => {
                  setCardData((prev) => ({
                    ...prev,
                    customStamp: URL.createObjectURL(e.target.files[0]),
                  }));
                  setImageData(e.target.files[0]);
                }}
                className="w-full px-4 py-2 rounded-lg bg-stone-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
            >
              Save
            </button>
          </form>
        </div>
        <div className="lg:w-1/2 bg-stone-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
          <div>
            <h2 className="text-xl font-bold text-green-300 mb-10 text-center">
              Live Preview
            </h2>
            <div>
              {format == "L2" ? <L2 {...cardData} /> : <L1 {...cardData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeLoyaltyCard;
