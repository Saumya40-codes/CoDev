'use client';

import React from 'react'
import { useAppSelector } from '@/app/lib/redux/hooks';
import { AddIcon } from '@chakra-ui/icons';
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
import styles from './menubar.module.css'
  

const Menubar = () => {

    const shareId = useAppSelector(state => state.project.shareId);

  return (
    <div className={styles.menub}>
    <Popover>
      <PopoverTrigger>
        <AddIcon color='white' className={styles.addIcon}/>
      </PopoverTrigger>
      <PopoverContent marginRight='20px' background='hsl(212 18% 14%)' color='#0A0909' fontWeight='bold'>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          Collaborate with others!
        </PopoverHeader>
        <PopoverBody>
          <button>
            Invite other devs
          </button>
        </PopoverBody>
        <PopoverFooter>
          
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  </div>
  )
}

export default Menubar
