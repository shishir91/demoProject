import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import api from "./api/config";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/admin/Dashboard";
import { ToastContainer } from "react-toastify";
import MessageForm from "./pages/MessageForm";
import ScheduledMessage from "./pages/admin/ScheduledMessage";
import Sidebar from "./components/Sidebar";
import Store from "./pages/Store";
import AddStore from "./pages/admin/AddStore";
import EditStore from "./pages/EditStore";
import Loyality from "./pages/CustomizeLoyalityCard";
import Reward from "./pages/Reward";
import CreateReward from "./pages/CreateReward";
import LoyalityCardC from "./pages/subdomainPages/LoyalityCard";
import CustomerLogin from "./pages/subdomainPages/CustomerLogin";
import Verification from "./pages/subdomainPages/Verification";
import Rewards from "./pages/subdomainPages/Rewards";
import Reservation from "./pages/subdomainPages/Reservation";
import Customers from "./pages/Customers";
import StoreSide from "./pages/subdomainPages/StoreSide";
import NotFound from "./components/NotFound";
import GetPoints from "./pages/subdomainPages/GetPoints";
import LoyalityCard from "./pages/LoyalityCard";
import PoweredBySamparka from "./components/PoweredBySamparka";
import TextEditor from "./components/TextEditor";

const App = () => {
  // Use state to track auth status
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

  //HANDLE SUBDOMAIN
  const [subdomain, setSubdomain] = useState("");
  const [storeStatus, setStoreStatus] = useState();

  useEffect(() => {
    const host = window.location.hostname.split(".");
    console.log(host);

    const sub = host.length > 1 ? host[0] : null;
    console.log(sub);
    setSubdomain(sub);
  }, []);

  useEffect(() => {
    const checkStore = async () => {
      if (subdomain && subdomain !== "" && subdomain !== "www") {
        console.log(subdomain);

        try {
          const response = await api.get(`/store/checkStore/${subdomain}`);
          console.log(response);

          if (response.data) {
            setStoreStatus(response.data.success);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    checkStore();
  }, [subdomain]);

  // return <TextEditor/>

  if (!subdomain || subdomain == "" || subdomain == "www") {
    const ProtectedRoute = ({ children }) => {
      if (!authState.userInfo || !authState.token) {
        return <Navigate to="/" replace />;
      }
      return children;
    };

    const PublicRoute = ({ children }) => {
      if (authState.userInfo && authState.token) {
        if (authState.userInfo.role === "admin") {
          return <Navigate to="/dashboard" replace />;
        } else {
          return <Navigate to="/store" replace />;
        }
      }
      return children;
    };
    return (
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          {/* Public Route with Protection */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Sidebar />
                  <Dashboard />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms"
            element={
              <ProtectedRoute>
                <Sidebar />
                {authState.userInfo && authState.userInfo.role === "admin" ? (
                  <ScheduledMessage />
                ) : (
                  <MessageForm />
                )}
              </ProtectedRoute>
            }
          />
          <Route path="/store">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <Store />
                </ProtectedRoute>
              }
            />
            <Route
              path="loyalityCard"
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <Loyality />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/addStore"
            element={
              <ProtectedRoute>
                <Sidebar />
                <AddStore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editStore"
            element={
              <ProtectedRoute>
                <Sidebar />
                <EditStore />
              </ProtectedRoute>
            }
          />
          <Route path="/reward">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <Reward />
                </ProtectedRoute>
              }
            />
            <Route
              path="createReward/:status"
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <CreateReward />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Sidebar />
                <Customers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    );
  } else if (storeStatus) {
    const StoreProtectedRoute = ({ children }) => {
      const storeUser = JSON.parse(localStorage.getItem("userInfo"));
      const storeToken = localStorage.getItem("token");

      if (!storeUser || !storeToken) {
        return <Navigate to="/" replace />;
      }

      return children;
    };

    const StorePublicRoute = ({ children }) => {
      const storeUser = JSON.parse(localStorage.getItem("storeUser"));
      const storeToken = localStorage.getItem("storeToken");

      if (storeUser && storeToken) {
        return <Navigate to="/loyality" replace />;
      }

      return children;
    };

    return (
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Route: Only accessible if NOT logged in */}
          <Route
            index
            element={
              <StorePublicRoute>
                <CustomerLogin url={subdomain} />
              </StorePublicRoute>
            }
          />

          {/* Protected Routes: Require store login */}
          <Route
            path="/points_distribution"
            element={
              <StoreProtectedRoute>
                <StoreSide url={subdomain} />
              </StoreProtectedRoute>
            }
          />
          <Route
            path="/verification"
            element={
              <StoreProtectedRoute>
                <Verification />
              </StoreProtectedRoute>
            }
          />
          <Route path="/loyality">
            <Route
              index
              element={
                <StoreProtectedRoute>
                  <LoyalityCard url={subdomain} />
                </StoreProtectedRoute>
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
          <Route
            path="/rewards"
            element={
              <StoreProtectedRoute>
                <Rewards />
              </StoreProtectedRoute>
            }
          />
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
  } else {
    return <PoweredBySamparka />;
  }
};

export default App;
