import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import ProductDescription from "../../components/user/ProductDescription";
import PropTypes from "prop-types";
import CartComponent from "../../components/user/CartComponent";
import PortalDrawer from "../../components/PortalDrawer";
import { useCart } from "../../context/CartProvider";
import api from "../../api/config";
import { useQuery } from "@tanstack/react-query";

const StoreBody = ({ className = "", store }) => {
  const [isFrameOpen, setFrameOpen] = useState(false);
  const [viewType, setViewType] = useState("list"); // Default is 'list'

  const openFrame = useCallback(() => setFrameOpen(true), []);
  const closeFrame = useCallback(() => setFrameOpen(false), []);

  const fetchProducts = async (storeURL) => {
    const response = await api.get(`/product/getProducts/${storeURL}`);
    return response.data;
  };

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(store.url),
  });

  const { cartItems, totalPrice, totalQuantity } = useCart();

  console.log("Cart Details", cartItems);

  if (isLoading) {
    <div className={`relative flex flex-col items-center ${className} `}>
      <div className="flex flex-col items-center justify-center py-0 px-5 gap-[27px] mt-12 sm:mt-8">
        <div className="w-full sm:w-[480px] rounded-xl border-gray-300 border-[1px] border-solid box-border flex flex-col items-start justify-center p-5 gap-3">
          <div className="self-stretch flex flex-col items-center justify-center text-base sm:text-lg">
            <div className="self-stretch flex flex-row items-center justify-start">
              <b className="flex-1 tracking-[0.01em] text-h1 text-center sm:text-left">
                Products
              </b>
            </div>
            <div className="self-stretch flex flex-row items-center justify-start text-sm sm:text-base">
              <div className="flex-1 tracking-[0.01em] text-rubik">
                Products
              </div>
            </div>
          </div>

          {isLoading && <p>Loading products...</p>}
        </div>
      </div>
    </div>;
  }

  if (error) {
    {
      error && <p className="text-red-500">{error.message}</p>;
    }
  }



  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Floating Cart Button */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between bg-black text-white px-6 py-3 rounded-[10px] shadow-lg w-[90%] sm:w-[300px]">
        <span className="text-sm sm:text-base">
          Total: Rs {totalPrice.toFixed(2)}
        </span>
        <button
          className="flex-1 text-center font-semibold text-xl sm:text-lg"
          onClick={openFrame}
        >
          Cart
        </button>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm sm:text-base">
          {totalQuantity}
        </span>
      </div>

      {/* Store Content */}
      <div className="flex justify-end w-full px-4 mt-4">
  {/* Grid and List View Buttons */}
  <div className="flex gap-3">
    {/* Grid Button */}
    <button
      className={`flex items-center justify-center w-10 h-10 rounded-full shadow transition ${
        viewType === "grid"
          ? "bg-gray-300 text-white hover:bg-gray-300" // Active Grid button styles
          : "bg-gray-200 hover:bg-gray-300"
      }`}
      aria-label="Grid View"
      onClick={() => setViewType("grid")}
    >
      <img src="/grid-view.svg" className="w-6 h-6" />
    </button>

    {/* List Button */}
    <button
      className={`flex items-center justify-center w-10 h-10 rounded-full shadow transition ${
        viewType === "list"
          ? "bg-gray-300 text-white hover:bg-gray-300" // Active List button styles
          : "bg-gray-200 hover:bg-gray-300"
      }`}
      aria-label="List View"
      onClick={() => setViewType("list")}
    >
      <img src="./list.svg" alt="" className="w-6 h-6" />
    </button>
  </div>
</div>

      <div className="flex flex-col items-center justify-center py-0 px-5 gap-[27px] mt-12 sm:mt-8">
        {/* Conditionally hide this div when grid view is selected */}
        <div
          className={`w-full sm:w-[480px] rounded-xl border-gray-300 border-[1px] border-solid box-border flex flex-col items-start justify-center p-5 gap-3 ${
            viewType === "grid" ? "hidden" : ""
          }`}
        >
          <div className="self-stretch flex flex-col items-center justify-center text-base sm:text-lg">
            <div className="self-stretch flex flex-row items-center justify-start">
              <b className="flex-1 tracking-[0.01em] text-h1 text-center sm:text-left">
                Products
              </b>
            </div>

            {/* Product List (List View) */}
            {viewType === "list" ? (
              <div className="w-full">
                {products?.map((item, index) => (
                  <Link
                    key={index}
                    to={`/product/${item._id}`}
                    className="self-stretch h-auto sm:h-28 flex flex-row items-start justify-start gap-2 cursor-pointer p-2 hover:shadow-md transition"
                  >
                    {/* Product Info */}
                    <div className="flex-1 flex flex-col items-start justify-start gap-1">
                      <div className="text-sm sm:text-base font-medium truncate w-full max-w-[200px]">
                        {item.name}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-500 line-clamp-2">
                        {item.description}
                      </div>

                      <div className="flex items-center gap-2 text-darkgray-300">
                        <div className="line-through text-xs sm:text-sm">
                          Rs {item.price}
                        </div>
                        <b className="text-xs sm:text-sm text-black">
                          Rs {item.calculatedPrice ?? item.price}
                        </b>
                      </div>

                      <div className="text-xs sm:text-sm font-semibold text-red-400">
                        {item.discountRate}% Off
                      </div>
                    </div>

                    {/* Product Image */}
                    <div
                      className="w-[90px] h-20 rounded-md bg-cover bg-center bg-no-repeat sm:w-[120px] sm:h-32"
                      style={{ backgroundImage: `url(${item.images[0]})` }}
                    />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Product Description (Grid View) */}
        {viewType === "grid" && <ProductDescription store={store} />}
      </div>
    </div>
  );
};

StoreBody.propTypes = {
  className: PropTypes.string,
  cartItems: PropTypes.array,
  totalPrice: PropTypes.number,
};

export default StoreBody;
