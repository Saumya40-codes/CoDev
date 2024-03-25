'use client';

import React, { useEffect, useState } from 'react'
import socket from '@/app/lib/socket/socket';
import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { useAppSelector } from '@/app/lib/redux/hooks';

const Participants = () => {

    const projectId = useAppSelector(state => state.project.projectId);
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
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const handleUserJoined = async () => {
            console.log('User joined');
            await getParticipants();
        };
    
        socket.on('user-joined', handleUserJoined);
    
        return () => {
            socket.off('user-joined', handleUserJoined);
        };
    }, [projectId, getParticipants, socket]);

    
  return (
    <div>
      <AvatarGroup size='md' max={2}>
        <Avatar name='Ryan Florence' src='https://bit.ly/ryan-florence' />
        <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
        <Avatar name='Kent Dodds' src='https://bit.ly/kent-c-dodds' />
        <Avatar name='Prosper Otemuyiwa' src='https://bit.ly/prosper-baba' />
        <Avatar name='Christian Nwamba' src='https://bit.ly/code-beast' />
      </AvatarGroup>
    </div>
  )
}

export default Participants
