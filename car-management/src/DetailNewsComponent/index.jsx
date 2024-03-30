import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import styles from './styles.module.css'
import NewsRandomComponent from './components/NewsRandomComponent'
import moment from 'moment'
import axios from 'axios';

const NewsDetailPage = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    useEffect(() => {

        const fetchNewsDetail = async () => {
            try {
                const response = await axios.get(`/news/${id}`);
                setNews(response.data[0]);
            } catch (error) {
                console.error('Error fetching news detail:', error);
            }
        };

        fetchNewsDetail();
    }, [id]);


    if (!news) {
        return <div className='w-full flex justify-center'>Loading...</div>;
    }


    return (
        <div className={`${styles.wrapper}`}>
            <div className={`${styles.container}`}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to="/" className={styles.backButton}>Quay lại</Link>
                </div>
                <div className='flex justify-center' style={{ gap: '20px' }}>
                    <div style={{ maxWidth: '100%', width: '100%', boxShadow: '5px 5px 5px 0px rgba(0, 0, 0, .2)', padding: '0px 10px', boxSizing: 'border-box', borderRadius: '5px', overflow: 'hidden' }}>
                        <h2 className={styles.title}>{news.title}</h2>
                        <p style={{ fontSize: '14px', textAlign: 'right' }}>{moment(news.createdAt).format('DD-MM-YYYY HH:MM:SS')}</p>
                        <hr />
                        <div dangerouslySetInnerHTML={{ __html: news.content }}></div>
                    </div>
                    <NewsRandomComponent cate_id={news.cate_id} />
                </div>
            </div>
        </div>
    );
};

export default NewsDetailPage;
