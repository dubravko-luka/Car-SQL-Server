import React from 'react'
import RandomCarsComponent from './components/CarRandomComponent'
import NewsRandomComponent from './components/NewsRandomComponent'
import styles from './styles.module.css'

const HomeComponent = () => {
    return (
        <>
            <div className={`${styles.wrapper}`}>
                <RandomCarsComponent title="Xe mới đăng" />
                <br />
                <hr />
                <NewsRandomComponent title="Tin mới" />
                <br />
                <hr />
                <RandomCarsComponent title="Xe HOT" />
                <br />
                <hr />
                <NewsRandomComponent title="Tin tức gần đây" />
            </div>
        </>
    )
}

export default HomeComponent