import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import moment from 'moment';

const RandomNewsComponent = ({ title }) => {
    const [randomNews, setRandomNews] = useState([]);
    const [showFullContent, setShowFullContent] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            if (contentRef.current.clientHeight >= 120) {
                setShowFullContent(false);
            } else {
                setShowFullContent(true);
            }
        } else {
            setShowFullContent(false)
        }
    }, [contentRef]);

    useEffect(() => {
        getRandomNews();
    }, []);

    const getRandomNews = async () => {
        try {
            const response = await axios.get('/random-news');
            setRandomNews(response.data);
        } catch (error) {
            console.error('Error fetching random news:', error);
        }
    };

    return (
        <>
            <h2 className={styles.title}>{title}</h2>
            <div className={`${styles.list}`}>
                {randomNews.map((news, index) => (
                    <Link key={index} to={`/news/detail/${news.news_id}`} className={styles.carItem}>
                        <div className={`${styles.contentItemCar}`}>
                            <table border={0} className={styles.table}>
                                <tbody>
                                    <tr>
                                        <td className={`${styles.titleTable}`}>
                                            <span style={{ fontWeight: 'bold' }}>{news.title}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={`${styles.titleTableTime}`}>
                                            <span style={{ fontSize: '12px' }}>{moment(news.createdAt).format('DD/MM/YYYY HH:mm:ssqu')}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ position: 'relative' }}>
                                            <div ref={contentRef} style={{ height: showFullContent ? 'auto' : '120px', overflow: 'hidden' }}>
                                                <div className={styles.contentNews} dangerouslySetInnerHTML={{ __html: news.content }} />
                                            </div>
                                            {!showFullContent && <div className={styles.more}></div>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Link>
                ))}
            </div>
            {
                randomNews.length === 0 && (
                    <div className="w-full flex justify-center">
                        <div className='loading'></div>
                    </div>
                )
            }
        </>
    );
};

export default RandomNewsComponent;
