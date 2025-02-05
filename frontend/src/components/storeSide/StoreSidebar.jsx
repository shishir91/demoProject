import React, { useState } from "react";
import { Home, UserPlus, Gift, Menu, X } from "lucide-react";

const StoreSidebar = () => {
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
        <div className="text-2xl font-bold text-center py-6">Brand Logo</div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                <Home size={20} />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                <UserPlus size={20} />
                <span>New Customer</span>
              </a>
            </li>
            <li>
              <a
                href="/store/viewRewards"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                <Gift size={20} />
                <span>Rewards</span>
              </a>
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
