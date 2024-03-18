'use client'

import React from 'react'
import styles from './contents.module.css'
import { useRouter } from 'next/navigation'

const Contents = () => {

  const router = useRouter();

  return (
    <div>
        <div className={styles.mainContent}>
            <span>
                Do your coding work all <span className={styles.diff}>Together</span>
            </span>
            <button className={styles.mainButton} onClick={()=>router.push('/dashboard')}>
                Get Started
            </button>
        </div>
    </div>
  )
}

export default Contents
