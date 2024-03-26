'use client'

import React, { useEffect, useState } from 'react'
import styles from './createproject.module.css'
import { CloseIcon } from '@chakra-ui/icons'
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import socket from '@/app/lib/socket/socket';
import { useAppDispatch } from '@/app/lib/redux/hooks';
import { setShareId } from '@/app/lib/redux/features/ProjectSlice';
import { setCurrentFile } from '@/app/lib/redux/features/FileSlice';

const CreateProject = ({setCreateProject}:{setCreateProject:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const cookies = useCookies();
    const userId = cookies.get('userId');
    const dispatch = useAppDispatch();
    const {data: session} = useSession();

    useEffect(()=>{
        if(userId === undefined && session?.user?.email !== undefined){
            const getUserId = async() => {
                const res = await fetch(`api/auth/${session?.user?.email}/getUser`);
                const data = await res.json();
                cookies.set('userId', data.id);
            }
            getUserId(); 
        }
    },[userId])
    const router = useRouter();

    const [projectName, setProjectName] = useState<string>('');

    const handleCreateProject = async() => {
        try{
            const res = await fetch('/api/projects/newProject',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: projectName,
                    userId
                })
            });

            
            const data = await res.json();
            dispatch(setShareId(null));
            dispatch(setCurrentFile(null))
            const newProjUrl = `/project/${data.id}`;
            router.push(newProjUrl);
        }
        catch(err){
            console.error(err);
        }
    }

  return (
    <div className={styles.projnew}>
        <div className={styles.projmain}>
            <div className={styles.closeIcon}>
                <CloseIcon onClick={()=> setCreateProject((prevClicked)=>!prevClicked)} />
            </div>
            <div className={styles.projnewContent}>
                <span>
                    Project Name
                </span>
                <input type="text" placeholder="Enter Here..." className={styles.projnewInput} onChange={(e)=>setProjectName(e.target.value)} />
            </div>
            <div className={styles.projnewBtn}>
            <button className={styles.projBtn} onClick={handleCreateProject}>
                Go
            </button>
            </div>
        </div>
    </div>
  )
}

export default CreateProject
