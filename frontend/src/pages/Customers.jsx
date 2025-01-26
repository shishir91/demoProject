import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { Search } from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
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

  const getCustomers = async (storeId) => {
    setLoading(true);
    try {
      const response = await api.get(`/store/getCustomers/${storeId}`, {
        headers: { token },
      });

      if (response.data.success) {
        setCustomers(response.data.customers);
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
    <div className="p-4 sm:ml-64 bg-stone-800 min-h-screen mr-6 mt-7 rounded rounded-xl">
      {loading && <LoadingSpinner />}
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-200">Customers List</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-gray-400">Store:</div>
          <div className="text-emerald-500">
            <select
              name="store"
              id="store"
              onChange={(e) => getCustomers(e.target.value)}
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
              placeholder="Search by Customer Name"
              className="w-full bg-[#1E1B1A] rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-[#1E1B1A] rounded-md shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-stone-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-200">ID</th>
              <th className="px-4 py-2 text-left text-gray-200">Name</th>
              <th className="px-4 py-2 text-left text-gray-200">Email</th>
              <th className="px-4 py-2 text-left text-gray-200">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2 text-gray-300">{user._id}</td>
                <td className="px-4 py-2 text-gray-300">{user.name}</td>
                <td className="px-4 py-2 text-gray-300">{user.email}</td>
                <td className="px-4 py-2 text-gray-300">{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
