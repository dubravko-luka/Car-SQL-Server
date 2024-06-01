import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styles from './styles.module.css'; // Import file CSS để áp dụng style
import axios from 'axios';

const HorizontalMenu = () => {

  const [userData, setUserData] = useState(null);
  const [loged, setLoged] = useState(false)
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;

      axios.get('/myaccount')
        .then(response => {
          setLoged(true)
          setUserData(response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });

    } else {
      setLoged(false)
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <div className={styles.menu}>
      {/* Logo */}
      <Link to="/" className={styles.logo}>
        <img src="/logo.png" alt="Logo" />
      </Link>

      {/* Menu Items */}
      <div className={styles.menuItems}>
        <Link to="/" className={`${styles.menuItem} ${location.pathname === '/' ? styles.active : ''}`}>Trang chủ</Link>
        <Link to="/car" className={`${styles.menuItem} ${location.pathname === '/car' ? styles.active : ''}`}>Xe trưng bày</Link>
        <Link to="/contact" className={`${styles.menuItem} ${location.pathname === '/contact' ? styles.active : ''}`}>Liên hệ tư vấn</Link>
      </div>

      {/* Avatar and Account */}
      <div className={styles.avatar}>
        {
          loged && <Link styles={{ marginRight: '10px' }} to="/myaccount">
            <div className={`${styles.wrapAvtarImg}`}>
              <img src={userData.avatar} alt="Avatar" />
            </div>
          </Link>
        }
        {
          loged
            ? (
              <span
                onClick={() => {
                  localStorage.removeItem('token')
                  history.push('/login')
                }}
                className={styles.link}
                to="/myaccount"
              >
                Đăng xuất
              </span>
            )
            : <Link className={styles.link} to="/login" >Đăng nhập</Link>
        }
      </div>
    </div>
  );
}

export default HorizontalMenu;
