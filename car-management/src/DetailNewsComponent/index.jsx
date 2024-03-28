import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import styles from './styles.module.css'
import moment from 'moment'
import axios from 'axios';

const NewsDetailPage = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    useEffect(() => {

        const fetchNewsDetail = async () => {
            try {
                const response = await axios.get(`/news/${id}`);
                setNews(response.data);
            } catch (error) {
                console.error('Error fetching news detail:', error);
            }
        };

        fetchNewsDetail();
    }, [id]);


    if (!news) {
        return <div>Loading...</div>;
    }


    return (
        <div className={`${styles.wrapper}`}>
            <div className={`${styles.container}`}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to="/" className={styles.backButton}>Quay lại</Link>
                </div>
                <h2 className={styles.title}>{news.title}</h2>
                <p style={{ fontSize: '14px', textAlign: 'right' }}>{moment().format('DD-MM-YYYY HH:MM:SS')}</p>
                <hr />
                <div dangerouslySetInnerHTML={{ __html: news.content }}></div>
            </div>
        </div>
    );
};

export default NewsDetailPage;
