import React from 'react';
import { useEditor } from './EditorContext';
import { Minus, Plus } from 'lucide-react';

const StatusBar: React.FC = () => {
  const { state, setState } = useEditor();

  return (
    <div className="flex items-center h-6 px-3 bg-statusbar text-statusbar-foreground text-[11px] select-none shrink-0">
      <span className="mr-4">Page {state.pageCount} of {state.pageCount}</span>
      <span className="mr-4">{state.wordCount} words</span>
      <span className="mr-4">{state.charCount} characters</span>
      <span className="mr-4">English (United States)</span>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <button className="ribbon-btn-sm text-statusbar-foreground" onClick={() => setState(p => ({ ...p, zoom: Math.max(10, p.zoom - 10) }))}>
          <Minus size={12} />
        </button>
        <input
          type="range"
          className="zoom-slider w-24"
          min={10}
          max={500}
          value={state.zoom}
          onChange={e => setState(p => ({ ...p, zoom: Number(e.target.value) }))}
        />
        <button className="ribbon-btn-sm text-statusbar-foreground" onClick={() => setState(p => ({ ...p, zoom: Math.min(500, p.zoom + 10) }))}>
          <Plus size={12} />
        </button>
        <span className="w-10 text-center">{state.zoom}%</span>
      </div>
    </div>
  );
};

export default StatusBar;
