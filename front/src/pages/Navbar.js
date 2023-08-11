import React, { useContext} from "react";
import styles from "../css/navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  const Navigate = useNavigate();



  const logout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        console.log("logging");
        dispatch({ type: "USER", payload: { isAuthenticated: false } });
        localStorage.removeItem("userState");
        Navigate("/");
        console.log(state.isAuthenticated);
      }
    } catch (error) {
      window.alert("Logging out");
    }
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.navbarHeading}>TechMate</h1>
      <ul className={styles.navbarList}>
        <li>
          <NavLink to={"/"} className={styles.navbarLink}>
            Home
          </NavLink>
        </li>
        {state.isAuthenticated.isAuthenticated ? (
          <>
            <li>
              <NavLink to={"/orders"} className={styles.navbarLink}>
                User Area
              </NavLink>
            </li>
            <li>
              <NavLink to={"/seller"} className={styles.navbarLink}>
                Seller
              </NavLink>
            </li>
            <li>
              <NavLink className={styles.navbarLink} onClick={logout}>
                Logout
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to={"/login"} className={styles.navbarLink}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to={"/register"} className={styles.navbarLink}>
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
