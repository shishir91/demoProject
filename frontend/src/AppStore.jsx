import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CustomerLogin from "./pages/subdomainPages/CustomerLogin";
import Verification from "./pages/subdomainPages/Verification";
import Reservation from "./pages/subdomainPages/Reservation";
import StoreSide from "./pages/subdomainPages/storeSide/StoreSide";
import GetPoints from "./pages/subdomainPages/GetPoints";
import LoyalityCard from "./pages/LoyalityCard";
import PoweredBySamparka from "./components/PoweredBySamparka";
import StoreSidebar from "./components/storeSide/StoreSidebar";
import ViewRewards from "./pages/subdomainPages/storeSide/ViewRewards";
import HomePageStore from "./pages/user/HomePageStore";
import SingleProduct from "./pages/user/SingleProduct";
import Checkout from "./pages/user/Checkout";
import { CartProvider } from "./context/CartProvider";
import StoreLogin from "./pages/subdomainPages/storeSide/StoreLogin";
import api from "./api/config";
import Customers from "./pages/subdomainPages/storeSide/Customers";
import { useQuery } from "@tanstack/react-query";
import fetchStoreData from "./api/fetchStore";

const AppStore = (sub) => {
  const [authState, setAuthState] = useState({
    userInfo: JSON.parse(localStorage.getItem("userInfo")),
    token: localStorage.getItem("token"),
  });
  const [storeStatus, setStoreStatus] = useState();
  const [storeData, setStoreData] = useState({});
  const subdomain = sub.subdomain;

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "userInfo" || event.key === "token") {
        setAuthState({
          userInfo: JSON.parse(localStorage.getItem("userInfo")),
          token: localStorage.getItem("token"),
        });
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const StoreProtectedRoute = ({ children }) => {
    if (!authState.userInfo || !authState.token) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const StorePublicRoute = ({ children }) => {
    if (authState.userInfo && authState.token) {
      return <Navigate to="/loyality" replace />;
    }
    return children;
  };

  useEffect(() => {
    const checkStore = async () => {
      if (subdomain && subdomain !== "" && subdomain !== "www") {
        try {
          fetch(
            `${
              import.meta.env.VITE_SERVER_BASE_URL
            }manifest.json?subdomain=${subdomain}`
          )
            .then((res) => res.json())
            .then((store) => {
              const blob = new Blob([JSON.stringify(store)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);

              const link = document.createElement("link");
              link.rel = "manifest";
              link.href = url;
              document.head.appendChild(link);

              // Update document title
              document.title = store.name;

              // Add new favicon
              if (store.icons && store.icons.length > 0) {
                // Remove existing favicons
                document
                  .querySelectorAll("link[rel='icon']")
                  .forEach((el) => el.remove());
                const newFavicon = document.createElement("link");
                newFavicon.rel = "icon";
                newFavicon.type = "image/png";
                newFavicon.sizes = "16x16";
                newFavicon.href = store.icons[0].src;
                document.head.appendChild(newFavicon);
              }

              // Dynamically set Apple-specific meta tags
              const metaTitle = document.createElement("meta");
              metaTitle.name = "apple-mobile-web-app-title";
              metaTitle.content = store.name;

              const touchIcon = document.createElement("link");
              touchIcon.rel = "apple-touch-icon";
              touchIcon.href = store.icons[0].src;

              document.head.appendChild(metaTitle);
              document.head.appendChild(touchIcon);

              console.log(
                "Dynamic Apple meta tags and icon added for:",
                store.name
              );
            })
            .catch((error) =>
              console.error("Failed to fetch store data:", error)
            );
        } catch (error) {
          console.log(error);
        }
      }
    };
    checkStore();
  }, [subdomain]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["store"],
    queryFn: () => fetchStoreData(subdomain),
    enabled: !!subdomain,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      const { storeData, success } = data;
      setStoreData(storeData);
      setStoreStatus(success);
      // Update document title
      //   document.title = manifest.name;

      //   // Add favicon dynamically
      //   if (manifest.icons && manifest.icons.length > 0) {
      //     document
      //       .querySelectorAll("link[rel='icon']")
      //       .forEach((el) => el.remove());
      //     const newFavicon = document.createElement("link");
      //     newFavicon.rel = "icon";
      //     newFavicon.type = "image/png";
      //     newFavicon.sizes = "16x16";
      //     newFavicon.href = manifest.icons[0].src;
      //     document.head.appendChild(newFavicon);
      //   }

      //   // Set Apple meta tags
      //   const metaTitle = document.createElement("meta");
      //   metaTitle.name = "apple-mobile-web-app-title";
      //   metaTitle.content = manifest.name;

      //   const touchIcon = document.createElement("link");
      //   touchIcon.rel = "apple-touch-icon";
      //   touchIcon.href = manifest.icons[0].src;

      //   document.head.appendChild(metaTitle);
      //   document.head.appendChild(touchIcon);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (storeStatus) {
    return (
      <Router>
        <Toaster richColors expand={false} position="top-right" />
        <Routes>
          {/* Public Route: Only accessible if NOT logged in */}
          <Route
            index
            element={
              <CustomerLogin />
              // <StorePublicRoute>
              // </StorePublicRoute>
            }
          />

          {/* Protected Routes: Require store login */}
          <Route path="/store">
            <Route
              path="login"
              element={
                <>
                  <StoreLogin url={subdomain} />
                </>
              }
            />
            <Route
              path="points"
              element={
                <>
                  <StoreSidebar store={storeData} />
                  <StoreSide url={subdomain} />
                </>
              }
            />
            <Route
              path="viewRewards"
              element={
                <>
                  <StoreSidebar store={storeData} />
                  <ViewRewards url={subdomain} />
                </>
              }
            />
            <Route
              path="customers"
              element={
                <>
                  <StoreSidebar store={storeData} />
                  <Customers url={subdomain} store={storeData} />
                </>
              }
            />
          </Route>
          <Route
            path="/verification"
            element={
              <Verification />
              // <StoreProtectedRoute>
              // </StoreProtectedRoute>
            }
          />
          <Route path="/loyality">
            <Route
              index
              element={
                <LoyalityCard />
                // <StoreProtectedRoute>
                // </StoreProtectedRoute>
              }
            />
            <Route
              path=":pointsId"
              element={
                <StoreProtectedRoute>
                  <GetPoints />
                </StoreProtectedRoute>
              }
            />
          </Route>
          {/* <Route
          path="/rewards"
          element={
            <StoreProtectedRoute>
              <Rewards />
            </StoreProtectedRoute>
          }
        /> */}
          {/* <Route
          path="/reservation"
          element={
            <Reservation url={subdomain} />
            // <StoreProtectedRoute>
            // </StoreProtectedRoute>
          }
        /> */}

          {storeData.services?.ecommerce?.status && (
            <Route path="/products">
              <Route
                index
                element={
                  <CartProvider>
                    <HomePageStore url={subdomain} store={storeData} />
                  </CartProvider>
                }
              />
              <Route
                path=":productId"
                element={
                  <CartProvider>
                    <SingleProduct />
                  </CartProvider>
                }
              />
              <Route
                path="checkout"
                element={
                  <CartProvider>
                    <Checkout url={subdomain} store={storeData} />
                  </CartProvider>
                }
              />
            </Route>
          )}

          {/* Catch-all Route */}
          <Route path="*" element={<PoweredBySamparka />} />
        </Routes>
      </Router>
    );
  } else {
    return <PoweredBySamparka />;
  }
};

export default AppStore;
