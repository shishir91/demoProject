import React, { useEffect, useState } from "react";
import api from "./api/config";
import PoweredBySamparka from "./components/PoweredBySamparka";
import MainApp from "./MainApp";
import AppStore from "./AppStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = () => {
  // Initialize the QueryClient instance
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10000,
      },
    },
  });

  // Handle subdomain
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    const host = window.location.hostname.split(".");
    const sub = host.length > 1 ? host[0] : null;
    setSubdomain(sub);
  }, []);

  // Optional: Logic for checking store status (commented out for now)
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

  if (!subdomain || subdomain === "" || subdomain === "www") {
    return <MainApp />;
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <AppStore subdomain={subdomain} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  }
};

export default App;
