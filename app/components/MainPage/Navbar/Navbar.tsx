'use client'

import React, {useEffect, useState} from 'react'
import logo from '../../../../styles/images/logo.png'
import styles from './navbar.module.css'
import Link from 'next/link'
import Auth from '../../Auth/Auth'
import Profile from '../Profile/Profile'
import { useSession } from 'next-auth/react'

const Navbar = () => {

    const {data: session, status} = useSession(); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    

    useEffect(()=>{
        if(status === 'authenticated'){
            setIsAuthenticated(true);
        }
    }, [status]);

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
        {isAuthenticated ? <Profile/> : <Auth/>}
      </div>
    </div>
  )
}

export default Navbar
