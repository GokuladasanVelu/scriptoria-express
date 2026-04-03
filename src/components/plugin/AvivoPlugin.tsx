import React, { useState, useEffect } from 'react';
import { MessageSquare, BookOpen, Shield, ClipboardCheck, PanelRightClose, PanelRightOpen, X } from 'lucide-react';
import { useEditor } from '../editor/EditorContext';
import AssistantTab from './AssistantTab';
import ClauseLibraryTab from './ClauseLibraryTab';
import ReviewModeTab from './ReviewTab';
import PlaybookTab from './PlaybookTab';

const tabs = [
  { id: 'assistant', label: 'Assistant', icon: MessageSquare },
  { id: 'clauses', label: 'Clauses', icon: BookOpen },
  { id: 'review', label: 'Review', icon: Shield },
  { id: 'playbook', label: 'Playbook', icon: ClipboardCheck },
];

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const AvivoPlugin: React.FC<Props> = ({ isOpen, onToggle }) => {
  const { editorRef } = useEditor();
  const [activeTab, setActiveTab] = useState('assistant');
  const [selectedText, setSelectedText] = useState('');

  // Track document selection
  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && editorRef.current?.contains(sel.anchorNode)) {
        setSelectedText(sel.toString().trim());
      }
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [editorRef]);

  const handleInsertClause = (text: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const p = document.createElement('p');
      p.innerHTML = text;
      range.insertNode(p);
      range.collapse(false);
    } else {
      const p = document.createElement('p');
      p.innerHTML = text;
      editorRef.current.appendChild(p);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={onToggle} className="fixed right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1 px-1.5 py-3 rounded-l-lg bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors" title="Open Avivo Plugin">
        <PanelRightOpen size={16} />
        <span className="text-[9px] font-medium writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>Avivo</span>
      </button>
    );
  }

  return (
    <div className="w-[380px] h-full flex flex-col border-l border-border bg-background shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-[12px] font-semibold">Avivo</span>
        </div>
        <button onClick={onToggle} className="p-1 rounded hover:bg-accent transition-colors" title="Close plugin">
          <X size={14} />
        </button>
      </div>

      {/* Context bar */}
      {selectedText && (
        <div className="px-3 py-1.5 border-b border-border bg-accent/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-primary">Selected text</span>
            <button onClick={() => setSelectedText('')} className="text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
          </div>
          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">"{selectedText.slice(0, 80)}{selectedText.length > 80 ? '...' : ''}"</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'assistant' && <AssistantTab selectedText={selectedText} />}
        {activeTab === 'clauses' && <ClauseLibraryTab selectedText={selectedText} onInsertClause={handleInsertClause} />}
        {activeTab === 'review' && <ReviewModeTab />}
        {activeTab === 'playbook' && <PlaybookTab />}
      </div>
    </div>
  );
};

export default AvivoPlugin;
