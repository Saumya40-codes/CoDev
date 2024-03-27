'use client'

import React from 'react'
import logo from '../../../../styles/images/logo.png'
import styles from './navbar.module.css'
import Link from 'next/link'
import Auth from '../../Auth/Auth'
import Profile from '../../MainPage/Profile/Profile'
import Menubar from '../Menubar/Menubar'
import Participants from '../../participants/Participants'
import { useSession } from 'next-auth/react'
import { useAppSelector } from '@/app/lib/redux/hooks'

const Navbar = () => {

  const {data: session, status} = useSession();
  const shareId = useAppSelector(state=>state?.project?.shareId);

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
        {shareId && <Participants/>}
        {status === 'loading' ? <div>Loading...</div> : !session ? <Auth/>: <Profile />}
      </div>
    </div>
  )
}

export default Navbar
