import React, { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Gift,
  CalendarCheck,
  ShoppingCart,
  Gamepad2,
  Share2,
} from "lucide-react";
import { Switch } from "@mui/material";
import config from "../../api/config";
import { toast } from "sonner";

const Services = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const store = location.state.store;
  const token = localStorage.getItem("token");

  // Services state management
  const [services, setServices] = useState({
    loyalty: store.services.loyalty,
    reservation: store.services.reservation,
    ecommerce: store.services.ecommerce?.status || false,
    games: store.services.games,
    share: store.services.share,
  });

  // Toggle function
  const handleToggle = async (service) => {
    setIsLoading(true);
    const updatedServices = {
      ...services,
      [service]: !services[service],
    };

    try {
      const response = await config.put(
        `/store/editServices/${store._id}`,
        {
          service,
        },
        { headers: { token } }
      );

      if (response.status === 200) {
        setServices(updatedServices); // Update state only if API call is successful
        toast.success("Service updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update service");
    } finally {
      setIsLoading(false);
    }
  };

  // Service list
  const serviceOptions = [
    { key: "loyalty", label: "Loyalty", icon: <Gift />, link: "/loyalty" },
    {
      key: "reservation",
      label: "Reservation",
      icon: <CalendarCheck />,
      link: "/reservation",
    },
    {
      key: "ecommerce",
      label: "E-Commerce",
      icon: <ShoppingCart />,
      link: "/store/services/ecommerce",
    },
    { key: "games", label: "Games", icon: <Gamepad2 />, link: "/games" },
    { key: "share", label: "Share", icon: <Share2 />, link: "/share" },
  ];

  return (
    <div className="p-4 sm:ml-60 mt-4 mr-4 min-h-screen bg-stone-800 text-gray-100 rounded-xl">
      {isLoading && <LoadingSpinner />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-6 h-6 text-emerald-500" />
              <h1 className="text-xl font-semibold text-emerald-500">
                Services
              </h1>
            </div>
            <h1 className="text-xl font-semibold text-emerald-500">
              {store.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-stone-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">
          Manage Store Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceOptions.map(({ key, label, icon, link }) => (
            <div
              key={key}
              className="flex justify-between cursor-pointer items-center bg-stone-600 p-4 rounded-lg shadow-md hover:bg-stone-500 transition"
              onClick={
                key === "ecommerce"
                  ? () => navigate(link, { state: store })
                  : undefined
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">{icon}</span>
                <span className="text-gray-200 text-lg font-medium">
                  {label}
                </span>
              </div>
              <Switch
                checked={services[key]}
                onChange={() => handleToggle(key)}
                color="success"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
