// ShowListComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import styles from './styles.module.css';

function ShowListComponent() {
  const [carList, setCarList] = useState([]);
  const [filters, setFilters] = useState({
    car_name: '',
    brand_id: '',
    model: '',
    year: ''
  });
  const [brandList, setBrandList] = useState([]);

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/[^\d]/g, ''); // Loại bỏ ký tự không phải số
    const formattedValue = Number(cleanValue).toLocaleString('vi-VN'); // Định dạng số theo tiêu chuẩn Việt Nam
    return formattedValue;
  };

  useEffect(() => {
    axios.get('/cars', { params: {
      ...filters,
      year: filters.year.length < 4 ? '' : filters.year
    } })
      .then(response => {
        setCarList(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [filters]);

  useEffect(() => {
    axios.get('/carBrands')
      .then(response => {
        setBrandList(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <>
      <div className={`${styles.wrapper}`}>
        <h2 className={styles.title}>Danh sách xe</h2>
        <div className={`${styles.filters}`}>
          <table className={styles.carTable}>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    name="car_name"
                    value={filters.car_name}
                    onChange={handleFilterChange}
                    placeholder="Tên xe"
                    className={styles.input}
                  />
                </td>
                <td>
                  <select
                    className={styles.select}
                    name="brand_id"
                    value={filters.brand_id}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brandList.map(brand => (
                      <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="model"
                    value={filters.model}
                    onChange={handleFilterChange}
                    placeholder="Mẫu xe"
                    className={styles.input}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                    placeholder="Năm sản xuất"
                    className={styles.input}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={`${styles.list}`}>
          {carList.map((car, index) => (
            <div key={index} className={styles.carItem}>
              <div className={`${styles.wrapImgCar}`}>
                <img
                  className={styles.imgCar}
                  src={
                    car.image ?? 'https://img.freepik.com/premium-vector/car-logo-vector-illustration_762078-124.jpg'
                  }
                  alt=""
                />
              </div>
              <div className={`${styles.contentItemCar}`}>
                <table border={1} className={styles.table}>
                  <tbody>
                    <tr>
                      <td>
                        <span>Tên xe</span>
                      </td>
                      <td>
                        <span>{car.car_name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>Thương hiệu</span>
                      </td>
                      <td>
                        <span>{car.brand}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>Mẫu xe</span>
                      </td>
                      <td>
                        <span>{car.model}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>Năm sản xuất</span>
                      </td>
                      <td>
                        <span>{car.year}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>Giá</span>
                      </td>
                      <td>
                        <span>{formatCurrency(car.price)}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>Showroom</span>
                      </td>
                      <td>
                        <span>{car.creator}</span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} style={{ textAlign: 'center' }}>
                        <Link
                          to={{
                            pathname: `/car/detail/${car.car_id}`,
                            state: { from: '/car' }
                          }}
                        >
                          <span>Xem chi tiết</span>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ShowListComponent;
