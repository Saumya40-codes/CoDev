'use client'

import React, { useEffect, useCallback } from 'react'
import Editor from '@monaco-editor/react';
import { useAppSelector, useAppDispatch } from '@/app/lib/redux/hooks';
import logo from '../../../styles/images/logo.png';
import styles from './editor.module.css';
import { EmailIcon } from '@chakra-ui/icons'
import { setCurrentCode, setFileSaved } from '@/app/lib/redux/features/FileSlice';
import { setFileUser } from '@/app/lib/redux/features/EditingSlice';
import { editor } from 'monaco-editor';
import socket from '@/app/lib/socket/socket';
import { Session } from '@/app/lib/types/types';
import { useSession } from 'next-auth/react';

const EditorMain = () => {    
  const currentFile = useAppSelector((state) => state?.file.currentFile);
  const currentLanguage = useAppSelector((state) => state?.file.currentLanguage);
  const currentCode = useAppSelector((state) => state?.file.currentCode);
  const shareId = useAppSelector((state) => state?.project.shareId);
  const projectId = useAppSelector((state) => state?.project.projectId);
  const fileUserId = useAppSelector((state) => state.editing.fileUserMap);
  const dispatch = useAppDispatch();
  const {data: session} = useSession() as {data: Session | undefined};

  const handleEditorDidMount = (editor: any, monaco: any) => {
    monaco.editor.defineTheme('my-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ background: 'EDF1F5' }],
      colors: {
        'editor.foreground': '#ffffff',
        'editor.background': '#0d1117',
        'editorCursor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#8b949e',
        'editor.selectionBackground': '#3fb95040',
        'editor.inactiveSelectionBackground': '#3fb95020',
        'editorSuggestWidget.background': '#161b22',
        'editorSuggestWidget.border': '#30363d',
        'editorSuggestWidget.foreground': '#c9d1d9',
        'editorSuggestWidget.selectedBackground': '#2ea04380',
        'editorWidget.background': '#161b22',
        'minimap.background': '#0d1117',
        'minimapSlider.background': '#30363d80',
        'minimapSlider.hoverBackground': '#30363dcc',
        'minimapSlider.activeBackground': '#30363d',
        'scrollbar.shadow': '#0008',
        'scrollbarSlider.background': '#30363d80',
        'scrollbarSlider.hoverBackground': '#30363dcc',
      }
    });

    monaco.editor.setTheme('my-theme');
    editor.focus();
  }

  const emitCodeChange = (value: string) => {
    socket.emit('code-changed', {
      fileId: currentFile,
      projectId,
      value,
      name: session?.user?.name
    });
  };

  useEffect(() => {
    const handleCodeChanged = (value: { fileId: string; value: string; name: string }) => {
      dispatch(setCurrentCode({ fileId: value.fileId, code: value.value }));
      dispatch(setFileUser({ name: value.name, fileId: value.fileId }));
      dispatch(setFileSaved({ fileId: value.fileId, saved: false }));
    };

    socket.on('code-changed', handleCodeChanged);
    socket.on('connect', () => console.log('Socket connected'));
    socket.on('disconnect', () => console.log('Socket disconnected'));
    socket.on('error', (error) => console.error('Socket error:', error));

    return () => {
      socket.off('code-changed', handleCodeChanged);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
    }
  }, [dispatch]);

  const handleCodeChange = (value: string | undefined, event: editor.IModelContentChangedEvent) => {
    console.log('Code changed:', value);
    if (value !== undefined) {
      console.log(currentFile, session?.user?.name);
      dispatch(setCurrentCode({fileId: currentFile, code: value}));
      dispatch(setFileUser({name: session?.user?.name, fileId: currentFile}));
      dispatch(setFileSaved({fileId: currentFile, saved: false}));
      emitCodeChange(value);
    }
  }

  const handleCtrlQ = async(event: React.KeyboardEvent) => {
    if(event.ctrlKey && event.key === 'q') {
      dispatch(setFileSaved({fileId: currentFile, saved: true}));

      if(!currentFile) {
        return;
      }

      try {
        await fetch('/api/file/addCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({fileId: currentFile, code: currentCode[currentFile]})
        });
      } catch (error) {
        console.error('Failed to save file:', error);
        dispatch(setFileSaved({fileId: currentFile, saved: false}));
      }
    }
  }

  return (
    <div style={{width:"100%", resize:'both', overflow:'auto'}} onKeyDown={handleCtrlQ}>
      {shareId && (<div className={styles.shareIdBlock}>
        {currentFile && fileUserId[currentFile] && (
          <span>
            <span className={styles.editingUser}>{fileUserId[currentFile]} </span>
            is Editing...</span>
        )} 
      </div>)
      }
      {currentFile ? (
      <Editor
        height="100vh"
        width="100%"
        language={currentLanguage}
        onMount={handleEditorDidMount}
        onChange={handleCodeChange}
        value={currentCode[currentFile]}
        theme="my-theme"
        options={
          {
            fontSize: 16,
            wordWrap: 'on',
            minimap: {
              enabled: false
            },
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'auto',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              arrowSize: 30
            }
          }
        }
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