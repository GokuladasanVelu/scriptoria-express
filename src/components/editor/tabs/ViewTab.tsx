import React from 'react';
import { useEditor } from '../EditorContext';
import { Ruler } from 'lucide-react';

const ViewTab: React.FC = () => {
  const { state, setState } = useEditor();

  return (
    <div className="flex items-stretch gap-0">
      {/* Views */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex gap-1">
          <button className={`ribbon-btn-lg ${state.viewMode === 'print' ? 'active' : ''}`} onClick={() => setState(p => ({ ...p, viewMode: 'print' }))} title="Print Layout">
            <span className="text-[18px]">📄</span>
            <span className="text-[9px]">Print Layout</span>
          </button>
          <button className={`ribbon-btn-lg ${state.viewMode === 'web' ? 'active' : ''}`} onClick={() => setState(p => ({ ...p, viewMode: 'web' }))} title="Web Layout">
            <span className="text-[18px]">🌐</span>
            <span className="text-[9px]">Web Layout</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Views</span>
      </div>

      {/* Show */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer select-none">
            <input type="checkbox" className="w-3.5 h-3.5 accent-primary" checked={state.showRuler}
              onChange={e => setState(p => ({ ...p, showRuler: e.target.checked }))}
            />
            <Ruler size={12} /> Ruler
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer select-none">
            <input type="checkbox" className="w-3.5 h-3.5 accent-primary" checked={state.showFormatMarks}
              onChange={e => setState(p => ({ ...p, showFormatMarks: e.target.checked }))}
            />
            ¶ Formatting Marks
          </label>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Show</span>
      </div>

      {/* Zoom */}
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <div className="flex gap-1 items-center">
          <span className="text-[11px]">Zoom:</span>
          <button className="ribbon-btn-sm text-[10px]" onClick={() => setState(p => ({ ...p, zoom: 100 }))}>100%</button>
          <button className="ribbon-btn-sm text-[10px]" onClick={() => setState(p => ({ ...p, zoom: 75 }))}>75%</button>
          <button className="ribbon-btn-sm text-[10px]" onClick={() => setState(p => ({ ...p, zoom: 150 }))}>150%</button>
          <button className="ribbon-btn-sm text-[10px]" onClick={() => setState(p => ({ ...p, zoom: 200 }))}>200%</button>
          <input type="range" className="zoom-slider w-20" min={10} max={500} value={state.zoom}
            onChange={e => setState(p => ({ ...p, zoom: Number(e.target.value) }))}
          />
          <span className="text-[11px] w-10">{state.zoom}%</span>
        </div>
        <span className="text-[9px] text-muted-foreground mt-auto">Zoom</span>
      </div>
    </div>
  );
};

export default ViewTab;
