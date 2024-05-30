'use client'

import React from 'react'
import styles from './profile.module.css'
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react'
import { useCookies } from 'next-client-cookies';

const Profile = ({ session }: { session: Session }) => {
  const cookies = useCookies();

  const handleSignOut = async() => {
    try{
      await signOut();
      cookies.remove('userId');
    }
    catch(err){
      console.error(err);
    }
  }

  return (
    <div className={styles.avatarContain}>
      <Popover>
        <PopoverTrigger>
          <img src={session?.user?.image ?? ''} alt="Profile" className={styles.avatar}/>
        </PopoverTrigger>
        <PopoverContent marginRight='20px' background='hsl(212 18% 14%)' color='#0A0909' fontWeight='bold'>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <p className={styles.name}>{session?.user?.name}</p>
          </PopoverHeader>
          <PopoverBody>
            <span className={styles.others}>
              Profile
            </span>
          </PopoverBody>
          <PopoverFooter>
            <button onClick={handleSignOut}>
              <span className={styles.signout}>
                Sign Out
              </span>
            </button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Profile;
