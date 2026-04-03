import React, { useState } from 'react';
import { Search, Sparkles, ChevronRight, ChevronLeft, Star, BookOpen, ArrowRight, Check, X } from 'lucide-react';
import { mockClauses, Clause } from './mockData';

interface Props {
  selectedText: string;
  onInsertClause: (text: string) => void;
}

const riskColors = { low: 'text-green-600 bg-green-50', medium: 'text-yellow-600 bg-yellow-50', high: 'text-red-600 bg-red-50' };
const riskLabels = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };
const categories = ['All', 'Liability', 'Indemnification', 'Termination', 'Confidentiality', 'Data Protection', 'Miscellaneous'];
const contractTypes = ['All', 'MSA', 'NDA', 'SLA'];

const ClauseLibraryTab: React.FC<Props> = ({ selectedText, onInsertClause }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [insertConfirm, setInsertConfirm] = useState<string | null>(null);

  const filtered = mockClauses.filter(c => {
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (typeFilter !== 'All' && c.contractType !== typeFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const suggestions = selectedText ? mockClauses.filter(c =>
    c.tags.some(t => selectedText.toLowerCase().includes(t.toLowerCase().split(' ')[0]))
  ).slice(0, 4) : [];

  const handleInsert = (clause: Clause) => {
    let text = clause.text;
    onInsertClause(text);
    setInsertConfirm(clause.id);
    setTimeout(() => setInsertConfirm(null), 2000);
  };

  // Detail view
  if (selectedClause) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2 border-b border-border">
          <button onClick={() => setSelectedClause(null)} className="flex items-center gap-1 text-[11px] text-primary hover:underline">
            <ChevronLeft size={12} /> Back to library
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          <div>
            <h3 className="text-sm font-semibold">{selectedClause.title}</h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${riskColors[selectedClause.riskLevel]}`}>
                {riskLabels[selectedClause.riskLevel]}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{selectedClause.contractType}</span>
              <span className="text-[10px] text-muted-foreground">• {selectedClause.marketStandard}% market standard</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">{selectedClause.description}</p>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground mb-1">CLAUSE TEXT</p>
            <div className="text-[11px] leading-relaxed p-2.5 rounded border border-border bg-muted/30">
              {selectedClause.text}
            </div>
          </div>
          {selectedClause.variables && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1">VARIABLES</p>
              <div className="flex flex-wrap gap-1">
                {selectedClause.variables.map(v => (
                  <span key={v} className="text-[10px] px-2 py-1 rounded bg-accent text-accent-foreground font-mono">{v}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {selectedClause.tags.map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">#{t}</span>
            ))}
          </div>
        </div>
        <div className="border-t border-border p-3">
          <button onClick={() => handleInsert(selectedClause)} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/90 transition-colors">
            {insertConfirm === selectedClause.id ? <><Check size={14} /> Inserted!</> : <>Insert Clause <ArrowRight size={12} /></>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and filters */}
      <div className="px-3 py-2 space-y-2 border-b border-border">
        <div className="relative">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clauses..." className="w-full text-[11px] pl-7 pr-2 py-1.5 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.slice(0, 5).map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)} className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${categoryFilter === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'}`}>
              {c}
            </button>
          ))}
        </div>
        {selectedText && (
          <button onClick={() => setShowSuggestions(!showSuggestions)} className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded border border-primary/30 bg-primary/5 text-primary text-[11px] font-medium hover:bg-primary/10 transition-colors">
            <Sparkles size={12} /> Smart Suggest ({suggestions.length})
          </button>
        )}
      </div>

      {/* Smart suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="px-3 py-2 border-b border-border bg-accent/20">
          <p className="text-[10px] font-medium text-muted-foreground mb-1.5">AI SUGGESTIONS FOR SELECTED TEXT</p>
          <div className="space-y-1.5">
            {suggestions.map(c => (
              <button key={c.id} onClick={() => setSelectedClause(c)} className="w-full text-left p-2 rounded border border-border bg-background hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium">{c.title}</span>
                  <span className={`text-[9px] px-1 py-0.5 rounded ${riskColors[c.riskLevel]}`}>{c.riskLevel}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{c.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clause list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-[11px] text-muted-foreground">
            <BookOpen className="mx-auto mb-2" size={24} />
            No clauses found
          </div>
        ) : (
          filtered.map(c => (
            <div key={c.id} className="group p-2.5 rounded border border-border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer" onClick={() => setSelectedClause(c)}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium truncate">{c.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{c.description}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${riskColors[c.riskLevel]}`}>{riskLabels[c.riskLevel]}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{c.contractType}</span>
                <span className="text-[9px] text-muted-foreground ml-auto">{c.marketStandard}% standard</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClauseLibraryTab;
