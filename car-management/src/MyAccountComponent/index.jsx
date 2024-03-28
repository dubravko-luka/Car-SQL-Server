// MyAccountComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../helpers/toast';

function MyAccountComponent() {
  const [userData, setUserData] = useState(null);
  const [carList, setCarList] = useState([]);
  const [contactList, setContactList] = useState([]);

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/[^\d]/g, ''); // Loại bỏ ký tự không phải số
    const formattedValue = Number(cleanValue).toLocaleString('vi-VN'); // Định dạng số theo tiêu chuẩn Việt Nam
    return formattedValue;
  };

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

    axios.get('/mycars')
      .then(response => {
        setCarList(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.get('/contacts')
      .then(response => {
        setContactList(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleDeleteCar = (carId) => {
    const loading = toastPending('Đang xoá xe')
    const isConfirmed = window.confirm('Xoá thật nhé?');
    if (isConfirmed) {
      axios.delete(`/cars/delete/${carId}`)
        .then(response => {
          setCarList(carList.filter(car => car.car_id !== carId));
          toastUpdateSuccess(loading, 'Xoá thành công')
        })
        .catch(error => {
          console.error('Error:', error);
          toastUpdateError(loading, 'Xoá thất bại')
        });
    } else {
      toastUpdateError(loading, 'Từ chối xoá')
    }
  };

  const handleDeleteContact = (contactId) => {
    const loading = toastPending('Đang xoá yêu cầu tư vấn')
    const isConfirmed = window.confirm('Xoá thật nhé?');
    if (isConfirmed) {
      axios.delete(`/contacts/${contactId}`)
        .then(response => {
          setContactList(contactList.filter(contact => contact.contact_id !== contactId));
          toastUpdateSuccess(loading, 'Xoá thành công')
        })
        .catch(error => {
          console.error('Error:', error);
          toastUpdateError(loading, 'Xoá thất bại')
        });
    } else {
      toastUpdateError(loading, 'Từ chối xoá')
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tài khoản của tôi</h2>
      {userData && (
        <>
          <div className={styles.userData}>
            <img src={userData.avatar} alt="Avatar" className={styles.avatar} />
            <div>
              <p className={styles.userInfo}>
                <span>Tên Garage / Showroom</span>: {userData.first_name} {userData.last_name}
              </p>
              <p className={styles.userInfo}>
                <span>Username</span>: {userData.username}
              </p>
              <p className={styles.userInfo}>
                <span>Số điện thoại</span>: (+84) {Number(userData.phone).toLocaleString('it-IT') ?? '-'}
              </p>
            </div>
          </div>

          <div className={styles.buttonGroupCreate} style={{ justifyContent: 'flex-start' }}>
            <Link to="/myaccount/edit" className={styles.updateInfoButton}>Cập nhật thông tin</Link>
          </div>
        </>
      )}
      <hr />
      <h2 className={styles.carListTitle}>Danh sách xe của tôi</h2>
      <div className={styles.buttonGroupCreate}>
        <Link to="/create" className={styles.createButton}>Thêm mới</Link>
      </div>
      <table border={1} className={styles.carTable}>
        <thead>
          <tr>
            <th>Tên xe</th>
            <th>Thương hiệu</th>
            <th>Mẫu xe</th>
            <th>Năm sản xuất</th>
            <th>Giá xe</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {carList.map(car => (
            <tr key={car.id} className={styles.carItem}>
              <td>{car.car_name}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>{formatCurrency(car.price)}</td>
              <td>
                <div className={styles.buttonGroup}>
                  <Link to={`/edit/${car.car_id}`} className={styles.editButton}>Sửa</Link>
                  <button onClick={() => handleDeleteCar(car.car_id)} className={styles.deleteButton}>Xoá</button>
                </div>
              </td>
            </tr>
          ))}
          {
            carList.length === 0 && (
              <tr className={styles.carItem}>
                <td colSpan={6} style={{ textAlign: 'center' }}>
                  Không có dữ liệu
                </td>
              </tr>
            )
          }
        </tbody>
      </table>

      <h2 className={styles.carListTitle}>Danh sách tư vấn của tôi</h2>
      <table border={1} className={styles.carTable}>
        <thead>
          <tr>
            <th>Họ và Tên</th>
            <th>Giới tính</th>
            <th>Khoảng giá</th>
            <th>Số điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {contactList.map(contact => (
            <tr key={contact.contact_id} className={styles.carItem}>
              <td>{contact.full_name}</td>
              <td>{contact.gender === 'Male' ? 'Nam' : contact.gender === 'Femal' ? 'Nữ' : 'Khác'}</td>
              <td>{Number(contact.price_range).toLocaleString('it-IT')}</td>
              <td>(+84) {Number(contact.phone).toLocaleString('it-IT')}</td>
              <td>
                <div className={styles.buttonGroup}>
                  <button onClick={() => handleDeleteContact(contact.contact_id)} className={styles.deleteButton}>Xoá</button>
                </div>
              </td>
            </tr>
          ))}
          {
            contactList.length === 0 && (
              <tr className={styles.carItem}>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  Không có dữ liệu
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  );
}

export default MyAccountComponent;
