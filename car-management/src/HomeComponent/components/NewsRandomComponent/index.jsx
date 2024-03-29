import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './styles.module.css'
import { Link } from 'react-router-dom'

const RandomNewsComponent = () => {
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
            <h2 className={styles.title}>Tin tức hôm nay</h2>
            <div className={`${styles.list}`}>
                {randomNews.map((news, index) => (
                    <div key={index} className={styles.carItem}>
                        <div className={`${styles.contentItemCar}`}>
                            <table border={0} className={styles.table}>
                                <tbody>
                                    <tr>
                                        <td className={`${styles.titleTable}`}>
                                            <span style={{ fontWeight: 'bold' }}>{news.title}</span>
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
                    </div>
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
