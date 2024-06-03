'use client'

import React,{useEffect, useState} from 'react'
import styles from './recentactivity.module.css'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Session } from '@/app/lib/types/types';

interface DataProps{
    projects: [
        {
            id: string;
            name: string;
            updatedAt: string;
            type: string;
        }
    ]
}

const RecentActivity = () => {

    const[mainData, setMainData] = useState<DataProps>();
    const {data: session} = useSession() as {data: Session | undefined};
    const userId = session?.user?.id; 
    const router = useRouter();

    useEffect(()=>{        
        const getProjects = async() => {
            try{
                const res = await fetch(`/api/user/${userId}/projects`,{
                    method: 'GET'
                });
                const data = await res.json();
                setMainData(data);
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
            <div className={styles.updatedAt}>
            {mainData?.projects && mainData?.projects.length > 0  && <span>
                Updated At
            </span>}
            </div>
            {mainData?.projects?.map((project) => (
                <div key={project.id} className={styles.project} onClick={()=>router.push(`/project/${project.id}`)}>
                    <div>
                    {project.type === 'owner' ? (
                        <span>
                           You updated your project <span className={styles.projectName}>{project.name}</span>
                        </span>
                    ) : (
                        <span>
                            You collaborated to a project <span className={styles.projectName}>{project.name}</span>
                        </span>
                    )}
                    </div>
                    <div>
                        <div>
                            {project.updatedAt}
                        </div>
                    </div>
                </div>
            ))}
            {!mainData?.projects && <span>
                No Recent Activity Found...
            </span>}
    </div>
    </div>
    )}

export default RecentActivity
