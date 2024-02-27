import React from 'react'
import styles from './contents.module.css'
import Link from 'next/link'

const Contents = () => {
  return (
    <div>
        <div className={styles.mainContent}>
            <span>
                Do your coding work all <span className={styles.diff}>Together</span>
            </span>
            <Link href="/Editor">
            <button className={styles.mainButton}>
                Get Started
            </button>
            </Link>
        </div>
    </div>
  )
}

export default Contents
