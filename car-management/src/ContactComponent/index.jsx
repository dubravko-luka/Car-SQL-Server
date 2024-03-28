import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../helpers/toast';

const ContactForm = () => {
  const [contactInfo, setContactInfo] = useState({
    garage_id: '',
    full_name: '',
    gender: '',
    price_range: '',
    phone: '',
  });
  const [error, setError] = useState({});

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/[^\d]/g, ''); // Loại bỏ ký tự không phải số
    const formattedValue = Number(cleanValue).toLocaleString('vi-VN'); // Định dạng số theo tiêu chuẩn Việt Nam
    return formattedValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prevState => ({
      ...prevState,
      [name]: name === 'price_range' ? formatCurrency(value) : value
    }));
  };

  const handleCreateContact = async () => {
    setError(prevState => (
      {
        ...prevState,
        garage_id: !contactInfo.garage_id?.trim() ? 'Hình ảnh là bắt buộc' : '',
        full_name: !contactInfo.full_name?.trim() ? 'Tên xe là bắt buộc' : '',
        gender: !contactInfo.gender?.trim() ? 'Thương hiệu là bắt buộc' : '',
        price_range: !contactInfo.price_range?.trim() ? 'Mẫu xe là bắt buộc' : '',
        phone: !contactInfo.phone?.trim() ? 'Năm sản xuất là bắt buộc' : '',
      }
    ));

    if (
      !contactInfo.garage_id?.trim() ||
      !contactInfo.full_name?.trim() ||
      !contactInfo.gender?.trim() ||
      !contactInfo.price_range?.trim() ||
      !contactInfo.phone?.trim()
    ) {
      return;
    }

    const loading = toastPending('Đang đăng ký')
    try {
      await axios.post('/contacts', {
        ...contactInfo,
        price_range: contactInfo.price_range.replace(/[.,]/g, "")
      }).then((res) => {
        toastUpdateSuccess(loading, 'Đăng ký thành công')
        setContactInfo({
          garage_id: '',
          full_name: '',
          gender: '',
          price_range: '',
          phone: ''
        })
      });
      // Thực hiện các hành động sau khi tạo contact thành công (VD: hiển thị thông báo, redirect...)
    } catch (error) {
      console.error('Error creating contact:', error);
      toastUpdateError(loading, 'Đăng ký thất bại')
      // Xử lý lỗi (VD: hiển thị thông báo lỗi)
    }
  }

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `${token}`;

      const response = await axios.get('/users');
      setUserList(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div style={{ width: '100%' }}>
        <div className={styles.container}>
          <table border={1} className={styles.formTable}>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <h2 className={styles.title}>Đăng ký tư vấn</h2>
                </td>
              </tr>
              <tr>
                <td><label htmlFor="selectedUser">Chọn Showroom</label></td>
                <td>
                {error.garage_id && <div className='error'>{error.garage_id}</div>}
                  <select id="selectedUser" name="garage_id" value={contactInfo.garage_id} onChange={handleChange}>
                    <option value="">-- Showroom --</option>
                    {userList.map(user => (
                      <option key={user.user_id} value={user.user_id}>{user.username}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td><label htmlFor="fullName">Tên quý khách:</label></td>
                <td>
                  {error.full_name && <div className='error'>{error.full_name}</div>}
                  <input type="text" id="fullName" name="full_name" value={contactInfo.full_name} onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="gender">Giới tính:</label></td>
                <td>
                {error.gender && <div className='error'>{error.gender}</div>}
                  <select id="gender" name="gender" value={contactInfo.gender} onChange={handleChange}>
                    <option value="">-- Giới Tính --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><label htmlFor="priceRange">Giá khoảng:</label></td>
                <td>
                {error.price_range && <div className='error'>{error.price_range}</div>}
                  <input type="text" id="priceRange" name="price_range" value={contactInfo.price_range} onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="phone">Phone:</label></td>
                <td>
                {error.phone && <div className='error'>{error.phone}</div>}
                <input type="phone" id="phone" name="phone" value={contactInfo.phone} onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleCreateContact} className={styles.createButton}>Gửi</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
