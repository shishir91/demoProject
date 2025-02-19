import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import useFetchSingleProducts from "../../hooks/useFetchSingleProduct";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/config";

const SingleProduct = ({ className = "" }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  // console.log("SingleProduct", productId);

  const fetchSinglelProduct = async (productId) => {
    const response = await api.get(`/product/getProduct/${productId}`);
    return response.data;
  };

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchSinglelProduct(productId),
  });

  // const { product, loading, error } = useFetchSingleProducts(productId);
  const [quantity, setQuantity] = useState(1);

  const onVectorIconClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Slick Carousel settings
  const settings = {
    dots: true, // Show dots
    infinite: true, // Infinite loop
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one image at a time
    slidesToScroll: 1, // Scroll one image at a time
    autoplay: true, // Auto-play the carousel
    autoplaySpeed: 3000, // Set auto-play speed
  };

  // Calculate total price
  const pricePerItem = product?.calculatedPrice || product?.price || 0;
  const totalPrice = pricePerItem * quantity;

  // Handle quantity change
  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (value === "" || (!isNaN(value) && Number(value) > 0)) {
      setQuantity(Number(value));
    }
  };

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Decrease quantity (minimum 1)
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Helper function to open or create IndexedDB
  // Helper function to open or create IndexedDB
  const openDb = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("cartDb", 2);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("cartItems")) {
          const objectStore = db.createObjectStore("cartItems", {
            keyPath: "id", // ✅ Keep keyPath, but REMOVE autoIncrement
          });

          console.log("Object store 'cartItems' created.");
        } else {
          console.log("Object store 'cartItems' already exists.");
        }
      };

      request.onsuccess = (event) => {
        console.log("IndexedDB opened successfully");
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error("Error opening IndexedDB:", event.target.error);
        reject(event.target.error);
      };
    });
  };

  const addToCartDb = async (product, quantity, totalPrice) => {
    try {
      const db = await openDb();

      if (!db.objectStoreNames.contains("cartItems")) {
        console.error("Object store 'cartItems' not found.");
        return;
      }

      const transaction = db.transaction("cartItems", "readwrite");
      const store = transaction.objectStore("cartItems");

      const existingItemRequest = store.get(product._id);

      existingItemRequest.onsuccess = () => {
        const existingItem = existingItemRequest.result;

        if (existingItem) {
          existingItem.productQuantity += quantity;
          existingItem.productTotalPrice += totalPrice;

          const updateRequest = store.put(existingItem);
          updateRequest.onsuccess = () => {
            toast.success("Cart updated successfully!", {
              duration: 1000,
              onAutoClose: () => window.location.reload(),
            });
          };
          updateRequest.onerror = (event) => {
            console.error("Error updating item:", event.target.error);
          };
        } else {
          const newItem = {
            productId: product._id,
            productPrice: product.price,
            productName: product.name,
            productQuantity: quantity,
            productTotalPrice: totalPrice,
            productImage: product.images?.[0] || "",
          };

          console.log("Adding new item:", newItem); // Debugging

          const addRequest = store.add(newItem);
          addRequest.onsuccess = () => {
            toast.success("Item added to cart!", {
              duration: 1000,
              onAutoClose: () => window.location.reload(),
            });
          };
          addRequest.onerror = (event) => {
            console.error("Error adding item:", event.target.error);
          };
        }
      };

      existingItemRequest.onerror = (event) => {
        console.error("Error checking existing item:", event.target.error);
      };

      transaction.oncomplete = () => {
        console.log("Transaction completed");
      };

      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
      };
    } catch (error) {
      console.error("Error interacting with IndexedDB:", error);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    console.log("Add to Cart:");
    console.log("Item Name:", product?.name);
    console.log("Quantity:", quantity);
    console.log("Total Price: Rs", totalPrice);

    addToCartDb(product, quantity, totalPrice);
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    console.log("Buy Now:");
    console.log("Item Name:", product?.name);
    console.log("item per Price",product);
    console.log("Quantity:", quantity);
    console.log("Total Price: Rs", totalPrice);

    navigate("/products/checkout", {
      state: {
        items: [
          {
            productId,
            productImage: product.images[0],
            productName: product.name,
            productQuantity: quantity,
            productPrice:product.calculatedPrice,
            productTotalPrice: totalPrice,
          },
        ],

        totalPrice: totalPrice,
      },
    });
  };

  if (product) {
    return (
      <>
        {/* {console.log("Product", product)} */}

        {product && (
          <div
            className={`flex items-center justify-center w-full h-screen bg-gray-100 ${className} overflow-hidden`}
          >
            <div className="w-full max-w-[440px] h-full bg-white flex flex-col items-center justify-start py-0 px-4 sm:px-[30px] text-left font-poppins overflow-y-auto flex-grow pb-[70px]">
              <button
                className="cursor-pointer border-none py-[15px] px-2.5 bg-transparent self-stretch flex items-center justify-start"
                onClick={onVectorIconClick}
              >
                <img
                  className="w-[11.8px] h-[21px] cursor-pointer"
                  alt="Back"
                  src="/vector4.svg"
                />
              </button>
              <div className="w-full">
                {product.images && product.images.length > 1 ? (
                  <Slider {...settings}>
                    {product.images.map((image, index) => (
                      <div key={index}>
                        <img
                          className="max-w-full h-auto object-cover max-h-[350px]"
                          alt={`${product.name} ${index + 1}`}
                          src={image}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : product.images && product.images.length === 1 ? (
                  <img
                    className="max-w-full h-auto object-cover max-h-[350px]"
                    alt={product.name}
                    src={product.images[0]}
                  />
                ) : (
                  <p className="text-gray-500 text-center">
                    No image available for this product
                  </p>
                )}
              </div>
              <div className="w-full px-[18px] mt-2">
                <div className="text-lg font-medium">{product.name}</div>
                <div
                  className="text-xs text-gray-500 mb-4"
                  style={{
                    maxHeight: "50px", // Set max height for description
                    overflowY: "auto", // Enable scrolling if content exceeds max height
                  }}
                >
                  {product.description}
                </div>

                {/* Price Section */}
                <div className="flex items-center justify-between text-sm mb-4">
                  {/* Discount rate displayed next to the price */}
                  {product.discountRate && (
                    <div className="text-red-500 font-semibold text-lg mr-2">
                      {product.discountRate}% Off
                    </div>
                  )}
                  <div className="flex items-center">
                    <div className="line-through text-red-500 text-xs mr-2">
                      Rs {product.price}
                    </div>
                    <div className="text-lg font-bold">Rs {pricePerItem}</div>
                  </div>
                </div>
              </div>
              {/* Quantity Section */}
              <div className="w-full border-t-[1px] border-b-[1px] border-gray-300 py-4 px-[18px] mt-4 flex justify-between items-center">
                <div className="text-sm font-bold">Quantity</div>
                <div className="flex items-center border border-gray-300 rounded-3xs px-3 py-2">
                  <button
                    className="cursor-pointer text-lg"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="w-10 text-center text-sm mx-2 border-none outline-none bg-transparent"
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                  <button
                    className="cursor-pointer text-lg"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons Section (Add to Cart & Buy Now) */}
              <div className="fixed bottom-0 w-full shadow-lg py-5 px-[18px] flex justify-between space-x-4 z-10 bg-white">
                <button
                  className="w-full py-1.5 bg-gray-800 text-white rounded-md flex justify-center"
                  onClick={() => handleAddToCart()}
                >
                  <b className="text-right">Add</b>
                  <div className="text-left ml-2">Rs {totalPrice}</div>
                </button>
                <button
                  className="w-full py-1.5 bg-green-500 text-white rounded-md flex justify-center"
                  onClick={() => handleBuyNow()}
                >
                  <b className="text-right">Buy Now</b>
                  <div className="text-left ml-2">Rs {totalPrice}</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (error) {
    <p className="text-red-500 text-9xl">Error Encountered</p>;
  }

  if (isLoading) {
    <p className="text-black">loading</p>;
  }
};

SingleProduct.propTypes = {
  className: PropTypes.string,
};

export default SingleProduct;
