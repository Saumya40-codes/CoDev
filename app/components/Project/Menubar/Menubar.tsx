'use client';

import React from 'react'
import { useAppSelector, useAppDispatch } from '@/app/lib/redux/hooks';
import { setShareId } from '@/app/lib/redux/features/ProjectSlice';
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
    const projectId = useAppSelector(state => state.project.projectId);
    const dispatch = useAppDispatch();

    const shareProject = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try{
          const res = await fetch('/api/projects/share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectId })
          });

          const data = await res.json();
          console.log(data);
          dispatch(setShareId(data.shareId));
        }
        catch(err){
          console.log(err);
        }
      }

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
        { shareId &&(
        <PopoverBody>
          <input type="text" value={shareId} readOnly/>
        </PopoverBody>
        )
        }
        <PopoverFooter>
          <button onClick={(e)=> shareProject(e)} disabled={shareId !== null}>
            Invite other devs
          </button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  </div>
  )
}

export default Menubar
