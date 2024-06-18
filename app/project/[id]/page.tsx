'use client'

import React, {useEffect} from 'react'
import styles from './project.module.css'
import Navbar from '@/app/components/Project/Navbar/Navbar'
import Folder from '@/app/components/Folder/Folder'
import EditorMain from '@/app/components/Editor/EditorMain'
import Terminal from '@/app/components/Terminal/Terminal'
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks'
import socket from '@/app/lib/socket/socket'
import { setShareId, setShareIdLink } from '@/app/lib/redux/features/ProjectSlice'
import { useSession } from 'next-auth/react'
import { Session } from '@/app/lib/types/types'

const project = ({ params }: { params: { id: string } }) => {

  const shareId = useAppSelector((state) => state?.project.shareId);
  const projectId = useAppSelector((state) => state?.project.projectId);
  const projectOwner = useAppSelector((state) => state.project.projectAdmin);
  const dispatch = useAppDispatch();
  const {data: session} = useSession() as {data: Session | undefined};
  const userId = session?.user?.id;

  useEffect(()=>{

      if(shareId && projectId){

      if(session?.user?.email === projectOwner){
        socket.emit('join-project', projectId,userId);
        dispatch(setShareId(shareId));
        dispatch(setShareIdLink(`${window.location.href}?shareId=${shareId}`));
        return;
      }

      const path = window.location.href;
      const url = new URL(path);
      const urlShareId = url.searchParams.get('shareId');

      if(!urlShareId) {
        return;
      }

      if(urlShareId === shareId) {
        if(!userId) {
          return;
        }

        const addParticipant = async () => {
          const res = await fetch('/api/projects/participants', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({projectId, userId})
          });
          const data = await res.json();

          console.log('data',data);
          
          if(data.message === 'Participant added successfully') {
            socket.emit('join-project', projectId,userId);
            dispatch(setShareId(shareId));
            dispatch(setShareIdLink(`${window.location.href}?shareId=${shareId}`));
          }
        }

        addParticipant();
      }
    }
  },[shareId]);

  return (
    <div className={styles.projBody}>
      <div className={styles.navb}>
      <Navbar />
      </div>
      <hr className={styles.ruler} />
      <div className={styles.projContent}>
        <Folder id={params.id}/>
        <div className={styles.workspace}>
          <EditorMain/>
          <Terminal/>
        </div>
      </div>
    </div>
  )
}

export default project
