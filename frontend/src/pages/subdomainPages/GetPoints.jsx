import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config";
import { toast } from "react-toastify";
import { CheckCircle } from "lucide-react";

const GetPoints = (store) => {
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const { pointsId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!user && !token) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    if (!user && !token) {
      navigate("/");
    }
    const getPoints = async () => {
      try {
        const response = await api.put(
          `/customer/getPoints/${pointsId}`,
          {},
          { headers: { token } }
        );
        if (response.data.success) {
          setPoints(response.data.points);
          toast.success(response.data.message, {
            autoClose: 2000,
            theme: "colored",
            onClose: () => navigate("/loyality"),
          });
        } else {
          navigate("/loyality");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPoints();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center animate-fadeIn">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto animate-bounce" />
        <h1 className="text-3xl font-bold mt-4 text-gray-800">
          Congratulations!
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          You have received{" "}
          <span className="font-semibold text-blue-600">{points}</span> Points!
        </p>
      </div>
    </div>
  );
};

export default GetPoints;
