import React, { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  PlusCircle,
  EllipsisVertical,
  Trash2,
  Pencil,
  ExternalLink,
  IdCard,
} from "lucide-react";
import Switch from "../components/Switch";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const Store = () => {
  const [stores, setStores] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modelStoreId, setModelStoreId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const getStoresAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/store", { headers: { token } });
      if (response.data.success) {
        console.log(response);

        setStores(response.data.stores);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getStoresClient = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/store/myStores", { headers: { token } });
      if (response.data.success) {
        console.log(response);

        setStores(response.data.stores);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (user.role == "admin") {
      getStoresAdmin();
    } else {
      getStoresClient();
    }
  }, []);

  const handleDeleteStore = async (storeId) => {
    setIsLoading(true);
    try {
      const response = await api.delete(
        `/store/deleteStore?storeId=${storeId}`,
        {
          headers: { token },
        }
      );
      console.log(response);
      if (response.data.success) {
        setShowModal(false);
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => window.location.reload(),
        });
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (e) {
      console.log(e);
      setShowModal(false);
      toast.error(e.message, {
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (storeId, currentStatus) => {
    setIsLoading(true);
    const newStatus = currentStatus === "active" ? "deactive" : "active";

    try {
      const response = await api.put(
        `/store/changeStoreStatus/${storeId}`,
        { status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        setStores((prevStores) =>
          prevStores.map((store) =>
            store._id === storeId ? { ...store, status: newStatus } : store
          )
        );

        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
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
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:ml-60 text-white min-h-screen">
      {isLoading && <LoadingSpinner />}
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-300">
          STORE LIST{" "}
          <span className="text-sm font-normal ml-2">
            Total: {stores ? stores.length : 0}
          </span>
        </h1>
        {user.role == "admin" && (
          <button
            onClick={() => navigate("/addStore")}
            className="flex items-center bg-green-300 text-[#1E1B1A] px-4 py-2 rounded-md hover:bg-green-400"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Store
          </button>
        )}
      </div>

      {/* Store List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores &&
          stores.map((store, index) => (
            <div
              key={index}
              className="bg-[#2A2524] p-4 rounded-lg shadow-md relative"
            >
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <EllipsisVertical
                    className="h-6 w-6 text-gray-500 cursor-pointer"
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === store._id ? null : store._id
                      )
                    }
                  />
                  {dropdownOpen === store._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {/* visit */}
                      <a
                        href={`http://${store.url}.samparka.co/points_distribution`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 hover:rounded-lg flex items-center">
                          <ExternalLink className="h-5 w-5 mr-2 text-gray-500" />
                          Visit
                        </button>
                      </a>
                      {/* edit */}
                      <button
                        onClick={() =>
                          navigate("/editStore", { state: { store } })
                        }
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 flex items-center"
                      >
                        <Pencil className="h-5 w-5 mr-2 text-gray-500" />
                        Edit
                      </button>
                      {/* loyality card */}
                      <button
                        onClick={() =>
                          navigate("/store/loyalityCard", { state: { store } })
                        }
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 flex items-center"
                      >
                        <IdCard className="h-5 w-5 mr-2 text-gray-500" />
                        Loyality Card
                      </button>
                      {user.role == "admin" && (
                        // {/* delete */}
                        <button
                          onClick={() => {
                            setShowModal(true);
                            setModelStoreId(store._id);
                          }}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 hover:rounded-lg flex items-center"
                        >
                          <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-2 text-green-300">
                {store.name}
              </h2>
              <p className="flex items-center text-sm text-gray-400 mb-1">
                <MapPin className="w-4 h-4 mr-2" />
                {store.location}
              </p>
              <p className="flex items-center text-sm text-gray-400 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(store.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              <img
                src={store.logo}
                alt={``}
                className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
              />
              <div className="flex justify-between items-center">
                {/* Action Buttons */}

                <div className="flex items-center">
                  <Switch
                    status={store.status === "active"}
                    onChange={() => handleStatusChange(store._id, store.status)}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Model */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-stone-800 rounded-lg p-6 w-full max-w-lg mx-auto shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Delete Store</h2>
            <p className="text-gray-400 mb-2">
              Are you sure you want to delete this store?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)} // Close modal
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
              >
                No
              </button>
              <button
                onClick={() => handleDeleteStore(modelStoreId)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
