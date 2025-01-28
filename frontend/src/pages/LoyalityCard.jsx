import React, { useState, useEffect, useCallback } from "react";
import ViewReward from "../components/ViewReward";
import Reward from "../components/Reward";
import PortalDrawer from "../components/PortalDrawer";
import L1 from "../components/L1";
import L2 from "../components/L2";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../api/config";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const LoyalityCard = (
  store,
  assets = {},
  textConfig = {
    greetingInterval: 2000,
    fontColor: "text-black",
    pointsLabel: "Points",
  },
  navigationPaths = {
    game: "/game",
    reservation: "/reservation",
  },
  cardStyle = {
    bgColor: "bg-seagreen-100",
    borderColor: "border-whitesmoke-100",
  }
) => {
  const greetings = ["Namaste!", "Jwojwolapa!", "Sewaro!", "Tashi Delek!"];
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [cardData, setCardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFrameOpen, setFrameOpen] = useState(false);
  const [greeting, setGreeting] = useState(greetings[0]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate("/");
      return;
    }

    const getCustomerData = async () => {
      try {
        const response = await api.get("/customer", { headers: { token } });
        console.log(response);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        setUser(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const getStore = async () => {
      try {
        const response = await api.get(`/customer/loyaltyCard/${store.url}`, {
          headers: { token },
        });
        console.log(response.data);

        if (response.data.success) {
          setCardData({
            ...response.data.store.loyaltyCard,
            store: response.data.store.name,
            logo: response.data.store.logo,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getStore();
    getCustomerData();
  }, [token]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % greetings.length;
      setGreeting(greetings[index]);
    }, textConfig.greetingInterval);

    return () => clearInterval(interval);
  }, [greetings, textConfig.greetingInterval]);

  const openFrame = useCallback(() => setFrameOpen(true), []);
  const closeFrame = useCallback(() => setFrameOpen(false), []);
  const handleNavigate = useCallback(
    (path) => () => navigate(path),
    [navigate]
  );

  return (
    <div className="mix-h-screen">
      <div
        className={`min-h-screen w-full relative bg-white flex flex-col items-center justify-start pt-6 px-0 pb-[70px] box-border gap-[34px] text-left text-5xl1 ${textConfig.fontColor} font-poppins`}
      >
        {/* Greeting Section */}
        <div className="w-80 flex flex-col items-start justify-start box-border text-center font-rubik font-thin fontSize-mini1">
          <div className="relative tracking-[0.01em] text-black ">
            <span className="font-thin text-3xl">{greeting}</span>
            <span className="font-medium font-Poppins">👋🏼</span>
          </div>
          <div className="relative text-xl tracking-[0.01em] font-semibold font-poppins mt-[-5px] mq350small1:font-poppins mq350small1:text-mini1">
            {user.name}
          </div>
        </div>

        {/* Rewards Component */}
        <ViewReward group1410103762={cardData.logo} vector="/send.svg" />

        {cardData.format == "L1" ? (
          // {/* L1 Component */}
          <L1 {...cardData} points={user?.points || 0} />
        ) : (
          // {/* L2 Component */}
          <L2 {...cardData} points={user?.points || 0} />
        )}
        {/* View Rewards Button */}
        <div className="self-stretch flex flex-row items-center justify-center py-2 px-0 gap-1 text-mini1">
          <div className="w-5 h-5 overflow-hidden shrink-0 flex flex-row items-center justify-center p-px box-border">
            <img
              className="w-4 relative h-[15px]"
              alt="View Rewards Icon"
              src="/vector.svg"
            />
          </div>
          <div
            className="relative tracking-[0.01em] font-medium cursor-pointer mq350small1:text-smi1"
            onClick={openFrame}
          >
            View Rewards
          </div>
          <img
            className="w-5 relative h-5"
            alt="Frame Icon"
            src="/frame-1410103878.svg"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="w-full flex flex-row items-center justify-between py-2 px-0 gap-1 lg1:gap-1">
          <div
            className={`w-[70px] rounded-tl-none rounded-tr-3xs1 rounded-br-3xs1 rounded-bl-none ${cardStyle.bgColor} ${cardStyle.borderColor} border-[1px] border-solid box-border flex flex-row items-center justify-center py-[9px] px-0 cursor-pointer lg1:gap-2.5`}
            onClick={handleNavigate(navigationPaths.game)}
          >
            <img
              className="w-6 relative h-[22px]"
              alt="Game Icon"
              src="/joysticksvgrepocom-1.svg"
            />
          </div>
          <div
            className={`w-[70px] rounded-tl-3xs1 rounded-tr-none rounded-br-none rounded-bl-3xs1 ${cardStyle.bgColor} ${cardStyle.borderColor} border-[1px] border-solid box-border flex flex-row items-center justify-center py-[9px] px-0 cursor-pointer lg1:gap-2.5`}
            onClick={handleNavigate(navigationPaths.reservation)}
          >
            <img
              className="w-6 relative h-[22px]"
              alt="Reservation Icon"
              src="/icon1.svg"
            />
          </div>
        </div>
      </div>

      {/* Reward Modal */}
      {isFrameOpen && (
        <PortalDrawer
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Bottom"
          onOutsideClick={closeFrame}
        >
          <Reward onClose={closeFrame} />
        </PortalDrawer>
      )}
    </div>
  );
};

export default LoyalityCard;
