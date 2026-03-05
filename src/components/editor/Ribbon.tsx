import React from 'react';
import { useEditor } from './EditorContext';
import HomeTab from './tabs/HomeTab';
import InsertTab from './tabs/InsertTab';
import DesignTab from './tabs/DesignTab';
import LayoutTab from './tabs/LayoutTab';
import ReferencesTab from './tabs/ReferencesTab';
import ReviewTab from './tabs/ReviewTab';
import ViewTab from './tabs/ViewTab';
import FileMenu from './FileMenu';

const tabs = ['File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Review', 'View'];

const Ribbon: React.FC = () => {
  const { state, setState } = useEditor();
  const [fileMenuOpen, setFileMenuOpen] = React.useState(false);

  const renderTabContent = () => {
    switch (state.activeTab) {
      case 'Home': return <HomeTab />;
      case 'Insert': return <InsertTab />;
      case 'Design': return <DesignTab />;
      case 'Layout': return <LayoutTab />;
      case 'References': return <ReferencesTab />;
      case 'Review': return <ReviewTab />;
      case 'View': return <ViewTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <>
      {/* Tab bar */}
      <div className="flex items-end bg-tab-row h-8 px-1">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-3 py-1 text-[11px] font-normal rounded-t-sm transition-colors ${
              tab === 'File'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 mr-0.5'
                : state.activeTab === tab
                ? 'bg-ribbon text-foreground border-t border-x border-ribbon-border -mb-px'
                : 'text-primary-foreground/80 hover:text-primary-foreground'
            }`}
            onClick={() => {
              if (tab === 'File') {
                setFileMenuOpen(true);
              } else {
                setState(p => ({ ...p, activeTab: tab }));
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Ribbon content */}
      <div className="bg-ribbon border-b border-ribbon-border min-h-[90px] flex items-stretch px-1 py-1">
        {renderTabContent()}
      </div>
      {fileMenuOpen && <FileMenu onClose={() => setFileMenuOpen(false)} />}
    </>
  );
};

export default Ribbon;
