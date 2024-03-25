'use client';

import React, { useEffect, useState } from 'react'
import socket from '@/app/lib/socket/socket';
import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { useAppSelector } from '@/app/lib/redux/hooks';


interface ParticipantsProps {
    user : {
        id: string,
        name: string,
        image: string
    }
}
const Participants = () => {

    const projectId = useAppSelector(state => state.project.projectId);
    const [participants, setParticipants] = useState<ParticipantsProps[]>();

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
            console.log(data);
            setParticipants(data);
            console.log(participants);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getParticipants();

        const handleUserChange = async () => {
            console.log('User joined');
            await getParticipants();
        };
    
        socket.on('user-joined', handleUserChange);
        socket.on('user-left', handleUserChange);

    }, [socket, projectId]);

    
  return (
    <div>
      <AvatarGroup size='md' max={2}>
            {participants?.map((val) => (
                <Avatar key={val.user.id} name={val.user.name} src={val.user.image} />
            ))}
      </AvatarGroup>
    </div>
  )
}

export default Participants
