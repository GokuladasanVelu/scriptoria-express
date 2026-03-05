import React from 'react';
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

export interface EditorState {
  fontFamily: string;
  fontSize: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  align: string;
  fontColor: string;
  highlightColor: string;
  zoom: number;
  wordCount: number;
  charCount: number;
  pageCount: number;
  showFormatMarks: boolean;
  documentTitle: string;
  undoStack: string[];
  redoStack: string[];
  findReplaceOpen: boolean;
  activeTab: string;
}

interface EditorContextType {
  state: EditorState;
  setState: React.Dispatch<React.SetStateAction<EditorState>>;
  editorRef: React.RefObject<HTMLDivElement>;
  execCommand: (command: string, value?: string) => void;
  updateFormatState: () => void;
  pushUndo: () => void;
  undo: () => void;
  redo: () => void;
}

const defaultState: EditorState = {
  fontFamily: 'Calibri',
  fontSize: '11',
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  align: 'left',
  fontColor: '#000000',
  highlightColor: 'transparent',
  zoom: 100,
  wordCount: 0,
  charCount: 0,
  pageCount: 1,
  showFormatMarks: false,
  documentTitle: 'Document1',
  undoStack: [],
  redoStack: [],
  findReplaceOpen: false,
  activeTab: 'Home',
};

const EditorContext = createContext<EditorContextType | null>(null);

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EditorState>(defaultState);
  const editorRef = useRef<HTMLDivElement>(null!);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const updateFormatState = useCallback(() => {
    setState(prev => ({
      ...prev,
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      fontFamily: document.queryCommandValue('fontName')?.replace(/"/g, '') || prev.fontFamily,
      fontSize: document.queryCommandValue('fontSize') || prev.fontSize,
    }));
  }, []);

  const pushUndo = useCallback(() => {
    if (!editorRef.current) return;
    setState(prev => ({
      ...prev,
      undoStack: [...prev.undoStack.slice(-49), editorRef.current!.innerHTML],
      redoStack: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.undoStack.length === 0) return prev;
      const stack = [...prev.undoStack];
      const last = stack.pop()!;
      const current = editorRef.current?.innerHTML || '';
      if (editorRef.current) editorRef.current.innerHTML = last;
      return {
        ...prev,
        undoStack: stack,
        redoStack: [...prev.redoStack, current],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.redoStack.length === 0) return prev;
      const stack = [...prev.redoStack];
      const last = stack.pop()!;
      const current = editorRef.current?.innerHTML || '';
      if (editorRef.current) editorRef.current.innerHTML = last;
      return {
        ...prev,
        redoStack: stack,
        undoStack: [...prev.undoStack, current],
      };
    });
  }, []);

  return (
    <EditorContext.Provider value={{ state, setState, editorRef, execCommand, updateFormatState, pushUndo, undo, redo }}>
      {children}
    </EditorContext.Provider>
  );
};
