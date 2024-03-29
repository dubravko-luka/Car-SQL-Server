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
                console.log('-----TSX---->', response.data);
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
                <Link to={location?.state?.from ?? '/'} className={styles.backButton}>Quay lại</Link>
                <div className={styles.detailNameCar}>
                    <h2 className={styles.title}>{carDetail.car_name}</h2>
                </div>
                <div className={styles.detailPage}>
                    <table border={0}>
                        <tbody>
                            <tr style={{ display: 'flex', width: '100%' }}>
                                <td className={styles.tdImg}>
                                    <table border={0} className={styles.table2} style={{ height: '400px' }}>
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
                                <td className={styles.tdInfo}>
                                    <div className={styles.tdInfoDiv}>
                                        <table border={0} className={styles.table2}>
                                            <tbody>
                                                <tr className='flex justify-between w-full'>
                                                    <td>
                                                        <span style={{ fontSize: '13px' }}>Giá bán</span>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(carDetail.price)} VNĐ</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ paddingTop: '0px' }}>
                                                        <span style={{ fontSize: '10px', color: 'rgb(2 119 189)' }}>Chưa gồm thuế, phí</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={styles.tdInfoDiv}>
                                        <table border={0} className={styles.table2}>
                                            <tbody>
                                                <tr className='flex justify-between w-full'>
                                                    <td>
                                                        <span style={{ fontSize: '13px' }}>Danh mục xe</span>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontWeight: 'bold' }}>{carDetail.cate_name}</span>
                                                    </td>
                                                </tr>
                                                <tr className='flex justify-between w-full'>
                                                    <td>
                                                        <span style={{ fontSize: '13px' }}>Thương hiệu</span>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontWeight: 'bold' }}>{carDetail.brand_name}</span>
                                                    </td>
                                                </tr>
                                                <tr className='flex justify-between w-full'>
                                                    <td>
                                                        <span style={{ fontSize: '13px' }}>Mẫu xe</span>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontWeight: 'bold' }}>{carDetail.model}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={styles.tdInfoDiv}>
                                        <table border={0} className={styles.table2}>
                                            <tbody>
                                            <tr className='flex justify-between w-full'>
                                                    <td colSpan={2}>
                                                        <span style={{ fontWeight: 'bold' }}>Người bán</span>
                                                    </td>
                                                </tr>
                                                <tr className='flex justify-between w-full'>
                                                    <td colSpan={2}>
                                                        <div className={`${styles.showRoom}`}>
                                                            <div className={`${styles.avatar}`}>
                                                                <img src={carDetail.creator_avatar} alt="" />
                                                            </div>
                                                            <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                                                                {carDetail.creator_first_name} {carDetail.creator_last_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
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
