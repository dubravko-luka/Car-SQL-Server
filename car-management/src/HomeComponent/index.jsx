import React from 'react'
import RandomCarsComponent from './components/CarRandomComponent'
import NewsRandomComponent from './components/NewsRandomComponent'
import styles from './styles.module.css'

const HomeComponent = () => {
    return (
        <>
            <div className={`${styles.wrapper}`}>
                <RandomCarsComponent />
                <br />
                <hr />
                <NewsRandomComponent />
                <br />
                <hr />
                <RandomCarsComponent />
                <br />
                <hr />
                <NewsRandomComponent />
            </div>
        </>
    )
}

export default HomeComponent