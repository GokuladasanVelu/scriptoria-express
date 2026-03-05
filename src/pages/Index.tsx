import React, { useEffect } from 'react';
import { EditorProvider, useEditor } from '../components/editor/EditorContext';
import QuickAccessToolbar from '../components/editor/QuickAccessToolbar';
import Ribbon from '../components/editor/Ribbon';
import DocumentCanvas from '../components/editor/DocumentCanvas';
import StatusBar from '../components/editor/StatusBar';
import FindReplace from '../components/editor/FindReplace';

const EditorInner: React.FC = () => {
  const { undo, redo, setState, state, editorRef, pushUndo, execCommand, updateFormatState } = useEditor();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            // Trigger save - just prevent default
            break;
          case 'b':
            e.preventDefault();
            pushUndo();
            execCommand('bold');
            updateFormatState();
            break;
          case 'i':
            e.preventDefault();
            pushUndo();
            execCommand('italic');
            updateFormatState();
            break;
          case 'u':
            e.preventDefault();
            pushUndo();
            execCommand('underline');
            updateFormatState();
            break;
          case 'h':
            if (e.ctrlKey) {
              e.preventDefault();
              setState(p => ({ ...p, findReplaceOpen: !p.findReplaceOpen }));
            }
            break;
          case 'f':
            e.preventDefault();
            setState(p => ({ ...p, findReplaceOpen: !p.findReplaceOpen }));
            break;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, setState, pushUndo, execCommand, updateFormatState]);

  // Auto-save timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current) {
        try {
          localStorage.setItem('word-autosave', editorRef.current.innerHTML);
          localStorage.setItem('word-autosave-title', state.documentTitle);
        } catch (e) { /* ignore */ }
      }
    }, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, [editorRef, state.documentTitle]);

  // Restore auto-save on mount
  useEffect(() => {
    const saved = localStorage.getItem('word-autosave');
    const title = localStorage.getItem('word-autosave-title');
    if (saved && editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = saved;
      if (title) setState(p => ({ ...p, documentTitle: title }));
    }
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <QuickAccessToolbar />
      <Ribbon />
      <FindReplace />
      <DocumentCanvas />
      <StatusBar />
    </div>
  );
};

const Index: React.FC = () => (
  <EditorProvider>
    <EditorInner />
  </EditorProvider>
);

export default Index;
