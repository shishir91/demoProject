import { Settings } from "lucide-react";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/config";

const ConfigSMTP = () => {
  const location = useLocation();
  const store = location.state?.store;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(
        `/store/config/${store._id}`,
        { ...formData },
        { headers: { token } }
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () =>
            navigate("/store/emailSetting", {
              state: { store },
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 sm:ml-60 mt-4 mr-4 h-[500px] bg-stone-800 text-gray-100 rounded rounded-xl">
      {loading && <LoadingSpinner />}
      <div className="ml-5 mt-2">
        <h1 className="text-2xl font-bold text-green-300 mb-2 flex">
          Config SMTP <Settings className="mt-1.5 ml-2" />
        </h1>
        <h2 className="text-xl font-bold text-green-300 mb-4">
          STORE: {store.name}
        </h2>
      </div>
      <div className="flex justify-center mt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-stone-900 p-6 rounded-2xl shadow-2xl w-[400px]"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-stone-800 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
          </div>

          {/* Pass */}
          <div className="relative">
            <label
              htmlFor="pass"
              className="block text-sm font-medium text-gray-200"
            >
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="pass"
                name="pass"
                value={formData.pass}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 bg-stone-800 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigSMTP;
