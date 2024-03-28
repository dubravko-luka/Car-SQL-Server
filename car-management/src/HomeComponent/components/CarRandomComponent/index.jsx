import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import styles from './styles.module.css'

const RandomCarsComponent = () => {
    const [randomCars, setRandomCars] = useState([]);

    useEffect(() => {
        getRandomCars();
    }, []);

    const getRandomCars = async () => {
        try {
            const response = await axios.get('/random-cars');
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
            <h2 className={styles.title}>Xe mới đăng</h2>
            <div className={`${styles.list}`}>
                {randomCars.map((car, index) => (
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
                                            <span>{car.creator_detail}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} style={{ textAlign: 'center' }}>
                                            <Link
                                                to={{
                                                    pathname: `/car/detail/${car.car_id}`,
                                                    state: { from: '/' }
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
