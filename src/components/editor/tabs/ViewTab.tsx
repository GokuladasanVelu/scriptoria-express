import React from 'react';
import { useEditor } from '../EditorContext';
import { Columns2, Eye, Ruler } from 'lucide-react';

const ViewTab: React.FC = () => {
  const { state, setState } = useEditor();

  return (
    <div className="flex items-stretch gap-0">
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex gap-1">
          <button className="ribbon-btn-lg" title="Print Layout">
            <span className="text-[18px]">📄</span>
            <span className="text-[9px]">Print Layout</span>
          </button>
          <button className="ribbon-btn-lg" title="Web Layout">
            <span className="text-[18px]">🌐</span>
            <span className="text-[9px]">Web Layout</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Views</span>
      </div>
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-[11px] cursor-pointer">
            <input type="checkbox" className="w-3 h-3" checked={state.showFormatMarks}
              onChange={e => setState(p => ({ ...p, showFormatMarks: e.target.checked }))}
            />
            Formatting Marks
          </label>
          <label className="flex items-center gap-1 text-[11px] cursor-pointer">
            <Ruler size={12} /> Ruler
          </label>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Show</span>
      </div>
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <div className="flex gap-1 items-center">
          <span className="text-[11px]">Zoom:</span>
          <input type="range" className="zoom-slider w-20" min={10} max={500} value={state.zoom}
            onChange={e => setState(p => ({ ...p, zoom: Number(e.target.value) }))}
          />
          <span className="text-[11px] w-8">{state.zoom}%</span>
        </div>
        <span className="text-[9px] text-muted-foreground mt-auto">Zoom</span>
      </div>
    </div>
  );
};

export default ViewTab;
