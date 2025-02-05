// import { useEffect } from "react";
// import PropTypes from "prop-types";

// const Myreservation = ({ className = "", onClose }) => {
//   useEffect(() => {
//     const scrollAnimElements = document.querySelectorAll(
//       "[data-animate-on-scroll]"
//     );
//     const observer = new IntersectionObserver(
//       (entries) => {
//         for (const entry of entries) {
//           if (entry.isIntersecting || entry.intersectionRatio > 0) {
//             const targetElement = entry.target;
//             targetElement.classList.add("animate");
//             observer.unobserve(targetElement);
//           }
//         }
//       },
//       {
//         threshold: 0.15,
//       }
//     );
//     for (let i = 0; i < scrollAnimElements.length; i++) {
//       observer.observe(scrollAnimElements[i]);
//     }

//     return () => {
//       for (let i = 0; i < scrollAnimElements.length; i++) {
//         observer.unobserve(scrollAnimElements[i]);
//       }
//     };
//   }, []);
//   return (
//     <div
//       className={`w-full relative flex flex-col items-center justify-center gap-2.5 [&.animate]:animate-[0.25s_ease_0s_1_normal_forwards_slide-in-bottom] opacity-[0] max-h-[90%] overflow-auto text-center text-3xs text-darkslategray font-garet ${className}`}
//       data-animate-on-scroll
//     >
//       <div className="w-[46px] relative rounded bg-white h-[3px]" />
//       <div
//         className="self-stretch rounded-t-2xl rounded-b-none bg-white h-[527px] flex flex-col items-center justify-start pt-7 px-0 pb-[42px] box-border gap-7 [&.animate]:animate-[0.25s_ease_0s_1_normal_forwards_slide-in-bottom] opacity-[0] w-full max-h-[90%] overflow-auto"
//         data-animate-on-scroll
//       >
//         <div className="rounded [background:linear-gradient(90.3deg,_#f5f2ed,_#f4f5f0_52.08%,_#edf5f3,_#edf5f4)] flex flex-row items-center justify-center p-[3px]">
//           <div className="w-[95px] shadow-[0px_4px_10px_rgba(10,_19,_8,_0.12)] rounded bg-white border-white border-[1px] border-solid box-border h-6 flex flex-row items-center justify-center">
//             <div className="flex-1 relative">My Reservations</div>
//           </div>
//         </div>
//         <div className="self-stretch flex flex-row items-center justify-center flex-wrap content-center text-xs-4 text-black font-poppins">
//           <div className="w-[270px] shadow-[0px_4px_12.2px_rgba(0,_0,_0,_0.25)] rounded-3xs bg-white h-[143px] flex flex-col items-center justify-center py-2.5 px-0 box-border gap-2.5">
//             <div className="self-stretch flex flex-row items-center justify-center gap-[3px]">
//               <div className="w-2.5 relative rounded-62xl bg-lime border-whitesmoke-200 border-[1px] border-solid box-border h-2.5" />
//               <div className="flex flex-row items-center justify-center">
//                 <div className="relative font-medium">{`Pending Approval `}</div>
//               </div>
//             </div>
//             <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-2.5 text-left">
//               <div className="self-stretch flex flex-col items-start justify-center py-0 px-3.5 gap-px">
//                 <div className="self-stretch flex flex-row items-center justify-start">
//                   <div className="w-[125.9px] relative font-medium inline-block shrink-0">
//                     #1123
//                   </div>
//                 </div>
//                 <div className="self-stretch flex flex-row items-center justify-start">
//                   <div className="w-[125.9px] relative font-medium inline-block shrink-0">{`Shreeyanch `}</div>
//                 </div>
//                 <div className="self-stretch relative font-montserrat text-darkgray-200">
//                   Table no: A3
//                 </div>
//               </div>
//               <div className="self-stretch h-[34px] flex flex-row items-center justify-center py-0 px-3.5 box-border">
//                 <div className="flex-1 relative">
//                   <span className="font-medium">{`Reservation Date: `}</span>
//                   <span className="font-montserrat text-darkgray-200">
//                     11th Feb 2025
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="rounded [background:linear-gradient(90.3deg,_#f5f2ed,_#f4f5f0_52.08%,_#edf5f3,_#edf5f4)] flex flex-row items-center justify-center p-[3px]">
//           <div className="w-[95px] shadow-[0px_4px_10px_rgba(10,_19,_8,_0.12)] rounded bg-white border-white border-[1px] border-solid box-border h-6 flex flex-row items-center justify-center">
//             <div className="flex-1 relative">My Reservations</div>
//           </div>
//         </div>
//         <div className="self-stretch flex flex-row items-center justify-center flex-wrap content-center text-xs-4 text-black font-poppins">
//           <div className="w-[270px] shadow-[0px_4px_12.2px_rgba(0,_0,_0,_0.25)] rounded-3xs bg-white h-[143px] flex flex-col items-center justify-center py-2.5 px-0 box-border gap-2.5">
//             <div className="self-stretch flex flex-row items-center justify-center gap-[3px]">
//               <div className="w-2.5 relative rounded-62xl bg-lime border-whitesmoke-200 border-[1px] border-solid box-border h-2.5" />
//               <div className="flex flex-row items-center justify-center">
//                 <div className="relative font-medium">{`Pending Approval `}</div>
//               </div>
//             </div>
//             <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-2.5 text-left">
//               <div className="self-stretch flex flex-col items-start justify-center py-0 px-3.5 gap-px">
//                 <div className="self-stretch flex flex-row items-center justify-start">
//                   <div className="w-[125.9px] relative font-medium inline-block shrink-0">
//                     #1123
//                   </div>
//                 </div>
//                 <div className="self-stretch flex flex-row items-center justify-start">
//                   <div className="w-[125.9px] relative font-medium inline-block shrink-0">{`Shreeyanch `}</div>
//                 </div>
//                 <div className="self-stretch relative font-montserrat text-darkgray-200">
//                   Table no: A3
//                 </div>
//               </div>
//               <div className="self-stretch h-[34px] flex flex-row items-center justify-center py-0 px-3.5 box-border">
//                 <div className="flex-1 relative">
//                   <span className="font-medium">{`Reservation Date: `}</span>
//                   <span className="font-montserrat text-darkgray-200">
//                     11th Feb 2025
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="w-[46px] relative rounded bg-white h-[3px]" />
//     </div>
//   );
// };

// Myreservation.propTypes = {
//   className: PropTypes.string,
//   onClose: PropTypes.func,
// };

// export default Myreservation;

import { useState, useCallback, useEffect } from "react";
import Description from "./Description";
import PortalPopup from "./PortalPopup";
import PropTypes from "prop-types";
import ReservationDetails from "./ReservationDetails";
import api from "../api/config";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";

const MyReservation = ({ className = "", onClose, token }) => {
  const [isDescriptionPopupOpen, setDescriptionPopupOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const openDescriptionPopup = useCallback(() => {
    setDescriptionPopupOpen(true);
  }, []);

  const closeDescriptionPopup = useCallback(() => {
    setDescriptionPopupOpen(false);
  }, []);

  const getMyReservations = async () => {
    try {
      const response = await api.get("/customer/getReservations", {
        headers: { token },
      });
      if (response.data.success) {
        setReservations(response.data.reservations);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        duration: 2000,
        
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyReservations();
    const scrollAnimElements = document.querySelectorAll(
      "[data-animate-on-scroll]"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const targetElement = entry.target;
            targetElement.classList.add("animate");
            observer.unobserve(targetElement);
          }
        }
      },
      {
        threshold: 0.15,
      }
    );
    for (let i = 0; i < scrollAnimElements.length; i++) {
      observer.observe(scrollAnimElements[i]);
    }

    return () => {
      for (let i = 0; i < scrollAnimElements.length; i++) {
        observer.unobserve(scrollAnimElements[i]);
      }
    };
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      <div
        className={`w-full relative flex flex-col items-center justify-center gap-2.5 max-h-[90%] overflow-auto text-center text-3xs1 text-darkslategray font-poppins font-medium ${className}`}
      >
        <div className="w-[46px] relative rounded bg-white h-[3px]" />
        <div className="self-stretch rounded-t-xl1 rounded-b-none bg-white h-[527px] flex flex-col items-center justify-start pt-7 px-0 pb-[42px] box-border gap-7 w-full max-h-[100%] overflow-auto">
          {/* My Reservation Header */}
          <div className="rounded bg-gradient-to-r from-[#f5f2ed] via-[#f4f5f0] to-[#edf5f3] flex flex-row items-center justify-center p-[3px]">
            {/* Rewards Button */}
            <div className="w-[84px] h-[25px] flex flex-row items-center justify-center bg-white shadow-[0px_4px_10px_rgba(10,_19,_8,_0.12)] text-darkslategray">
              <div className="flex-1 relative tracking-[-0.02em]">
                My Reservation
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-center justify-center flex-wrap content-center gap-[53px] text-left text-xs-4 text-black font-poppins">
            {reservations.length > 0 ? (
              reservations.map((reservation, index) => (
                <div
                  key={index}
                  className="w-[270px] shadow-[0px_4px_12.2px_rgba(0,_0,_0,_0.25)] rounded-3xs1 bg-white h-58 flex flex-col items-center justify-start py-4 px-4 box-border relative gap-2.5"
                >
                  {/* Status */}
                  <div className="self-stretch flex flex-row items-center justify-center gap-[3px]">
                    <div className="w-2.5 relative rounded-62xl1 bg-lime border-whitesmoke-200 border-[1px] border-solid box-border h-2.5" />
                    <div className="flex flex-row items-center justify-center">
                      <div className="relative font-medium">
                        Pending Approval
                      </div>
                    </div>
                  </div>

                  {/* Reservation Details */}
                  <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-2.5 text-left">
                    <div className="self-stretch flex flex-col items-start justify-center py-0 px-3.5 gap-px">
                      <div className="self-stretch flex flex-row items-center justify-start">
                        <div className="w-[125.9px] relative font-medium inline-block shrink-0">
                          #1123
                        </div>
                      </div>
                      <div className="self-stretch flex flex-row items-center justify-start">
                        <div className="w-[125.9px] relative font-medium inline-block shrink-0">
                          Table No: {reservation.tableNumber}
                        </div>
                      </div>
                      <div className="self-stretch relative font-montserrat text-darkgray-200">
                        <p className="m-0">
                          <span className="font-medium">
                            Reservation Date:{" "}
                          </span>
                          <span className="font-montserrat text-darkgray-200">
                            {new Date(reservation.date).toLocaleDateString()}{" "}
                            {/* Format Date */}
                          </span>
                        </p>
                        <p className="m-0">
                          <span className="font-medium">
                            Reservation Time:{" "}
                          </span>
                          <span className="font-montserrat text-darkgray-200">
                            {new Date(reservation.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}{" "}
                            {/* Format Time */}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-[270px] shadow-[0px_4px_12.2px_rgba(0,_0,_0,_0.25)] rounded-3xs1 bg-white h-58 flex flex-col items-center justify-start py-4 px-4 box-border relative gap-2.5">
                No Reservations
              </div>
            )}
          </div>
          ;
        </div>
      </div>
      {isDescriptionPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeDescriptionPopup}
        >
          <Description onClose={closeDescriptionPopup} />
        </PortalPopup>
      )}
    </>
  );
};

MyReservation.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
};

export default MyReservation;
