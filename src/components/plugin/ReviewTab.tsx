import React, { useState } from 'react';
import { Play, ChevronDown, ChevronRight, Check, AlertTriangle, XCircle, FileText, Eye, EyeOff, Lightbulb } from 'lucide-react';
import { mockLanguageFindings, mockRiskFindings, mockObligationFindings, ReviewFinding } from './mockData';

const severityColors = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-red-50 text-red-700 border-red-200',
  critical: 'bg-red-100 text-red-800 border-red-300',
};
const severityIcons = {
  low: <Check size={12} className="text-green-600" />,
  medium: <AlertTriangle size={12} className="text-yellow-600" />,
  high: <AlertTriangle size={12} className="text-red-600" />,
  critical: <XCircle size={12} className="text-red-700" />,
};

const ReviewModeTab: React.FC = () => {
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ language: true, risk: true, obligation: true });
  const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set());
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [highlighting, setHighlighting] = useState(true);

  const runReview = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setIsRunning(false); setHasRun(true); return 100; }
        return p + Math.random() * 15 + 5;
      });
    }, 300);
  };

  const toggleSection = (s: string) => setExpandedSections(prev => ({ ...prev, [s]: !prev[s] }));
  const toggleReviewed = (id: string) => setReviewedItems(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const readabilityScore = 62;

  const renderFinding = (f: ReviewFinding) => {
    const isExpanded = expandedItem === f.id;
    const isReviewed = reviewedItems.has(f.id);
    return (
      <div key={f.id} className={`border rounded transition-all ${isReviewed ? 'opacity-50' : ''} ${severityColors[f.severity]}`}>
        <button onClick={() => setExpandedItem(isExpanded ? null : f.id)} className="w-full flex items-center gap-2 px-2.5 py-2 text-left">
          {severityIcons[f.severity]}
          <span className="flex-1 text-[11px] font-medium">{f.title}</span>
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        {isExpanded && (
          <div className="px-2.5 pb-2.5 space-y-2">
            <p className="text-[10px]">{f.description}</p>
            {f.clause && <p className="text-[10px]"><span className="font-medium">Clause:</span> {f.clause}</p>}
            {f.party && <p className="text-[10px]"><span className="font-medium">Party:</span> {f.party}</p>}
            {f.deadline && <p className="text-[10px]"><span className="font-medium">Deadline:</span> {f.deadline}</p>}
            {f.suggestion && (
              <div className="p-2 rounded bg-background/80 border border-border">
                <div className="flex items-center gap-1 mb-1">
                  <Lightbulb size={10} className="text-yellow-600" />
                  <span className="text-[10px] font-medium">Suggestion</span>
                </div>
                <p className="text-[10px]">{f.suggestion}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button onClick={() => toggleReviewed(f.id)} className="text-[10px] px-2 py-1 rounded border border-border bg-background hover:bg-accent transition-colors">
                {isReviewed ? 'Mark as unreviewed' : '✓ Mark as reviewed'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!hasRun) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        {isRunning ? (
          <>
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
            <p className="text-sm font-medium mb-1">Analyzing contract...</p>
            <p className="text-[11px] text-muted-foreground mb-4">
              {progress < 30 ? 'Checking language quality...' : progress < 60 ? 'Identifying risks...' : progress < 85 ? 'Extracting obligations...' : 'Finalizing report...'}
            </p>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </>
        ) : (
          <>
            <FileText className="mb-3 text-muted-foreground" size={32} />
            <p className="text-sm font-medium mb-1">Contract Review</p>
            <p className="text-[11px] text-muted-foreground mb-4">Run a comprehensive analysis to identify language issues, risks, and obligations.</p>
            <button onClick={runReview} className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/90 transition-colors">
              <Play size={14} /> Run Full Review
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Summary bar */}
      <div className="px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold">Review Summary</span>
          <button onClick={() => setHighlighting(!highlighting)} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
            {highlighting ? <Eye size={11} /> : <EyeOff size={11} />} Highlights
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-1.5 rounded bg-background border border-border">
            <p className="text-lg font-bold text-yellow-600">{mockLanguageFindings.length}</p>
            <p className="text-[9px] text-muted-foreground">Language</p>
          </div>
          <div className="text-center p-1.5 rounded bg-background border border-border">
            <p className="text-lg font-bold text-red-600">{mockRiskFindings.length}</p>
            <p className="text-[9px] text-muted-foreground">Risks</p>
          </div>
          <div className="text-center p-1.5 rounded bg-background border border-border">
            <p className="text-lg font-bold text-primary">{mockObligationFindings.length}</p>
            <p className="text-[9px] text-muted-foreground">Obligations</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Readability:</span>
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-yellow-500" style={{ width: `${readabilityScore}%` }} />
          </div>
          <span className="text-[10px] font-medium">{readabilityScore}/100</span>
        </div>
      </div>

      {/* Findings */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {/* Language */}
        <div>
          <button onClick={() => toggleSection('language')} className="w-full flex items-center gap-2 py-1.5 text-left">
            {expandedSections.language ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            <span className="text-[11px] font-semibold flex-1">Language Check</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{mockLanguageFindings.length}</span>
          </button>
          {expandedSections.language && <div className="space-y-1 ml-1">{mockLanguageFindings.map(renderFinding)}</div>}
        </div>

        {/* Risk */}
        <div>
          <button onClick={() => toggleSection('risk')} className="w-full flex items-center gap-2 py-1.5 text-left">
            {expandedSections.risk ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            <span className="text-[11px] font-semibold flex-1">Risk Analysis</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">{mockRiskFindings.length}</span>
          </button>
          {expandedSections.risk && <div className="space-y-1 ml-1">{mockRiskFindings.map(renderFinding)}</div>}
        </div>

        {/* Obligations */}
        <div>
          <button onClick={() => toggleSection('obligation')} className="w-full flex items-center gap-2 py-1.5 text-left">
            {expandedSections.obligation ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            <span className="text-[11px] font-semibold flex-1">Obligation Analysis</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{mockObligationFindings.length}</span>
          </button>
          {expandedSections.obligation && <div className="space-y-1 ml-1">{mockObligationFindings.map(renderFinding)}</div>}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border p-2 flex gap-1.5">
        <button onClick={runReview} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] border border-border hover:bg-accent transition-colors">
          <Play size={11} /> Re-run
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] border border-border hover:bg-accent transition-colors">
          Export Summary
        </button>
      </div>
    </div>
  );
};

export default ReviewModeTab;
