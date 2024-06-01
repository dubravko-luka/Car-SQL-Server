// PrivateRoute.js
import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Gắn token vào tiêu đề Authorization của yêu cầu Axios
          axios.defaults.headers.common['Authorization'] = `${token}`;
          const response = await axios.get('/verify');
          if (response.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
