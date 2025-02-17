import React, { useState, useEffect } from "react";
import { Switch } from "@mui/material";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "sonner";
import axios from "axios";

const validDeliveryOptions = {
  retail: ["pickUp", "delivery"],
  food: ["dineIn", "delivery", "preOrder"],
  service: ["booking"],
};

const EcommerceConfig = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const store = location.state || {};
  const [deliveryOptions, setDeliveryOptions] = useState(
    store.services?.ecommerce?.deliveryType || []
  );

  // Function to toggle a delivery option
  const handleToggle = async (option) => {
    setLoading(true);
    const updatedOptions = deliveryOptions.includes(option)
      ? deliveryOptions.filter((item) => item !== option)
      : [...deliveryOptions, option];

    setDeliveryOptions(updatedOptions);

    try {
      await axios.put(`/store/editServices/${store.id}`, {
        service: "ecommerce",
        deliveryType: updatedOptions,
      });
      toast.success("Delivery options updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update delivery options");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:ml-60 mt-4 mr-4 min-h-screen bg-stone-800 text-gray-100 rounded-xl">
      {loading && <LoadingSpinner />}

      <h1 className="text-2xl font-semibold text-emerald-500 mb-4">
        E-commerce Configuration
      </h1>

      <div className="bg-stone-700 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-2">Delivery Options</h2>
        {validDeliveryOptions[store.type]?.map((option) => (
          <div
            key={option}
            className="flex justify-between items-center bg-stone-600 p-3 rounded-md mb-2"
          >
            <span className="text-gray-200 capitalize">{option}</span>
            <Switch
              checked={deliveryOptions.includes(option)}
              onChange={() => handleToggle(option)}
              color="success"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EcommerceConfig;
