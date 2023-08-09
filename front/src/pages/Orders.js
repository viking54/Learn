import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "../css/home.module.css"; 
import { useNavigate } from "react-router-dom";
import { createGlobalStyle } from 'styled-components';
import ConfirmationDialog from './ConfirmationDialog';

function Cart({ cart , onDelete, onBuy }) {

  return (
    <>
        {cart.map((product) => (
    <div key={product._id} className={styles.productcard}>
   <img className={styles.productimage} src={`https://gadgetshop.onrender.com/${product.image}`} alt={product.name} />
    
    <div className={styles.producttitle}>{product.name}</div>
    <div className={styles.productprice}>{product.price}</div>
    <div className={styles.productprice}>
        {product.quantity > 0 ? (
          <>
            <span >Quantity Left: </span>
            {product.quantity}
          </>
        ) : (
          <span style={{ color: "red" }}>Sold</span>
        )}
      </div>
    <button className={styles.cardbutton} style={{ backgroundColor: 'green' }} onClick={() => onBuy(product)}>Buy Now</button>
          <button className={styles.cardbutton} style={{ backgroundColor: 'red' }}  onClick={() => onDelete(product._id)}>Remove From Cart</button>
  </div>
    
    ))}
  
    </>
  );
}

function Ordr({order , onCancel}) {

     

  return (
   <>     {order.map((product) => (
    <div key={product._id} className={styles.productcard}>
   <img className={styles.productimage} src={`https://gadgetshop.onrender.com/${product.image}`} alt={product.name} />
    <div className={styles.producttitle}>{product.name}</div>
    <div className={styles.productprice}>{product.price}</div>
    {product.status!=="Delivered" && product.status!=="Cancelled"   && ( <button className={styles.cardbutton} style={{ backgroundColor: 'brown' }} onClick={() => onCancel(product._id)}>Cancel Order</button>)}
   
    <h1 style={{marginTop:'20px', fontSize:"20px", color:"green"   }} >Status </h1>

    <h1 style={{marginTop:'20px', fontSize:"20px"}}> {product.status ? product.status : "Pending"} </h1>
        
  </div>
    
    ))}
  </>
  )
  
}

const Orders = () => {
  const productContainerRef = useRef(null);
  const [userData, setUserData] = useState({});
  const [products,setProducts] = useState([]);
  const[orderProducts,setOrderProducts] = useState([]);
  const Navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cart');
  const [showDialog, setShowDialog] = useState(false);
  const [productToCancel, setProductToCancel] = useState(null);

  const fetchCart = async() => {
   
    try {
      const { data } = await axios.get(`https://gadgetshop.onrender.com/api/producttask/cartCall/${userData._id}`);
   
      setProducts(data);
      console.log('Response data:', data); // Check the response data
     
    } catch (error) {
      console.error('Error fetching products:', error);
    }
   
  };

  const fetchOrders = async() => {
   
    try {
      const { data } = await axios.get(`https://gadgetshop.onrender.com/api/producttask/orderCall/${userData._id}`);
      setOrderProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
   
  };

 

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
  const handlefnClick = (tab) => {
    setActiveTab(tab);
    fetchOrders();
  };
  const callPage = async () => {
    try {
      const res = await fetch("https://gadgetshop.onrender.com/api/sellerauth/authUser", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
   
      const data = await res.json();
      setUserData(data);
      console.log(userData);


      if (!res.ok) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.log(error);
      Navigate("/login");
      window.alert("Login As a User");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`https://gadgetshop.onrender.com/api/producttask/cartproducts/${productId}/${userData._id}`);
      fetchCart(); 
    } catch (error) {
      console.error('Error deleting product:', error);
    }
   
  };


  const handleCancel = async (orderId) => {
    console.log("hello")
    setProductToCancel(orderId);
    setShowDialog(true);

  }


  const handleConfirmCancel = async () => {
    const status = "Cancelled"
    try {
      const response = await axios.put(
        `https://gadgetshop.onrender.com/api/producttask/updateOrderStatus/${productToCancel}`,
        { status }
      );
  
      if (response.status === 200) {
       
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
    setShowDialog(false);
  };

  const handleCancelCancel = () => {
    setShowDialog(false);
  };

  const handleBuy = (product) =>{
  

    Navigate('/orderConfirm', { state: { product, userData } });
  } 

 
  
  

  useEffect(() => {
    callPage();
    if (userData._id) {
      fetchCart(); 
    }
  }, [userData._id]);

  

  return (
    <>

      <div className={styles.homeContainer}>

        <GlobalStyle />
        <div className={styles.sellName}>
          <h3><span className={styles.hellotext}>Hi : </span> {userData.name}</h3>
        </div>
        <div className={styles.logoContainer}>
          <button className={styles.logo1}   onClick={() => handlefnClick("cart")} >Cart</button>
          <span> </span>
          <button className={styles.logo2} onClick={() => handlefnClick("orders")} >My Orders</button>
        </div>
        <div className={styles.productcontainer} ref={productContainerRef}>
        {activeTab  === 'cart' && <Cart cart={products} onDelete={handleDelete} onBuy={handleBuy} />}
        
          {activeTab === 'orders' && <Ordr order={orderProducts} onCancel={handleCancel}  />}
        </div>
      </div>
      <button className={`${styles.sliderbutton} ${styles.left}`} onClick={() => handleSlider('left')}>&#8249;</button>
      <button className={`${styles.sliderbutton} ${styles.right}`} onClick={() => handleSlider('right')}>&#8250;</button>

   
      
   
    {showDialog && (
      <ConfirmationDialog
        message="Are you sure you Cancel This Order?"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
      />
    )}

    </>
  );
}


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

export default Orders;
