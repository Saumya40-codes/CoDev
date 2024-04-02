'use client'

import React, {useEffect} from 'react'
import Editor from '@monaco-editor/react';
import { useAppSelector, useAppDispatch } from '@/app/lib/redux/hooks';
import logo from '../../../styles/images/logo.png';
import styles from './editor.module.css';
import { EmailIcon } from '@chakra-ui/icons'
import { setCurrentCode, setFileSaved } from '@/app/lib/redux/features/FileSlice';
import { setFileUser } from '@/app/lib/redux/features/EditingSlice';
import { editor } from 'monaco-editor';
import socket from '@/app/lib/socket/socket';
import { useCookies } from 'next-client-cookies';
import { useSession } from 'next-auth/react';
import { setShareId, setShareIdLink } from '@/app/lib/redux/features/ProjectSlice';

const EditorMain = () => {    
  const currentFile = useAppSelector((state) => state?.file.currentFile);
  const currentLanguage = useAppSelector((state) => state?.file.currentLanguage);
  const currentCode = useAppSelector((state) => state?.file.currentCode);
  const fileSaved = useAppSelector((state) => state?.file.fileSaved);
  const shareId = useAppSelector((state) => state?.project.shareId);
  const projectId = useAppSelector((state) => state?.project.projectId);
  const projectOwner = useAppSelector((state) => state.project.projectAdmin);
  const fileUserId = useAppSelector((state) => state.editing.fileUserMap);
  const dispatch = useAppDispatch();
  const cookies = useCookies();
  const {data: session} = useSession();

  const handleEditorDidMount = (editor: any, monaco: any) => {
    
    monaco.editor.defineTheme('my-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ background: 'EDF1F5'}],
      colors: {
        'editor.foreground': '#ffffff',
        'editor.background': '#000b1c',
        'editorCursor.foreground': '#8B0000',
        'editor.lineHighlightBackground': '#0000FF20',
        'editorLineNumber.foreground': '#008800',
        'editor.selectionBackground': '#88000030',
        'editor.inactiveSelectionBackground': '#88000015',
        'editorSuggestWidget.background': '#D4D4D4',
        'editorSuggestWidget.border': '#888888',
        'editorSuggestWidget.foreground': '#000000',
        'editorSuggestWidget.selectedBackground': '#0044BB',
        'editorWidget.background': '#000000',
        'minimap.background': '#000b1c',
        'minimapSlider.background': '#4A4A4A',
        'minimapSlider.hoverBackground': '#5A5A5A',
        'minimapSlider.activeBackground': '#6A6A6A',
        'scrollbar.shadow': '#000000',
        'scrollbarSlider.background': '#797979',
        'scrollbarSlider.hoverBackground': '#717171',
      }
    });

    monaco.editor.setTheme('my-theme');
    editor.focus();
  }

  useEffect(()=>{
    if(shareId && projectId){
      const userId = cookies.get('userId');

    if(!userId){
        const getUserId = async() => {
        const res = await fetch(`api/auth/${session?.user?.email}/getUser`);

        if(res.status === 404) {
          return;
        }

        const data = await res.json();
        cookies.set('userId', data.id);
      }
      
      getUserId(); 
    }

    if(session?.user?.email === projectOwner){
      socket.emit('join-project', projectId,userId);
      dispatch(setShareId(shareId));
      dispatch(setShareIdLink(`${window.location.href}?shareId=${shareId}`));
      return;
    }

    const path = window.location.href;
    const url = new URL(path);
    const urlShareId = url.searchParams.get('shareId');

    if(!urlShareId) {
      return;
    }

    if(urlShareId === shareId) {
      if(!userId) {
        return;
      }

      const addParticipant = async () => {
        const res = await fetch('/api/projects/participants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({projectId, userId})
        });
        const data = await res.json();
        
        if(data.message === 'Participant added successfully') {
          socket.emit('join-project', projectId,userId);
          dispatch(setShareId(shareId));
          dispatch(setShareIdLink(`${window.location.href}?shareId=${shareId}`));
        }
      }

      addParticipant();
    }
  }
},[projectId, shareId, projectOwner, session?.user?.email]);

  useEffect(()=>{
    socket.on('code-changed', (value) => {
      dispatch(setCurrentCode({fileId: value.fileId, code: value.value}));
      dispatch(setFileUser({name: value.name ,fileId: value.fileId}));
    });

    return () => {
      socket.off('code-changed');
    }
  }, []);

  const handleCodeChange = (value: string | undefined, event: editor.IModelContentChangedEvent) => {
    dispatch(setCurrentCode({fileId: currentFile, code: value}));
    dispatch(setFileUser({name: session?.user?.name ,fileId: currentFile}));
    socket.emit('code-changed', {projectId,fileId: currentFile, value, name: session?.user?.name});
    if(fileSaved) {
      dispatch(setFileSaved({fileId: currentFile, saved: false}));
    }
  }

  const handleCtrlQ = async(event: React.KeyboardEvent) => {
    if(event.ctrlKey && event.key === 'q') {
      dispatch(setFileSaved({fileId: currentFile, saved: true}));

      if(!currentFile) {
        return;
      }

      await fetch('/api/file/addCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({fileId: currentFile, code: currentCode[currentFile]})
      });
      return;
    }
  }

  return (
    <div style={{width:"100vw", resize:'both', overflow:'auto'}} onKeyDown={handleCtrlQ}>
      {shareId && (<div className={styles.shareIdBlock}>
        {currentFile && fileUserId[currentFile] && (
          <span>
            <span className={styles.editingUser}>{fileUserId[currentFile]} </span>
            is Editing...</span>
        )} 
      </div>)
      }
      {currentFile ? (<Editor
        height="100vh"
        width="100%"
        defaultValue='Start from here...'
        language={currentLanguage}
        onMount={handleEditorDidMount}
        onChange={handleCodeChange}
        value={currentCode[currentFile]}
        theme="my-theme"
      />): (
        <div className={styles.imgBlock}>
          <img src={logo.src} alt="Logo" className={styles.logoImg}/>
          <span className={styles.logoText}>Get started by creating a new file <EmailIcon /> </span>
        </div>
      )}
    </div>
  )
}

export default EditorMain