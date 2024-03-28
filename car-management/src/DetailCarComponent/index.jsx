import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link } from 'react-router-dom'
import styles from './styles.module.css'

function CarDetailComponent() {
    const [carDetail, setCarDetail] = useState(null);
    const location = useLocation();
    const params = useParams()

    useEffect(() => {
        axios.get(`/cars/detail/${params.id}`)
            .then(response => {
                setCarDetail(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [params.id]);

    if (!carDetail) {
        return <div>Loading...</div>;
    }

    const formatCurrency = (value) => {
        const cleanValue = value.replace(/[^\d]/g, ''); // Loại bỏ ký tự không phải số
        const formattedValue = Number(cleanValue).toLocaleString('vi-VN'); // Định dạng số theo tiêu chuẩn Việt Nam
        return formattedValue;
    };


    return (
        <div className={`${styles.wrapper}`}>
            <div className={`${styles.container}`}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={location?.state?.from ?? '/'} className={styles.backButton}>Quay lại</Link>
                </div>
                <h2 className={styles.title}>Chi tiết xe </h2>
                <div className={styles.detailPage}>
                    <table border={0}>
                        <tbody>
                            <tr style={{ display: 'flex' }}>
                                <td className={styles.tdImg}>
                                    <table border={1} className={styles.table2} style={{ height: '400px' }}>
                                        <tr style={{ background: '#fff' }}>
                                            <td style={{ padding: 0 }}>
                                                <div className={`${styles.wrapImg}`}>
                                                    <img
                                                        src={
                                                            carDetail.image ?? 'https://img.freepik.com/premium-vector/car-logo-vector-illustration_762078-124.jpg'
                                                        }
                                                        alt=""
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0px', width: '50%' }}>
                                    <table border={1} className={styles.table2}>
                                        <tbody>
                                            <tr>
                                                <td>Tên xe</td>
                                                <td>{carDetail.car_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Thương hiệu</td>
                                                <td>{carDetail.brand_detail}</td>
                                            </tr>
                                            <tr>
                                                <td>Mẫu xe</td>
                                                <td>{carDetail.model}</td>
                                            </tr>
                                            <tr>
                                                <td>Năm sản xuất</td>
                                                <td>{carDetail.year}</td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <span>Giá</span>
                                                </td>
                                                <td>
                                                    <span>{formatCurrency(carDetail.price)}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Showroom</td>
                                                <td>{carDetail.creator_detail}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table>
                        <tr>
                            <td>
                                <table border={1} className={styles.table2}>
                                    <tbody>
                                        <tr>
                                            <td style={{ textAlign: 'center' }} colSpan={2}>Mô tả</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: carDetail.car_description ?
                                                            JSON.parse(carDetail.car_description)?.replace(/\n/g, '<br />') :
                                                            `<p style="text-align: center">Không có mô tả</p>`
                                                    }}
                                                ></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CarDetailComponent;
