import React from 'react';
import { useEditor } from './EditorContext';
import { Save, Undo2, Redo2, Printer } from 'lucide-react';
import { saveAs } from 'file-saver';

const QuickAccessToolbar: React.FC = () => {
  const { undo, redo, state, editorRef } = useEditor();

  const handleSave = async () => {
    try {
      const content = editorRef.current?.innerHTML || '';
      const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Calibri,sans-serif;font-size:11pt;line-height:1.15;}</style></head><body>${content}</body></html>`;
      const htmlToDocx = (await import('html-to-docx')).default;
      const blob = await htmlToDocx(fullHtml, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });
      saveAs(blob as Blob, `${state.documentTitle}.docx`);
    } catch {
      const content = editorRef.current?.innerHTML || '';
      const blob = new Blob([content], { type: 'text/html' });
      saveAs(blob, `${state.documentTitle}.html`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center h-7 px-2 gap-0.5 bg-tab-row">
      <div className="flex items-center gap-0.5">
        <button className="ribbon-btn-sm text-qat-foreground opacity-90 hover:opacity-100" onClick={handleSave} title="Save (Ctrl+S)">
          <Save size={14} />
        </button>
        <button className="ribbon-btn-sm text-qat-foreground opacity-90 hover:opacity-100" onClick={undo} title="Undo (Ctrl+Z)">
          <Undo2 size={14} />
        </button>
        <button className="ribbon-btn-sm text-qat-foreground opacity-90 hover:opacity-100" onClick={redo} title="Redo (Ctrl+Y)">
          <Redo2 size={14} />
        </button>
        <button className="ribbon-btn-sm text-qat-foreground opacity-90 hover:opacity-100" onClick={handlePrint} title="Print (Ctrl+P)">
          <Printer size={14} />
        </button>
      </div>
      <div className="flex-1" />
      <span className="text-qat-foreground text-[11px] opacity-80 mr-2">{state.documentTitle} - Word</span>
    </div>
  );
};

export default QuickAccessToolbar;
