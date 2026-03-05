import React from 'react';

const DesignTab: React.FC = () => {
  const themes = [
    { name: 'Office', colors: ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000'] },
    { name: 'Facet', colors: ['#90C226', '#54A021', '#2683C6', '#27CED7'] },
    { name: 'Integral', colors: ['#1CADE4', '#2683C6', '#27CED7', '#42BA97'] },
    { name: 'Ion', colors: ['#B01513', '#EA6312', '#E6B729', '#6AAC90'] },
    { name: 'Retrospect', colors: ['#E48312', '#BD582C', '#865640', '#9B8357'] },
  ];

  return (
    <div className="flex items-stretch gap-0">
      <div className="ribbon-group flex-col py-1 gap-0.5">
        <div className="flex items-center gap-1">
          {themes.map(t => (
            <button key={t.name} className="ribbon-btn flex-col items-center px-2 py-1 border border-border rounded-sm hover:border-primary" title={t.name}>
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

      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <div className="flex gap-1">
          <button className="ribbon-btn-lg" title="Page Color">
            <span className="text-[18px]">🎨</span>
            <span className="text-[9px]">Page Color</span>
          </button>
          <button className="ribbon-btn-lg" title="Page Borders">
            <span className="text-[18px]">📐</span>
            <span className="text-[9px]">Borders</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">Page Background</span>
      </div>
    </div>
  );
};

export default DesignTab;
