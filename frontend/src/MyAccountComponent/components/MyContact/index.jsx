// MyAccountComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../../../helpers/toast';

function MyAccountComponent() {
  const [contactList, setContactList] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `${token}`;

    axios.get('/contacts')
      .then(response => {
        setContactList(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

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
    <>
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
              <td>{contact.price_range}</td>
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
              <tr className={`${styles.carItem} ${styles.noData}`}>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  Không có dữ liệu
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </>
  );
}

export default MyAccountComponent;
