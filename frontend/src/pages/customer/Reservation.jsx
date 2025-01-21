import React from "react";
import image from "/unnamed.jpg";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Reservation = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-200 p-5">
      {/* Main Container */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Title */}
          <h1 className="text-lg font-bold text-gray-700">Reserve a Table</h1>
        </div>
        {/* Image Upload Section */}
        <div className="relative w-full my-4 h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBIfaw1Ql_CIvr3fYjX2GmcXIihn1GZ4K1yQ&s"
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Table Selection */}
        <div className="mt-6">
          <label
            htmlFor="table-selection"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Select a Table
          </label>
          <select
            id="table-selection"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" selected disabled>
              -- Select a Table --
            </option>
            <option value="table-1">Table 1</option>
            <option value="table-2">Table 2</option>
            <option value="table-3">Table 3</option>
            <option value="table-4">Table 4</option>
          </select>
        </div>

        {/* Date */}
        <div className="mt-6">
          <label
            htmlFor="table-selection"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Select Date and Time
          </label>
          <div className="flex justify-between">
            <input
              type="date"
              name="date"
              id=""
              className="w-1/2 px-4 py-2 mx-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="time"
              name="time"
              id=""
              className="w-1/2 px-4 py-2 mx-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button className="w-full px-4 py-2 text-teal-200 bg-green-800 rounded-lg hover:bg-green-900">
            Reserve
          </button>
        </div>
        {/* Back Button */}
        <div className="my-4">
          <button
            onClick={() => navigate("/loyality")}
            className="w-full bg-green-800 hover:bg-green-900 text-teal-200 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
