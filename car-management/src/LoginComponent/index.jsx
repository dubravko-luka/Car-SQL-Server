// LoginComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css'
import { Link, useHistory } from 'react-router-dom'
import { toastPending, toastUpdateError, toastUpdateSuccess } from '../helpers/toast';

function LoginComponent() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  const history = useHistory();

  const handleLogin = () => {
    setError(prevState => (
      {
        ...prevState,
        username: !username?.trim() ? 'Tên đăng nhập là bắt buộc' : '',
        password: !password?.trim() ? 'Mật khẩu là bắt buộc' : ''
      }
    ));

    if (
      !username?.trim() ||
      !password?.trim()
    ) {
      return;
    }

    const loading = toastPending('Đang đăng nhập')
    axios.post('/login', { username, password })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        toastUpdateSuccess(loading, 'Đăng nhập thành công')
        history.push('/myaccount');
      })
      .catch(error => {
        toastUpdateError(loading, 'Đăng nhập thất bại')
      });
  };

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `${token}`;
          const response = await axios.get('/verify');
          if (response.status === 200) {
            history.push('/myaccount');
          }
        } catch (err) {
          // 
        }
      }
    };
  
    // eslint-disable-next-line
    verifyToken();

    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2>Login</h2>
        {error.username && <div className='error'>{error.username}</div>}
        <input className={styles.input} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        {error.password && <div className='error'>{error.password}</div>}
        <input className={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className={styles.button} onClick={handleLogin}>Login</button>
        <Link to={'/register'} className={styles.register}>Register</Link>
      </div>
    </div>
  );
}

export default LoginComponent;
