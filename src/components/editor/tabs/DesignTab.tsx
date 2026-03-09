import React from 'react';
import { useEditor } from '../EditorContext';

const themes = [
  { name: 'Office', colors: ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000'], headingColor: '#2E74B5', accentColor: '#4472C4' },
  { name: 'Facet', colors: ['#90C226', '#54A021', '#2683C6', '#27CED7'], headingColor: '#54A021', accentColor: '#90C226' },
  { name: 'Integral', colors: ['#1CADE4', '#2683C6', '#27CED7', '#42BA97'], headingColor: '#1CADE4', accentColor: '#2683C6' },
  { name: 'Ion', colors: ['#B01513', '#EA6312', '#E6B729', '#6AAC90'], headingColor: '#B01513', accentColor: '#EA6312' },
  { name: 'Retrospect', colors: ['#E48312', '#BD582C', '#865640', '#9B8357'], headingColor: '#BD582C', accentColor: '#E48312' },
];

const pageColors = [
  '#FFFFFF', '#FFF8DC', '#F0F8FF', '#F5F5DC', '#FFFACD',
  '#E6E6FA', '#FFF0F5', '#F0FFF0', '#F5F5F5', '#FFFFF0',
  '#FFE4E1', '#E0FFFF', '#FAEBD7', '#D3D3D3', '#000000',
];

const borderStyles = [
  { name: 'None', value: 'none' },
  { name: 'Box', value: '2px solid #333' },
  { name: 'Shadow', value: '2px solid #666' },
  { name: 'Double', value: '4px double #333' },
  { name: 'Dashed', value: '2px dashed #666' },
];

const DesignTab: React.FC = () => {
  const { state, setState, editorRef } = useEditor();
  const [showPageColors, setShowPageColors] = React.useState(false);
  const [showBorders, setShowBorders] = React.useState(false);

  const applyTheme = (theme: typeof themes[0]) => {
    setState(p => ({ ...p, theme: theme.name }));
    // Apply theme colors to headings in the document
    if (editorRef.current) {
      const headings = editorRef.current.querySelectorAll('h1, h2, h3, h4');
      headings.forEach(h => {
        (h as HTMLElement).style.color = theme.headingColor;
      });
    }
  };

  return (
    <div className="flex items-stretch gap-0">
      {/* Themes */}
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex items-center gap-1">
          {themes.map(t => (
            <button
              key={t.name}
              className={`ribbon-btn flex-col items-center px-2 py-1 border rounded-sm hover:border-primary ${
                state.theme === t.name ? 'border-primary bg-accent' : 'border-border'
              }`}
              title={t.name}
              onClick={() => applyTheme(t)}
            >
              <div className="flex gap-0.5">
                {t.colors.map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-[9px] mt-0.5">{t.name}</span>
            </button>
          ))}
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Document Formatting</span>
      </div>

      {/* Page Background */}
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <div className="flex gap-1">
          {/* Page Color */}
          <div className="relative">
            <button className="ribbon-btn-lg" onClick={() => { setShowPageColors(!showPageColors); setShowBorders(false); }} title="Page Color">
              <div className="w-5 h-5 rounded border border-border" style={{ backgroundColor: state.pageColor }} />
              <span className="text-[9px]">Page Color</span>
            </button>
            {showPageColors && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border p-2 shadow-lg rounded">
                <p className="text-[10px] text-muted-foreground mb-1">Page Color</p>
                <div className="grid grid-cols-5 gap-1">
                  {pageColors.map(c => (
                    <button key={c} className={`w-6 h-6 rounded-sm border hover:scale-110 transition-transform ${state.pageColor === c ? 'border-primary border-2' : 'border-border'}`}
                      style={{ backgroundColor: c }}
                      onClick={() => { setState(p => ({ ...p, pageColor: c })); setShowPageColors(false); }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Page Borders */}
          <div className="relative">
            <button className="ribbon-btn-lg" onClick={() => { setShowBorders(!showBorders); setShowPageColors(false); }} title="Page Borders">
              <span className="text-[18px]">📐</span>
              <span className="text-[9px]">Borders</span>
            </button>
            {showBorders && (
              <div className="absolute top-full left-0 z-50 bg-background border border-border shadow-lg rounded py-1 min-w-[150px]">
                {borderStyles.map(b => (
                  <button key={b.name} className={`word-context-menu-item w-full text-left ${state.pageBorder === b.value ? 'bg-accent' : ''}`}
                    onClick={() => { setState(p => ({ ...p, pageBorder: b.value })); setShowBorders(false); }}
                  >
                    {b.name !== 'None' && <span className="inline-block w-8 mr-2" style={{ borderBottom: b.value }}>&nbsp;</span>}
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Page Background</span>
      </div>
    </div>
  );
};

export default DesignTab;
