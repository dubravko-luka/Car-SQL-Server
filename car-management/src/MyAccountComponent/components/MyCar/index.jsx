// MyAccountComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../../../helpers/toast';

function MyAccountComponent() {
  const [carList, setCarList] = useState([]);

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    const formattedValue = Number(cleanValue).toLocaleString('vi-VN');
    return formattedValue;
  };

  useEffect(() => {

    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `${token}`;

    axios.get('/mycars')
      .then(response => {
        setCarList(response.data);
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

  return (
    <>
      <div className={styles.buttonGroupCreate}>
        <Link to="/create" className={styles.createButton}>Thêm mới</Link>
      </div>
      <div className={`${styles.tableResponsive}`}>
        <table border={1} className={styles.carTable}>
          <thead>
            <tr>
              <th>Tên xe</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Mẫu xe</th>
              <th>Năm sản xuất</th>
              <th>Giá xe</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {carList.map(car => (
              <tr
                key={car.id}
                className={`${styles.carItem} ${car.status === 0 ? styles.pending : car.status === 1 ? styles.actived : styles.reject}`}
              >
                <td>{car.car_name}</td>
                <td>{car.cate_name}</td>
                <td>{car.brand_name}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>{formatCurrency(car.price)}</td>
                <td>{car.status === 0 ? 'Chờ duyệt' : car.status === 1 ? 'Đang hoạt động' : 'Từ chối hiển thị'}</td>
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
                <tr className={`${styles.carItem} ${styles.noData}`}>
                  <td colSpan={7} style={{ textAlign: 'center' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MyAccountComponent;
