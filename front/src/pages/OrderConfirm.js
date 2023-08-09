import React, { useState } from "react";
import styles from "../css/orderConfirm.module.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

const OrderConfirm = () => {
  const location = useLocation();
  const state = location.state;
  const product = state?.product;
  const userData = state?.userData;
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    buyername: "",
    address: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${data.pincode}`
      );
      const dat = response.data;

      if (dat[0].Message !== "No records found") {
        const postOfficeName = dat[0].PostOffice[0].Name;
        setLoading(false);
        showSuccessMessage(`Deliverable At ${postOfficeName}`);

        setVerified(true);
      } else {
        setLoading(false);
        showErrorMessage("Not Deliverable");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching post office data:", error);
      showErrorMessage("Not Deliverable");
    }
  };

  const onBuy = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const formData = {
        buyername: data.buyername,
        address: data.address,
        pincode: data.pincode,
        productId: product._id,
        sellerId: product.sellerId,
        name: product.name,
        image: product.image,
        price: product.price,
      };

      const url = `https://gadgetshop.onrender.com/api/producttask/saveorder/${userData._id}`;
      const { data: res } = await axios.post(url, formData);
      setLoading(false);
      showSuccessMessage(res.message);

      console.log(res.message);
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        showErrorMessage(error.response.data.message);
      }
    }
  };

  const showSuccessMessage = (message) => {
    setMsg(message);
    setTimeout(() => {
      setMsg(null);
    }, 3000);
  };

  const showErrorMessage = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  return (
    <>
      <div className={styles.messageContainer}>
        {msg && <div className={styles.msg}>{msg}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
      <div className={styles.container}>
        <div className={styles.productcard}>
          <img
            className={styles.productimage}
            src={`https://gadgetshop.onrender.com/${product.image}`}
            alt={product.name}
          />
          <div className={styles.producttitle}>{product.name}</div>
          <div className={styles.productprice}>{product.price}</div>
        </div>
        <div className={styles.buyContainer}>
          <div className={styles.buyForm}>
            <h1>Get Now</h1>
            <input
              type="text"
              onChange={handleChange}
              value={data.buyername}
              required
              name="buyername"
              placeholder="Name"
            />
            <input
              type="text"
              onChange={handleChange}
              value={data.address}
              required
              name="address"
              placeholder="Address"
            />
            <input
              type="number"
              onChange={handleChange}
              value={data.pincode}
              required
              name="pincode"
              placeholder="Pincode"
            />
            {loading ? (
              <div className={styles.loader}></div>
            ) : (
              <button className={styles.signUpButton} onClick={handleVerify}>
                Verify Pincode
              </button>
            )}

            <button
              className={styles.buyButton}
              disabled={
                !data.buyername || !data.address || !data.pincode || !verified
              }
              onClick={onBuy}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirm;
