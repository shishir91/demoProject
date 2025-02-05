import PropTypes from "prop-types";
import { useState } from "react";

const AddAddress = ({ className = "", closePopup ,onAddressChange}) => {
    const [address,setAddress] = useState("");
    const handleAddressChange = (e)=>{
        setAddress(e.target.value);
        onAddressChange(e.target.value);
    }
    const handleConfirm = () => {
        closePopup(); // Close the popup when the address is confirmed
    };
  return (
    <div
      className={`w-[350px] relative rounded-6xs bg-white overflow-hidden flex flex-col items-center justify-center py-[25px] px-6 box-border gap-2.5 max-w-full max-h-full text-left text-sm text-black font-poppins ${className}`}
    >
      <img
        className="w-3 absolute !m-[0] top-[19px] left-[323px] h-3 cursor-pointer z-[0]"
        alt=""
        src="/icon2.svg"
        onClick={closePopup}
      />
      <div className="self-stretch rounded-6xs flex flex-col items-center justify-end py-[15px] px-2.5 gap-[13px] z-[1]">
        <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
          <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
            Enter Address
          </div>
          <textarea
            value={address}
            onChange={handleAddressChange}
            placeholder="Type your address here"
          className="border-gray-300 border-[1px] border-solid bg-[transparent] [outline:none] self-stretch rounded-6xs box-border h-[50px]" />
        </div>
        <button 
        onClick={handleConfirm}
        className="cursor-pointer border-black border-[1px] border-solid py-2.5 px-[3px] bg-darkslategray-300 self-stretch rounded-6xs box-border h-auto flex flex-row items-center justify-center max-w-full sm:h-auto sm:rounded-6xs sm:pl-0 sm:pr-0 sm:box-border">
          <div className="flex-1 relative text-sm tracking-[0.01em] font-semibold font-poppins text-black text-center sm:flex-1 sm:text-sm sm:self-stretch sm:h-auto">
            Confirm
          </div>
        </button>
      </div>
    </div>
  );
};

AddAddress.propTypes = {
  className: PropTypes.string,
  closePopup: PropTypes.func,
  onAddressChange: PropTypes.string,
};

export default AddAddress;
