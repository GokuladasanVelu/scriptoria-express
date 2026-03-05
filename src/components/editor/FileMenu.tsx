import React, { useRef } from 'react';
import { useEditor } from './EditorContext';
import { FileText, FolderOpen, Save, Download, FilePlus, X } from 'lucide-react';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FileMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { editorRef, setState, state, pushUndo } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const newDocument = () => {
    if (editorRef.current) {
      pushUndo();
      editorRef.current.innerHTML = '';
      setState(p => ({ ...p, documentTitle: 'Document1', wordCount: 0, charCount: 0, pageCount: 1 }));
    }
    onClose();
  };

  const saveAsDocx = async () => {
    try {
      const content = editorRef.current?.innerHTML || '';
      const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Calibri,sans-serif;font-size:11pt;line-height:1.15;}</style></head><body>${content}</body></html>`;
      
      // Dynamic import for html-to-docx
      const htmlToDocx = (await import('html-to-docx')).default;
      const blob = await htmlToDocx(fullHtml, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });
      saveAs(blob as Blob, `${state.documentTitle}.docx`);
    } catch (err) {
      console.error('Error saving DOCX:', err);
      // Fallback: save as HTML
      const content = editorRef.current?.innerHTML || '';
      const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Calibri;font-size:11pt;}</style></head><body>${content}</body></html>`], { type: 'text/html' });
      saveAs(blob, `${state.documentTitle}.html`);
    }
    onClose();
  };

  const saveAsPdf = async () => {
    if (!editorRef.current) return;
    try {
      const canvas = await html2canvas(editorRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'letter');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${state.documentTitle}.pdf`);
    } catch (err) {
      console.error('Error saving PDF:', err);
    }
    onClose();
  };

  const openFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileOpen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editorRef.current) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (ext === 'docx' || ext === 'doc') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        pushUndo();
        editorRef.current.innerHTML = result.value;
        setState(p => ({ ...p, documentTitle: file.name.replace(/\.\w+$/, '') }));
      } catch (err) {
        console.error('Error opening file:', err);
      }
    } else if (ext === 'html' || ext === 'htm') {
      const text = await file.text();
      pushUndo();
      editorRef.current.innerHTML = text;
      setState(p => ({ ...p, documentTitle: file.name.replace(/\.\w+$/, '') }));
    } else if (ext === 'txt') {
      const text = await file.text();
      pushUndo();
      editorRef.current.innerText = text;
      setState(p => ({ ...p, documentTitle: file.name.replace(/\.\w+$/, '') }));
    }
    e.target.value = '';
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-[320px] bg-primary z-50 text-primary-foreground shadow-xl flex flex-col">
        <input type="file" ref={fileInputRef} className="hidden" accept=".docx,.doc,.html,.htm,.txt" onChange={handleFileOpen} />
        
        <div className="p-4 flex items-center gap-2">
          <span className="text-lg font-semibold">File</span>
          <div className="flex-1" />
          <button className="ribbon-btn-sm text-primary-foreground" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        
        <div className="flex flex-col">
          <button className="flex items-center gap-3 px-6 py-3 hover:bg-primary-foreground/10 text-left" onClick={newDocument}>
            <FilePlus size={18} />
            <div>
              <div className="text-[13px]">New</div>
              <div className="text-[11px] opacity-70">Create a blank document</div>
            </div>
          </button>
          <button className="flex items-center gap-3 px-6 py-3 hover:bg-primary-foreground/10 text-left" onClick={openFile}>
            <FolderOpen size={18} />
            <div>
              <div className="text-[13px]">Open</div>
              <div className="text-[11px] opacity-70">Open DOCX, DOC, HTML, or TXT files</div>
            </div>
          </button>
          <button className="flex items-center gap-3 px-6 py-3 hover:bg-primary-foreground/10 text-left" onClick={saveAsDocx}>
            <Save size={18} />
            <div>
              <div className="text-[13px]">Save As DOCX</div>
              <div className="text-[11px] opacity-70">Save document as Word format</div>
            </div>
          </button>
          <button className="flex items-center gap-3 px-6 py-3 hover:bg-primary-foreground/10 text-left" onClick={saveAsPdf}>
            <Download size={18} />
            <div>
              <div className="text-[13px]">Export as PDF</div>
              <div className="text-[11px] opacity-70">Save document as PDF</div>
            </div>
          </button>
          <button className="flex items-center gap-3 px-6 py-3 hover:bg-primary-foreground/10 text-left" onClick={() => window.print()}>
            <FileText size={18} />
            <div>
              <div className="text-[13px]">Print</div>
              <div className="text-[11px] opacity-70">Print the document</div>
            </div>
          </button>
        </div>
        
        <div className="mt-auto p-4 border-t border-primary-foreground/20">
          <div className="text-[11px] opacity-60">
            <div>Document: {state.documentTitle}</div>
            <div>{state.wordCount} words · {state.charCount} characters · {state.pageCount} page(s)</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileMenu;
