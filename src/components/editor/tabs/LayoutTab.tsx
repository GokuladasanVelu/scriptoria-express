import React from 'react';
import { useEditor } from '../EditorContext';

const margins = [
  { name: 'Normal', desc: 'Top: 1" Bottom: 1" Left: 1.25" Right: 1.25"' },
  { name: 'Narrow', desc: 'Top: 0.5" Bottom: 0.5" Left: 0.5" Right: 0.5"' },
  { name: 'Moderate', desc: 'Top: 1" Bottom: 1" Left: 0.75" Right: 0.75"' },
  { name: 'Wide', desc: 'Top: 1" Bottom: 1" Left: 2" Right: 2"' },
];

const LayoutTab: React.FC = () => {
  const [showMargins, setShowMargins] = React.useState(false);

  return (
    <div className="flex items-stretch gap-0">
      <div className="ribbon-group flex-col py-1 gap-0.5 relative">
        <div className="flex gap-1">
          <div className="relative">
            <button className="ribbon-btn-lg" onClick={() => setShowMargins(!showMargins)} title="Margins">
              <span className="text-[18px]">📏</span>
              <span className="text-[9px]">Margins</span>
            </button>
            {showMargins && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded py-1 min-w-[200px]">
                {margins.map(m => (
                  <button key={m.name} className="word-context-menu-item w-full text-left flex-col items-start" onClick={() => setShowMargins(false)}>
                    <span className="font-medium">{m.name}</span>
                    <span className="text-[9px] text-muted-foreground">{m.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="ribbon-btn-lg" title="Orientation">
            <span className="text-[18px]">📄</span>
            <span className="text-[9px]">Orientation</span>
          </button>
          <button className="ribbon-btn-lg" title="Size">
            <span className="text-[18px]">📃</span>
            <span className="text-[9px]">Size</span>
          </button>
          <button className="ribbon-btn-lg" title="Columns">
            <span className="text-[18px]">▥</span>
            <span className="text-[9px]">Columns</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Page Setup</span>
      </div>
    </div>
  );
};

export default LayoutTab;
