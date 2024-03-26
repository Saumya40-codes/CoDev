import React from 'react'
import styles from './dashboard.module.css'
import Navbar from '../components/MainPage/Navbar/Navbar'
import DashboardContents from '../components/Dashboard/Dashboard'
import RecentActivity from '../components/Dashboard/RecentActivity/RecentActivity'

const Dashboard = async () => {
  return (
    <div className={styles.mains}>
        <Navbar />
        <DashboardContents />
        <RecentActivity />
    </div>
  )
}

export default Dashboard
