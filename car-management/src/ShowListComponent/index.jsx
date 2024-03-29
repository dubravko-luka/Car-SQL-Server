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
    year: '',
    cate_id: ''
  });
  const [brandList, setBrandList] = useState([]);
  const [cateList, setCateList] = useState([]);

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/[^\d]/g, ''); // Loại bỏ ký tự không phải số
    const formattedValue = Number(cleanValue).toLocaleString('vi-VN'); // Định dạng số theo tiêu chuẩn Việt Nam
    return formattedValue;
  };

  useEffect(() => {
    axios.get('/cars', {
      params: {
        ...filters,
        year: filters.year.length < 4 ? '' : filters.year
      }
    })
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

      axios.get('/categories')
      .then(response => {
        setCateList(response.data);
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
          <table border={0} className={styles.carTable}>
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
                    name="cate_id"
                    value={filters.cate_id}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {cateList.map(cate => (
                      <option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</option>
                    ))}
                  </select>
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
              </tr>
              <tr>
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
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={`${styles.list}`}>
          {carList.map((car, index) => (
            <Link
              className={styles.link}
              to={{
                pathname: `/car/detail/${car.car_id}`,
                state: { from: '/car' }
              }}
            >
              <div key={index} className={styles.carItem}>
                <div key={index} className={`${styles.wrapImgCar}`}>
                  <img
                    className={styles.imgCar}
                    src={
                      car.image ?? 'https://img.freepik.com/premium-vector/car-logo-vector-illustration_762078-124.jpg'
                    }
                    alt=""
                  />
                </div>
                <div className={`${styles.contentItemCar}`}>
                  <table border={0} className={styles.table}>
                    <tbody>
                      <tr>
                        <td colSpan={2}>
                          <span className={styles.titleCar}>{car.car_name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style={{ fontSize: '16px', color: '#000' }}>Giá xe</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 'bold', color: '#00498D', fontSize: '18px', textAlign: 'right' }}>{formatCurrency(car.price)} VNĐ</span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <span style={{ fontSize: '12px', color: '#077DC2' }}>Chưa bao gồm thuế, phí</span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className={`${styles.showRoom}`}>

                            <div className={`${styles.avatar}`}>
                              <img src={car.creator_avatar} alt="" />
                            </div>
                            <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                              {car.creator_first_name} {car.creator_last_name}
                            </span>

                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default ShowListComponent;
