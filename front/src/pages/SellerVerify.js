import React, { Fragment, useEffect, useState } from "react";
import success from "../images/success.png";
import axios from "axios";
import styles from "../css/verify.module.css";
import { useNavigate, useParams } from "react-router-dom";

const SellerVerify = () => {
  const Navigate = useNavigate();
  const [validUrl, setValidUrl] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const param = useParams();

  useEffect(() => {
    const VerifyEmailUrl = async () => {
      try {
        const url = `https://gadgetshop.onrender.com/api/sellertask/${param.id}/sellerVerify/${param.token}`;
        const { data } = await axios.get(url);
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      } finally {
        setLoading(false); // Set loading to false after the verification process
      }
    };
    VerifyEmailUrl();
  }, [param]);

  return (
    <div className={styles.container}>
      {loading ? ( // Show loading circle if loading is true
        <div className={styles.loadingCircle}></div>
      ) : validUrl ? (
        <Fragment>
          <h1 className={styles.header}>Verified</h1>
          <img src={success} alt="Success" className={styles.image} />
          <button onClick={() => Navigate("/login")} className={styles.button}>
            Sign In
          </button>
        </Fragment>
      ) : (
        <h1 className={styles.error}>404 Not Found</h1>
      )}
    </div>
  );
};

export default SellerVerify;
