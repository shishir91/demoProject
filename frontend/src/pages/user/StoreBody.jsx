import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductDescription from "../../components/user/ProductDescription";
import PropTypes from "prop-types";
import useFetchProducts from "../../hooks/useFetchProducts";
import CartComponent from "../../components/user/CartComponent";
import PortalDrawer from "../../components/PortalDrawer";
import { useCart } from "../../context/CartProvider";

const StoreBody = ({ className = "" }) => {
  let { storeId } = useParams();
  const [isFrameOpen, setFrameOpen] = useState(false);
  console.log("storeId: ", storeId);
  const openFrame = useCallback(() => setFrameOpen(true), []);
  const closeFrame = useCallback(() => setFrameOpen(false), []);


  const { products, loading, error } = useFetchProducts(storeId);
  const { cartItems, totalPrice, totalQuantity } = useCart();
  console.log("Cart Details", cartItems);

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Floating Cart Button */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between bg-black text-white px-6 py-3 rounded-[10px] shadow-lg w-[300px]">
        <span className="text-smi1">Total: Rs {totalPrice.toFixed(2)}</span>
        <button
          className="flex-1 text-center font-semibold text-xl1"
          onClick={
            // () => navigate("/cart")
            openFrame
          }
        >
          Cart
        </button>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
          {totalQuantity}
        </span>
      </div>

      {/* Store Content */}
      <div className="flex flex-col items-center justify-center py-0 px-5 gap-[27px]">
        <div className="w-[480px] rounded-xl border-gray-300 border-[1px] border-solid box-border flex flex-col items-start justify-center p-5 gap-3">
          <div className="self-stretch flex flex-col items-center justify-center text-base1">
            <div className="self-stretch flex flex-row items-center justify-start">
              <b className="flex-1 tracking-[0.01em] text-h1">Products</b>
            </div>
            <div className="self-stretch flex flex-row items-center justify-start text-smi1">
              <div className="flex-1 tracking-[0.01em] text-rubik">
                Products
              </div>
            </div>
          </div>

          {loading && <p>Loading products...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Product List */}
          {products.map((item, index) => (
            <Link
              key={index}
              to={`/product/${item._id}`}
              className="self-stretch h-28 flex flex-row items-start justify-start gap-2 cursor-pointer p-2 hover:shadow-md transition"
            >
              {/* Product Info */}
              <div className="flex-1 flex flex-col items-start justify-start gap-1">
                <div className="text-base1 font-medium truncate w-full max-w-[200px]">
                  {item.name}
                </div>
                <div className="text-smi1 font-medium text-gray-500 line-clamp-2">
                  {item.description}
                </div>

                <div className="flex items-center gap-2 text-darkgray-300">
                  <div className="line-through text-smi1">Rs {item.price}</div>
                  <b className="text-smi1 text-black">
                    Rs {item.calculatedPrice ?? item.price}
                  </b>
                </div>

                <div className="text-smi1 font-semibold text-red-400">
                  {item.discountRate}% Off
                </div>
              </div>

              {/* Product Image */}
              <div
                className="w-[93px] h-24 rounded-md bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${item.images[0]})` }}
              />
            </Link>
          ))}
        </div>

        {/* More Products Section */}
        <div className="w-full max-w-4xl mx-auto rounded-xl border border-gray-300 p-5 text-base1">
          <div className="text-center">
            <b className="text-xl text-h1">Products</b>
            <p className="text-gray-500 text-sm">Our Latest Products</p>
          </div>
          <div className="mt-5">
            <ProductDescription />
          </div>
        </div>

        {/* Cart Modal */}
        {isFrameOpen && (
          <PortalDrawer
            overlayColor="rgba(113, 113, 113, 0.3)"
            placement="Right"
            onOutsideClick={closeFrame}
          >
            <CartComponent onClose={closeFrame} />
          </PortalDrawer>
        )}
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
