import * as pdfjsLib from 'pdfjs-dist'
import { createWorker } from 'tesseract.js'
import { TextItem } from 'pdfjs-dist/types/src/display/api'

// Initialize PDF.js worker for Next.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

// Types for PDF processing results
export interface PDFPage {
  pageNumber: number
  content: string
  textPositions: TextPosition[]
  paragraphs: Paragraph[]
}

export interface TextPosition {
  text: string
  x: number
  y: number
  width: number
  height: number
}

export interface Paragraph {
  id: string
  content: string
  pageNumber: number
  position: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface PDFMetadata {
  title: string
  author: string
  subject: string
  keywords: string
  creator: string
  producer: string
  creationDate: string
  modificationDate: string
}

export interface PDFProcessingResult {
  pages: PDFPage[]
  metadata: PDFMetadata
  isScanned: boolean
}

/**
 * Processes a PDF file and extracts text content with metadata
 * @param file The PDF file to process
 * @returns Promise resolving to the processed PDF content
 */
export async function processPDF(file: File): Promise<PDFProcessingResult> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    // Get document metadata
    const metadata = await extractMetadata(pdf)
    
    // Process each page
    const pages: PDFPage[] = []
    let isScanned = false
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const pageContent = await extractPageContent(page)
      
      // Check if page might be scanned (contains images)
      if (pageContent.isScanned) {
        isScanned = true
        // Try OCR if the page appears to be scanned
        const ocrContent = await performOCR(page)
        pages.push({
          pageNumber: i,
          content: ocrContent,
          textPositions: [], // OCR doesn't provide text positions
          paragraphs: []
        })
      } else {
        pages.push({
          pageNumber: i,
          content: pageContent.text,
          textPositions: pageContent.textPositions,
          paragraphs: pageContent.paragraphs
        })
      }
    }
    
    return {
      pages,
      metadata,
      isScanned
    }
  } catch (error) {
    console.error('Error processing PDF:', error)
    throw new Error('Failed to process PDF file')
  }
}

/**
 * Extracts metadata from a PDF document
 */
async function extractMetadata(pdf: pdfjsLib.PDFDocumentProxy): Promise<PDFMetadata> {
  const info = await pdf.getMetadata()
  const metadata = info.info || {}
  
  return {
    title: (metadata as any).Title || '',
    author: (metadata as any).Author || '',
    subject: (metadata as any).Subject || '',
    keywords: (metadata as any).Keywords || '',
    creator: (metadata as any).Creator || '',
    producer: (metadata as any).Producer || '',
    creationDate: (metadata as any).CreationDate || '',
    modificationDate: (metadata as any).ModificationDate || '',
  }
}

/**
 * Extracts content from a single PDF page
 */
async function extractPageContent(page: pdfjsLib.PDFPageProxy): Promise<{ 
  text: string, 
  textPositions: TextPosition[], 
  isScanned: boolean,
  paragraphs: Paragraph[]
}> {
  const textContent = await page.getTextContent()
  const viewport = page.getViewport({ scale: 1.0 })
  
  // Check if page might be scanned (contains images)
  const isScanned = await checkIfScanned(page)
  
  // Extract text and positions
  const textPositions: TextPosition[] = []
  let text = ''
  const paragraphs: Paragraph[] = []
  let currentParagraph: { text: string, positions: TextPosition[] } = { text: '', positions: [] }
  
  for (const item of textContent.items) {
    if ('str' in item) {
      const textItem = item as TextItem
      const itemText = textItem.str
      
      // Check if this item starts a new paragraph
      const isNewParagraph = itemText.trim().match(/^[A-Z]/) && 
                            (currentParagraph.text.endsWith('.') || 
                             currentParagraph.text.endsWith('!') || 
                             currentParagraph.text.endsWith('?'))
      
      if (isNewParagraph && currentParagraph.text.trim()) {
        // Save the current paragraph
        const paragraphId = `p-${page.pageNumber}-${paragraphs.length}`
        const paragraphBounds = calculateParagraphBounds(currentParagraph.positions)
        paragraphs.push({
          id: paragraphId,
          content: currentParagraph.text.trim(),
          pageNumber: page.pageNumber,
          position: paragraphBounds
        })
        
        // Start a new paragraph
        currentParagraph = { text: '', positions: [] }
      }
      
      // Add text to current paragraph
      currentParagraph.text += itemText + ' '
      currentParagraph.positions.push({
        text: itemText,
        x: textItem.transform[4],
        y: viewport.height - textItem.transform[5],
        width: textItem.width,
        height: textItem.height
      })
      
      // Add to overall text
      text += itemText + ' '
      textPositions.push({
        text: itemText,
        x: textItem.transform[4],
        y: viewport.height - textItem.transform[5],
        width: textItem.width,
        height: textItem.height
      })
    }
  }
  
  // Add the last paragraph if it exists
  if (currentParagraph.text.trim()) {
    const paragraphId = `p-${page.pageNumber}-${paragraphs.length}`
    const paragraphBounds = calculateParagraphBounds(currentParagraph.positions)
    paragraphs.push({
      id: paragraphId,
      content: currentParagraph.text.trim(),
      pageNumber: page.pageNumber,
      position: paragraphBounds
    })
  }
  
  return {
    text: text.trim(),
    textPositions,
    isScanned,
    paragraphs
  }
}

/**
 * Calculates the bounding box for a paragraph based on its text positions
 */
function calculateParagraphBounds(positions: TextPosition[]): { x: number, y: number, width: number, height: number } {
  if (positions.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }
  
  const xValues = positions.map(p => p.x)
  const yValues = positions.map(p => p.y)
  const widths = positions.map(p => p.width)
  const heights = positions.map(p => p.height)
  
  const minX = Math.min(...xValues)
  const minY = Math.min(...yValues)
  const maxX = Math.max(...xValues.map((x, i) => x + widths[i]))
  const maxY = Math.max(...yValues.map((y, i) => y + heights[i]))
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}

/**
 * Checks if a page might be scanned (contains images)
 */
async function checkIfScanned(page: pdfjsLib.PDFPageProxy): Promise<boolean> {
  const operators = await page.getOperatorList()
  
  // Look for image operators
  const imageOperators = operators.fnArray.filter(op => 
    op === pdfjsLib.OPS.paintImageXObject ||
    op === pdfjsLib.OPS.paintImageXObjectRepeat
  )
  
  // If there are many image operators and few text operators, it's likely scanned
  const textOperators = operators.fnArray.filter(op => 
    op === pdfjsLib.OPS.showText ||
    op === pdfjsLib.OPS.showSpacedText
  )
  
  return imageOperators.length > textOperators.length
}

/**
 * Performs OCR on a PDF page
 */
async function performOCR(page: pdfjsLib.PDFPageProxy): Promise<string> {
  try {
    // Convert page to image
    const viewport = page.getViewport({ scale: 2.0 }) // Higher scale for better OCR
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    if (!context) {
      throw new Error('Failed to create canvas context')
    }
    
    canvas.width = viewport.width
    canvas.height = viewport.height
    
    await page.render({
      canvasContext: context,
      viewport
    }).promise
    
    // Initialize Tesseract worker
    const worker = await createWorker('eng')
    
    try {
      // Perform OCR
      const { data: { text } } = await worker.recognize(canvas)
      return text.trim()
    } finally {
      await worker.terminate()
    }
  } catch (error) {
    console.error('OCR failed:', error)
    return '' // Return empty string if OCR fails
  }
}

/**
 * Splits PDF content into pages with approximately equal content
 * @param pages Array of PDF pages
 * @param targetPageCount Desired number of pages
 * @returns Array of page content strings
 */
export function splitPDFIntoPages(pages: PDFPage[], targetPageCount = 10): string[] {
  if (pages.length === 0) return []
  
  // If we have fewer pages than target, return as is
  if (pages.length <= targetPageCount) {
    return pages.map(page => page.content)
  }
  
  // Calculate total content length
  const totalContent = pages.map(page => page.content).join(' ')
  const words = totalContent.split(/\s+/)
  const wordsPerPage = Math.ceil(words.length / targetPageCount)
  
  const result: string[] = []
  let currentPage: string[] = []
  let wordCount = 0
  
  for (const word of words) {
    currentPage.push(word)
    wordCount++
    
    if (wordCount >= wordsPerPage) {
      // Try to find a good breaking point
      const currentText = currentPage.join(' ')
      const sentenceBreak = findSentenceBreak(currentText)
      
      if (sentenceBreak > 0 && sentenceBreak < currentText.length - 20) {
        result.push(currentText.substring(0, sentenceBreak + 1).trim())
        currentPage = currentText.substring(sentenceBreak + 1).trim().split(' ')
      } else {
        result.push(currentText)
        currentPage = []
      }
      
      wordCount = currentPage.length
    }
  }
  
  // Add any remaining content
  if (currentPage.length > 0) {
    result.push(currentPage.join(' '))
  }
  
  return result
}

/**
 * Finds the last sentence break in a text
 */
function findSentenceBreak(text: string): number {
  const matches = [...text.matchAll(/[.!?]\s/g)]
  return matches.length > 0 ? matches[matches.length - 1].index! : -1
} 