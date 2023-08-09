import React, { useEffect, useRef, useState } from 'react';
import styles from '../css/home.module.css'; 
import { createGlobalStyle } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationDialog from './ConfirmationDialog';

function SellerProducts({ products, onDelete }) {
  const Navi = useNavigate();
  const navigateToSellerEdit = (product) => {
    Navi("/edit", { state: product });
  };
  
  return (
    <>
      {products.map((product) => (
        <div key={product._id} className={styles.productcard}>
          <img className={styles.productimage} src={`https://gadgetshop.onrender.com/${product.image}`} alt={product.name} />
          <div className={styles.producttitle}>{product.name}</div>
          <div className={styles.productprice}>{product.price}</div>
          <div className={styles.productprice}>Quantity: {product.quantity}</div>
          <button className={styles.cardbutton} style={{ backgroundColor: 'green' }} onClick={() => navigateToSellerEdit(product)}>Edit</button>
          <button className={styles.cardbutton} style={{ backgroundColor: 'red' }} onClick={() => onDelete(product._id)}>Delete</button>
        </div>
      ))}
    </>
  );
}

const SellerArea = () => {
  const location = useLocation();
  const sellerData = location.state;
  const Navi = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const productContainerRef = useRef(null);
  const [products, setProducts] = useState([]);

  const handleSlider = (direction) => {
    const container = productContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else if (direction === 'right') {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`https://gadgetshop.onrender.com/api/producttask/products/${sellerData._id}`);
      setProducts(data);
      console.log('Response data:', data); // Check the response data
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId) => {
    setProductToDelete(productId);
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://gadgetshop.onrender.com/api/producttask/products/${productToDelete}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setShowDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDialog(false);
  };
  const navigateToSellerOrder = () => {
    Navi("/sellerOrders", { state: sellerData  });
  };

  return (
    <>
      <div className={styles.homeContainer}>
        <GlobalStyle />
        <div className={styles.sellName}>
          <h3><span className={styles.hellotext}>Hi : </span> {sellerData.name}</h3>
          <button  onClick={navigateToSellerOrder} className={styles.areabutton}>Orders</button>
        </div>
        <div className={styles.searchbar}>
          <input type="text" placeholder="Search products..." />
          <button className={styles.searchbutton}>Search</button>
        </div>
        <div className={styles.logoContainer}>
          <button className={styles.logo1}>Your Products</button>
        </div>
        <div className={styles.productcontainer} ref={productContainerRef}>
          <SellerProducts products={products} onDelete={handleDelete} />
        </div>
      </div>
      <button className={`${styles.sliderbutton} ${styles.left}`} onClick={() => handleSlider('left')}>&#8249;</button>
      <button className={`${styles.sliderbutton} ${styles.right}`} onClick={() => handleSlider('right')}>&#8250;</button>
      
      {showDialog && (
        <ConfirmationDialog
          message="Are you sure you want to delete this product?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
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
}`;

export default SellerArea;
