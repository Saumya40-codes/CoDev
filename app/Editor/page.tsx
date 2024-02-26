'use client'

import React from 'react'
import Editor from '@monaco-editor/react';


const CustomEditor = () => {
  return (
    <div style={{backgroundColor:"white !important"}}>
      <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />;
    </div>
  )
}

export default CustomEditor
