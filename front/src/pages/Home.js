import React, { useEffect, useRef, useState } from "react";
import styles from "../css/home.module.css";
import axios from "axios";
import { createGlobalStyle } from "styled-components";

function Phones({ products, onCart }) {
  return (
    <>
      {products.map((product) => (
        <div key={product._id} className={styles.productcard}>
          <img
            className={styles.productimage}
            src={`http://localhost:5000/${product.image}`}
            alt={product.name}
          />

          <div className={styles.producttitle}>{product.name}</div>
          <div className={styles.productprice}>{product.price}</div>
          <div className={styles.productprice}>
            Quantity Left: {product.quantity}
          </div>
          <button
            className={styles.cardbutton}
            style={{ backgroundColor: "green" }}
            onClick={() => onCart(product)}
          >
            Add to Cart{" "}
          </button>
        </div>
      ))}
    </>
  );
}
function Laptop({ products, onCart }) {
  return (
    <>
      {products.map((product) => (
        <div key={product._id} className={styles.productcard}>
          <img
            className={styles.productimage}
            src={`http://localhost:5000/${product.image}`}
            alt={product.name}
          />

          <div className={styles.producttitle}>{product.name}</div>
          <div className={styles.productprice}>{product.price}</div>
          <div className={styles.productprice}>
            Quantity Left: {product.quantity}
          </div>
          <button
            className={styles.cardbutton}
            style={{ backgroundColor: "green" }}
            onClick={() => onCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </>
  );
}
function Tablet({ products, onCart }) {
  return (
    <>
      {products.map((product) => (
        <div key={product._id} className={styles.productcard}>
          <img
            className={styles.productimage}
            src={`http://localhost:5000/${product.image}`}
            alt={product.name}
          />

          <div className={styles.producttitle}>{product.name}</div>
          <div className={styles.productprice}>{product.price}</div>
          <div className={styles.productprice}>
            Quantity Left: {product.quantity}
          </div>
          <button
            className={styles.cardbutton}
            style={{ backgroundColor: "green" }}
            onClick={() => onCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </>
  );
}

const HomePage = () => {
  const productContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("phones");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");


  
  const [searchInput, setSearchInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearch = (event) => {
    const input = event.target.value;
    setSearchInput(input);

    const filteredPhones = phones.filter((product) =>
      product.name.toLowerCase().includes(input.toLowerCase())
    );
    const filteredTablets = tablets.filter((product) =>
      product.name.toLowerCase().includes(input.toLowerCase())
    );
    const filteredLaptops = laptops.filter((product) =>
      product.name.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredProducts({
      phones: filteredPhones,
      tablets: filteredTablets,
      laptops: filteredLaptops,
    });
  };


  console.log("Products:", products);
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const showSuccessMessage = (message) => {
    setMsg(message);
    setTimeout(() => {
      setMsg(null);
    }, 3000);
  };

  // Function to show error message
  const showErrorMessage = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleCart = async (product) => {
    // Check if the user is logged in by retrieving the token from the cookie
    const token = getCookie("jwtUtoken");
    if (!token) {
      alert("Please login to add products to the cart.");
      return;
    }

    // Send the request to add the product to the user's cart
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/cart",
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccessMessage(response.data.message);
      console.log(response.data.message); // Success message from the server
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        showErrorMessage(error.response.data.message);
      }
    }
  };
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/producttask/products"
      );
      setProducts(data);
      console.log("Response data:", data); // Check the response data
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const phones = products.filter(
    (product) => product.type === "phone" && product.quantity >= 1
  );
  const tablets = products.filter(
    (product) => product.type === "tablet" && product.quantity >= 1
  );
  const laptops = products.filter(
    (product) => product.type === "laptop" && product.quantity >= 1
  );

  return (
    <>
      <div className={styles.homeContainer}>
        <GlobalStyle />

        <div className={styles.searchbar}>
          <input type="text" placeholder="Search products..." value={searchInput} onChange={handleSearch} />
          <button className={styles.searchbutton}>Search</button>
        </div>
        <div className={styles.logoContainer}>
          <button
            className={styles.logo1}
            onClick={() => handleTabClick("phones")}
          >
            Phone
          </button>
          <span> </span>
          <button
            className={styles.logo2}
            onClick={() => handleTabClick("tablets")}
          >
            Tablet
          </button>
          <span> </span>
          <button
            className={styles.logo3}
            onClick={() => handleTabClick("laptops")}
          >
            Laptop
          </button>
        </div>
        {msg && <div className={styles.msg}>{msg}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.productcontainer} ref={productContainerRef}>
          {activeTab === "phones" && (
            <Phones products={filteredProducts.phones || phones} onCart={handleCart} />
          )}
          {activeTab === "tablets" && (
            <Tablet  products={filteredProducts.tablets || tablets} onCart={handleCart} />
          )}
          {activeTab === "laptops" && (
            <Laptop  products={filteredProducts.laptops || laptops} onCart={handleCart} />
          )}
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
// Global styles
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

export default HomePage;
