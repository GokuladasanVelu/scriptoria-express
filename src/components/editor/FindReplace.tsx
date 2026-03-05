import React, { useState } from 'react';
import { useEditor } from './EditorContext';
import { X } from 'lucide-react';

const FindReplace: React.FC = () => {
  const { state, setState, editorRef } = useEditor();
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  if (!state.findReplaceOpen) return null;

  const findAll = () => {
    if (!editorRef.current || !findText) return;
    // Clear existing highlights
    const html = editorRef.current.innerHTML.replace(/<mark class="find-highlight">(.*?)<\/mark>/g, '$1');
    editorRef.current.innerHTML = html;

    if (findText) {
      const regex = new RegExp(`(${findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const newHtml = editorRef.current.innerHTML.replace(regex, '<mark class="find-highlight" style="background:#FFFF00">$1</mark>');
      editorRef.current.innerHTML = newHtml;
      const matches = editorRef.current.querySelectorAll('.find-highlight');
      setMatchCount(matches.length);
      if (matches.length > 0) {
        matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const replaceAll = () => {
    if (!editorRef.current || !findText) return;
    const html = editorRef.current.innerHTML.replace(/<mark class="find-highlight">(.*?)<\/mark>/g, '$1');
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    editorRef.current.innerHTML = html.replace(regex, replaceText);
    setMatchCount(0);
  };

  const close = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = editorRef.current.innerHTML.replace(/<mark class="find-highlight">(.*?)<\/mark>/g, '$1');
    }
    setState(p => ({ ...p, findReplaceOpen: false }));
  };

  return (
    <div className="find-replace-dialog">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-[13px]">Find and Replace</span>
        <button className="ribbon-btn-sm" onClick={close}><X size={14} /></button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className="text-[11px] w-16">Find:</label>
          <input className="ribbon-dropdown flex-1 px-2" value={findText} onChange={e => setFindText(e.target.value)} onKeyDown={e => e.key === 'Enter' && findAll()} />
          <button className="px-2 py-0.5 bg-secondary rounded text-[11px] hover:bg-accent" onClick={findAll}>Find All</button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] w-16">Replace:</label>
          <input className="ribbon-dropdown flex-1 px-2" value={replaceText} onChange={e => setReplaceText(e.target.value)} />
          <button className="px-2 py-0.5 bg-secondary rounded text-[11px] hover:bg-accent" onClick={replaceAll}>Replace All</button>
        </div>
        {matchCount > 0 && <span className="text-[11px] text-muted-foreground">{matchCount} match(es) found</span>}
      </div>
    </div>
  );
};

export default FindReplace;
