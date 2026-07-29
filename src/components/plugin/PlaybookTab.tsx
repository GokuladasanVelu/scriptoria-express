import React, { useState } from 'react';
import { Play, ChevronDown, ChevronRight, Check, AlertTriangle, XCircle, BookOpen } from 'lucide-react';
import { mockPlaybooks, mockPlaybookResults, Playbook, PlaybookCheck } from './mockData';

const statusIcons = {
  passed: <Check size={13} className="text-green-600" />,
  warning: <AlertTriangle size={13} className="text-yellow-600" />,
  failed: <XCircle size={13} className="text-red-600" />,
};
const statusColors = {
  passed: 'border-green-200 bg-green-50',
  warning: 'border-yellow-200 bg-yellow-50',
  failed: 'border-red-200 bg-red-50',
};

const PlaybookTab: React.FC = () => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);

  const runPlaybook = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setIsRunning(false); setHasRun(true); return 100; }
        return p + Math.random() * 12 + 4;
      });
    }, 400);
  };

  const passed = mockPlaybookResults.filter(c => c.status === 'passed').length;
  const warnings = mockPlaybookResults.filter(c => c.status === 'warning').length;
  const failed = mockPlaybookResults.filter(c => c.status === 'failed').length;
  const score = Math.round((passed / mockPlaybookResults.length) * 100 + (warnings / mockPlaybookResults.length) * 50);

  // Playbook selection
  if (!selectedPlaybook) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2 border-b border-border">
          <p className="text-[11px] font-semibold">Select a Playbook</p>
          <p className="text-[10px] text-muted-foreground">Choose a compliance framework to validate your contract against.</p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {mockPlaybooks.map(pb => (
            <button key={pb.id} onClick={() => setSelectedPlaybook(pb)} className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:shadow-sm transition-all">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold">{pb.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{pb.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{pb.category}</span>
                    <span className="text-[9px] text-muted-foreground">{pb.checks} checks</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Running state
  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-medium mb-1">Running {selectedPlaybook.name}...</p>
        <p className="text-[11px] text-muted-foreground mb-4">
          Checking {Math.min(Math.floor(progress / 100 * selectedPlaybook.checks) + 1, selectedPlaybook.checks)} of {selectedPlaybook.checks} requirements
        </p>
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>
    );
  }

  // Pre-run state
  if (!hasRun) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2 border-b border-border">
          <button onClick={() => { setSelectedPlaybook(null); setHasRun(false); }} className="text-[10px] text-primary hover:underline mb-1">← Back to playbooks</button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-primary" />
          </div>
          <p className="text-sm font-semibold mb-1">{selectedPlaybook.name}</p>
          <p className="text-[11px] text-muted-foreground mb-1">{selectedPlaybook.description}</p>
          <p className="text-[10px] text-muted-foreground mb-4">{selectedPlaybook.checks} checks • {selectedPlaybook.category}</p>
          <button onClick={runPlaybook} className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/90 transition-colors">
            <Play size={14} /> Run Playbook
          </button>
        </div>
      </div>
    );
  }

  // Results
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-border">
        <button onClick={() => { setSelectedPlaybook(null); setHasRun(false); }} className="text-[10px] text-primary hover:underline mb-1">← Back to playbooks</button>
        <p className="text-[11px] font-semibold">{selectedPlaybook.name}</p>
      </div>

      {/* Scorecard */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke={score >= 80 ? '#27AE60' : score >= 60 ? '#F39C12' : '#E74C3C'} strokeWidth="3" strokeDasharray={`${score * 0.942} 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold">{score}</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <Check size={11} className="text-green-600" />
              <span className="text-[10px]">{passed} Passed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={11} className="text-yellow-600" />
              <span className="text-[10px]">{warnings} Warnings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle size={11} className="text-red-600" />
              <span className="text-[10px]">{failed} Failed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {mockPlaybookResults.map(check => {
          const isExpanded = expandedCheck === check.id;
          return (
            <div key={check.id} className={`border rounded transition-all ${statusColors[check.status]}`}>
              <button onClick={() => setExpandedCheck(isExpanded ? null : check.id)} className="w-full flex items-center gap-2 px-2.5 py-2 text-left">
                {statusIcons[check.status]}
                <span className="flex-1 text-[11px] font-medium">{check.name}</span>
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              {isExpanded && (
                <div className="px-2.5 pb-2.5 space-y-1.5">
                  <p className="text-[10px]">{check.description}</p>
                  <p className="text-[10px]"><span className="font-medium">Impact:</span> {check.impact}</p>
                  {check.remediation && (
                    <div className="p-2 rounded bg-background/80 border border-border">
                      <p className="text-[10px] font-medium mb-0.5">Remediation</p>
                      <p className="text-[10px]">{check.remediation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="border-t border-border p-2 flex gap-1.5" />

    </div>
  );
};

export default PlaybookTab;
