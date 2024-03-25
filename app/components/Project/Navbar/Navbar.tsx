import React from 'react'
import logo from '../../../../styles/images/logo.png'
import styles from './navbar.module.css'
import Link from 'next/link'
import Auth from '../../Auth/Auth'
import Profile from '../../MainPage/Profile/Profile'
import { getServerSession } from "next-auth";
import { authConfig } from '@/app/lib/auth/auth';
import Menubar from '../Menubar/Menubar'
import Participants from '../../participants/Participants'

const Navbar = async() => {

  const session = await getServerSession(authConfig);

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
        <Menubar/>
        <Participants/>
        {!session ? <Auth/>: <Profile session={session}/>}
      </div>
    </div>
  )
}

export default Navbar
