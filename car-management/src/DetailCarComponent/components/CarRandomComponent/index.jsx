import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import styles from './styles.module.css'

const RandomCarsComponent = ({ brand_id, cate_id }) => {
    const [randomCars, setRandomCars] = useState([]);

    useEffect(() => {
        getRandomCars();
        // eslint-disable-next-line
    }, []);

    const getRandomCars = async () => {
        try {
            const response = await axios.get(`/cars-some?brand_id=${brand_id}&cate_id=${cate_id}`);
            setRandomCars(response.data);
        } catch (error) {
            console.error('Error fetching random cars:', error);
        }
    };

    const formatCurrency = (value) => {
        const cleanValue = value.replace(/[^\d]/g, ''); // Loại bỏ ký tự không phải số
        const formattedValue = Number(cleanValue).toLocaleString('vi-VN'); // Định dạng số theo tiêu chuẩn Việt Nam
        return formattedValue;
    };

    return (
        <>
            <div style={{ borderTop: '1px solid rgba(0, 0, 0, .2)', marginTop: '20px' }}></div>
            <div className="flex justify-between items-center">
                <h2 className={styles.title}>Xe tương tự</h2>
                <Link className={styles.viewAll} to="/car">Xem tất cả →</Link>
            </div>
            <div className={`${styles.list}`}>
                {randomCars.map((car, index) => (
                    <Link
                        key={index}
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
            {
                randomCars.length === 0 && (
                    <div className="w-full flex justify-center">
                        <div className='loading'></div>
                    </div>
                )
            }
        </>
    );
};

export default RandomCarsComponent;
