// MyAccountComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../../../helpers/toast';
import { useHistory } from 'react-router-dom';
import CarDetailComponent from '../../../DetailCarComponent';

function MyAccountComponent() {
  const [carList, setCarList] = useState([]);
  const history = useHistory()
  const [idViewCar, setIdViewCar] = useState(0)

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    const formattedValue = Number(cleanValue).toLocaleString('vi-VN');
    return formattedValue;
  };

  useEffect(() => {

    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `${token}`;

    axios.get('/myaccount')
      .then(response => {
        if (response.data.role_id !== 1) {
          history.push('/')
        }
      })
      .catch(error => {
        history.push('/')
      });

    axios.get('/cars-admin')
      .then(response => {
        setCarList(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    // eslint-disable-next-line
  }, []);

  const handleUpdateStatus = (carId, status) => {
    const loading = toastPending('Đang cập nhật')
    axios.put(`/cars-status`, { car_id: carId, status: status })
      .then(response => {
        axios.get('/cars-admin')
          .then(response => {
            setCarList(response.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        toastUpdateSuccess(loading, 'Cập nhật thành công')
      })
      .catch(error => {
        console.error('Error:', error);
        toastUpdateError(loading, 'Cập nhật thất bại')
      });
  };

  return (
    <>
      <div className={styles.buttonGroupCreate}>
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
              <th>Showrooms</th>
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
                <td>{car.creator_first_name} {car.creator_last_name}</td>
                <td>{car.status === 0 ? 'Chờ duyệt' : car.status === 1 ? 'Đang hoạt động' : 'Từ chối hiển thị'}</td>
                <td>
                  <div className={styles.buttonGroup}>
                    <button onClick={() => setIdViewCar(car.car_id)} className={styles.viewButton}>Chi tiết</button>
                    {
                      car.status === 0 || car.status === 2
                        ? <button onClick={() => handleUpdateStatus(car.car_id, 1)} className={styles.editButton}>Duyệt</button>
                        : <div className={`${styles.buttonEmpty}`}></div>
                    }
                    {
                      car.status === 0 || car.status === 1
                        ? <button onClick={() => handleUpdateStatus(car.car_id, 2)} className={styles.deleteButton}>Từ chối</button>
                        : <div className={`${styles.buttonEmpty}`}></div>
                    }
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
      {
        idViewCar !== 0 && (
          <div className={`${styles.modal}`}>
            <div className={`${styles.backdrop}`} onClick={() => setIdViewCar(0)}></div>
            <div className={`${styles.modalWrap}`}>
              <div className={`${styles.close}`} onClick={() => setIdViewCar(0)}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.41422" width="21" height="2" transform="rotate(45 1.41422 0)" fill="white" />
                  <rect y="14.8492" width="21" height="2" transform="rotate(-45 0 14.8492)" fill="white" />
                </svg>
              </div>
              <div className={`${styles.modalContent}`}>
                <CarDetailComponent idCar={idViewCar} showBack={false} />
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}

export default MyAccountComponent;
