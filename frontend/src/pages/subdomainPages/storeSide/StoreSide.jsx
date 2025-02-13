import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../../../components/LoadingSpinner";
import api from "../../../api/config";
import SetPoints from "../../../components/storeSide/SetPoints";
import NewCustomer from "../../../components/storeSide/NewCustomer";
import StoreSidebar from "../../../components/storeSide/StoreSidebar";
import { useNavigate } from "react-router-dom";

const StoreSide = (subdomain) => {
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isNew, setIsNew] = useState(false);
  const token = localStorage.getItem("storeToken");
  const navigate = useNavigate();

  const newQR = `http://${subdomain.url}.samparka.co/`;

  useEffect(() => {
    if (!token) {
      navigate("/store/login");
    }
    setLoading(true);
    getPointsDetail();
    setLoading(false);
  }, []);

  const getPointsDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/store/getPointsDetail/${subdomain.url}`);
      if (response.data.success) {
        setQrCodeUrl(
          `https://${subdomain.url}.samparka.co/loyality/${response.data.points._id}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePointsChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(`/store/changePoints/${subdomain.url}`, {
        points,
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,

          onAutoClose: window.location.reload(),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:ml-56  min-h-screen">
      {/* Main Content */}
      <main className="flex-1 bg-gray-200 p-6">
        {loading && <LoadingSpinner />}
        {/* <div className="mb-4">
            <select
              name="new"
              id="new"
              className="bg-gray-400 text-gray-700 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              onChange={(e) => setIsNew(e.target.value)}
            >
              <option value="false">Old</option>
              <option value="true">New</option>
            </select>
          </div> */}

        {/* {isNew === "true" ? (
            <NewCustomer qrCodeUrl={newQR} />
          ) : ( */}
        <SetPoints
          qrCodeUrl={qrCodeUrl}
          setPoints={setPoints}
          handlePointsChange={handlePointsChange}
        />
        {/* )} */}
      </main>
    </div>
  );
};

export default StoreSide;
