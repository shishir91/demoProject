import React, { useState } from "react";
import PropTypes from "prop-types";

const Form = ({ className = "", formData, handleChange, handleSubmit }) => {
  // State for custom dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+977");

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Handle option selection
  const handleCountryCodeSelect = (code) => {
    setSelectedCountryCode(code);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={`self-stretch flex flex-col items-center justify-center py-5 px-0 ${className} overflow-hidden`}
    >
      {/* Curved container with shadow */}
      <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.3)] p-6 w-[320px] sm:w-auto overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="m-0 flex flex-col items-center justify-center gap-2.5"
        >
          <div className="self-stretch relative text-mini1 tracking-[0.01em] font-semibold font-poppins text-black text-center">
            Earn Points
          </div>
          <input
            className="border-gray-200 border-[1px] font-poppins border-solid outline-none bg-transparent self-stretch filter drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)_inset] rounded-6xs1 box-border h-[35px] flex items-center justify-center py-[7px] px-3 text-base1"
            placeholder="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className="border-gray-200 border-[1px] font-poppins border-solid outline-none bg-transparent self-stretch filter drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)_inset] rounded-6xs1 box-border h-[35px] flex items-center justify-center py-[7px] px-3 text-base1"
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="self-stretch flex flex-row items-start justify-start gap-2.5 sm1:self-stretch sm1:w-auto">
            {/* Custom Dropdown */}
            <div className="relative flex-1">
              <div
                className="border-gray-200 border-[1px] font-poppins border-solid rounded-6xs1 bg-transparent h-[35px] flex items-center justify-between py-[7px] px-3 cursor-pointer gap-2 text-base1"
                onClick={toggleDropdown}
              >
                <span className="text-black">{selectedCountryCode}</span>
                <span className="text-black">{isDropdownOpen ? "▲" : "▼"}</span>
              </div>
              {isDropdownOpen && (
                <div className="absolute w-full mt-1 border-gray-400 border-[1px] border-solid rounded-6xs1 bg-white z-10 font-poppins">
                  {["+977", "+91"].map((code, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCountryCodeSelect(code)}
                    >
                      {code}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              className="w-full border-gray-200 border-[1px]  font-poppins border-solid outline-none bg-transparent rounded-6xs1 box-border h-[35px] flex items-center justify-center py-[7px] px-3 text-base1"
              placeholder="Phone No"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer border-whitesmoke-100 border-[1px] border-solid py-[9px] px-0 bg-seagreen-100 w-full rounded-3xs1 box-border h-[39px] flex items-center justify-center"
          >
            <div className="relative text-base1 tracking-[0.01em] leading-[149.7%] font-semibold font-poppins text-white">
              Continue
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

Form.propTypes = {
  className: PropTypes.string,
};

export default Form;
