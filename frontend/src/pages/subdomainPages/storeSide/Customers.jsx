import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/config";
import { toast } from "sonner";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Search, UserPlus } from "lucide-react";

const Customers = (state) => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const store = state.store;
  const token = localStorage.getItem("storeToken");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pointsModal, setPointsModal] = useState(false);
  const [points, setPoints] = useState(0);
  const [storeID, setStoreID] = useState("");
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getCustomers(store._id);
    setLoading(false);
  }, [token]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(
        `/store/createCustomer/${store._id}`,
        { ...newCustomer },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 1000,
          onAutoClose: () => window.location.reload(),
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

  const handleGivePoints = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(
        `/store/givePoints/${storeID}`,
        { phone, points },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,
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

  const filteredCustomers = customers.filter((user) =>
    [user.name, user.email, user.phone].some((field) =>
      String(field || "")
        .toLowerCase()
        .includes(query.toLowerCase())
    )
  );
  return (
    <div className="bg-gray-200 pt-7">
      <div className="p-4 sm:ml-64 bg-stone-800 min-h-screen rounded rounded-xl">
        {loading && <LoadingSpinner />}
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-200">Customers List</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div>
              <button
                className="flex gap-2 px-4 py-2 text-sm text-white bg-green-800 rounded-md hover:bg-green-900"
                onClick={() => setIsModalOpen(true)}
              >
                <UserPlus className="w-4 pb-1" />
                Add New Customer
              </button>
            </div>

            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search Name, Email or Phone"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#1E1B1A] text-emerald-400 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-[#1E1B1A] rounded-md shadow-md overflow-x-auto">
          <table className="w-full table-auto min-w-max">
            <thead className="bg-stone-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-200">S.N.</th>
                <th className="px-4 py-2 text-left text-gray-200">Name</th>
                <th className="px-4 py-2 text-left text-gray-200">Email</th>
                <th className="px-4 py-2 text-left text-gray-200">
                  Phone Number
                </th>
                <th className="px-4 py-2 text-left text-gray-200">Points</th>
                <th className="px-4 py-2 text-left text-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((user, index) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-2 text-gray-300">{index + 1}</td>
                    <td className="px-4 py-2 text-gray-300">{user.name}</td>
                    <td className="px-4 py-2 text-gray-300">{user.email}</td>
                    <td className="px-4 py-2 text-gray-300">{user.phone}</td>
                    <td className="px-4 py-2 text-gray-300">{user.points}</td>
                    <td className="px-4 py-2 text-gray-300">
                      <button
                        className="bg-green-800 p-1 px-4 rounded-lg text-white"
                        onClick={() => {
                          setPointsModal(true);
                          setStoreID(user.store);
                          setPhone(user.phone);
                        }}
                      >
                        Give Points
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-2 text-center text-gray-400"
                  >
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for Creating New User */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Create New Customer</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newCustomer.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Giving Points */}
        {pointsModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Give Points</h2>
              <form onSubmit={handleGivePoints}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={phone}
                    disabled
                    required
                    className="w-full px-4 py-2 border rounded-md text-gray-500 focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    name="points"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => setPointsModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
