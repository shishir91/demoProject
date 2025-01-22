import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GetPoints = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const { pointsId } = useParams();

  useEffect(() => {
    if (!user && !token) {
      navigate("/");
    }
    const getPoints = async () => {
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
    getPoints();
  }, [token]);

  return <div>GetPoints</div>;
};

export default GetPoints;
