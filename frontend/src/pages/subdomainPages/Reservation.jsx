// import React from "react";
// import image from "/unnamed.jpg";

// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// const Reservation = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="flex flex-col items-center justify-center min-h-full bg-gray-200 p-5">
//       {/* Main Container */}
//       <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
//         <div className="flex flex-col items-center justify-center text-center">
//           {/* Title */}
//           <h1 className="text-lg font-bold text-gray-700">Reserve a Table</h1>
//         </div>
//         {/* Image Upload Section */}
//         <div className="relative w-full my-4 h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
//           <img
//             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBIfaw1Ql_CIvr3fYjX2GmcXIihn1GZ4K1yQ&s"
//             alt="Uploaded preview"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Table Selection */}
//         <div className="mt-6">
//           <label
//             htmlFor="table-selection"
//             className="block mb-2 text-sm font-medium text-gray-700"
//           >
//             Select a Table
//           </label>
//           <select
//             id="table-selection"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="" selected disabled>
//               -- Select a Table --
//             </option>
//             <option value="table-1">Table 1</option>
//             <option value="table-2">Table 2</option>
//             <option value="table-3">Table 3</option>
//             <option value="table-4">Table 4</option>
//           </select>
//         </div>

//         {/* Date */}
//         <div className="mt-6">
//           <label
//             htmlFor="table-selection"
//             className="block mb-2 text-sm font-medium text-gray-700"
//           >
//             Select Date and Time
//           </label>
//           <div className="flex justify-between">
//             <input
//               type="date"
//               name="date"
//               id=""
//               className="w-1/2 px-4 py-2 mx-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//             <input
//               type="time"
//               name="time"
//               id=""
//               className="w-1/2 px-4 py-2 mx-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="mt-6">
//           <button className="w-full px-4 py-2 text-teal-200 bg-green-800 rounded-lg hover:bg-green-900">
//             Reserve
//           </button>
//         </div>
//         {/* Back Button */}
//         <div className="my-4">
//           <button
//             onClick={() => navigate("/loyality")}
//             className="w-full bg-green-800 hover:bg-green-900 text-teal-200 py-2 rounded-lg flex items-center justify-center gap-2"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Back To Dashboard
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reservation;

import { useState, useCallback } from "react";
import FrameTell from "../../components/FrameTell";
import PortalPopup from "../../components/PortalPopup";
import FrameComponent from "../../components/FrameComponent";
import Myreservation from "../../components/Myreservation";
import PortalDrawer from "../../components/PortalDrawer";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import api from "../../api/config";
import LoadingSpinner from "../../components/LoadingSpinner";
const Reservation = (store) => {
  const [isFrameTellPopupOpen, setFrameTellPopupOpen] = useState(false);
  const [isReservationModalOpen, setReservationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const openFrameTellPopup = useCallback(() => {
    setFrameTellPopupOpen(true);
  }, []);

  const closeFrameTellPopup = useCallback(() => {
    setFrameTellPopupOpen(false);
  }, []);

  const openReservationModal = useCallback(() => {
    setReservationModalOpen(true);
  }, []);

  const closeReservationModal = useCallback(() => {
    setReservationModalOpen(false);
  }, []);

  const onBackSvgrepoComClick = useCallback(() => {
    navigate("/loyality");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post(
        `/customer/reservation/${store.url}`,
        {
          ...formData,
        },
        { headers: { token } }
      );
      if (response.data.success) {
        setLoading(false);

        toast.success(response.data.message, {
          duration: 1000,
          theme: "colored",
          onAutoClose: () => window.location.reload(),
        });
      } else {
        setLoading(false);
        toast.error(response.data.message, {
          duration: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message, {
        duration: 2000,
        theme: "colored",
      });
    }
  };
  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="w-full relative bg-white min-h-screen flex flex-col items-center justify-center pt-[35px] px-0 pb-[30px] box-border gap-[25px] text-center text-base1 text-black font-garet lg1:pt-10 lg1:px-20 lg1:pb-[60px] lg1:box-border md1:pl-10 md1:pr-10 md1:box-border sm1:pl-6 sm1:pr-6 sm1:box-border">
        <div className="w-80 flex flex-col items-center justify-center pt-[11px] px-0 pb-1.5 box-border z-[0]">
          <div className="relative tracking-[0.01em] lg1:text-black font-poppins text-lg">
            Make your
          </div>
          <div className="relative text-base1 tracking-[0.01em] font-semibold font-poppins text-xl">
            Reservation 📆
          </div>
        </div>
        <img
          className="w-[270px] relative h-[195px] object-cover cursor-pointer z-[1]"
          alt="Frame"
          src="/pic.png"
          onClick={openFrameTellPopup}
        />
        <form
          onSubmit={handleSubmit}
          className="m-0 w-[270px] flex flex-col items-center justify-center gap-2.5 z-[2] sm1:self-stretch sm1:w-auto sm1:pl-10 sm1:pr-10 sm1:box-border mq350small1:pl-0 mq350small1:pr-0 mq350small1:box-border"
        >
          <input
            className="border-gray-200 text-base1 font-poppins border-[1px] border-solid [outline:none] bg-[transparent] self-stretch [filter:drop-shadow(0px_0px_2px_rgba(0,_0,_0,_0.25)_inset)] rounded-6xs1 box-border h-[35px] flex flex-row items-center justify-center py-[7px] px-3"
            placeholder="Table No"
            name="tableNumber"
            type="text"
            value={formData.tableNumber}
            onChange={handleChange}
            required
          />
          <input
            className="border-gray-200 text-base1 font-poppins border-[1px] border-solid [outline:none] bg-[transparent] self-stretch [filter:drop-shadow(0px_0px_2px_rgba(0,_0,_0,_0.25)_inset)] rounded-6xs1 box-border h-[35px] flex flex-row items-center justify-center py-[7px] px-3"
            placeholder="No Of Guests"
            name="numberofGuests"
            type="number"
            value={formData.numberofGuests}
            onChange={handleChange}
            required
          />
          <input
            className="border-gray-200 text-base1 font-poppins border-[1px] border-solid [outline:none] bg-[transparent] self-stretch [filter:drop-shadow(0px_0px_2px_rgba(0,_0,_0,_0.25)_inset)] rounded-6xs1 box-border h-[35px] flex flex-row items-center justify-center py-[7px] px-3"
            name="name"
            placeholder="Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="border-gray-200 text-base1 font-poppins border-[1px] border-solid [outline:none] bg-[transparent] w-[270px] flex-1 [filter:drop-shadow(0px_0px_2px_rgba(0,_0,_0,_0.25)_inset)] rounded-6xs1 box-border flex flex-row items-center justify-center py-[7px] px-3 sm1:self-stretch sm1:w-auto"
            placeholder="Phone No"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            className="border-gray-200  text-base1 font-poppins border-[1px] border-solid [outline:none] bg-[transparent] self-stretch [filter:drop-shadow(0px_0px_2px_rgba(0,_0,_0,_0.25)_inset)] rounded-6xs1 box-border h-[35px] flex flex-row items-center justify-center py-[7px] px-3"
            name="date"
            placeholder="Date "
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="cursor-pointer font-poppins border-whitesmoke-100 border-[1px] border-solid py-[9px] px-0 bg-seagreen-100 self-stretch rounded-6xs1 box-border h-[39px] flex flex-row items-end justify-center lg1:gap-2.5"
          >
            <div className="relative text-base1 tracking-[0.01em] leading-[149.7%] font-medium font-poppins text-white text-left">
              Continue
            </div>
          </button>
        </form>
        <div className="self-stretch flex flex-row items-center justify-center py-2 px-0 gap-1 z-[4]">
          <div className="w-[22px] h-[22px] overflow-hidden shrink-0 flex flex-row items-center justify-center p-px box-border">
            <img className="w-6 relative h-[22px]" alt="Icon" src="/icon.svg" />
          </div>
          <button
            className="cursor-pointer [border:none] p-0 bg-[transparent] relative text-smi1 tracking-[0.01em] font-medium font-poppins text-black text-left inline-block"
            onClick={openReservationModal}
          >
            {`View Reservations `}
          </button>
          <img
            className="w-5 relative h-5"
            alt="Frame"
            src="/frame-14101038781.svg"
          />
        </div>
        <button
          className="cursor-pointer [border:none] p-0 bg-[transparent] w-[43px] absolute !m-[0] top-[12px] left-[18px] h-[43px] overflow-hidden shrink-0 z-[5]"
          onClick={onBackSvgrepoComClick}
        >
          <ChevronLeft />
        </button>
        {/* Powered by Samparka */}
        <div className="flex flex-row items-center justify-center gap-2 z-6 text-3xs1 text-darkslategray-100 font-poppins mt-8">
          <a
            href="https://www.samparka.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <p className="text-2xs1 text-center">Powered By</p>
            <img
              src="/SAMPARKA.png"
              alt="Samparka Logo"
              className="w-[80px] object-contain"
            />
          </a>
        </div>
      </div>
      {isFrameTellPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.9)"
          placement="Centered"
          onOutsideClick={closeFrameTellPopup}
        >
          <FrameTell onClose={closeFrameTellPopup} />
        </PortalPopup>
      )}
      {isReservationModalOpen && (
        <PortalDrawer
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Bottom"
          onOutsideClick={closeReservationModal}
        >
          <Myreservation onClose={closeReservationModal} token={token} />
        </PortalDrawer>
      )}
    </>
  );
};

export default Reservation;
