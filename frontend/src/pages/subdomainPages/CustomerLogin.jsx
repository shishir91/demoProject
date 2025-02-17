import React, { useEffect, useState } from "react";
import { Mail, User, Phone } from "lucide-react";
import { toast } from "sonner";
import api from "../../api/config.js";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import image from "/unnamed.jpg";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CustomerLogin = (storeURL) => {
  const [formData, setFormData] = useState({
    countryCode: "+977",
    phone: "",
    name: "",
    email: "",
  });
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const subdomain = storeURL.url;
  const { storeData } = queryClient.getQueryData(["store", subdomain]); // Retrieve cached data
  const [store, setStore] = useState(storeData);

  console.log(storeData);

  if (!storeData) return <p>No store data available</p>;

  // const getStore = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await api.get(`/customer/store/${storeURL.url}`);
  //     if (response.data.success) {
  //       setStore(response.data.store);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message, {
  //       duration: 2000,

  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (user && token) {
      navigate("/loyality");
    }
    // getStore();
  }, []);

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
      const response = await api.post(`/customer/register/${store.url}`, {
        ...formData,
      });
      if (response.data.success) {
        setLoading(false);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response.data.customer)
        );
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message, {
          duration: 1000,
          // onAutoClose: () =>
          //   navigate("/verification", {
          //     state: {
          //       userInfo: JSON.stringify(response.data.customer),
          //       token: response.data.token,
          //     },
          //   }),
          onAutoClose: () => navigate("/loyality"),
        });
      } else {
        setLoading(false);
        toast.error(response.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message, {
        duration: 2000,
      });
    }
  };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 space-y-6">
    //   {isLoading && <LoadingSpinner />}
    //   {<ToastContainer />}
    //   {/* Logo */}
    //   <div className="w-20 h-20 flex items-center justify-center">
    //     <img src={image} alt="" />
    //   </div>
    //   {/* Form */}
    //   <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
    //     <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
    //       Earn Points
    //     </h2>
    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       {/* Name */}
    //       <div>
    //         <label className="block text-sm font-medium text-gray-800">
    //           Name
    //         </label>
    //         <div className="relative">
    //           <input
    //             type="text"
    //             name="name"
    //             placeholder="Enter your name"
    //             value={formData.name}
    //             onChange={handleChange}
    //             className="w-full px-10 py-2 mt-1 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    //           />
    //           <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
    //         </div>
    //       </div>

    //       {/* Email */}
    //       <div>
    //         <label className="block text-sm font-medium text-gray-800">
    //           Email
    //         </label>
    //         <div className="relative">
    //           <input
    //             type="email"
    //             name="email"
    //             placeholder="Enter your email"
    //             value={formData.email}
    //             onChange={handleChange}
    //             className="w-full px-10 py-2 mt-1 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    //           />
    //           <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
    //         </div>
    //       </div>

    //       {/* Phone Number */}
    //       <div>
    //         <label className="block text-sm font-medium text-gray-800">
    //           Phone Number
    //         </label>
    //         <div className="flex items-center space-x-4 mt-2">
    //           {/* Country Code Dropdown */}
    //           <select
    //             name="countryCode"
    //             value={formData.countryCode}
    //             onChange={handleChange}
    //             className="px-3 py-2 text-sm border border-gray-400 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white w-1/4"
    //           >
    //             <option value="+977">+977 (Nepal)</option>
    //             <option value="+91">+91 (India)</option>
    //             <option value="+44">+44 (UK)</option>
    //             <option value="+1">+1 (US)</option>
    //           </select>

    //           {/* Phone Input */}
    //           <div className="relative flex-1">
    //             <input
    //               type="number"
    //               name="phone"
    //               id="phoneNumber"
    //               placeholder="Enter your phone number"
    //               value={formData.phone}
    //               onChange={handleChange}
    //               className="w-full px-10 py-2 text-sm border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    //             />
    //             <Phone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
    //           </div>
    //         </div>
    //       </div>

    //       {/* Submit Button */}
    //       <button
    //         type="submit"
    //         className="w-full py-2 text-white bg-green-800 rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
    //       >
    //         Continue
    //       </button>
    //     </form>
    //   </div>
    // </div>
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-[35px] text-center   font-garet overflow-hidden">
      {isLoading && <LoadingSpinner />}
      {/* Logo and Title */}
      <div className="flex flex-col items-center justify-center ">
        <img
          className="w-auto h-[80px] object-cover"
          alt="Logo"
          src={store.logo}
        />
        <div className="font-poppins tracking-[0.01em] text-mini1 sm:text-sm md:text-sm lg:text-sm xl:text-sm w-full text-center mt-2">
          Welcome to my store
        </div>
      </div>

      {/* Form */}
      <Form
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

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
  );
};

export default CustomerLogin;
