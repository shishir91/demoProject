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
import StoreSide from "./pages/subdomainPages/StoreSide";
import GetPoints from "./pages/subdomainPages/GetPoints";
import LoyalityCard from "./pages/LoyalityCard";
import PoweredBySamparka from "./components/PoweredBySamparka";
import StoreSidebar from "./components/storeSide/StoreSidebar";
import ViewRewards from "./components/storeSide/ViewRewards";

const AppStore = () => {
  const [authState, setAuthState] = useState({
    userInfo: JSON.parse(localStorage.getItem("userInfo")),
    token: localStorage.getItem("token"),
  });

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

  return (
    <Router>
      <Toaster richColors expand={false} position="top-right" />
      <Routes>
        {/* Public Route: Only accessible if NOT logged in */}
        <Route
          index
          element={
            <CustomerLogin url={subdomain} />
            // <StorePublicRoute>
            // </StorePublicRoute>
          }
        />

        {/* Protected Routes: Require store login */}
        <Route path="/store">
          <Route
            path="points"
            element={
              <>
                <StoreSide url={subdomain} />
              </>
            }
          />
          <Route
            path="viewRewards"
            element={
              <>
                <StoreSidebar />
                <ViewRewards url={subdomain} />
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
              <LoyalityCard url={subdomain} />
              // <StoreProtectedRoute>
              // </StoreProtectedRoute>
            }
          />
          <Route
            path=":pointsId"
            element={
              <StoreProtectedRoute>
                <GetPoints url={subdomain} />
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
        <Route
          path="/reservation"
          element={
            <StoreProtectedRoute>
              <Reservation url={subdomain} />
            </StoreProtectedRoute>
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<PoweredBySamparka />} />
      </Routes>
    </Router>
  );
};

export default AppStore;
