import React, { useEffect, useState } from 'react';
import { EditorProvider, useEditor } from '../components/editor/EditorContext';
import QuickAccessToolbar from '../components/editor/QuickAccessToolbar';
import Ribbon from '../components/editor/Ribbon';
import DocumentCanvas from '../components/editor/DocumentCanvas';
import StatusBar from '../components/editor/StatusBar';
import FindReplace from '../components/editor/FindReplace';
import AvivoPlugin from '../components/plugin/AvivoPlugin';
import { dummyContractHTML } from '../components/plugin/mockData';

const EditorInner: React.FC = () => {
  const { undo, redo, setState, state, editorRef, pushUndo, execCommand, updateFormatState } = useEditor();
  const [pluginOpen, setPluginOpen] = useState(true);

  // Load dummy contract on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = dummyContractHTML;
      setState(p => ({ ...p, documentTitle: 'Acme-TechServ MSA 2025' }));
    }
  }, [editorRef, setState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z': e.preventDefault(); undo(); break;
          case 'y': e.preventDefault(); redo(); break;
          case 's': e.preventDefault(); break;
          case 'b': e.preventDefault(); pushUndo(); execCommand('bold'); updateFormatState(); break;
          case 'i': e.preventDefault(); pushUndo(); execCommand('italic'); updateFormatState(); break;
          case 'u': e.preventDefault(); pushUndo(); execCommand('underline'); updateFormatState(); break;
          case 'h':
            if (e.ctrlKey) { e.preventDefault(); setState(p => ({ ...p, findReplaceOpen: !p.findReplaceOpen })); }
            break;
          case 'f': e.preventDefault(); setState(p => ({ ...p, findReplaceOpen: !p.findReplaceOpen })); break;
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
    }, 120000);
    return () => clearInterval(interval);
  }, [editorRef, state.documentTitle]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <QuickAccessToolbar />
      <Ribbon />
      <FindReplace />
      <div className="flex flex-1 overflow-hidden">
        <DocumentCanvas />
        <AvivoPlugin isOpen={pluginOpen} onToggle={() => setPluginOpen(!pluginOpen)} />
      </div>
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
