import React, { useCallback, useEffect, useRef } from 'react';
import { useEditor } from './EditorContext';

const DocumentCanvas: React.FC = () => {
  const { state, setState, editorRef, updateFormatState, pushUndo } = useEditor();
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number } | null>(null);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    const height = editorRef.current.scrollHeight;
    const pageHeight = 11 * 96; // 11 inches in px
    const pages = Math.max(1, Math.ceil(height / pageHeight));
    setState(p => ({
      ...p,
      wordCount: words.length,
      charCount: chars,
      pageCount: pages,
    }));
    updateFormatState();
  }, [editorRef, setState, updateFormatState]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&emsp;&emsp;');
    }
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  useEffect(() => {
    document.addEventListener('click', closeContextMenu);
    return () => document.removeEventListener('click', closeContextMenu);
  }, [closeContextMenu]);

  const contextActions = [
    { label: 'Cut', shortcut: 'Ctrl+X', action: () => { pushUndo(); document.execCommand('cut'); } },
    { label: 'Copy', shortcut: 'Ctrl+C', action: () => document.execCommand('copy') },
    { label: 'Paste', shortcut: 'Ctrl+V', action: () => { pushUndo(); document.execCommand('paste'); } },
    null,
    { label: 'Bold', shortcut: 'Ctrl+B', action: () => { pushUndo(); document.execCommand('bold'); updateFormatState(); } },
    { label: 'Italic', shortcut: 'Ctrl+I', action: () => { pushUndo(); document.execCommand('italic'); updateFormatState(); } },
    { label: 'Underline', shortcut: 'Ctrl+U', action: () => { pushUndo(); document.execCommand('underline'); updateFormatState(); } },
    null,
    { label: 'Select All', shortcut: 'Ctrl+A', action: () => document.execCommand('selectAll') },
  ];

  return (
    <div className="flex-1 overflow-auto document-area bg-document-bg" onClick={closeContextMenu}>
      {/* Horizontal ruler */}
      <div className="ruler sticky top-0 z-10 flex items-end justify-center select-none">
        <div className="w-[8.5in] flex items-end h-full px-4 relative">
          {Array.from({ length: 17 }, (_, i) => (
            <div key={i} className="flex-1 border-r border-border/50 h-3 flex items-end justify-center">
              <span className="text-[8px] text-muted-foreground">{i > 0 && i < 17 ? i : ''}</span>
            </div>
          ))}
          {/* Margin markers */}
          <div className="absolute left-[1.25in] top-0 bottom-0 w-0.5 bg-border" />
          <div className="absolute right-[1.25in] top-0 bottom-0 w-0.5 bg-border" />
        </div>
      </div>

      <div style={{ transform: `scale(${state.zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.1s' }}>
        <div
          ref={editorRef}
          className="document-page"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onKeyUp={() => updateFormatState()}
          onMouseUp={() => updateFormatState()}
          onContextMenu={handleContextMenu}
          onBeforeInput={() => pushUndo()}
          spellCheck
          style={{
            fontFamily: 'Calibri, sans-serif',
            fontSize: '11pt',
            lineHeight: '1.15',
            minHeight: '11in',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        />
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div className="word-context-menu fixed" style={{ left: contextMenu.x, top: contextMenu.y }}>
          {contextActions.map((item, i) =>
            item === null ? (
              <div key={i} className="word-context-menu-separator" />
            ) : (
              <button key={i} className="word-context-menu-item w-full text-left" onClick={item.action}>
                <span className="flex-1">{item.label}</span>
                <span className="text-muted-foreground text-[10px]">{item.shortcut}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentCanvas;
