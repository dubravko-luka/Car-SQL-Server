// EditCarComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory, useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../helpers/toast';

function EditCarComponent() {
  const [image, setImage] = useState('');
  const [carName, setCarName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [cateId, setCateId] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [carDescription, setCarDesription] = useState('');
  const [carBrands, setCarBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const history = useHistory();
  const params = useParams()
  const [error, setError] = useState({});

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    const formattedValue = Number(cleanValue).toLocaleString('vi-VN');
    return formattedValue;
  };

  useEffect(() => {
    axios.get(`/cars/detail/${params.id}`)
      .then(response => {
        const carDetail = response.data;
        setCarName(carDetail.car_name);
        setBrandId(carDetail.brand_id.toString());
        setCateId(carDetail.cate_id.toString());
        setModel(carDetail.model);
        setYear(carDetail.year.toString());
        setImage(carDetail.image);
        try {
          setCarDesription(JSON.parse(carDetail.car_description));
        } catch {
          setCarDesription(carDetail.car_description);
        }
        setPrice(formatCurrency(carDetail.price))
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.get('/carBrands')
      .then(response => {
        setCarBrands(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.get('/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [params.id]);

  const handleEditCar = () => {

    setError(prevState => (
      {
        ...prevState,
        image: !image?.trim() ? 'Hình ảnh là bắt buộc' : '',
        carName: !carName?.trim() ? 'Tên xe là bắt buộc' : '',
        brandId: !brandId?.trim() ? 'Thương hiệu là bắt buộc' : '',
        model: !model?.trim() ? 'Mẫu xe là bắt buộc' : '',
        year: !year?.trim() ? 'Năm sản xuất là bắt buộc' : '',
        price: !price?.trim() ? 'Giá là bắt buộc' : '',
        cateId: !cateId?.trim() ? 'Danh mục là bắt buộc' : '',
      }
    ));

    if (
      !image?.trim() ||
      !carName?.trim() ||
      !brandId?.trim() ||
      !model?.trim() ||
      !year?.trim() ||
      !price?.trim() ||
      !cateId?.trim()
    ) {
      return;
    }

    const loading = toastPending('Đang cập nhật')
    axios.put(`/cars/edit/${params.id}`, { car_name: carName, brand_id: brandId, cate_id: cateId, image, model, year, price: price.replace(/[.,]/g, ""), car_description: JSON.stringify(carDescription) })
      .then(response => {
        toastUpdateSuccess(loading, 'Cập nhật thành công')
        history.push('/myaccount');
      })
      .catch(error => {
        toastUpdateError(loading, 'Cập nhật thất bại')
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
            <table border={0} className={styles.carTable}>
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <h2 className={styles.title}>Sửa thông tin xe</h2>
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
                    <label>Danh mục</label>
                  </td>
                  <td>
                    {error.cateId && <div className='error'>{error.cateId}</div>}
                    <select value={cateId} onChange={(e) => setCateId(e.target.value)} className={styles.select}>
                      <option value="">Danh mục</option>
                      {categories.map(cate => (
                        <option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</option>
                      ))}
                    </select>
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
                    <input
                      type="text"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(formatCurrency(e.target.value))}
                      className={styles.input}
                    />
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
                      <button onClick={handleEditCar} className={styles.createButton}>Cập nhật</button>
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

export default EditCarComponent;
