'use client'

import React, { useEffect, useState } from 'react';
import styles from './recentactivity.module.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Session } from '@/app/lib/types/types';

interface Project {
    id: string;
    name: string;
    updatedAt: string;
    type: string;
}

interface DataProps {
    projects: Project[];
}

const RecentActivity = () => {
    const [mainData, setMainData] = useState<DataProps>();
    const { data:session } = useSession() as { data: Session };
    console.log("session from client: ", session)
    let userId = session?.user?.id;
    const router = useRouter();

    useEffect(()=>{
        userId = session?.user?.id;
        console.log(session?.user)
        console.log(session)
    }, [session?.user?.id])

    useEffect(() => {
        const getProjects = async () => {
            try {
                const res = await fetch(`/api/user/${userId}/projects`, {
                    method: 'GET',
                });
                const data = await res.json();
                setMainData(data);
            } catch (err) {
                console.error(err);
            }
        };
        getProjects();
    }, []);

    return (
        <div className={styles.recProjects}>
            <span>Recent Activity</span>
            {mainData?.projects && mainData?.projects.length > 0 ? (
                <div className={styles.projects}>
                    <div className={styles.updatedAt}>
                        <span>Updated At</span>
                    </div>
                    {mainData?.projects?.map((project) => (
                        <div
                            key={project.id}
                            className={styles.project}
                            onClick={() => router.push(`/project/${project.id}`)}
                        >
                            <div>
                                {project.type === 'owner' ? (
                                    <span>
                                        You updated your project{' '}
                                        <span className={styles.projectName}>{project.name}</span>
                                    </span>
                                ) : (
                                    <span>
                                        You collaborated to a project{' '}
                                        <span className={styles.projectName}>{project.name}</span>
                                    </span>
                                )}
                            </div>
                            <div>
                                <div>{new Date(project.updatedAt).toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <span>No Recent Activity Found...</span>
            )}
        </div>
    );
};

export default RecentActivity;