declare module 'mammoth' {
  interface ConvertResult {
    value: string;
    messages: any[];
  }
  interface ImageElement {
    read(encoding: string): Promise<string>;
    contentType: string;
  }
  interface MammothOptions {
    styleMap?: string[];
    includeDefaultStyleMap?: boolean;
    convertImage?: any;
  }
  const mammoth: {
    convertToHtml(input: { arrayBuffer: ArrayBuffer }, options?: MammothOptions): Promise<ConvertResult>;
    images: {
      imgElement(callback: (image: ImageElement) => Promise<{ src: string; style?: string }>): any;
    };
  };
  export default mammoth;
}

declare module 'jspdf' {
  class jsPDF {
    constructor(orientation?: string, unit?: string, format?: string);
    internal: { pageSize: { getWidth(): number; getHeight(): number } };
    addImage(data: string, format: string, x: number, y: number, w: number, h: number): void;
    save(filename: string): void;
  }
  export default jsPDF;
}

declare module 'html-to-docx' {
  function htmlToDocx(html: string, headerHtml: string | null, options?: any): Promise<Blob>;
  export default htmlToDocx;
}
