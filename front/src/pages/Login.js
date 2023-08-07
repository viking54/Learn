import React, { useState , useContext} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";
import styles from "../css/login.module.css"; // Update the CSS import with the new file name

const Login = () => {

  const {state,dispatch} = useContext(UserContext);
  const Navigate = useNavigate();
  const [error, setError] = useState("");
  const[msg,setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };
  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = data.isSeller
        ? "http://localhost:5000/api/sellerauth"
        : "http://localhost:5000/api/auth";
        const { data: res } = await axios.post(url, data, {
          withCredentials: true, // Set withCredentials to true to include cookies
        });
      setMsg(res.message)
      setLoading(false);
      dispatch({ type: "USER", payload: { isAuthenticated: true } });
     localStorage.setItem("userState", JSON.stringify({ isAuthenticated: true }));

      Navigate("/")

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

  const onVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = data.isSeller
       ?"http://localhost:5000/api/sellerlogVerify"
       : "http://localhost:5000/api/logVerify";
      const { data: res } = await axios.post(url, data);
      setMsg(res.message)
      setLoading(false);
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

  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}> {/* Update class name */}
        <h1>Login</h1>
          {msg && <div className={styles.msg}>{msg}</div>}
        {error && <div className={styles.error}>{error}</div>} {/* Update class name */}
        <h1 style={{fontSize:20, color:'white'}}>Tick if Seller </h1>
        <input
          type="checkbox"
          checked={data.isSeller}
          name="isSeller"
          onChange={handleChange}
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
          type="password"
          value={data.password}
          required
          name="password"
          onChange={handleChange}
          placeholder="Password"
        />
     
        {loading ? (
          <div className={styles.loader}></div> 
        ) : (
          <button
            className={styles.loginButton}
            disabled={!data.email || !data.password}
            onClick={onLogin}
          >
            Login
          </button>
        )}
        <button className={styles.signUpButton} onClick={() => Navigate("/register")}>{/* Update class name */}
          New Here ? Sign Up
        </button>
        <button className={styles.signUp2Button} onClick={onVerify}>{/* Update class name */}
         Verify
        </button>
      </div>
    </div>
  );
};

export default Login;
