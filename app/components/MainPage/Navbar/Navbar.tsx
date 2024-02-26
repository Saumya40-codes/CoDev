import React from 'react'
import logo from '../../../../styles/images/logo.png'
import styles from './navbar.module.css'
import Link from 'next/link'
import Auth from '../../Auth/Auth'

const Navbar = () => {
  return (
    <div className={styles.mainNav}>
      <div className={styles.codev}>
        <img src={logo.src} alt="Logo" className={styles.codevLogo}/>
        <span className={styles.nameDash}>
            /
        </span>
        <span className={styles.name}>
        <Link href="/">
            coDev
        </Link>
        </span>
      </div>
      <div className={styles.btns}>
        <Auth />
      </div>
    </div>
  )
}

export default Navbar
