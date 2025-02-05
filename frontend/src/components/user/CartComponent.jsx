import { useEffect } from "react";
import PropTypes from "prop-types";
import CartProductComponent from "./CartProductComponent";
import { useCart } from "../../context/CartProvider";
import {useNavigate} from "react-router-dom"

const CartComponent = ({ className = "", onClose }) => {
  const { totalPrice,cartItems } = useCart();
  console.log('TotalPrice: ',totalPrice);
  const navigate = useNavigate();

  useEffect(() => {
    const scrollAnimElements = document.querySelectorAll("[data-animate-on-scroll]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-[pulseCircle]");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    scrollAnimElements.forEach((el) => observer.observe(el));

    return () => scrollAnimElements.forEach((el) => observer.unobserve(el));
  }, []);

  const handleCheckout = ()=>{
    console.log("Cart Items: ", cartItems);
    navigate("/product/checkout",{
      state:{
        items:cartItems,
        totalPrice:totalPrice
      }
    })
  }

  return (
    <div
      className={`w-[520px] max-w-[90%] h-full bg-white flex flex-col ${className}`}
      data-animate-on-scroll
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <b className="text-lg font-medium">Cart</b>
        <img className="w-4 h-4 cursor-pointer" alt="close" src="/exit.svg" onClick={onClose} />
      </div>

      {/* Scrollable Cart Products */}
      <div className="flex-1 overflow-y-auto p-4">
        <CartProductComponent />
      </div>

      {/* Checkout Button */}
      <div className="p-4 border-t border-gray-300">
        <button
         onClick={handleCheckout}
         className="w-full bg-darkslategray text-white py-2.5 rounded-lg ">
          <b className="text-sm">Checkout</b>
          <div className="text-sm">Rs {totalPrice.toFixed(2)}</div>
        </button>
      </div>
    </div>
  );
};

CartComponent.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
};

export default CartComponent;
