import React from 'react'
import logo from '../../../../styles/images/logo.png'
import styles from './navbar.module.css'
import Link from 'next/link'
import Auth from '../../Auth/Auth'
import { getServerSession } from "next-auth";
import { authConfig } from '@/app/lib/auth/auth'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'

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
        {!session ? <Auth/>:(
            <div>
                <img src={session.user?.image || ''} className={styles.avatar} />
            </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
