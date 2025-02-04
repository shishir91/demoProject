import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/admin/Dashboard";
import MessageForm from "./pages/MessageForm";
import ScheduledMessage from "./pages/admin/ScheduledMessage";
import Sidebar from "./components/Sidebar";
import Store from "./pages/Store";
import AddStore from "./pages/admin/AddStore";
import EditStore from "./pages/EditStore";
import Loyality from "./pages/CustomizeLoyalityCard";
import Reward from "./pages/Reward";
import CreateReward from "./pages/CreateReward";
import Customers from "./pages/Customers";
import EmailSetting from "./pages/EmailSetting";
import EditReward from "./pages/EditReward";
import ConfigSMTP from "./pages/ConfigSMTP";
import PoweredBySamparka from "./components/PoweredBySamparka";

const MainApp = () => {
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
      } else if (authState.userInfo.role === "user") {
        return <Navigate to="/store" replace />;
      } else {
        return <Navigate to="/loyality" replace />;
      }
    }
    return children;
  };

  return (
    <Router>
      <Navbar />
      <Toaster richColors expand={false} position="top-right" />
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
          <Route
            path="config"
            element={
              <ProtectedRoute>
                <Sidebar />
                <ConfigSMTP />
              </ProtectedRoute>
            }
          />
          <Route
            path="emailSetting"
            element={
              <ProtectedRoute>
                <Sidebar />
                <EmailSetting />
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
          <Route
            path="editReward/:status"
            element={
              <ProtectedRoute>
                <Sidebar />
                <EditReward />
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
        <Route path="*" element={<PoweredBySamparka />} />
      </Routes>
    </Router>
  );
};

export default MainApp;
