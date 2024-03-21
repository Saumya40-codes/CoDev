'use client'

import React from 'react'
import Editor from '@monaco-editor/react';
import { useAppSelector } from '@/app/lib/redux/hooks';
import logo from '../../../styles/images/logo.png';
import styles from './editor.module.css';
import { EmailIcon } from '@chakra-ui/icons'

const EditorMain = () => {    
  const currentFile = useAppSelector((state) => state.file.currentFile);
  const currentLanguage = useAppSelector((state) => state.file.currentLanguage);
  const currentCode = useAppSelector((state) => state.file.currentCode);


  const handleEditorDidMount = (editor: any, monaco: any) => {
    
    monaco.editor.defineTheme('my-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ background: 'EDF1F5'}],
      colors: {
        'editor.foreground': '#000000',
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
      }
    });

    monaco.editor.setTheme('my-theme');
    editor.focus();
  }

  return (
    <div style={{width:"100vw", resize:'both', overflow:'auto'}}>
      {currentFile ? (<Editor
        height="100vh"
        width="100%"
        defaultLanguage={currentLanguage}
        defaultValue={currentCode}
        onMount={handleEditorDidMount}
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
