import React, { useRef } from 'react';
import { useEditor } from '../EditorContext';
import { Image, Table, Square, Type, Hash, Minus, X } from 'lucide-react';

const SYMBOLS = [
  '©', '®', '™', '°', '±', '÷', '×', '→', '←', '↑', '↓', '↔',
  '•', '—', '–', '…', '€', '£', '¥', '¢', '¤', '§', '¶', '†',
  '‡', '‰', '∞', '≈', '≠', '≤', '≥', '∑', '∏', '∫', '√', 'π',
  'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'σ', 'φ', 'ω', 'Ω',
];

const SHAPES = [
  { name: 'Rectangle', html: '<div style="display:inline-block;width:120px;height:80px;border:2px solid #333;margin:4px;background:transparent"></div>' },
  { name: 'Rounded Rectangle', html: '<div style="display:inline-block;width:120px;height:80px;border:2px solid #333;border-radius:12px;margin:4px;background:transparent"></div>' },
  { name: 'Circle', html: '<div style="display:inline-block;width:80px;height:80px;border:2px solid #333;border-radius:50%;margin:4px;background:transparent"></div>' },
  { name: 'Oval', html: '<div style="display:inline-block;width:120px;height:80px;border:2px solid #333;border-radius:50%;margin:4px;background:transparent"></div>' },
  { name: 'Diamond', html: '<div style="display:inline-block;width:60px;height:60px;border:2px solid #333;margin:20px;transform:rotate(45deg);background:transparent"></div>' },
  { name: 'Right Arrow', html: '<div style="display:inline-block;font-size:48px;margin:4px;color:#333">➡</div>' },
  { name: 'Left Arrow', html: '<div style="display:inline-block;font-size:48px;margin:4px;color:#333">⬅</div>' },
  { name: 'Star', html: '<div style="display:inline-block;font-size:48px;margin:4px;color:#333">⭐</div>' },
  { name: 'Heart', html: '<div style="display:inline-block;font-size:48px;margin:4px;color:#333">❤</div>' },
  { name: 'Callout', html: '<div style="display:inline-block;width:140px;min-height:60px;border:2px solid #333;border-radius:8px;padding:8px;margin:4px;position:relative;background:#FFFDE7"><span style="font-size:10pt">Callout text</span></div>' },
];

const InsertTab: React.FC = () => {
  const { execCommand, pushUndo, editorRef } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTableGrid, setShowTableGrid] = React.useState(false);
  const [tableHover, setTableHover] = React.useState({ rows: 0, cols: 0 });
  const [showSymbols, setShowSymbols] = React.useState(false);
  const [showShapes, setShowShapes] = React.useState(false);
  const [showHeaderFooter, setShowHeaderFooter] = React.useState(false);

  const insertTable = (rows: number, cols: number) => {
    pushUndo();
    let html = '<table style="border-collapse:collapse;width:100%;margin:8px 0" border="1">';
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        html += '<td style="border:1px solid #999;padding:4px 8px;min-width:60px">&nbsp;</td>';
      }
      html += '</tr>';
    }
    html += '</table><p></p>';
    execCommand('insertHTML', html);
    setShowTableGrid(false);
  };

  const insertImage = () => fileInputRef.current?.click();

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      pushUndo();
      execCommand('insertHTML', `<img src="${ev.target?.result}" style="max-width:100%;height:auto" />`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const insertShape = (shape: typeof SHAPES[0]) => {
    pushUndo();
    execCommand('insertHTML', shape.html);
    setShowShapes(false);
  };

  const insertPageNumber = (position: string) => {
    pushUndo();
    if (position === 'top-center') {
      execCommand('insertHTML', '<div style="text-align:center;color:#666;font-size:10pt;border-bottom:1px solid #eee;padding:4px;margin-bottom:8px">[Page #]</div>');
    } else if (position === 'bottom-center') {
      if (editorRef.current) {
        const div = document.createElement('div');
        div.style.cssText = 'text-align:center;color:#666;font-size:10pt;border-top:1px solid #eee;padding:4px;margin-top:auto';
        div.textContent = '[Page #]';
        editorRef.current.appendChild(div);
      }
    } else if (position === 'bottom-right') {
      if (editorRef.current) {
        const div = document.createElement('div');
        div.style.cssText = 'text-align:right;color:#666;font-size:10pt;border-top:1px solid #eee;padding:4px;margin-top:auto';
        div.textContent = '[Page #]';
        editorRef.current.appendChild(div);
      }
    }
    setShowHeaderFooter(false);
  };

  const insertHeader = () => {
    pushUndo();
    execCommand('insertHTML', '<div style="border-bottom:1px solid #ccc;padding:4px 0;margin-bottom:12px;font-size:10pt;color:#666" contenteditable="true">Header text — double-click to edit</div>');
    setShowHeaderFooter(false);
  };

  const insertDate = () => {
    pushUndo();
    execCommand('insertHTML', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    setShowHeaderFooter(false);
  };

  const insertHR = () => {
    pushUndo();
    execCommand('insertHorizontalRule');
  };

  const insertTextBox = () => {
    pushUndo();
    execCommand('insertHTML', '<div style="border:1px solid #999;padding:8px 12px;margin:8px 0;min-height:40px;display:inline-block;min-width:200px;background:#fff" contenteditable="true">Text box — click to edit</div>');
  };

  const insertWordArt = () => {
    pushUndo();
    const text = prompt('Enter WordArt text:', 'WordArt');
    if (!text) return;
    execCommand('insertHTML', `<div style="display:inline-block;font-size:36pt;font-weight:bold;background:linear-gradient(135deg, #4472C4, #ED7D31);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:8px 0;text-shadow:2px 2px 4px rgba(0,0,0,0.1)">${text}</div>`);
  };

  return (
    <div className="flex items-stretch gap-0">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageFile} />

      {/* Tables */}
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center relative">
        <button className="ribbon-btn-lg" onClick={() => { setShowTableGrid(!showTableGrid); setShowSymbols(false); setShowShapes(false); setShowHeaderFooter(false); }} title="Insert Table">
          <Table size={20} />
          <span className="text-[9px]">Table</span>
        </button>
        {showTableGrid && (
          <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded p-2">
            <p className="text-[10px] mb-1 text-muted-foreground">Insert Table ({tableHover.rows}×{tableHover.cols})</p>
            <div className="grid grid-cols-8 gap-0.5">
              {Array.from({ length: 64 }, (_, i) => {
                const r = Math.floor(i / 8) + 1;
                const c = (i % 8) + 1;
                return (
                  <div key={i}
                    className={`w-4 h-4 border cursor-pointer ${r <= tableHover.rows && c <= tableHover.cols ? 'bg-accent border-primary' : 'border-border'}`}
                    onMouseEnter={() => setTableHover({ rows: r, cols: c })}
                    onClick={() => insertTable(r, c)}
                  />
                );
              })}
            </div>
          </div>
        )}
        <span className="text-[9px] text-muted-foreground mt-auto">Tables</span>
      </div>

      {/* Illustrations */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex gap-1">
          <button className="ribbon-btn-lg" onClick={insertImage} title="Insert Picture">
            <Image size={20} />
            <span className="text-[9px]">Pictures</span>
          </button>
          <div className="relative">
            <button className="ribbon-btn-lg" onClick={() => { setShowShapes(!showShapes); setShowTableGrid(false); setShowSymbols(false); setShowHeaderFooter(false); }} title="Shapes">
              <Square size={20} />
              <span className="text-[9px]">Shapes</span>
            </button>
            {showShapes && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded p-2 min-w-[200px]">
                <p className="text-[10px] text-muted-foreground mb-1">Basic Shapes</p>
                <div className="grid grid-cols-5 gap-1">
                  {SHAPES.map(s => (
                    <button key={s.name} className="w-9 h-9 border border-border rounded hover:bg-accent flex items-center justify-center text-[16px]" title={s.name} onClick={() => insertShape(s)}>
                      {s.name === 'Rectangle' && '▬'}
                      {s.name === 'Rounded Rectangle' && '▢'}
                      {s.name === 'Circle' && '●'}
                      {s.name === 'Oval' && '⬭'}
                      {s.name === 'Diamond' && '◆'}
                      {s.name === 'Right Arrow' && '➡'}
                      {s.name === 'Left Arrow' && '⬅'}
                      {s.name === 'Star' && '⭐'}
                      {s.name === 'Heart' && '❤'}
                      {s.name === 'Callout' && '💬'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Illustrations</span>
      </div>

      {/* Header & Footer */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex gap-1">
          <div className="relative">
            <button className="ribbon-btn-lg" onClick={() => { setShowHeaderFooter(!showHeaderFooter); setShowTableGrid(false); setShowSymbols(false); setShowShapes(false); }} title="Header & Footer">
              <Hash size={20} />
              <span className="text-[9px]">Header &<br/>Footer</span>
            </button>
            {showHeaderFooter && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded py-1 min-w-[180px]">
                <button className="word-context-menu-item w-full text-left" onClick={insertHeader}>Insert Header</button>
                <button className="word-context-menu-item w-full text-left" onClick={() => insertPageNumber('top-center')}>Page # (Top Center)</button>
                <button className="word-context-menu-item w-full text-left" onClick={() => insertPageNumber('bottom-center')}>Page # (Bottom Center)</button>
                <button className="word-context-menu-item w-full text-left" onClick={() => insertPageNumber('bottom-right')}>Page # (Bottom Right)</button>
                <div className="word-context-menu-separator" />
                <button className="word-context-menu-item w-full text-left" onClick={insertDate}>Insert Date</button>
              </div>
            )}
          </div>
          <button className="ribbon-btn-lg" onClick={insertHR} title="Horizontal Rule">
            <Minus size={20} />
            <span className="text-[9px]">Line</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Header & Footer</span>
      </div>

      {/* Text */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex gap-1">
          <button className="ribbon-btn-lg" onClick={insertTextBox} title="Text Box">
            <Type size={20} />
            <span className="text-[9px]">Text Box</span>
          </button>
          <button className="ribbon-btn-lg" onClick={insertWordArt} title="WordArt">
            <span className="text-[16px] font-bold" style={{ background: 'linear-gradient(135deg, #4472C4, #ED7D31)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>A</span>
            <span className="text-[9px]">WordArt</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Text</span>
      </div>

      {/* Symbols */}
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center relative">
        <button className="ribbon-btn-lg" onClick={() => { setShowSymbols(!showSymbols); setShowTableGrid(false); setShowShapes(false); setShowHeaderFooter(false); }} title="Insert Symbol">
          <span className="text-[20px]">Ω</span>
          <span className="text-[9px]">Symbol</span>
        </button>
        {showSymbols && (
          <div className="absolute top-full right-0 z-50 bg-background border border-border shadow-lg rounded p-2 min-w-[220px]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-muted-foreground">Insert Symbol</p>
              <button className="ribbon-btn-sm" onClick={() => setShowSymbols(false)}><X size={12} /></button>
            </div>
            <div className="grid grid-cols-8 gap-0.5">
              {SYMBOLS.map(s => (
                <button key={s} className="w-6 h-6 border border-border rounded text-[14px] hover:bg-accent flex items-center justify-center" onClick={() => {
                  pushUndo();
                  execCommand('insertHTML', s);
                  setShowSymbols(false);
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <span className="text-[9px] text-muted-foreground mt-auto">Symbols</span>
      </div>
    </div>
  );
};

export default InsertTab;
