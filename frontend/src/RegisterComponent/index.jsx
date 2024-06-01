import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css'
import { Link, useHistory } from 'react-router-dom'
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../helpers/toast';

function RegisterComponent() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState({});

  const history = useHistory();

  const handleRegister = () => {

    setError(prevState => (
      {
        ...prevState,
        username: !username?.trim() ? 'Tên đăng nhập là bắt buộc' : '',
        password: !password?.trim() ? 'Mật khẩu là bắt buộc' : '',
        first_name: !first_name?.trim() ? 'Tên là bắt buộc' : '',
        last_name: !last_name?.trim() ? 'Họ là bắt buộc' : '',
        phone: !phone?.trim() ? 'Số điện thoại là bắt buộc' : '',
      }
    ));

    if (
      !username?.trim() ||
      !password?.trim() ||
      !first_name?.trim() ||
      !last_name?.trim() ||
      !phone?.trim()
    ) {
      return;
    }

    const loading = toastPending('Đang đăng ký')
    axios.post('/register', { username, password, first_name, last_name, phone })
      .then(response => {
        toastUpdateSuccess(loading, 'Đăng ký thành công')
        history.push('/login');
      })
      .catch(error => {
        toastUpdateError(loading, 'Đăng ký thất bại')
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={`${styles.wrapTitle}`}>
          <div className={`${styles.titleContent}`}>
            <Link to={'/login'}>
              <div className={styles.title}>
                Login
              </div>
            </Link>
            <div className={`${styles.title} ${styles.active}`}>Register</div>
          </div>
        </div>
        <div className={`${styles.content}`}>
          {error.phone && <div className='error'>{error.phone}</div>}
          <input className={styles.input} type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

          {error.first_name && <div className='error'>{error.first_name}</div>}
          <input className={styles.input} type="text" placeholder="Firstname" value={first_name} onChange={(e) => setFirstName(e.target.value)} />

          {error.last_name && <div className='error'>{error.last_name}</div>}
          <input className={styles.input} type="text" placeholder="Lastname" value={last_name} onChange={(e) => setLastName(e.target.value)} />

          {error.username && <div className='error'>{error.username}</div>}
          <input className={styles.input} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

          {error.password && <div className='error'>{error.password}</div>}
          <input className={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className={styles.button} onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default RegisterComponent;
