'use client'

import React,{useEffect, useState} from 'react'
import styles from './recentactivity.module.css'
import { useCookies } from 'next-client-cookies';

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
        <div className={styles.projects}>
            {datas && datas?.projects?.map((project, index) => (
                <div key={index} className={styles.project}>
                    <span>{project.name}</span>
                </div>
            ))}
        </div>
    </div>
  )
}

export default RecentActivity
