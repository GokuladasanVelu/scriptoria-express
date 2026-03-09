import React from 'react';
import { useEditor } from '../EditorContext';
import { Search, SpellCheck, MessageSquare } from 'lucide-react';

const ReviewTab: React.FC = () => {
  const { setState, editorRef, pushUndo } = useEditor();

  const runSpellCheck = () => {
    if (!editorRef.current) return;
    // Highlight common misspellings with red underline
    const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT, null);
    // Simple approach: just trigger browser's built-in spellcheck focus
    editorRef.current.focus();
    // Ensure spellcheck is enabled
    editorRef.current.setAttribute('spellcheck', 'true');
    // Force re-render to trigger spell check
    const content = editorRef.current.innerHTML;
    editorRef.current.innerHTML = '';
    requestAnimationFrame(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }
    });
  };

  const insertComment = () => {
    pushUndo();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      alert('Please select text to add a comment.');
      return;
    }
    const text = prompt('Enter your comment:');
    if (!text) return;
    const range = selection.getRangeAt(0);
    const wrapper = document.createElement('span');
    wrapper.style.cssText = 'background:#FFF3CD;border-bottom:2px solid #FFC107;position:relative;cursor:pointer';
    wrapper.title = `Comment: ${text}`;
    wrapper.setAttribute('data-comment', text);
    range.surroundContents(wrapper);
  };

  return (
    <div className="flex items-stretch gap-0">
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <button className="ribbon-btn-lg" onClick={runSpellCheck} title="Spelling & Grammar">
          <SpellCheck size={20} />
          <span className="text-[9px]">Spelling</span>
        </button>
        <span className="text-[9px] text-muted-foreground mt-auto">Proofing</span>
      </div>
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <button className="ribbon-btn-lg" onClick={insertComment} title="New Comment">
          <MessageSquare size={20} />
          <span className="text-[9px]">Comment</span>
        </button>
        <span className="text-[9px] text-muted-foreground mt-auto">Comments</span>
      </div>
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <button className="ribbon-btn-lg" onClick={() => setState(p => ({ ...p, findReplaceOpen: true }))} title="Find & Replace">
          <Search size={20} />
          <span className="text-[9px]">Find &<br/>Replace</span>
        </button>
        <span className="text-[9px] text-muted-foreground mt-auto">Editing</span>
      </div>
    </div>
  );
};

export default ReviewTab;
