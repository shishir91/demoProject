import React, { useState } from "react";
import {
  ShoppingBag,
  Mail,
  Users,
  Award,
  ShoppingBasket,
  ChevronRight,
  ChevronDown,
  Crown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Leaderboard } from "@mui/icons-material";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleEcomClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    navigate("/products");
  };

  return (
    <aside
      id="default-sidebar"
      className="fixed top-15 left-0 z-40 w-56 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-stone-800">
        <ul className="space-y-2 font-medium">
          {user.role === "admin" && (
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
              >
                <Users className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="ms-3">Users</span>
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/store"
              className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
            >
              <ShoppingBag className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
              <span className="ms-3">Store</span>
            </Link>
          </li>
          <li>
            <Link
              to="/reward"
              className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
            >
              <Award className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
              <span className="ms-3">Reward</span>
            </Link>
          </li>
          <li>
            <Link
              to="/sms"
              className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
            >
              <Mail className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
              <span className="ms-3">SMS</span>
            </Link>
          </li>
          <li>
            <Link
              to="/customers"
              className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
            >
              <Users className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
              <span className="ms-3">Customers</span>
            </Link>
          </li>
          {/* Leaderboard */}
          <li>
            <Link
              to="/leaderboard"
              className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
            >
              <Leaderboard className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
              <span className="ms-3">Leaderboard</span>
            </Link>
          </li>

          {/* E-Commerce Section */}
          <li>
            <div className="flex hover:bg-gray-700 rounded-lg hover:text-white">
              <button
                onClick={handleEcomClick}
                className="flex w-full p-2 text-white group focus:outline-none"
              >
                <ShoppingBasket className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="ms-3">E-Store</span>
              </button>
              <div
                className="text-gray-400 mt-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {isDropdownOpen ? (
                  <ChevronDown className="transition-transform duration-300 hover:bg-gray-800 rounded-lg" />
                ) : (
                  <ChevronRight className="transition-transform duration-300 hover:bg-gray-800 rounded-lg" />
                )}
              </div>
            </div>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ${
                isDropdownOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              <ul className="pl-8 mt-2 space-y-2">
                {/* <li>
                  <Link
                    to="/products"
                    className="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700"
                  >
                    <span>Products</span>
                  </Link>
                </li> */}
                <li className="relative">
                  <Link
                    to="/orders"
                    className="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 group"
                  >
                    <span>Orders</span>
                    <Crown className="w-3 h-3 text-yellow-400 absolute -top-2 right-0 group-hover:text-yellow-300" />
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
