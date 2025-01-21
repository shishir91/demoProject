import React from "react";
import { ShoppingBag, Mail, Users, Award } from "lucide-react";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <div>
      <aside
        id="default-sidebar"
        className="fixed top-15 left-0 z-40 w-56 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-stone-800 ">
          <ul className="space-y-2 font-medium">
            {/* Dashboard */}
            {user.role == "admin" && (
              <li>
                <a
                  href="/dashboard"
                  className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                >
                  <Users className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                  <span className="ms-3">Users</span>
                </a>
              </li>
            )}

            {/* Store */}
            <li>
              <a
                href="/store"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
              >
                <ShoppingBag className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="ms-3">Store</span>
              </a>
            </li>

            {/* Reward */}
            <li>
              <a
                href="/reward"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
              >
                <Award className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="ms-3">Reward</span>
              </a>
            </li>

            {/* SMS */}
            <li>
              <a
                href="/sms"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
              >
                <Mail className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">SMS</span>
              </a>
            </li>

            {/* Customers */}
            <li>
              <a
                href="/customers"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
              >
                <Users className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Customers</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
