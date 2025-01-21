import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/config.js";
import { toast } from "react-toastify";

const EditStore = () => {
  const location = useLocation();
  const store = location.state.store;
  const [formData, setFormData] = useState(store);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      setIsLoading(true);
      const response = await api.put(
        `/store/editStore?storeId=${store._id}`,
        formData,
        {
          headers: {
            token,
          },
        }
      );
      setIsLoading(false);
      console.log("Response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => {
            navigate("/store");
          },
        });
      } else {
        toast.error(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting form:", error);
      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="p-4 sm:ml-60 bg-[#1E1B1A] text-white min-h-screen flex justify-center">
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Edit Store</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-stone-800 p-6 rounded-lg shadow-md "
        >
          {/* Store Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200"
            >
              Store Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-[#1E1B1A] border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-200"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-[#1E1B1A] border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-200"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-[#1E1B1A] border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* URL */}
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-200"
            >
              Store URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              disabled
              className="mt-1 block w-full px-4 py-2 bg-[#1E1B1A] border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Edit Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStore;
