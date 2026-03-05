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
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            styleMap: [
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p[style-name='Heading 3'] => h3:fresh",
              "p[style-name='Heading 4'] => h4:fresh",
              "p[style-name='Title'] => h1.doc-title:fresh",
              "p[style-name='Subtitle'] => h2.doc-subtitle:fresh",
              "p[style-name='Quote'] => blockquote:fresh",
              "p[style-name='Intense Quote'] => blockquote.intense:fresh",
              "p[style-name='List Paragraph'] => li:fresh",
              "r[style-name='Strong'] => strong",
              "r[style-name='Emphasis'] => em",
              "r[style-name='Intense Emphasis'] => em.intense",
            ],
            includeDefaultStyleMap: true,
            convertImage: mammoth.images.imgElement(function(image) {
              return image.read("base64").then(function(imageBuffer) {
                return {
                  src: "data:" + image.contentType + ";base64," + imageBuffer,
                  style: "max-width:100%;height:auto",
                };
              });
            }),
          }
        );

        pushUndo();
        
        // Preserve formatting by wrapping in a container that retains Word-like defaults
        let html = result.value;
        
        // Preserve paragraph spacing from Word
        html = html.replace(/<p>/g, '<p style="margin:0 0 8pt 0;line-height:1.15;">');
        
        // Preserve heading styles
        html = html.replace(/<h1>/g, '<h1 style="font-size:16pt;font-weight:bold;color:#2E74B5;margin:12pt 0 4pt 0;">');
        html = html.replace(/<h2>/g, '<h2 style="font-size:13pt;font-weight:bold;color:#2E74B5;margin:10pt 0 4pt 0;">');
        html = html.replace(/<h3>/g, '<h3 style="font-size:11pt;font-weight:bold;margin:8pt 0 4pt 0;">');
        html = html.replace(/<h4>/g, '<h4 style="font-size:11pt;font-weight:bold;font-style:italic;margin:6pt 0 2pt 0;">');
        
        // Preserve blockquote formatting
        html = html.replace(/<blockquote>/g, '<blockquote style="margin:8pt 0;padding:4pt 12pt;border-left:3px solid #2E74B5;color:#404040;font-style:italic;">');
        
        // Preserve table formatting
        html = html.replace(/<table>/g, '<table style="border-collapse:collapse;width:100%;margin:8pt 0;">');
        html = html.replace(/<td>/g, '<td style="border:1px solid #999;padding:4px 8px;">');
        html = html.replace(/<th>/g, '<th style="border:1px solid #999;padding:4px 8px;font-weight:bold;background:#f0f0f0;">');
        
        editorRef.current.innerHTML = html;
        setState(p => ({ ...p, documentTitle: file.name.replace(/\.\w+$/, '') }));
        
        if (result.messages.length > 0) {
          console.warn('Document conversion warnings:', result.messages);
        }
      } catch (err) {
        console.error('Error opening file:', err);
      }
    } else if (ext === 'html' || ext === 'htm') {
      const text = await file.text();
      pushUndo();
      // Extract body content if full HTML document, preserving styles
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      // Grab any <style> blocks and inline them
      const styles = doc.querySelectorAll('style');
      let styleContent = '';
      styles.forEach(s => { styleContent += s.textContent; });
      const bodyContent = doc.body.innerHTML;
      editorRef.current.innerHTML = (styleContent ? `<style>${styleContent}</style>` : '') + bodyContent;
      setState(p => ({ ...p, documentTitle: file.name.replace(/\.\w+$/, '') }));
    } else if (ext === 'txt') {
      const text = await file.text();
      pushUndo();
      // Preserve line breaks
      editorRef.current.innerHTML = text.split('\n').map(line => `<p style="margin:0 0 2pt 0;">${line || '&nbsp;'}</p>`).join('');
      setState(p => ({ ...p, documentTitle: file.name.replace(/\.\w+$/, '') }));
    } else if (ext === 'rtf') {
      // Basic RTF - just strip RTF codes and display as text
      const text = await file.text();
      pushUndo();
      const plainText = text.replace(/\{[^}]*\}/g, '').replace(/\\[a-z]+\d* ?/g, '').replace(/[{}]/g, '');
      editorRef.current.innerHTML = plainText.split('\n').map(line => `<p style="margin:0 0 2pt 0;">${line || '&nbsp;'}</p>`).join('');
      setState(p => ({ ...p, documentTitle: file.name.replace(/\.\w+$/, '') }));
    }
    e.target.value = '';
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-[320px] bg-primary z-50 text-primary-foreground shadow-xl flex flex-col">
        <input type="file" ref={fileInputRef} className="hidden" accept=".docx,.doc,.html,.htm,.txt,.rtf" onChange={handleFileOpen} />
        
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
