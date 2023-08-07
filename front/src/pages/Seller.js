import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/seller.module.css";
import { useNavigate } from "react-router-dom";

const Seller = () => {
  const [error, setError] = useState("");
  const Navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [getdata,setGetdata]= useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    image: null,
    price: "",
    quantity:"",
    type: "",
    desc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const navigateToSellerArea = () => {
    Navigate("/sellerArea", { state: getdata });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    setData({ ...data, image: file });
 
  };

  const onAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("sellerId", getdata._id);
      formData.append("desc", data.desc);
      formData.append("image", data.image); // data.image is the File object of the image

      const url = "http://localhost:5000/api/producttask";
      const { data: res } = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the proper headers for the FormData
        },
      });

      setLoading(false);
      setMsg(res.message);
   
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const callPage = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sellerauth/authSeller", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const da = await res.json();
      setGetdata(da);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      Navigate("/login");
      window.alert("Please login As Seller ")
    }
  };
   useEffect(()=>{
       callPage();
   },[])
  

  return (
    <>
    
   
    <div className={styles.sellerContainer}>
    <div className={styles.sellName}>
        <h3><span className={styles.hellotext}>Hi :</span> {getdata.name}</h3>
        <button onClick={navigateToSellerArea} className={styles.areabutton}>SellerArea</button>
      </div>
      <div className={styles.sellerForm}>
        <h1>+ PRODUCT +</h1>
        {msg && <div className={styles.msg}>{msg}</div>}
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="text"
          value={data.name}
          required
          name="name"
          onChange={handleChange}
          placeholder="Product Name"
        />
        <input
          type="file"
          accept="image/*"
          required
          name="image"
          onChange={handleImageChange}
          placeholder="Product Image"
        />
        <div className={styles.sel}>
          <label htmlFor="deviceType">Select a device:</label>
          <select name="type" value={data.type} onChange={handleChange}>
            <option value="laptop">Laptop</option>
            <option value="tablet">Tablet</option>
            <option value="phone">Phone</option>
          </select>
        </div>
        <input
          type="number"
          value={data.price}
          required
          name="price"
          onChange={handleChange}
          placeholder="Price (in Rupees)"
        />
        <input
          type="number"
          value={data.quantity}
          required
          name="quantity"
          onChange={handleChange}
          placeholder="Quantity"
        />
        <div className={styles.sel}>
          <label htmlFor="description">Description:</label>
          <textarea
            value={data.desc}
            name="desc"
            required
            onChange={handleChange}
            placeholder="Enter product description..."
          ></textarea>
        </div>
        {/* Display a loading spinner while the seller is in progress */}
        {loading ? (
          <div className={styles.loader}></div>
        ) : (
          <button
            className={styles.sellerButton}
            disabled={!data.name ||!data.quantity|| !data.image || !data.type || !data.desc || !data.price}
            onClick={onAdd}
          >
            ADD PRODUCT
          </button>
        )}
      </div>
    </div>


    </>
  );
};

export default Seller;
