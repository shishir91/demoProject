import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/config";
import SetPoints from "../../components/storeSide/SetPoints";
import NewCustomer from "../../components/storeSide/NewCustomer";

const StoreSide = (subdomain) => {
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isNew, setIsNew] = useState(false);

  const newQR = `http://${subdomain.url}.samparka.co/`;

  useEffect(() => {
    setLoading(true);
    getPointsDetail();
    setLoading(false);
  }, []);

  const getPointsDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/store/getPointsDetail/${subdomain.url}`);
      if (response.data.success) {
        console.log(response.data.points._id);

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
          autoClose: 1000,
          theme: "colored",
          onClose: window.location.reload(),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200">
      {loading && <LoadingSpinner />}
      <div>
        <select
          name="new"
          id="new"
          className=""
          onChange={(e) => setIsNew(e.target.value)}
        >
          <option value="false">Old</option>
          <option value="true">New</option>
        </select>
      </div>
      {isNew == "true" ? (
        <NewCustomer qrCodeUrl={newQR} />
      ) : (
        <SetPoints
          qrCodeUrl={qrCodeUrl}
          setPoints={setPoints}
          handlePointsChange={handlePointsChange}
        />
      )}
    </div>
  );
};

export default StoreSide;
