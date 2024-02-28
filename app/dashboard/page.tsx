import React from 'react'
import styles from './dashboard.module.css'
import Navbar from '../components/MainPage/Navbar/Navbar'

const Dashboard = () => {
  return (
    <div className={styles.mains}>
        <Navbar />
        <div className={styles.dashBody}>
        <div className={styles.newProj}>
            <span>
                Create a new Project
            </span>
            <button className={styles.createButton}>
                Create
            </button>
            <hr className={styles.ruler} />
        </div>
        <div className={styles.recProjects}>
            <span>
                Recent Activity
            </span>
        </div>
        </div>
    </div>
  )
}

export default Dashboard
