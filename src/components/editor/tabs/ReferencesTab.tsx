import React from 'react';
import { useEditor } from '../EditorContext';

const ReferencesTab: React.FC = () => {
  const { editorRef, pushUndo, execCommand } = useEditor();

  const insertTOC = () => {
    if (!editorRef.current) return;
    pushUndo();
    const headings = editorRef.current.querySelectorAll('h1, h2, h3, h4');
    if (headings.length === 0) {
      execCommand('insertHTML', '<p style="color:#666;font-style:italic">[No headings found for Table of Contents]</p>');
      return;
    }
    let tocHtml = '<div style="border:1px solid #ccc;padding:12px;margin:8px 0;background:#fafafa"><p style="font-weight:bold;font-size:14pt;margin-bottom:8px">Table of Contents</p>';
    headings.forEach((h, i) => {
      const level = parseInt(h.tagName[1]);
      const indent = (level - 1) * 20;
      const text = h.textContent || `Heading ${i + 1}`;
      tocHtml += `<p style="margin:2px 0;padding-left:${indent}px;font-size:11pt">${text}</p>`;
    });
    tocHtml += '</div>';
    execCommand('insertHTML', tocHtml);
  };

  const insertFootnote = () => {
    pushUndo();
    const num = (editorRef.current?.querySelectorAll('.footnote-ref')?.length || 0) + 1;
    execCommand('insertHTML', `<sup class="footnote-ref" style="color:#2E74B5;cursor:pointer;font-size:9pt">[${num}]</sup>`);
    // Append footnote at bottom
    if (editorRef.current) {
      const footnoteDiv = document.createElement('div');
      footnoteDiv.style.cssText = 'border-top:1px solid #ccc;margin-top:16px;padding-top:4px;font-size:9pt;color:#666';
      footnoteDiv.innerHTML = `<sup style="color:#2E74B5">[${num}]</sup> <span contenteditable="true">Footnote text</span>`;
      editorRef.current.appendChild(footnoteDiv);
    }
  };

  const insertBibliography = () => {
    pushUndo();
    execCommand('insertHTML', `
      <div style="border-top:2px solid #333;margin-top:24px;padding-top:12px">
        <p style="font-weight:bold;font-size:14pt;margin-bottom:8px">Bibliography</p>
        <p style="margin:4px 0;padding-left:36px;text-indent:-36px;font-size:11pt">Author, A. (Year). <em>Title of work</em>. Publisher.</p>
        <p style="margin:4px 0;padding-left:36px;text-indent:-36px;font-size:11pt">Author, B. (Year). Title of article. <em>Journal Name</em>, Volume(Issue), Pages.</p>
      </div>
    `);
  };

  return (
    <div className="flex items-stretch gap-0">
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <button className="ribbon-btn-lg" onClick={insertTOC} title="Table of Contents">
          <span className="text-[18px]">📑</span>
          <span className="text-[9px]">Table of Contents</span>
        </button>
        <span className="text-[9px] text-muted-foreground mt-auto">Table of Contents</span>
      </div>
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <button className="ribbon-btn-lg" onClick={insertFootnote} title="Insert Footnote">
          <span className="text-[18px]">📝</span>
          <span className="text-[9px]">Footnote</span>
        </button>
        <span className="text-[9px] text-muted-foreground mt-auto">Footnotes</span>
      </div>
      <div className="ribbon-group flex-col py-1 gap-0.5 items-center">
        <button className="ribbon-btn-lg" onClick={insertBibliography} title="Insert Bibliography">
          <span className="text-[18px]">📚</span>
          <span className="text-[9px]">Bibliography</span>
        </button>
        <span className="text-[9px] text-muted-foreground mt-auto">Citations</span>
      </div>
    </div>
  );
};

export default ReferencesTab;
