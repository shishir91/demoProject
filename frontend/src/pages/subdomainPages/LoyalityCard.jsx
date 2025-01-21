import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config";
import InstallationGuide from "../../components/InstallationGuide";
import LoyalityCardComponent from "../../components/LoyalityCardComponent";
import { toast } from "react-toastify";

const LoyalityCard = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { pointsId } = useParams();
  const navigate = useNavigate();

  getPoints = async () => {
    try {
      const response = await api.put(`/customer/getPoints/${pointsId}`);
      if (response.data.success) {
        toast.success(response.data.success, {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user && !token) {
      navigate("/");
    }
    getPoints();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="">
        <LoyalityCardComponent />
      </div>
      <div className="relative">
        {/* Install Banner */}
        <InstallationGuide />
      </div>
    </div>
  );
};

export default LoyalityCard;
