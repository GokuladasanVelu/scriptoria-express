import React from 'react';
import { useEditor } from '../EditorContext';

const margins = [
  { name: 'Normal', top: 1, bottom: 1, left: 1.25, right: 1.25, desc: 'Top: 1" Bottom: 1" Left: 1.25" Right: 1.25"' },
  { name: 'Narrow', top: 0.5, bottom: 0.5, left: 0.5, right: 0.5, desc: 'Top: 0.5" Bottom: 0.5" Left: 0.5" Right: 0.5"' },
  { name: 'Moderate', top: 1, bottom: 1, left: 0.75, right: 0.75, desc: 'Top: 1" Bottom: 1" Left: 0.75" Right: 0.75"' },
  { name: 'Wide', top: 1, bottom: 1, left: 2, right: 2, desc: 'Top: 1" Bottom: 1" Left: 2" Right: 2"' },
];

const pageSizes = [
  { name: 'Letter', value: 'letter' as const, desc: '8.5" × 11"' },
  { name: 'A4', value: 'a4' as const, desc: '8.27" × 11.69"' },
  { name: 'Legal', value: 'legal' as const, desc: '8.5" × 14"' },
];

const columnOptions = [
  { name: 'One', value: 1, icon: '▌' },
  { name: 'Two', value: 2, icon: '▐▌' },
  { name: 'Three', value: 3, icon: '▐▐▌' },
];

const LayoutTab: React.FC = () => {
  const { state, setState } = useEditor();
  const [showMargins, setShowMargins] = React.useState(false);
  const [showOrientation, setShowOrientation] = React.useState(false);
  const [showSize, setShowSize] = React.useState(false);
  const [showColumns, setShowColumns] = React.useState(false);

  const applyMargin = (m: typeof margins[0]) => {
    setState(p => ({
      ...p,
      pageSetup: { ...p.pageSetup, marginTop: m.top, marginBottom: m.bottom, marginLeft: m.left, marginRight: m.right }
    }));
    setShowMargins(false);
  };

  const applyOrientation = (o: 'portrait' | 'landscape') => {
    setState(p => ({ ...p, pageSetup: { ...p.pageSetup, orientation: o } }));
    setShowOrientation(false);
  };

  const applySize = (s: 'letter' | 'a4' | 'legal') => {
    setState(p => ({ ...p, pageSetup: { ...p.pageSetup, pageSize: s } }));
    setShowSize(false);
  };

  const applyColumns = (c: number) => {
    setState(p => ({ ...p, pageSetup: { ...p.pageSetup, columns: c } }));
    setShowColumns(false);
  };

  const ps = state.pageSetup;

  return (
    <div className="flex items-stretch gap-0">
      <div className="ribbon-group flex-col py-1 gap-0.5 relative">
        <div className="flex gap-1">
          {/* Margins */}
          <div className="relative">
            <button className="ribbon-btn-lg" onClick={() => { setShowMargins(!showMargins); setShowOrientation(false); setShowSize(false); setShowColumns(false); }} title="Margins">
              <span className="text-[18px]">📏</span>
              <span className="text-[9px]">Margins</span>
            </button>
            {showMargins && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded py-1 min-w-[220px]">
                {margins.map(m => (
                  <button key={m.name} className={`word-context-menu-item w-full text-left flex flex-col items-start ${
                    ps.marginTop === m.top && ps.marginLeft === m.left ? 'bg-accent' : ''
                  }`} onClick={() => applyMargin(m)}>
                    <span className="font-medium text-[12px]">{m.name}</span>
                    <span className="text-[9px] text-muted-foreground">{m.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Orientation */}
          <div className="relative">
            <button className="ribbon-btn-lg" onClick={() => { setShowOrientation(!showOrientation); setShowMargins(false); setShowSize(false); setShowColumns(false); }} title="Orientation">
              <span className="text-[18px]">{ps.orientation === 'portrait' ? '📄' : '📄'}</span>
              <span className="text-[9px]">Orientation</span>
            </button>
            {showOrientation && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded py-1 min-w-[160px]">
                <button className={`word-context-menu-item w-full text-left ${ps.orientation === 'portrait' ? 'bg-accent' : ''}`} onClick={() => applyOrientation('portrait')}>
                  <span className="text-[14px] mr-2">▯</span> Portrait
                </button>
                <button className={`word-context-menu-item w-full text-left ${ps.orientation === 'landscape' ? 'bg-accent' : ''}`} onClick={() => applyOrientation('landscape')}>
                  <span className="text-[14px] mr-2 inline-block rotate-90">▯</span> Landscape
                </button>
              </div>
            )}
          </div>

          {/* Size */}
          <div className="relative">
            <button className="ribbon-btn-lg" onClick={() => { setShowSize(!showSize); setShowMargins(false); setShowOrientation(false); setShowColumns(false); }} title="Size">
              <span className="text-[18px]">📃</span>
              <span className="text-[9px]">Size</span>
            </button>
            {showSize && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded py-1 min-w-[180px]">
                {pageSizes.map(s => (
                  <button key={s.value} className={`word-context-menu-item w-full text-left flex flex-col items-start ${ps.pageSize === s.value ? 'bg-accent' : ''}`} onClick={() => applySize(s.value)}>
                    <span className="font-medium text-[12px]">{s.name}</span>
                    <span className="text-[9px] text-muted-foreground">{s.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columns */}
          <div className="relative">
            <button className="ribbon-btn-lg" onClick={() => { setShowColumns(!showColumns); setShowMargins(false); setShowOrientation(false); setShowSize(false); }} title="Columns">
              <span className="text-[18px]">▥</span>
              <span className="text-[9px]">Columns</span>
            </button>
            {showColumns && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded py-1 min-w-[140px]">
                {columnOptions.map(c => (
                  <button key={c.value} className={`word-context-menu-item w-full text-left ${ps.columns === c.value ? 'bg-accent' : ''}`} onClick={() => applyColumns(c.value)}>
                    <span className="mr-2">{c.icon}</span> {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Page Setup</span>
      </div>
    </div>
  );
};

export default LayoutTab;
