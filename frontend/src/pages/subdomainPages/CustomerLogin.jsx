import React, { useEffect, useState } from "react";
import { Mail, User, Phone } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../api/config.js";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import image from "/unnamed.jpg";

const CustomerLogin = (store) => {
  const [formData, setFormData] = useState({
    countryCode: "+977",
    phone: "",
    name: "",
    email: "",
  });
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      navigate("/loyality");
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post(`/customer/register/${store.url}`, {
        ...formData,
      });
      console.log(response);
      if (response.data.success) {
        setLoading(false);
        console.log(response.data);

        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () =>
            navigate("/verification", {
              state: {
                userInfo: JSON.stringify(response.data.customer),
                token: response.data.token,
              },
            }),
        });
      } else {
        setLoading(false);
        toast.error(response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 space-y-6">
      {isLoading && <LoadingSpinner />}
      {<ToastContainer />}
      {/* Logo */}
      <div className="w-20 h-20 flex items-center justify-center">
        <img src={image} alt="" />
      </div>
      {/* Form */}
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Earn Points
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-10 py-2 mt-1 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-10 py-2 mt-1 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Phone Number
            </label>
            <div className="flex items-center space-x-4 mt-2">
              {/* Country Code Dropdown */}
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="px-3 py-2 text-sm border border-gray-400 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white w-1/4"
              >
                <option value="+977">+977 (Nepal)</option>
                <option value="+91">+91 (India)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+1">+1 (US)</option>
              </select>

              {/* Phone Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-10 py-2 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <Phone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-800 rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
