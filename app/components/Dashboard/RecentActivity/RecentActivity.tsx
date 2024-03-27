'use client'

import React,{useEffect, useState} from 'react'
import styles from './recentactivity.module.css'
import { useCookies } from 'next-client-cookies';
import { useSession } from 'next-auth/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

interface RecentActivityProps {
    projects: [
        {
            id: string,
            name: string,
            createdAt?: string,
            updatedAt: string,
            files : [
                {
                    id: string,
                    language: string
                }
            ]
        }
    ]
}

const RecentActivity = () => {

    const[datas, setDatas] = useState<RecentActivityProps>();
    const cookies = useCookies();
    const userId = cookies.get('userId');
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(()=>{
        const getProjects = async() => {
            try{
                const res = await fetch(`/api/user/${userId}/projects`,{
                    method: 'GET'
                });
                const data = await res.json();
                setDatas(data);
                console.log(data);
                console.log(datas);
            }
            catch(err){
                console.error(err);
            }
        }
        getProjects();
    }, []);

  return (
    <div className={styles.recProjects}>
        <span>
            Recent Activity
        </span>
        {datas && datas.projects.length > 0 ? datas?.projects?.map((project, index) => (
        <div className={styles.projMain}>    
            <div key={index} className={styles.project}>
                <div className={styles.projectDetails}>
                    <span>{project.name}</span>
                    <ul>
                    {project.files.map((file, index) => (
                        <span key={index}>
                            <li>{file.language}</li>
                        </span>
                    ))}
                    </ul>
                </div>
                <div className={styles.participants}> 
                    <span>Participants</span>
                    <img src={session?.user?.image ?? ''} alt="users" className={styles.participantsImg}/>
                </div>
            </div>
            <div className={styles.view}>
                <button className={styles.viewBtn} onClick={()=> router.push(`/project/${project.id}`)}>
                    View <ChevronRightIcon/>
                </button>
            </div>
        </div>    
        )) : (
            <div>
                <span>
                    No Recent Activity Found
                </span>
            </div>
        )}
    </div>
  )
}

export default RecentActivity
