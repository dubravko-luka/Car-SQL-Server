// MyAccountComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import MyCar from './components/MyCar'
import CarAdmin from './components/CarAdmin'
import MyContact from './components/MyContact'
import { formatNumber } from 'utils';

function MyAccountComponent() {
  const [userData, setUserData] = useState(null);
  const [tab, setTab] = useState(0)

  useEffect(() => {

    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `${token}`;

    axios.get('/myaccount')
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thông tin cá nhân</h2>
      {userData && (
        <>
          <div className={`${styles.wrapMyInfo}`}>
            <div className={`${styles.userData} ${styles.userDataInfo}`}>
              <div className='w-full'>
                <p className={styles.userInfo}>
                  <p className={styles.label}>Họ</p>
                  <p className={styles.value}>{userData.first_name}</p>
                </p>
                <p className={styles.userInfo}>
                  <p className={styles.label}>Tên</p>
                  <p className={styles.value}>{userData.last_name}</p>
                </p>
                <p className={styles.userInfo}>
                  <p className={styles.label}>Username</p>
                  <p className={styles.value}>{userData.username}</p>
                </p>
                <p className={styles.userInfo}>
                  <p className={styles.label}>Số điện thoại</p>
                  <p className={styles.value}>(+84) {formatNumber(userData.phone) ?? '-'}</p>
                </p>
              </div>
            </div>

            <div className={styles.userData}>
              <div className='w-full'>
                <p className={styles.userInfo}>
                  <p className={styles.label}>Ảnh đại diện</p>
                </p>
                <div className={styles.avatar}>
                  <img src={userData.avatar} alt="avatar" />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className={styles.buttonGroupCreate} style={{ justifyContent: 'flex-end' }}>
                <Link to="/myaccount/edit" className={styles.updateInfoButton}>Cập nhật thông tin</Link>
              </div>
            </div>
          </div>
        </>
      )}
      <hr />

      <div className={`${styles.wrapTab}`}>
        <div
          className={`${styles.tab} ${tab === 0 ? styles.active : ''}`}
          onClick={() => {
            setTab(0)
          }}
        >
          Danh sách xe
        </div>
        {
          userData?.role_id !== 1 && (
            <div
              className={`${styles.tab} ${tab === 1 ? styles.active : ''}`}
              onClick={() => {
                setTab(1)
              }}
            >
              Danh sách liên hệ
            </div>
          )
        }
      </div>

      {
        userData?.role_id === 1 && (
          <CarAdmin />
        )
      }

      {
        userData?.role_id !== 1 && (
          <>
            {
              tab === 0 && <MyCar />
            }

            {
              tab === 1 && <MyContact />
            }
          </>
        )
      }
    </div>
  );
}

export default MyAccountComponent;
