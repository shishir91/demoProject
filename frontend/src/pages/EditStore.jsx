import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/config.js";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

const EditStore = () => {
  const location = useLocation();
  const store = location.state.store;
  const [formData, setFormData] = useState(store);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    if (formData.url && /[^a-z0-9.-]/.test(formData.url)) {
      setUrlError("Invalid URL");
    } else {
      setUrlError("");
    }
  }, [formData.url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a new FormData object
    const formDataToSend = new FormData();

    // Append each field to the FormData object
    formDataToSend.append("name", formData.name);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("phone", formData.phone);

    // Append the file (image)
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    try {
      setIsLoading(true);
      const response = await api.put(
        `/store/editStore?storeId=${store._id}`,
        formDataToSend,
        {
          headers: {
            token,
          },
        }
      );
      setIsLoading(false);
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,
          theme: "colored",
          onAutoClose: () => {
            navigate("/store");
          },
        });
      } else {
        toast.error(response.data.message, {
          duration: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting form:", error);
      toast.error(error.message, {
        duration: 2000,
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
              className="mt-1 block w-full px-4 py-2 bg-[#1E1B1A] border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Store Logo */}
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-200"
            >
              Store Logo
            </label>
            <input
              type="file"
              accept="image/*"
              id="image"
              name="image"
              onChange={handleFileChange}
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
            <div className="flex">
              <input
                type="text"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                disabled
                className="cursor-not-allowed mt-1 block w-full px-4 py-2 bg-[#1E1B1A] border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-5 font-semibold">.samparka.co</p>
            </div>
            {!urlError == "" && (
              <span className="flex text-red-700 mt-2">
                <CircleX className="w-5 mr-1" />
                <p>{urlError}</p>
              </span>
            )}
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
