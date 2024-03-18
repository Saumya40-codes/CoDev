'use client'

import React from 'react'
import Editor from '@monaco-editor/react';

const CustomEditor = () => {
  return (
    <div>
      <Editor
        height="84vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
      />
    </div>
  )
}

export default CustomEditor
