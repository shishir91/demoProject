import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoyalityCard from "./pages/LoyalityCard";
import Login from "./pages/Login";
import Rewards from "./pages/Rewards";
import Verification from "./pages/Verification";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/loyality" element={<LoyalityCard />} />
        <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </Router>
  );
};

export default App;
