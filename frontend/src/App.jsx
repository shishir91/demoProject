import React, { useEffect, useState } from "react";
import api from "./api/config";
import PoweredBySamparka from "./components/PoweredBySamparka";
import MainApp from "./MainApp";
import AppStore from "./AppStore";

const App = () => {
  //HANDLE SUBDOMAIN
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    const host = window.location.hostname.split(".");

    const sub = host.length > 2 ? host[0] : null;
    setSubdomain(sub);
  }, []);

  // useEffect(() => {
  //   const checkStore = async () => {
  //     if (subdomain && subdomain !== "" && subdomain !== "www") {
  //       try {
  //         const response = await api.get(`/store/checkStore/${subdomain}`);

  //         if (response.data) {
  //           setStoreStatus(response.data.success);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };
  //   checkStore();
  // }, [subdomain]);

  if (!subdomain || subdomain == "" || subdomain == "www") {
    return <MainApp />;
    // }
    // else if (storeStatus) {
    //   return <AppStore />;
  } else {
    return <AppStore subdomain={subdomain} />;
    // return <PoweredBySamparka />;
  }
};

export default App;
