import React, { useEffect, useState, useRef } from "react";
import styles from "../css/home.module.css";
import { createGlobalStyle } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SellerOrders = () => {
  const productContainerRef = useRef(null);
  const location = useLocation();
  const sellerData = location.state;

  // const [activeTab, setActiveTab] = useState("phones");
  const [products, setProducts] = useState([]);
  // const [error, setError] = useState("");
  const handleSlider = (direction) => {
    const container = productContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
      } else if (direction === "right") {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/producttask/callorders/${sellerData._id}`
      );
      setProducts(data);
      console.log("Response data:", data); // Check the response data
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleClick = async (orderId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/producttask/updateOrderStatus/${orderId}`,
        { status }
      );
  
      if (response.status === 200) {
       
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className={styles.homeContainer}>
        <GlobalStyle />
       
        <div className={styles.productcontainer} ref={productContainerRef}>
          {products &&products.map((product) => (
            <div key={product._id} className={styles.productcard}>
             
              <img
                className={styles.productimage}
                src={`http://localhost:5000/${product.image}`}
                alt={product.name}
              />

              <div className={styles.producttitle}>{product.name}</div>
              <div className={styles.productprice}>{product.price}</div>
              <h1 style={{ marginTop: "20px", fontSize: "20px" }}>Status</h1>
              {product.status === "Cancelled" && ( // Check the status here
                  <div className={styles.cmsg}>Order Is Cancelled By User</div>
                )}
              {product.status !== "Cancelled" && ( // Check the status here
                 <>
                  <button
              className={`${styles.cardbutton} ${
                product.status === "Shipped" ? styles.active : ""
              }`}
              style={{ backgroundColor: "grey" }}
              onClick={() => handleClick(product._id, "Shipped")}
            >
              Shipped
            </button>
            <button
              className={`${styles.cardbutton} ${
                product.status === "Out For Delivery" ? styles.active : ""
              }`}
              style={{ backgroundColor: "black" }}
              onClick={() => handleClick(product._id, "Out For Delivery")}
            >
              Out For Delivery
            </button>
            <button
              className={`${styles.cardbutton} ${
                product.status === "Delivered" ? styles.active : ""
              }`}
              style={{ backgroundColor: "green" }}
              onClick={() => handleClick(product._id, "Delivered")}
            >
              Delivered
            </button>
                 </>
                )}
              
             

            <p style={{ color: 'white', marginTop:'10px' }}>Name: {product.buyername}</p>
<p style={{ color: 'white'}}>Address: {product.address}</p>
<p style={{ color: 'white'}}>Pincode: {product.pincode}</p>
            </div>
         

          ))}
        </div>
      </div>
      <button
        className={`${styles.sliderbutton} ${styles.left}`}
        onClick={() => handleSlider("left")}
      >
        &#8249;
      </button>
      <button
        className={`${styles.sliderbutton} ${styles.right}`}
        onClick={() => handleSlider("right")}
      >
        &#8250;
      </button>
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  /* Reset some default styles to ensure consistent styling */
  body, h1, h2, h3, p, ul, li {
    margin: 0;
    padding: 0;
  }

  /* Set a global font and background color */
  body {
    font-family: 'Signika Negative', sans-serif;
    overflow-y: hidden;
  }
`;

export default SellerOrders;
