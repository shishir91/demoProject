import React, { useEffect, useState } from "react";
import api from "../../api/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CircleX } from "lucide-react";

const AddStore = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [urlError, setUrlError] = useState("");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.url && /[^a-z0-9.-]/.test(formData.url)) {
      setUrlError("Invalid URL");
    } else {
      setUrlError("");
    }
  }, [formData.url]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get("/admin/getUsers", {
          headers: { token },
        });
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, []);

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
    setLoading(true);
    e.preventDefault();

    // Create a new FormData object
    const formDataToSend = new FormData();

    // Append each field to the FormData object
    formDataToSend.append("name", formData.name);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("url", formData.url);
    formDataToSend.append("user", formData.user);

    // Append the file (image)
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await api.post("/store/addStore", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      console.log(response);

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

  return (
    <div className="p-4 sm:ml-60 bg-[#1E1B1A] text-white min-h-screen flex justify-center">
      {loading && <LoadingSpinner />}
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Add New Store</h2>
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
              // required
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
                required
                className="mt-1 block w-full px-4 py-2 bg-[#1E1B1A] border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          {/* Assign User */}
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-200"
            >
              Assign User
            </label>
            <select
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-[#1E1B1A] border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select User</option>
              {users.length > 0 ? (
                users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))
              ) : (
                <option disabled>No users available</option>
              )}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
