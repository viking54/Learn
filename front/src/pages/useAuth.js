// useAuth.js
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the token exists in the cookie
    const token = Cookies.get('jwttoken');
    console.log(token);
    // If the token exists, the user is authenticated
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated };
};

export default useAuth;

// Helper function to get the cookie value by name
