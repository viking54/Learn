import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/register.module.css";

const Register = () => {
  const Navigate = useNavigate();
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = data.isSeller
        ? "http://localhost:5000/api/sellertask"
        : "http://localhost:5000/api/task";
      const { data: res } = await axios.post(url, data);
      setLoading(false);
      setMsg(res.message);

      console.log(res.message);
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

  return (
    <div className={styles.registrationContainer}>
      <div className={styles.registrationForm}>
        <h1>Register</h1>
        {msg && <div className={styles.msg}>{msg}</div>}
        {error && <div className={styles.error}>{error}</div>}
        <h1 style={{fontSize:20, color:'white'}}>Tick if Seller </h1>
        <input
          type="checkbox"
          checked={data.isSeller}
          name="isSeller"
          onChange={handleChange}
        />

        <input
          type="text"
          value={data.name}
          required
          name="name"
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          value={data.email}
          required
          name="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="number"
          value={data.phone}
          required
          name="phone"
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          type="password"
          value={data.password}
          required
          name="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="password"
          value={data.cpassword}
          required
          name="cpassword"
          onChange={handleChange}
          placeholder="Confirm Password"
        />

        {/* Display a loading spinner while the registration is in progress */}
        {loading ? (
          <div className={styles.loader}></div>
        ) : (
          <button
            className={styles.registerButton}
            disabled={
              !data.name ||
              !data.email ||
              !data.phone ||
              !data.password ||
              data.password !== data.cpassword
            }
            onClick={onRegister}
          >
            Register
          </button>
        )}
        <button
          className={styles.signInButton}
          onClick={() => Navigate("/login")}
        >
          Have an Account ? Sign In
        </button>
      </div>
    </div>
  );
};

export default Register;
