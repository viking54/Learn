import React, {useState} from "react";
import axios from "axios";
import styles from "../css/seller.module.css";
import { useLocation} from "react-router-dom";

const Edit = () => {
  const location = useLocation();
  const proData = location.state;

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    price: "",
    quantity: "",
    desc: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

   const onEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const url = `http://localhost:5000/api/producttask/edit/${proData._id}`;
        const {data:res} = await axios.post(url,data);
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
   }

  return (
    <>
      <div className={styles.sellerContainer}>
        <div className={styles.sellerForm}>
          <h1>+ EDIT -</h1>
          {msg && <div className={styles.msg}>{msg}</div>}
          {error && <div className={styles.error}>{error}</div>}
          <input
            type="text"
            defaultValue={proData?.name || ""}
            disabled
            name="name"
            placeholder="Product Name"
          />
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
              disabled={!data.quantity || !data.desc || !data.price}
              onClick={onEdit}
            >
              EDIT PRODUCT
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Edit;
