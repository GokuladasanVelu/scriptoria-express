import React from 'react';
import { useEditor } from './EditorContext';
import { Save, Undo2, Redo2, Printer } from 'lucide-react';

const QuickAccessToolbar: React.FC = () => {
  const { undo, redo, state, setState } = useEditor();

  return (
    <div className="flex items-center h-7 px-2 gap-0.5 bg-tab-row">
      <div className="flex items-center gap-0.5">
        <button className="ribbon-btn-sm text-qat-foreground opacity-90 hover:opacity-100" title="Save (Ctrl+S)">
          <Save size={14} />
        </button>
        <button className="ribbon-btn-sm text-qat-foreground opacity-90 hover:opacity-100" onClick={undo} title="Undo (Ctrl+Z)">
          <Undo2 size={14} />
        </button>
        <button className="ribbon-btn-sm text-qat-foreground opacity-90 hover:opacity-100" onClick={redo} title="Redo (Ctrl+Y)">
          <Redo2 size={14} />
        </button>
        <button className="ribbon-btn-sm text-qat-foreground opacity-90 hover:opacity-100" title="Print (Ctrl+P)">
          <Printer size={14} />
        </button>
      </div>
      <div className="flex-1" />
      <span className="text-qat-foreground text-[11px] opacity-80 mr-2">{state.documentTitle} - Word</span>
    </div>
  );
};

export default QuickAccessToolbar;
