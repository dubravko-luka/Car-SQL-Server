import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom'
import styles from './styles.module.css'
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../helpers/toast';

const UpdateUserInfo = () => {
  const history = useHistory()
  const [userInfo, setUserInfo] = useState({
    username: '',
    phone: '',
    avatar: '',
    first_name: '',
    last_name: '',
    password: '',
  });
  const [error, setError] = useState({});

  useEffect(() => {
    // Gọi API để lấy thông tin người dùng hiện tại
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `${token}`;

        const response = await axios.get('/myaccount');
        console.log('-----TSX---->', response.data);
        setUserInfo({
          ...response.data,
          password: ''
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {

    setError(prevState => (
      {
        ...prevState,
        first_name: !userInfo.first_name?.trim() ? 'Họ là bắt buộc' : '',
        last_name: !userInfo.last_name?.trim() ? 'Tên là bắt buộc' : '',
        phone: !userInfo.phone?.trim() ? 'Số điện thoại là bắt buộc' : '',
      }
    ));

    if (
      !userInfo.first_name?.trim() ||
      !userInfo.last_name?.trim() ||
      !userInfo.phone?.trim()
    ) {
      return;
    }

    const loading = toastPending('Đang cập nhật')
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `${token}`;

      await axios.put('/updateUserInfo', {
        phone: userInfo.phone,
        avatar: userInfo.avatar,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        password: userInfo.password,
      }).then((res) => {
        history.push('/myaccount')
        toastUpdateSuccess(loading, 'Cập nhật thành công')
      });
      // Xử lý thành công
    } catch (error) {
      console.log('Error updating user info:', error);
      toastUpdateError(loading, 'Cập nhật thất bại')
    }
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
                    <h2 className={styles.title}>Cập nhật thông tin</h2>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Username</label>
                  </td>
                  <td>
                    <input disabled type="text" name="username" value={userInfo.username} className={styles.input} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Họ</label>
                  </td>
                  <td>
                    {error.first_name && <div className='error'>{error.first_name}</div>}
                    <input type="text" name="first_name" onChange={handleChange} value={userInfo.first_name} className={styles.input} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Tên</label>
                  </td>
                  <td>
                    {error.last_name && <div className='error'>{error.last_name}</div>}
                    <input type="text" name="last_name" onChange={handleChange} value={userInfo.last_name} className={styles.input} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Số điện thoại</label>
                  </td>
                  <td>
                    {error.phone && <div className='error'>{error.phone}</div>}
                    <input type="text" name="phone" onChange={handleChange} value={userInfo.phone} className={styles.input} />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Mật khẩu</label>
                  </td>
                  <td>
                    <input type="password" name="password" onChange={handleChange} value={userInfo.password} className={styles.input} />
                  </td>
                </tr>

                {/* <tr>
                  <td>
                    <label>Thương hiệu</label>
                  </td>
                  <td>
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
                    <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} className={styles.input} />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Năm sản xuất</label>
                  </td>
                  <td>
                    <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className={styles.input} />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Mô tả</label>
                  </td>
                  <td>
                    <textarea style={{ resize: 'vertical' }} placeholder="Mô tả" value={carDescription} onChange={(e) => setCarDesription(e.target.value)} className={styles.input} />
                  </td>
                </tr> */}
                <tr>
                  <td colSpan={2}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={handleSubmit} className={styles.createButton}>Cập nhật</button>
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
};

export default UpdateUserInfo;
