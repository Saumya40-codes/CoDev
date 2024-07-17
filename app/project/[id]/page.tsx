'use client'

import React, { useEffect, useCallback } from 'react'
import styles from './project.module.css'
import Navbar from '@/app/components/Project/Navbar/Navbar'
import Folder from '@/app/components/Folder/Folder'
import EditorMain from '@/app/components/Editor/EditorMain'
import Terminal from '@/app/components/Terminal/Terminal'
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks'
import socket from '@/app/lib/socket/socket'
import { setShareId, setShareIdLink, setProjectId } from '@/app/lib/redux/features/ProjectSlice'
import { setFileUser } from '@/app/lib/redux/features/EditingSlice'
import { setFileSaved } from '@/app/lib/redux/features/FileSlice'
import { useSession } from 'next-auth/react'
import { Session } from '@/app/lib/types/types'

const Project = ({ params }: { params: { id: string } }) => {
  const shareId = useAppSelector((state) => state.project.shareId);
  const projectId = useAppSelector((state) => state.project.projectId);
  const dispatch = useAppDispatch();
  const { data: session } = useSession() as { data: Session | undefined };
  const userId = session?.user?.id;

  const joinProject = useCallback((projectId: string, userId: string | undefined) => {
    if (userId) {
      socket.emit('join-project', projectId, userId);
      dispatch(setShareId(shareId));
      dispatch(setShareIdLink(`${window.location.href}?shareId=${shareId}`));
    }
  }, [dispatch, shareId]);

  const addParticipant = useCallback(async (projectId: string, userId: string) => {
    try {
      const res = await fetch('/api/projects/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectId, userId })
      });
      const data = await res.json();
      
      if (data.message === 'Participant added successfully') {
        joinProject(projectId, userId);
      }
    } catch (error) {
      console.error('Failed to add participant:', error);
    }
  }, [joinProject]);

  useEffect(() => {
    if (shareId && projectId) {
      const url = new URL(window.location.href);
      const urlShareId = url.searchParams.get('shareId');

      if (urlShareId === shareId && userId) {
        addParticipant(projectId, userId);
      }
    }

    return () => {
      if (shareId && projectId && userId) {
        socket.emit('leave-project', projectId, userId);
      }
    };
  }, [shareId, projectId, session, userId, joinProject, addParticipant]);

  useEffect(() => {
    socket.on('project-state', (data) => {
      const { projectId, fileUserMap, fileSaved, shareId, admin } = data;
      
      Object.entries(fileUserMap).forEach(([fileId, name]) => {
          dispatch(setFileUser({ fileId, name: name as string }));
      });

      Object.entries(fileSaved).forEach(([fileId, saved]) => {
          dispatch(setFileSaved({ fileId, saved: saved as boolean }));
      });

      dispatch(setProjectId({ projectId }));

      if (shareId) {
          dispatch(setShareId(shareId));
      }
    });

    return () => {
      socket.off('project-state');
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(setProjectId(
      { projectId: params.id }
    ));
  }, [params.id]);

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

export default Project