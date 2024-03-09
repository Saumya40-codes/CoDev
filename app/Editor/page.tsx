'use client'

import React from 'react'
import Editor from '@monaco-editor/react';
import Folder from '../components/Folder/Folder';


const CustomEditor = () => {
  return (
    <div>
      <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
      />
      </div>
      <Folder />
    </div>
  )
}

export default CustomEditor
