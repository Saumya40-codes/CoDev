'use client';

import React, { useEffect, useState, useCallback } from 'react'
import socket from '@/app/lib/socket/socket';
import { Avatar, AvatarGroup, Tooltip } from '@chakra-ui/react';
import { useAppSelector, useAppDispatch } from '@/app/lib/redux/hooks';

interface Participant {
    id: string;
    name: string;
    image: string;
}

const Participants = () => {
    const projectId = useAppSelector(state => state.project.projectId);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const shareId = useAppSelector(state => state.project.shareId);
    const dispatch = useAppDispatch();

    const getParticipants = useCallback(async () => {
        try {
            const res = await fetch('/api/projects/getParticipants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId })
            });

            const data = await res.json();
            console.log('Participants:', data);
            setParticipants(data.map((p: any) => p.user));
        } catch (err) {
            console.error('Failed to fetch participants:', err);
        }
    }, []);

    useEffect(() => {
        socket.on('user-joined', getParticipants);
        socket.on('user-left', getParticipants);

        const syncInterval = setInterval(getParticipants, 30000); // Sync every 30 seconds

        return () => {
            socket.off('user-left', getParticipants);
            socket.off('project-state');
            clearInterval(syncInterval);
        };
    }, []);

    if (!shareId) return null;

    return (
        <div>
            <AvatarGroup size='md' max={2}>
                {participants?.map((participant) => (
                    <Tooltip key={participant.id} label={participant.name}>
                        <Avatar name={participant.name} src={participant.image} />
                    </Tooltip>
                ))}
            </AvatarGroup>
        </div>
    );
}

export default Participants;