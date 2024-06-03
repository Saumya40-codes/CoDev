import React from 'react'
import logo from '../../../../styles/images/logo.png'
import styles from './navbar.module.css'
import Link from 'next/link'
import Auth from '../../Auth/Auth'
import Profile from '../Profile/Profile'
import { getServerSession } from "next-auth";
import { authConfig } from '@/app/lib/auth/auth';
import { Session } from '@/app/lib/types/types';

const Navbar = async() => {

    const session = await getServerSession(authConfig) as Session | null;

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
      {
        session ? <Profile session={session}/> : <Auth/>
      }
    </div>
  )
}

export default Navbar
