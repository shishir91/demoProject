import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import api from "../api/config";
import { toast } from "sonner";
import ProductFilter from "../components/ProductFilter";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

export default function Products() {
  const [stores, setStores] = useState([]);
  const [storeURL, setStoreURL] = useState("");
  const [storeId, setStoreId] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [query, setQuery] = useState("");

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
        } else {
          toast.error(response.data.message, { duration: 2000 });
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
  const filteratedProducts = filteredProducts.filter((product) =>
    [product.name].some((field) =>
      field.toLowerCase().includes(query.toLowerCase())
    )
  );
  return (
    <div className="p-4 sm:ml-64 bg-stone-800 min-h-screen mr-6 mt-7 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-200">My E-Store</h1>
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

      <div>
        {storeURL === "" ? (
          <div className="col-span-full flex justify-center items-center h-64 text-gray-500 text-lg">
            Select Your Store
          </div>
        ) : (
          <>
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
                <button
                  className="w-full h-10 bg-green-800 rounded-lg text-gray-200 hover:bg-green-900"
                  onClick={handleSaveDescription}
                >
                  Save Description
                </button>
              </div>
            </div>
            {/* Product Filter and Add Products Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="flex gap-4">
                <ProductFilter onFilterChange={setFilter} storeId={storeId} />
                <Link to="/addProducts" className="ml-auto sm:ml-0 mb-4">
                  <button className="w-full sm:w-auto min-h-10 bg-green-800 p-2 rounded-lg text-gray-200">
                    <span className="block">+ Add Products</span>
                  </button>
                </Link>
              </div>

              <div className="relative flex-1 sm:w-64 mb-3">
                <input
                  type="text"
                  placeholder="Search by Store Name or Location"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-stone-900 text-emerald-400 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* // Product Cards */}
            <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteratedProducts.length > 0 ? (
                filteratedProducts.map((product) => (
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
          </>
        )}
      </div>
    </div>
  );
}
