import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductDescription from "../../components/user/ProductDescription";
import PropTypes from "prop-types";
// import useFetchProducts from "../../hooks/useFetchProducts";
import CartComponent from "../../components/user/CartComponent";
import PortalDrawer from "../../components/PortalDrawer";
import { useCart } from "../../context/CartProvider";
import api from "../../api/config";
import { useQuery } from "@tanstack/react-query";

const StoreBody = ({ className = "", store }) => {
  // let { storeId } = useParams();
  console.log("Store:", store);

  const [isFrameOpen, setFrameOpen] = useState(false);
  // console.log("storeId: ", storeId);
  const openFrame = useCallback(() => setFrameOpen(true), []);
  const closeFrame = useCallback(() => setFrameOpen(false), []);

  // const { products, loading, error } = useFetchProducts(store);

  const fetchProducts = async (storeURL) => {
    console.log("Fetch Store; ", storeURL);
    const response = await api.get(`/product/getProducts/${storeURL}`);
    return response.data;
  };

  console.log(`/products/getProducts/${store.url}`);
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


  if(isLoading){
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
    </div>

  }

  if(error){
    {error && <p className="text-red-500">{error.message}</p>}
  }

  if(products){
    return (
      <div className={`relative flex flex-col items-center ${className} `}>
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
  
          
           
  
            {/* Product List */}
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
  
          {/* Cart Modal */}
          {isFrameOpen && (
            <PortalDrawer
              overlayColor="rgba(113, 113, 113, 0.3)"
              placement="right"
              onOutsideClick={closeFrame}
            >
              <CartComponent onClose={closeFrame} />
            </PortalDrawer>
          )}
        </div>
  
        <ProductDescription store={store} />
      </div>
    );
  }

  // return (
  //   <div className={`relative flex flex-col items-center ${className}`}>
  //     {/* Floating Cart Button */}
  //     <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between bg-black text-white px-6 py-3 rounded-[10px] shadow-lg w-[90%] sm:w-[300px]">
  //       <span className="text-sm sm:text-base">
  //         Total: Rs {totalPrice.toFixed(2)}
  //       </span>
  //       <button
  //         className="flex-1 text-center font-semibold text-xl sm:text-lg"
  //         onClick={openFrame}
  //       >
  //         Cart
  //       </button>
  //       <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm sm:text-base">
  //         {totalQuantity}
  //       </span>
  //     </div>

  //     {/* Store Content */}
  //     <div className="flex flex-col items-center justify-center py-0 px-5 gap-[27px] mt-12 sm:mt-8">
  //       <div className="w-full sm:w-[480px] rounded-xl border-gray-300 border-[1px] border-solid box-border flex flex-col items-start justify-center p-5 gap-3">
  //         <div className="self-stretch flex flex-col items-center justify-center text-base sm:text-lg">
  //           <div className="self-stretch flex flex-row items-center justify-start">
  //             <b className="flex-1 tracking-[0.01em] text-h1 text-center sm:text-left">
  //               Products
  //             </b>
  //           </div>
  //           <div className="self-stretch flex flex-row items-center justify-start text-sm sm:text-base">
  //             <div className="flex-1 tracking-[0.01em] text-rubik">
  //               Products
  //             </div>
  //           </div>
  //         </div>

  //         {loading && <p>Loading products...</p>}
  //         {error && <p className="text-red-500">{error.message}</p>}

  //         {/* Product List */}
  //         {products?.map((item, index) => (
  //           <Link
  //             key={index}
  //             to={`/product/${item._id}`}
  //             className="self-stretch h-auto sm:h-28 flex flex-row items-start justify-start gap-2 cursor-pointer p-2 hover:shadow-md transition"
  //           >
  //             {/* Product Info */}
  //             <div className="flex-1 flex flex-col items-start justify-start gap-1">
  //               <div className="text-sm sm:text-base font-medium truncate w-full max-w-[200px]">
  //                 {item.name}
  //               </div>
  //               <div className="text-xs sm:text-sm font-medium text-gray-500 line-clamp-2">
  //                 {item.description}
  //               </div>

  //               <div className="flex items-center gap-2 text-darkgray-300">
  //                 <div className="line-through text-xs sm:text-sm">
  //                   Rs {item.price}
  //                 </div>
  //                 <b className="text-xs sm:text-sm text-black">
  //                   Rs {item.calculatedPrice ?? item.price}
  //                 </b>
  //               </div>

  //               <div className="text-xs sm:text-sm font-semibold text-red-400">
  //                 {item.discountRate}% Off
  //               </div>
  //             </div>

  //             {/* Product Image */}
  //             <div
  //               className="w-[93px] h-24 rounded-md bg-cover bg-center bg-no-repeat sm:w-[120px] sm:h-32"
  //               style={{ backgroundImage: `url(${item.images[0]})` }}
  //             />
  //           </Link>
  //         ))}
  //       </div>

  //       {/* Cart Modal */}
  //       {isFrameOpen && (
  //         <PortalDrawer
  //           overlayColor="rgba(113, 113, 113, 0.3)"
  //           placement="right"
  //           onOutsideClick={closeFrame}
  //         >
  //           <CartComponent onClose={closeFrame} />
  //         </PortalDrawer>
  //       )}
  //     </div>

  //     <ProductDescription store={store} />
  //   </div>
  // );
};

StoreBody.propTypes = {
  className: PropTypes.string,
  cartItems: PropTypes.array,
  totalPrice: PropTypes.number,
};

export default StoreBody;
