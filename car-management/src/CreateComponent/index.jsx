// CarFormComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import styles from './styles.module.css';
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../helpers/toast';

function CarFormComponent() {
  const [image, setImage] = useState('');
  const [carName, setCarName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [carDescription, setCarDesription] = useState('');
  const [carBrands, setCarBrands] = useState([]);
  const history = useHistory();
  const [error, setError] = useState({});

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/[^\d]/g, ''); // Loại bỏ ký tự không phải số
    const formattedValue = Number(cleanValue).toLocaleString('vi-VN'); // Định dạng số theo tiêu chuẩn Việt Nam
    return formattedValue;
  };

  useEffect(() => {
    // Lấy danh sách các hãng xe từ API carBrands
    axios.get('/carBrands')
      .then(response => {
        setCarBrands(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleCreateCar = () => {

    setError(prevState => (
      {
        ...prevState,
        image: !image?.trim() ? 'Hình ảnh là bắt buộc' : '',
        carName: !carName?.trim() ? 'Tên xe là bắt buộc' : '',
        brandId: !brandId?.trim() ? 'Thương hiệu là bắt buộc' : '',
        model: !model?.trim() ? 'Mẫu xe là bắt buộc' : '',
        year: !year?.trim() ? 'Năm sản xuất là bắt buộc' : '',
        price: !price?.trim() ? 'Giá là bắt buộc' : '',
      }
    ));

    if (
      !image?.trim() ||
      !carName?.trim() ||
      !brandId?.trim() ||
      !model?.trim() ||
      !year?.trim() ||
      !price?.trim()
    ) {
      return;
    }

    const loading = toastPending('Đang tạo')
    axios.post('/cars/create', { car_name: carName, brand_id: brandId, model, image, year, price: price.replace(/[.,]/g, ""), car_description: JSON.stringify(carDescription) })
      .then(response => {
        toastUpdateSuccess(loading, 'Tạo thành công')
        history.push('/myaccount')
      })
      .catch(error => {
        toastUpdateError(loading, 'Tạo thất bại')
        console.error('Error:', error);
        // Hiển thị thông báo lỗi
      });
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div style={{ width: '100%' }}>
          <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/myaccount" className={styles.backButton}>Quay lại</Link>
            </div>
            <table border={1} className={styles.carTable}>
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <h2 className={styles.title}>Tạo mới xe</h2>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Link ảnh xe</label>
                  </td>
                  <td>

                    {error.image && <div className='error'>{error.image}</div>}
                    <input type="text" placeholder="Car link image" value={image} onChange={(e) => setImage(e.target.value)} className={styles.input} />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Tên xe</label>
                  </td>
                  <td>
                    {error.carName && <div className='error'>{error.carName}</div>}
                    <input type="text" placeholder="Car name" value={carName} onChange={(e) => setCarName(e.target.value)} className={styles.input} />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Thương hiệu</label>
                  </td>
                  <td>
                    {error.brandId && <div className='error'>{error.brandId}</div>}
                    <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className={styles.select}>
                      <option value="">Thương hiệu</option>
                      {carBrands.map(brand => (
                        <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Mẫu xe</label>
                  </td>
                  <td>
                    {error.model && <div className='error'>{error.model}</div>}
                    <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} className={styles.input} />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Năm sản xuất</label>
                  </td>
                  <td>
                    {error.year && <div className='error'>{error.year}</div>}
                    <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className={styles.input} />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Giá xe</label>
                  </td>
                  <td>
                    {error.price && <div className='error'>{error.price}</div>}
                    <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(formatCurrency(e.target.value))} className={styles.input} />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Mô tả</label>
                  </td>
                  <td>
                    <textarea style={{ resize: 'vertical' }} placeholder="Mô tả" value={carDescription} onChange={(e) => setCarDesription(e.target.value)} className={styles.input} />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={handleCreateCar} className={styles.createButton}>Tạo</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default CarFormComponent;
