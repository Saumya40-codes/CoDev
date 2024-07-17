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
    const admin = useAppSelector((state) => state.project.projectAdmin);
    const fileUserMap = useAppSelector(state => state.editing.fileUserMap);
    const fileSaved = useAppSelector(state => state.file.fileSaved);
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
            setParticipants(data.map((p: any) => p.user));
        } catch (err) {
            console.error('Failed to fetch participants:', err);
        }
    }, [projectId]);

    const removeParticipant = useCallback(async (userId: string) => {
        try {
            const res = await fetch('/api/projects/removeParticipant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId, userId })
            });

            const data = await res.json();
            if (data.message === 'Participant removed successfully') {
                getParticipants();
            }
        } catch (err) {
            console.error('Failed to remove participant:', err);
        }
    }, [projectId, getParticipants]);

    const emitProjectState = () => {
        socket.emit('project-state', {
            projectId,
            fileUserMap,
            fileSaved,
            shareId,
            admin
        });
      };

    useEffect(() => {
        const handleUserJoined = async() => {
            console.log("User joined");
            emitProjectState();
            await getParticipants();
        };

        const handleUserLeft = async(userId: string) => {
            console.log("User left", userId);
            await removeParticipant(userId);
            setParticipants((prev) => prev.filter((p) => p.id !== userId));
        }

        socket.on('user-joined', handleUserJoined);
        socket.on('user-left', handleUserLeft);

        const syncInterval = setInterval(getParticipants, 30000); // Sync every 30 seconds

        return () => {
            socket.off('user-joined', handleUserJoined);
            socket.off('user-left', handleUserLeft); 
            clearInterval(syncInterval);
        };
    }, [getParticipants]);

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