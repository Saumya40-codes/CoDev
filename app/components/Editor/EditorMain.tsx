'use client'

import React, {useEffect} from 'react'
import Editor from '@monaco-editor/react';
import { useAppSelector, useAppDispatch } from '@/app/lib/redux/hooks';
import logo from '../../../styles/images/logo.png';
import styles from './editor.module.css';
import { EmailIcon } from '@chakra-ui/icons'
import { setCurrentCode, setFileSaved } from '@/app/lib/redux/features/FileSlice';
import { editor } from 'monaco-editor';
import socket from '@/app/lib/socket/socket';

const EditorMain = () => {    
  const currentFile = useAppSelector((state) => state?.file.currentFile);
  const currentLanguage = useAppSelector((state) => state?.file.currentLanguage);
  const currentCode = useAppSelector((state) => state?.file.currentCode);
  const fileSaved = useAppSelector((state) => state?.file.fileSaved);
  const dispatch = useAppDispatch();

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

  // useEffect(()=>{
  //   const path = window.location.href;
  //   const url = new URL(path);
  //   const type = url.searchParams.get('type');

  //   if(type === 'invite') {
  //     socket.emit('message', 'user joined the room');
  //   }
  // },[]);

  const handleCodeChange = (value: string | undefined, event: editor.IModelContentChangedEvent) => {
    dispatch(setCurrentCode(value));

    if(fileSaved) {
      dispatch(setFileSaved(false));
    }
  }

  const handleCtrlQ = (event: React.KeyboardEvent) => {
    if(event.ctrlKey && event.key === 'q') {
      dispatch(setFileSaved(true));
    }
  }

  return (
    <div style={{width:"100vw", resize:'both', overflow:'auto'}} onKeyDown={handleCtrlQ}>
      {currentFile ? (<Editor
        height="100vh"
        width="100%"
        defaultValue='Start from here...'
        onMount={handleEditorDidMount}
        onChange={handleCodeChange}
        value={currentCode}
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
