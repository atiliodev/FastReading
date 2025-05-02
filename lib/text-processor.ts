import { TextItem } from 'pdfjs-dist/types/src/display/api';

export interface TextElement {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  isTitle: boolean;
  level?: number; // For heading levels (h1, h2, etc.)
}

export interface TextProcessingOptions {
  titleSizeThreshold: number;      // Minimum font size for titles
  titleWeightThreshold: number;    // Minimum font weight for titles
  minTitleLength: number;         // Minimum length for a title
  maxTitleLength: number;         // Maximum length for a title
  titlePatterns?: RegExp[];       // Optional patterns to identify titles
  customTitleFonts?: string[];    // Specific fonts that indicate titles
}

export interface ProcessedContent {
  titles: TextElement[];
  paragraphs: TextElement[];
}

const defaultOptions: TextProcessingOptions = {
  titleSizeThreshold: 14,
  titleWeightThreshold: 600,
  minTitleLength: 2,
  maxTitleLength: 200,
  titlePatterns: [
    /^(?:Chapter|Section|\d+\.)/i,
    /^[A-Z\s]{4,}$/,  // All caps text of 4+ characters
  ]
};

export function isLikelyTitle(element: TextElement, options: TextProcessingOptions): boolean {
  const text = element.text.trim();
  
  // Check text length constraints
  if (text.length < options.minTitleLength || text.length > options.maxTitleLength) {
    return false;
  }

  // Check font properties if available
  if (element.fontSize && element.fontSize >= options.titleSizeThreshold) {
    return true;
  }

  if (element.fontWeight && element.fontWeight >= options.titleWeightThreshold) {
    return true;
  }

  // Check custom title fonts
  if (options.customTitleFonts && element.fontFamily) {
    if (options.customTitleFonts.some(font => 
      element.fontFamily?.toLowerCase().includes(font.toLowerCase())
    )) {
      return true;
    }
  }

  // Check title patterns
  if (options.titlePatterns) {
    if (options.titlePatterns.some(pattern => pattern.test(text))) {
      return true;
    }
  }

  return false;
}

export function processText(textItems: TextItem[], options: Partial<TextProcessingOptions> = {}): ProcessedContent {
  const mergedOptions = { ...defaultOptions, ...options };
  const result: ProcessedContent = {
    titles: [],
    paragraphs: []
  };

  let currentParagraph: TextElement = {
    text: '',
    isTitle: false
  };

  for (const item of textItems) {
    const textElement: TextElement = {
      text: item.str,
      fontSize: item.transform?.[0] || undefined, // PDF.js transform[0] often represents font size
      fontFamily: item.fontName,
      isTitle: false
    };

    // Determine if this element is a title
    textElement.isTitle = isLikelyTitle(textElement, mergedOptions);

    if (textElement.isTitle) {
      // If we have accumulated paragraph text, save it
      if (currentParagraph.text.trim()) {
        result.paragraphs.push({ ...currentParagraph });
        currentParagraph.text = '';
      }
      result.titles.push(textElement);
    } else {
      // Handle paragraph text
      if (item.hasEOL) {
        currentParagraph.text += textElement.text + ' ';
      } else {
        currentParagraph.text += textElement.text;
      }
    }
  }

  // Add the last paragraph if it exists
  if (currentParagraph.text.trim()) {
    result.paragraphs.push(currentParagraph);
  }

  return result;
}

export function getHeadingLevel(title: TextElement, baseSize: number = 14): number {
  if (!title.fontSize) return 1;
  
  const sizeDiff = title.fontSize - baseSize;
  if (sizeDiff >= 8) return 1;  // h1
  if (sizeDiff >= 6) return 2;  // h2
  if (sizeDiff >= 4) return 3;  // h3
  if (sizeDiff >= 2) return 4;  // h4
  return 5;  // h5
} 