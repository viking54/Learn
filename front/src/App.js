import "./App.css";
import React, { createContext, useReducer, useEffect } from 'react'; // Import useEffect
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import Seller from "./pages/Seller";
import SellerVerify from "./pages/SellerVerify";
import SellerArea from "./pages/SellerArea";
import Orders from "./pages/Orders";
import Edit from "./pages/Edit";
import OrderConfirm from "./pages/OrderConfirm";
import SellerOrders from "./pages/SellerOrders";
import { initialState, reducer } from './useReducer/userReducer';

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState());

  useEffect(() => {
    localStorage.setItem("userState", JSON.stringify(state));
  }, [state]);

  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/task/:id/verify/:token" element={<Verify />} />
          <Route path="/sellertask/:id/sellerVerify/:token" element={<SellerVerify />} />
          <Route path="/" element={<Home />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/sellerArea" element={<SellerArea />} />
          <Route path="/sellerOrders" element={<SellerOrders />} />
          <Route path="/orderConfirm" element={<OrderConfirm />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
