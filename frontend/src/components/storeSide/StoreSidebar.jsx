import React, { useState } from "react";
import { Home, UserPlus, Gift, Menu, X, Users } from "lucide-react";
import { Link } from "react-router-dom";

const StoreSidebar = (store) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Burger Button (Visible on Small Screens) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-56 h-screen bg-gray-900 text-white transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="text-3xl font-semibold text-center py-6 flex items-center justify-center gap-3">
          <img
            src={store.store.logo}
            alt={store.store.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="text-white text-xl">{store.store.name}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <Link
                to="/store/points"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                <Home size={20} />
                <span>Points</span>
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/store/customers"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                <Users size={20} />
                <span>Customers</span>
              </Link>
            </li>
            <li>
              <Link
                to="/store/viewRewards"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                <Gift size={20} />
                <span>Rewards</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay (for mobile view) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default StoreSidebar;
