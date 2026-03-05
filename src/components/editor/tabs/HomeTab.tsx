import React, { useRef, useCallback } from 'react';
import { useEditor } from '../EditorContext';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, IndentDecrease, IndentIncrease, Superscript, Subscript,
  Paintbrush, Type, ChevronDown, Minus, Plus
} from 'lucide-react';

const fonts = ['Calibri', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Palatino Linotype', 'Garamond', 'Book Antiqua', 'Lucida Console', 'Tahoma', 'Century Gothic', 'Cambria', 'Consolas'];
const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'];
const lineSpacings = ['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'];
const fontColors = ['#000000', '#FF0000', '#0000FF', '#008000', '#FF6600', '#800080', '#008080', '#800000', '#000080', '#808000', '#FF00FF', '#00FFFF', '#C0C0C0', '#808080', '#996633', '#333333'];
const highlightColors = ['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#0000FF', '#FF0000', '#000080', '#008080', '#008000', '#800080', '#800000', '#808000', '#C0C0C0', '#808080', 'transparent'];

const styles = [
  { name: 'Normal', tag: 'p', className: 'text-[11pt] font-normal' },
  { name: 'Heading 1', tag: 'h1', className: 'text-[16pt] font-bold text-primary' },
  { name: 'Heading 2', tag: 'h2', className: 'text-[13pt] font-bold text-primary' },
  { name: 'Heading 3', tag: 'h3', className: 'text-[11pt] font-bold' },
  { name: 'Title', tag: 'h1', className: 'text-[28pt] font-light text-primary' },
  { name: 'Subtitle', tag: 'h2', className: 'text-[14pt] text-muted-foreground' },
  { name: 'Quote', tag: 'blockquote', className: 'text-[11pt] italic text-muted-foreground border-l-4 pl-3' },
];

const HomeTab: React.FC = () => {
  const { state, execCommand, updateFormatState, pushUndo } = useEditor();
  const [showFontColors, setShowFontColors] = React.useState(false);
  const [showHighlightColors, setShowHighlightColors] = React.useState(false);
  const [showLineSpacing, setShowLineSpacing] = React.useState(false);
  const fontColorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineSpacingRef = useRef<HTMLDivElement>(null);

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    execCommand('fontName', e.target.value);
    pushUndo();
    updateFormatState();
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    execCommand('fontSize', e.target.value);
    pushUndo();
    updateFormatState();
  };

  const toggleFormat = (cmd: string) => {
    pushUndo();
    execCommand(cmd);
    updateFormatState();
  };

  const applyStyle = (tag: string) => {
    pushUndo();
    execCommand('formatBlock', `<${tag}>`);
    updateFormatState();
  };

  return (
    <div className="flex items-stretch gap-0">
      {/* Clipboard group */}
      <div className="ribbon-group flex-col gap-0.5 py-1 items-start">
        <button className="ribbon-btn-lg" onClick={() => execCommand('paste')} title="Paste">
          <span className="text-[20px]">📋</span>
          <span className="text-[9px]">Paste</span>
        </button>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Clipboard</span>
      </div>

      {/* Font group */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex items-center gap-0.5">
          <select className="ribbon-dropdown w-[120px]" value={state.fontFamily} onChange={handleFontChange}>
            {fonts.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
          </select>
          <select className="ribbon-dropdown w-[45px]" value={state.fontSize} onChange={handleSizeChange}>
            {fontSizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="ribbon-btn-sm" onClick={() => { const s = Math.min(72, parseInt(state.fontSize || '11') + 2); execCommand('fontSize', String(s)); updateFormatState(); }} title="Grow Font">
            <Plus size={12} />
          </button>
          <button className="ribbon-btn-sm" onClick={() => { const s = Math.max(8, parseInt(state.fontSize || '11') - 2); execCommand('fontSize', String(s)); updateFormatState(); }} title="Shrink Font">
            <Minus size={12} />
          </button>
        </div>
        <div className="flex items-center gap-0">
          <button className={`ribbon-btn-sm ${state.bold ? 'active' : ''}`} onClick={() => toggleFormat('bold')} title="Bold (Ctrl+B)">
            <Bold size={13} strokeWidth={2.5} />
          </button>
          <button className={`ribbon-btn-sm ${state.italic ? 'active' : ''}`} onClick={() => toggleFormat('italic')} title="Italic (Ctrl+I)">
            <Italic size={13} />
          </button>
          <button className={`ribbon-btn-sm ${state.underline ? 'active' : ''}`} onClick={() => toggleFormat('underline')} title="Underline (Ctrl+U)">
            <Underline size={13} />
          </button>
          <button className={`ribbon-btn-sm ${state.strikethrough ? 'active' : ''}`} onClick={() => toggleFormat('strikeThrough')} title="Strikethrough">
            <Strikethrough size={13} />
          </button>
          <button className="ribbon-btn-sm" onClick={() => toggleFormat('subscript')} title="Subscript">
            <Subscript size={13} />
          </button>
          <button className="ribbon-btn-sm" onClick={() => toggleFormat('superscript')} title="Superscript">
            <Superscript size={13} />
          </button>
          {/* Font color */}
          <div className="relative" ref={fontColorRef}>
            <button className="ribbon-btn-sm flex flex-col" onClick={() => setShowFontColors(!showFontColors)} title="Font Color">
              <Type size={12} />
              <div className="w-3 h-[3px] mt-[-2px]" style={{ backgroundColor: state.fontColor }} />
            </button>
            {showFontColors && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border p-2 shadow-lg rounded grid grid-cols-4 gap-1">
                {fontColors.map(c => (
                  <button key={c} className="w-5 h-5 rounded-sm border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                    onClick={() => { execCommand('foreColor', c); setShowFontColors(false); updateFormatState(); }}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Highlight */}
          <div className="relative" ref={highlightRef}>
            <button className="ribbon-btn-sm" onClick={() => setShowHighlightColors(!showHighlightColors)} title="Text Highlight">
              <Paintbrush size={12} />
            </button>
            {showHighlightColors && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border p-2 shadow-lg rounded grid grid-cols-5 gap-1">
                {highlightColors.map(c => (
                  <button key={c} className="w-5 h-5 rounded-sm border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: c === 'transparent' ? '#fff' : c }}
                    onClick={() => { execCommand('hiliteColor', c); setShowHighlightColors(false); }}
                  >
                    {c === 'transparent' && <span className="text-[8px]">✕</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Font</span>
      </div>

      {/* Paragraph group */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex items-center gap-0">
          <button className="ribbon-btn-sm" onClick={() => { pushUndo(); execCommand('insertUnorderedList'); }} title="Bullets">
            <List size={13} />
          </button>
          <button className="ribbon-btn-sm" onClick={() => { pushUndo(); execCommand('insertOrderedList'); }} title="Numbering">
            <ListOrdered size={13} />
          </button>
          <button className="ribbon-btn-sm" onClick={() => { pushUndo(); execCommand('outdent'); }} title="Decrease Indent">
            <IndentDecrease size={13} />
          </button>
          <button className="ribbon-btn-sm" onClick={() => { pushUndo(); execCommand('indent'); }} title="Increase Indent">
            <IndentIncrease size={13} />
          </button>
          {/* Line Spacing */}
          <div className="relative" ref={lineSpacingRef}>
            <button className="ribbon-btn-sm flex items-center gap-0" onClick={() => setShowLineSpacing(!showLineSpacing)} title="Line Spacing">
              <span className="text-[10px]">↕</span>
              <ChevronDown size={8} />
            </button>
            {showLineSpacing && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded py-1 min-w-[80px]">
                {lineSpacings.map(ls => (
                  <button key={ls} className="word-context-menu-item w-full text-left" onClick={() => {
                    const sel = window.getSelection();
                    if (sel && sel.rangeCount > 0) {
                      const range = sel.getRangeAt(0);
                      let block = range.startContainer as HTMLElement;
                      while (block && block.nodeType !== 1) block = block.parentElement!;
                      if (block) (block as HTMLElement).style.lineHeight = ls;
                    }
                    setShowLineSpacing(false);
                  }}>
                    {ls}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0">
          <button className="ribbon-btn-sm" onClick={() => { pushUndo(); execCommand('justifyLeft'); }} title="Align Left">
            <AlignLeft size={13} />
          </button>
          <button className="ribbon-btn-sm" onClick={() => { pushUndo(); execCommand('justifyCenter'); }} title="Align Center">
            <AlignCenter size={13} />
          </button>
          <button className="ribbon-btn-sm" onClick={() => { pushUndo(); execCommand('justifyRight'); }} title="Align Right">
            <AlignRight size={13} />
          </button>
          <button className="ribbon-btn-sm" onClick={() => { pushUndo(); execCommand('justifyFull'); }} title="Justify">
            <AlignJustify size={13} />
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Paragraph</span>
      </div>

      {/* Styles group */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex items-center gap-1 overflow-x-auto max-w-[300px]">
          {styles.map(s => (
            <button key={s.name} className="ribbon-btn px-2 py-0.5 border border-border rounded-sm text-[10px] whitespace-nowrap hover:border-primary"
              onClick={() => applyStyle(s.tag)}
              title={s.name}
            >
              {s.name}
            </button>
          ))}
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Styles</span>
      </div>
    </div>
  );
};

export default HomeTab;
