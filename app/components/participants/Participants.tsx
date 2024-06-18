'use client';

import React, { useEffect, useState } from 'react'
import socket from '@/app/lib/socket/socket';
import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { useAppSelector, useAppDispatch } from '@/app/lib/redux/hooks';
import { Tooltip } from '@chakra-ui/react';
import { setFileUser } from '@/app/lib/redux/features/EditingSlice';
import { setFileSaved } from '@/app/lib/redux/features/FileSlice';
import { setProjectId } from '@/app/lib/redux/features/ProjectSlice';
import { setShareId } from '@/app/lib/redux/features/ProjectSlice';

interface ParticipantsProps {
    user : {
        id: string,
        name: string,
        image: string
    }
}

// interface availParticipantsProps{

// }
const Participants = () => {

    const projectId = useAppSelector(state => state.project.projectId);
    const [participants, setParticipants] = useState<ParticipantsProps[]>();
    const shareId = useAppSelector(state => state.project.shareId);
    const fileUserMap = useAppSelector(state => state.editing.fileUserMap);
    const fileSaved = useAppSelector(state => state.file.fileSaved);
    const projectAdmin = useAppSelector(state => state.project.projectAdmin);
    // const [availParticipants, setAvailParticipants] = useState<>();
    const dispatch = useAppDispatch();

    const getParticipants = async () => {
        try {
            const res = await fetch('/api/projects/getParticipants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId })
            });


            const data = await res.json();
            setParticipants(data);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleUserLeft = async (user_id: string) => {
        const res = await fetch('/api/projects/removeParticipant', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({projectId, userId: user_id})
        });

        if(res.status === 200){
            await getParticipants();
        }
    }

    useEffect(() => {
        socket.on('user-joined', async () => {
            await getParticipants();
            socket.emit('project-state', { projectId, fileUserMap, fileSaved, shareId, projectAdmin});
        });
        socket.on('user-left', (user_id: string) => {
            handleUserLeft(user_id);
        });

        socket.on('project-state', async (data) => {
            const {projectId, fileUserMap, fileSaved, shareId, admin} = data;
            const keys = Object.keys(fileUserMap);

            keys.forEach((key) => {
                dispatch(setFileUser({fileId: key, name: fileUserMap[key]}));
            });

            const savedKeys = Object.keys(fileSaved);

            savedKeys.forEach((key) => {
                dispatch(setFileSaved({fileId: key, saved: fileSaved[key]}));
            });

            dispatch(setProjectId({projectId, user: admin}));

            if(shareId) {
                dispatch(setShareId(shareId));
            }
        });
    }, [projectId, shareId]);

    
  return (
    shareId ? (
        <div>
            <AvatarGroup size='md' max={2}>
                {Array.isArray(participants) && participants?.map((val) => (
                    <Tooltip label={val.user.name} key={val.user.id} >
                    <Avatar name={val.user.name} src={val.user.image} />
                    </Tooltip>
                ))}
            </AvatarGroup>
        </div>
    ):
    null
  )
}

export default Participants