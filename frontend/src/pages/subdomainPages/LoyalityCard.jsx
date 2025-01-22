import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import api from "../../api/config";
import InstallationGuide from "../../components/InstallationGuide";
import LoyalityCardComponent from "../../components/LoyalityCardComponent";
import { toast } from "react-toastify";

const LoyalityCard = (store) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [cardData, setCardData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate("/");
    }
    const getStore = async () => {
      try {
        const response = await api.get(`/customer/loyaltyCard/${store.url}`, {
          headers: { token },
        });
        if (response.data.success) {
          setCardData(response.data.cardData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getStore();
  }, [token]);

  return (
    <div>
      <div className="">
        <LoyalityCardComponent {...cardData} points={user.points} />
      </div>
      <div className="relative">
        {/* Install Banner */}
        <InstallationGuide />
      </div>
      <Outlet />
    </div>
  );
};

export default LoyalityCard;
