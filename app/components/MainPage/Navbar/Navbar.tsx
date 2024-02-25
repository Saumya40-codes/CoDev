import React from 'react'
import Image from 'next/image'
import logo from '../../../../styles/images/logo.png'
import styles from './navbar.module.css'

const Navbar = () => {
  return (
    <div className={styles.mainNav}>
      <div className={styles.codev}>
        <Image src={logo} alt="Logo" width={100} height={100} />
        <span className={styles.nameDash}>
            /
        </span>
        <span className={styles.name}>
            coDev
        </span>
      </div>
    </div>
  )
}

export default Navbar
