import React from 'react'
import styles from './contents.module.css'

const Contents = () => {
  return (
    <div>
        <div className={styles.mainContent}>
            <span>
                Do your coding work all Together
            </span>
            <button className={styles.mainButton}>
                Get Started
            </button>
        </div>
    </div>
  )
}

export default Contents
