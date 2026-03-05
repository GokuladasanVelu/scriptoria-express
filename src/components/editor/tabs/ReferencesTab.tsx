import React from 'react';

const ReferencesTab: React.FC = () => (
  <div className="flex items-stretch gap-0">
    <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
      <div className="flex gap-1">
        <button className="ribbon-btn-lg" title="Table of Contents">
          <span className="text-[18px]">📑</span>
          <span className="text-[9px]">Table of Contents</span>
        </button>
        <button className="ribbon-btn-lg" title="Footnote">
          <span className="text-[18px]">📝</span>
          <span className="text-[9px]">Footnote</span>
        </button>
        <button className="ribbon-btn-lg" title="Bibliography">
          <span className="text-[18px]">📚</span>
          <span className="text-[9px]">Bibliography</span>
        </button>
      </div>
      <span className="text-[9px] text-muted-foreground text-center w-full mt-auto">References</span>
    </div>
  </div>
);

export default ReferencesTab;
