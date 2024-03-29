'use client';

import React, { useEffect, useState } from 'react'
import socket from '@/app/lib/socket/socket';
import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { useAppSelector } from '@/app/lib/redux/hooks';
import { Tooltip } from '@chakra-ui/react';


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
    // const [availParticipants, setAvailParticipants] = useState<>();

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
        const handleUserChange = async () => {
            await getParticipants();
        };
        
        socket.on('user-joined', handleUserChange);
        socket.on('user-left', async (user_id: string) => {
            await handleUserLeft(user_id);
        });

    }, [socket, projectId, shareId]);

    
  return (
    <div>
      {shareId && (
        <AvatarGroup size='md' max={2}>
        {participants?.map((val) => (
            <Tooltip label={val.user.name} >
            <Avatar key={val.user.id} name={val.user.name} src={val.user.image} />
            </Tooltip>
        ))}
        </AvatarGroup>
      )}
    </div>
  )
}

export default Participants
