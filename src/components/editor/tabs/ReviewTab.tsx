import React from 'react';
import { useEditor } from '../EditorContext';
import { Search, Replace, SpellCheck } from 'lucide-react';

const ReviewTab: React.FC = () => {
  const { setState } = useEditor();

  return (
    <div className="flex items-stretch gap-0">
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <button className="ribbon-btn-lg" title="Spelling & Grammar">
          <SpellCheck size={20} />
          <span className="text-[9px]">Spelling</span>
        </button>
        <span className="text-[9px] text-muted-foreground mt-auto">Proofing</span>
      </div>
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <div className="flex gap-1">
          <button className="ribbon-btn-lg" onClick={() => setState(p => ({ ...p, findReplaceOpen: true }))} title="Find & Replace">
            <Search size={20} />
            <span className="text-[9px]">Find &<br/>Replace</span>
          </button>
        </div>
        <span className="text-[9px] text-muted-foreground mt-auto">Editing</span>
      </div>
    </div>
  );
};

export default ReviewTab;
