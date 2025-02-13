import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import api from "../api/config";
import { toast } from "sonner";
import ProductFilter from "../components/ProductFilter";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [stores, setStores] = useState([]);
  const [storeURL, setStoreURL] = useState("");
  const [storeId, setStoreId] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response =
          user.role === "admin"
            ? await api.get("/store", { headers: { token } })
            : await api.get("/store/myStores", { headers: { token } });

        if (response.data.success) {
          setStores(response.data.stores);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message, { duration: 2000, theme: "colored" });
      }
    };

    fetchStores();
  }, [token]);

  useEffect(() => {
    if (!storeURL) return;
    const fetchStoreProducts = async () => {
      try {
        const response = await api.get(`/product/getProducts/${storeURL}`, {
          headers: { token },
        });
        
        if (response.data.success) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        }else{
          setProducts([]);
          setFilteredProducts([]);

        }
      } catch (error) {
        console.error(error);
        toast.error(error.message, { duration: 2000 });
      }
    };
    fetchStoreProducts();
  }, [storeURL]);

  useEffect(() => {
    if (filter) {
      const filtered = products.filter((product) =>
        product.category.includes(filter)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [filter, products]);

  const handleSaveDescription = () => {
    // Handle saving the description (e.g., send to API or update store data)
    toast.success("Store description saved!", { duration: 2000 });
  };

  return (
    <div className="p-4 sm:ml-64 bg-stone-800 min-h-screen mr-6 mt-7 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-200">MyEcommerce</h1>
        <div className="w-19">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="text-gray-400">Store:</div>
            <div className="text-emerald-500">
              <select
                onChange={(e) => {
                  const selectedIndex = e.target.selectedIndex;
                  const selectedOption = e.target.options[selectedIndex];
                  setStoreURL(e.target.value);
                  setStoreId(selectedOption.getAttribute("data-id"));
                }}
                className="w-32 px-2 py-2 rounded-lg bg-stone-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option disabled selected>
                  Select Store
                </option>
                {stores.map((store) => (
                  <option value={store.url} key={store._id} data-id={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Store Description */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 mb-4">
          {/* Store Description Form */}
          <textarea
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            placeholder="Add store description..."
            className="w-full p-2 rounded-lg bg-stone-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
            rows="4"
          />

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveDescription}
            className="w-full"
          >
            Save Description
          </Button>
        </div>
      </div>

      {/* Product Filter and Add Products Button */}
      <div className="flex items-center gap-4 mb-6">
        <ProductFilter onFilterChange={setFilter} storeId={storeId} />
        <Link to="/addProducts" className="ml-auto sm:ml-0">
          <Button variant="contained" color="success">
            <span className="hidden sm:block">+ Add Products</span>
            <span className="block sm:hidden">+</span>
          </Button>
        </Link>
      </div>

      {/* Product Cards */}
      <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-64 text-gray-500 text-lg">
            No items found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
