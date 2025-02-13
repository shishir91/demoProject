import React, { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import api from "../api/config";
import { toast } from "react-toastify";

const ProductFilter = ({ onFilterChange, storeId }) => {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (storeId) {
      const fetchCategoryOptions = async () => {
        try {
          const response = await api.get(`/product/getCategory/${storeId}`, {
            headers: { token },
          });
          if (response.data && response.data.length > 0) {
            setCategories(response.data[0].name);
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message, { autoClose: 2000, theme: "colored" });
        }
      };
      fetchCategoryOptions();
    }
  }, [storeId]);
  const handleFilterChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    onFilterChange(event.target.value);
  };
  return (
    <div className="flex items-center gap-4 w-full md:w-auto mb-4">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded"
        onClick={() => alert("Filter Options")}
      >
        <Filter />
      </button>
      <select
        value={selectedCategory}
        onChange={handleFilterChange}
        className="w-full px-2 py-2 rounded-lg bg-stone-900 text-emerald-500 border border-gray-700"
      >
        <option value="">Select Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
        
      </select>
    </div>
  );
};

export default ProductFilter;
