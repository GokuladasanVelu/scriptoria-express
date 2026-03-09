import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor } from './EditorContext';

const PAGE_SIZES = {
  letter: { width: 8.5, height: 11 },
  a4: { width: 8.27, height: 11.69 },
  legal: { width: 8.5, height: 14 },
};

const DocumentCanvas: React.FC = () => {
  const { state, setState, editorRef, updateFormatState, pushUndo } = useEditor();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [draggingMarker, setDraggingMarker] = useState<string | null>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  const ps = state.pageSetup;
  const pageSize = PAGE_SIZES[ps.pageSize];
  const pageW = ps.orientation === 'portrait' ? pageSize.width : pageSize.height;
  const pageH = ps.orientation === 'portrait' ? pageSize.height : pageSize.width;

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    const height = editorRef.current.scrollHeight;
    const pageHeight = pageH * 96;
    const pages = Math.max(1, Math.ceil(height / pageHeight));
    setState(p => ({
      ...p,
      wordCount: words.length,
      charCount: chars,
      pageCount: pages,
    }));
    updateFormatState();
  }, [editorRef, setState, updateFormatState, pageH]);

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

  // Ruler drag handlers
  const handleRulerMouseDown = useCallback((marker: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingMarker(marker);
  }, []);

  useEffect(() => {
    if (!draggingMarker) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!rulerRef.current) return;
      const rect = rulerRef.current.getBoundingClientRect();
      const rulerWidthPx = pageW * 96;
      const rulerStartPx = rect.left + (rect.width - rulerWidthPx) / 2;
      const posInches = Math.max(0, Math.min(pageW, (e.clientX - rulerStartPx) / 96));
      const snapped = Math.round(posInches * 8) / 8; // snap to 1/8 inch

      setState(p => {
        const ps = { ...p.pageSetup };
        if (draggingMarker === 'left') {
          ps.marginLeft = Math.max(0.25, Math.min(snapped, pageW - ps.marginRight - 1));
        } else if (draggingMarker === 'right') {
          ps.marginRight = Math.max(0.25, Math.min(pageW - snapped, pageW - ps.marginLeft - 1));
        }
        return { ...p, pageSetup: ps };
      });
    };
    const handleMouseUp = () => setDraggingMarker(null);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingMarker, pageW, setState]);

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

  // Render tick marks for ruler
  const renderRulerTicks = () => {
    const ticks = [];
    const totalInches = Math.floor(pageW);
    for (let i = 0; i <= totalInches; i++) {
      // Major tick with number
      ticks.push(
        <div key={`major-${i}`} className="absolute" style={{ left: `${i * 96}px`, top: 0, bottom: 0 }}>
          <div className="w-px h-3 bg-muted-foreground/60" />
          {i > 0 && i < totalInches && (
            <span className="absolute text-[8px] text-muted-foreground" style={{ left: '-3px', top: '8px' }}>{i}</span>
          )}
        </div>
      );
      // Half-inch tick
      if (i < totalInches) {
        ticks.push(
          <div key={`half-${i}`} className="absolute" style={{ left: `${i * 96 + 48}px`, top: 0 }}>
            <div className="w-px h-2 bg-muted-foreground/40" />
          </div>
        );
        // Quarter-inch ticks
        ticks.push(
          <div key={`q1-${i}`} className="absolute" style={{ left: `${i * 96 + 24}px`, top: 0 }}>
            <div className="w-px h-1.5 bg-muted-foreground/30" />
          </div>
        );
        ticks.push(
          <div key={`q3-${i}`} className="absolute" style={{ left: `${i * 96 + 72}px`, top: 0 }}>
            <div className="w-px h-1.5 bg-muted-foreground/30" />
          </div>
        );
      }
    }
    return ticks;
  };

  return (
    <div className="flex-1 overflow-auto document-area" style={{ backgroundColor: state.viewMode === 'web' ? '#fff' : 'hsl(210, 11%, 71%)' }} onClick={closeContextMenu}>
      {/* Interactive Ruler */}
      {state.showRuler && (
        <div ref={rulerRef} className="ruler sticky top-0 z-10 flex items-center justify-center select-none" style={{ height: '24px' }}>
          <div className="relative" style={{ width: `${pageW * 96}px`, height: '100%' }}>
            {/* Grey areas for margins */}
            <div className="absolute top-0 bottom-0 bg-muted-foreground/15" style={{ left: 0, width: `${ps.marginLeft * 96}px` }} />
            <div className="absolute top-0 bottom-0 bg-muted-foreground/15" style={{ right: 0, width: `${ps.marginRight * 96}px` }} />
            
            {/* Ticks */}
            {renderRulerTicks()}

            {/* Left margin marker (draggable) */}
            <div
              className="absolute top-0 cursor-ew-resize z-20 group"
              style={{ left: `${ps.marginLeft * 96 - 6}px` }}
              onMouseDown={(e) => handleRulerMouseDown('left', e)}
              title={`Left margin: ${ps.marginLeft}"`}
            >
              <div className="w-3 h-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-muted-foreground group-hover:border-t-primary transition-colors" />
              </div>
            </div>

            {/* Right margin marker (draggable) */}
            <div
              className="absolute top-0 cursor-ew-resize z-20 group"
              style={{ left: `${(pageW - ps.marginRight) * 96 - 6}px` }}
              onMouseDown={(e) => handleRulerMouseDown('right', e)}
              title={`Right margin: ${ps.marginRight}"`}
            >
              <div className="w-3 h-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-muted-foreground group-hover:border-t-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ transform: `scale(${state.zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.1s' }}>
        <div
          ref={editorRef}
          className={`document-page ${state.showFormatMarks ? 'show-format-marks' : ''}`}
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
            width: `${pageW}in`,
            minHeight: `${pageH}in`,
            padding: `${ps.marginTop}in ${ps.marginRight}in ${ps.marginBottom}in ${ps.marginLeft}in`,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            backgroundColor: state.pageColor,
            border: state.pageBorder !== 'none' ? state.pageBorder : undefined,
            columnCount: ps.columns > 1 ? ps.columns : undefined,
            columnGap: ps.columns > 1 ? '0.5in' : undefined,
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
