'use client'

import React from 'react'
import Editor from '@monaco-editor/react';

const EditorMain = () => {
  return (
    <div>
      <Editor
        height="100vh"
        width="100vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
      />
    </div>
  )
}

export default EditorMain
