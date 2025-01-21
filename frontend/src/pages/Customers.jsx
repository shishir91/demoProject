import React, { useState } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  return (
    <div className="p-4 sm:ml-64 bg-stone-800 min-h-screen mr-6 mt-7 rounded rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-200">Customers List</h1>
      </div>

      {/* User Table */}
      <div className="bg-[#1E1B1A] rounded-md shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-stone-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-200">ID</th>
              <th className="px-4 py-2 text-left text-gray-200">Name</th>
              <th className="px-4 py-2 text-left text-gray-200">Email</th>
              <th className="px-4 py-2 text-left text-gray-200">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2 text-gray-300">{user._id}</td>
                <td className="px-4 py-2 text-gray-300">{user.email}</td>
                <td className="px-4 py-2 text-gray-300">{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
