import React, { useRef } from 'react';
import { useEditor } from '../EditorContext';
import { Image, Table, Square, Type, Hash, Minus } from 'lucide-react';

const InsertTab: React.FC = () => {
  const { execCommand, pushUndo, editorRef } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTableGrid, setShowTableGrid] = React.useState(false);
  const [tableHover, setTableHover] = React.useState({ rows: 0, cols: 0 });

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
    html += '</table>';
    execCommand('insertHTML', html);
    setShowTableGrid(false);
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

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

  const insertPageNumber = () => {
    pushUndo();
    execCommand('insertHTML', '<span style="color:#666">[Page #]</span>');
  };

  const insertHR = () => {
    pushUndo();
    execCommand('insertHorizontalRule');
  };

  const insertTextBox = () => {
    pushUndo();
    execCommand('insertHTML', '<div style="border:1px solid #999;padding:8px;margin:8px 0;min-height:40px;display:inline-block;min-width:200px">Text box</div>');
  };

  const insertSymbol = () => {
    pushUndo();
    const symbols = ['©', '®', '™', '°', '±', '÷', '×', '→', '←', '↑', '↓', '•', '—', '–', '…', '€', '£', '¥', '¢'];
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    execCommand('insertHTML', sym);
  };

  return (
    <div className="flex items-stretch gap-0">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageFile} />

      {/* Tables */}
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center relative">
        <button className="ribbon-btn-lg" onClick={() => setShowTableGrid(!showTableGrid)} title="Insert Table">
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
                    className={`w-4 h-4 border ${r <= tableHover.rows && c <= tableHover.cols ? 'bg-accent border-primary' : 'border-border'}`}
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
          <button className="ribbon-btn-lg" onClick={insertTextBox} title="Shapes">
            <Square size={20} />
            <span className="text-[9px]">Shapes</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Illustrations</span>
      </div>

      {/* Text */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex gap-1">
          <button className="ribbon-btn-lg" onClick={insertTextBox} title="Text Box">
            <Type size={20} />
            <span className="text-[9px]">Text Box</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Text</span>
      </div>

      {/* Header & Footer */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex gap-1">
          <button className="ribbon-btn-lg" onClick={insertPageNumber} title="Page Number">
            <Hash size={20} />
            <span className="text-[9px]">Page No.</span>
          </button>
          <button className="ribbon-btn-lg" onClick={insertHR} title="Horizontal Rule">
            <Minus size={20} />
            <span className="text-[9px]">Line</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Header & Footer</span>
      </div>

      {/* Symbols */}
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <button className="ribbon-btn-lg" onClick={insertSymbol} title="Insert Symbol">
          <span className="text-[20px]">Ω</span>
          <span className="text-[9px]">Symbol</span>
        </button>
        <span className="text-[9px] text-muted-foreground mt-auto">Symbols</span>
      </div>
    </div>
  );
};

export default InsertTab;
