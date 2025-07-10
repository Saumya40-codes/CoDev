'use client'

import React, { useEffect, useCallback, useRef, useState } from 'react'
import Editor, { OnMount } from '@monaco-editor/react';
import { useAppSelector, useAppDispatch } from '@/app/lib/redux/hooks';
import logo from '../../../styles/images/logo.png';
import styles from './editor.module.css';
import { EmailIcon, CheckIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons'
import { setCurrentCode, setFileSaved } from '@/app/lib/redux/features/FileSlice';
import { setFileUser } from '@/app/lib/redux/features/EditingSlice';
import { editor } from 'monaco-editor';
import socket from '@/app/lib/socket/socket';
import { Session } from '@/app/lib/types/types';
import { useSession } from 'next-auth/react';
import debounce from 'lodash/debounce';

const EditorMain = () => {    
  const currentFile = useAppSelector((state) => state?.file.currentFile);
  const currentLanguage = useAppSelector((state) => state?.file.currentLanguage);
  const currentCode = useAppSelector((state) => state?.file.currentCode);
  const shareId = useAppSelector((state) => state?.project.shareId);
  const projectId = useAppSelector((state) => state?.project.projectId);
  const fileUserId = useAppSelector((state) => state.editing.fileUserMap);
  const fileSaved = useAppSelector((state) => state?.file.fileSaved);
  const dispatch = useAppDispatch();
  const {data: session} = useSession() as {data: Session | undefined};

  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
  const [showConnectionToast, setShowConnectionToast] = useState(false);
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced theme with better contrast and readability
  const handleEditorDidMount: OnMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Define enhanced theme
    monaco.editor.defineTheme('enhanced-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'FF7B72' },
        { token: 'string', foreground: 'A5D6FF' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'regexp', foreground: '7EE787' },
        { token: 'operator', foreground: 'FF7B72' },
        { token: 'namespace', foreground: 'FFA657' },
        { token: 'type', foreground: 'FFA657' },
        { token: 'struct', foreground: 'FFA657' },
        { token: 'class', foreground: 'FFA657' },
        { token: 'interface', foreground: 'FFA657' },
        { token: 'parameter', foreground: 'FFA657' },
        { token: 'variable', foreground: 'FFA657' },
        { token: 'function', foreground: 'D2A8FF' },
        { token: 'member', foreground: 'D2A8FF' },
      ],
      colors: {
        'editor.foreground': '#E6EDF3',
        'editor.background': '#0D1117',
        'editorCursor.foreground': '#7C3AED',
        'editor.lineHighlightBackground': '#161B22',
        'editorLineNumber.foreground': '#7D8590',
        'editorLineNumber.activeForeground': '#E6EDF3',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorIndentGuide.background': '#21262D',
        'editorIndentGuide.activeBackground': '#30363D',
        'editorSuggestWidget.background': '#161B22',
        'editorSuggestWidget.border': '#30363D',
        'editorSuggestWidget.foreground': '#E6EDF3',
        'editorSuggestWidget.selectedBackground': '#264F78',
        'editorWidget.background': '#161B22',
        'editorWidget.border': '#30363D',
        'minimap.background': '#0D1117',
        'scrollbar.shadow': '#00000088',
        'scrollbarSlider.background': '#30363D80',
        'scrollbarSlider.hoverBackground': '#30363DCC',
        'scrollbarSlider.activeBackground': '#30363D',
        'editorBracketMatch.background': '#3FB95040',
        'editorBracketMatch.border': '#3FB950',
      }
    });

    monaco.editor.setTheme('enhanced-dark');
    editor.focus();

    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleManualSave();
    });

    // Add bracket matching and auto-formatting
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.trigger('', 'editor.action.formatDocument', '');
    });

    // Enhanced editor settings
    editor.updateOptions({
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true,
      },
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      mouseWheelZoom: true,
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: 'full',
      tabCompletion: 'on',
      parameterHints: { enabled: true },
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      snippetSuggestions: 'top',
    });
  }

  // Enhanced debounced code change with better error handling
  const emitCodeChange = useCallback(debounce((value: string, cursorPosition: number) => {
    if (connectionStatus === 'connected') {
      socket.emit('code-changed', {
        fileId: currentFile,
        projectId,
        value,
        cursorPosition,
        version: version + 1,
        name: session?.user?.name,
        timestamp: new Date().toISOString()
      });
      setVersion(v => v + 1);
    }
  }, 200), [currentFile, projectId, session?.user?.name, version, connectionStatus]);

  // Auto-save functionality
  const autoSave = useCallback(debounce(async () => {
    if (currentFile && currentCode[currentFile] && saveStatus !== 'saving') {
      await handleSave();
    }
  }, 2000), [currentFile, currentCode, saveStatus]);

  // Enhanced save function with better error handling
  const handleSave = async () => {
    if (!currentFile) return;

    setSaveStatus('saving');
    
    try {
      const response = await fetch('/api/file/addCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileId: currentFile, 
          code: currentCode[currentFile],
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      dispatch(setFileSaved({ fileId: currentFile, saved: true }));
      setSaveStatus('saved');
      setLastSavedTime(new Date());
      socket.emit('code-saved', { fileId: currentFile, projectId });
      
    } catch (error) {
      console.error('Failed to save file:', error);
      setSaveStatus('error');
      dispatch(setFileSaved({ fileId: currentFile, saved: false }));
      
      // Show error toast
      setTimeout(() => setSaveStatus('unsaved'), 3000);
    }
  };

  const handleManualSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    handleSave();
  };

  // Socket connection management
  useEffect(() => {
    const handleConnect = () => {
      setConnectionStatus('connected');
      setShowConnectionToast(true);
      setTimeout(() => setShowConnectionToast(false), 3000);
    };

    const handleDisconnect = () => {
      setConnectionStatus('disconnected');
      setShowConnectionToast(true);
    };

    const handleReconnecting = () => {
      setConnectionStatus('reconnecting');
      setShowConnectionToast(true);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnecting', handleReconnecting);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnecting', handleReconnecting);
    };
  }, []);

  // Enhanced code change handler with conflict resolution
  useEffect(() => {
    const handleCodeChanged = (value: { 
      fileId: string; 
      value: string; 
      name: string; 
      version: number; 
      cursorPosition: number;
      timestamp: string;
    }) => {
      if (value.fileId === currentFile && value.version > version) {
        dispatch(setCurrentCode({ fileId: value.fileId, code: value.value }));
        dispatch(setFileUser({ name: value.name, fileId: value.fileId }));
        dispatch(setFileSaved({ fileId: value.fileId, saved: false }));
        setVersion(value.version);

        if (editorRef.current) {
          const currentPosition = editorRef.current.getPosition();
          const model = editorRef.current.getModel();
          
          if (model) {
            model.setValue(value.value);
            
            // Preserve cursor position if possible
            if (currentPosition) {
              const lineCount = model.getLineCount();
              const safePosition = {
                lineNumber: Math.min(currentPosition.lineNumber, lineCount),
                column: Math.min(currentPosition.column, model.getLineMaxColumn(Math.min(currentPosition.lineNumber, lineCount)))
              };
              editorRef.current.setPosition(safePosition);
            }
          }
        }
      }
    };

    const handleCodeSaved = (data: { fileId: string }) => {
      dispatch(setFileSaved({ fileId: data.fileId, saved: true }));
      if (data.fileId === currentFile) {
        setSaveStatus('saved');
        setLastSavedTime(new Date());
      }
    };

    socket.on('code-changed', handleCodeChanged);
    socket.on('code-saved', handleCodeSaved);

    return () => {
      socket.off('code-changed', handleCodeChanged);
      socket.off('code-saved', handleCodeSaved);
    }
  }, [dispatch, currentFile, version]);

  // Enhanced code change handler
  const handleCodeChange = (value: string | undefined, event: editor.IModelContentChangedEvent) => {
    if (value !== undefined && editorRef.current) {
      const cursorPosition = editorRef.current.getPosition();
      
      dispatch(setCurrentCode({ fileId: currentFile, code: value }));
      dispatch(setFileUser({ name: session?.user?.name, fileId: currentFile }));
      dispatch(setFileSaved({ fileId: currentFile, saved: false }));
      
      setSaveStatus('unsaved');
      
      // Emit change to other users
      emitCodeChange(value, cursorPosition?.lineNumber || 0);
      
      // Trigger auto-save
      autoSave();
    }
  }

  // Enhanced keyboard shortcuts
  const handleKeyDown = async (event: React.KeyboardEvent) => {
    // Ctrl+S or Cmd+S for save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      await handleManualSave();
    }
    
    // Ctrl+Q for quick save (legacy support)
    if (event.ctrlKey && event.key === 'q') {
      event.preventDefault();
      await handleManualSave();
    }
  }

  // Format last saved time
  const formatLastSavedTime = (time: Date) => {
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return time.toLocaleDateString();
  };

  // Status indicator component
  const StatusIndicator = () => (
    <div className={styles.statusBar}>
      <div className={styles.statusLeft}>
        {shareId && currentFile && fileUserId[currentFile] && (
          <div className={styles.editingIndicator}>
            <div className={styles.editingDot}></div>
            <span className={styles.editingUser}>{fileUserId[currentFile]}</span>
            <span className={styles.editingText}>is editing</span>
          </div>
        )}
      </div>
      
      <div className={styles.statusRight}>
        <div className={styles.connectionStatus}>
          <div className={`${styles.connectionDot} ${styles[connectionStatus]}`}></div>
          <span className={styles.connectionText}>
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Disconnected'}
          </span>
        </div>
        
        <div className={styles.saveStatus}>
          {saveStatus === 'saved' && (
            <>
              <CheckIcon className={styles.statusIcon} />
              <span>Saved {lastSavedTime && formatLastSavedTime(lastSavedTime)}</span>
            </>
          )}
          {saveStatus === 'saving' && (
            <>
              <TimeIcon className={styles.statusIcon} />
              <span>Saving...</span>
            </>
          )}
          {saveStatus === 'unsaved' && (
            <>
              <div className={styles.unsavedDot}></div>
              <span>Unsaved changes</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <WarningIcon className={styles.statusIcon} />
              <span>Save failed</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Connection toast
  const ConnectionToast = () => (
    showConnectionToast && (
      <div className={`${styles.toast} ${styles[connectionStatus]}`}>
        {connectionStatus === 'connected' && '✓ Connected to server'}
        {connectionStatus === 'disconnected' && '⚠ Disconnected from server'}
        {connectionStatus === 'reconnecting' && '🔄 Reconnecting...'}
      </div>
    )
  );

  return (
    <div className={styles.editorContainer} onKeyDown={handleKeyDown}>
      <ConnectionToast />
      
      {currentFile ? (
        <div className={styles.editorWrapper}>
          <StatusIndicator />
          <Editor
            height="calc(100vh - 40px)"
            width="100%"
            language={currentLanguage}
            onMount={handleEditorDidMount}
            onChange={handleCodeChange}
            value={currentCode[currentFile] || ''}
            theme="enhanced-dark"
            loading={<div className={styles.loadingSpinner}>Loading editor...</div>}
            options={{
              fontSize: 16,
              fontFamily: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
              fontLigatures: true,
              lineHeight: 1.6,
              letterSpacing: 0.5,
              wordWrap: 'on',
              minimap: { enabled: false },
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              contextmenu: true,
              copyWithSyntaxHighlighting: true,
              emptySelectionClipboard: false,
              links: true,
              multiCursorModifier: 'alt',
              selectionHighlight: true,
              occurrencesHighlight: "singleFile",
              codeLens: true,
              folding: true,
              foldingHighlight: true,
              foldingImportsByDefault: false,
              unfoldOnClickAfterEndOfLine: false,
              showUnused: true,
              showDeprecated: true,
            }}
          />
        </div>
      ) : (
        <div className={styles.welcomeScreen}>
          <div className={styles.welcomeContent}>
            <img src={logo.src} alt="Logo" className={styles.logoImg} />
            <h2 className={styles.welcomeTitle}>Welcome to Code Editor</h2>
            <p className={styles.welcomeSubtitle}>
              Create a new file to start coding with enhanced features
            </p>
            <div className={styles.featuresList}>
              <div className={styles.feature}>
                <CheckIcon className={styles.featureIcon} />
                <span>Auto-save & Real-time collaboration</span>
              </div>
              <div className={styles.feature}>
                <CheckIcon className={styles.featureIcon} />
                <span>Syntax highlighting & Code completion</span>
              </div>
              <div className={styles.feature}>
                <CheckIcon className={styles.featureIcon} />
                <span>Advanced shortcuts & Formatting</span>
              </div>
            </div>
            <div className={styles.shortcutHints}>
              <div className={styles.shortcut}>
                <kbd>Ctrl+S</kbd> <span>Save file</span>
              </div>
              <div className={styles.shortcut}>
                <kbd>Ctrl+Shift+F</kbd> <span>Format code</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditorMain
