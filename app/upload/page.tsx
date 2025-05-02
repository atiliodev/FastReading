"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, ChevronLeft, Upload, AlertCircle, FileText, FileIcon as FilePdf } from "lucide-react"
import { splitTextIntoPages } from "@/lib/text-processing"
import { processPDF, splitPDFIntoPages as splitPDFPages } from "@/lib/pdf-processor"
import type { BookItem } from "@/lib/types"

export default function UploadPage() {
  // State for tracking file upload process
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  /**
   * Check if a book with the given title already exists in the library
   * @param title Title of the book to check
   * @returns The existing book or null if not found
   */
  const checkExistingBooks = (title: string): BookItem | null => {
    try {
      const existingLibraryJSON = localStorage.getItem("reading-library")
      if (!existingLibraryJSON) return null

      const existingLibrary = JSON.parse(existingLibraryJSON) as BookItem[]
      return existingLibrary.find((book) => book.title === title) || null
    } catch (error) {
      console.error("Error checking existing books:", error)
      return null
    }
  }

  /**
   * Handle file upload and process the file content
   * @param e File input change event
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset error and warning states
    setError(null)
    setWarning(null)

    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)

    try {
      let text: string
      let pages: string[]
      let paragraphs: { id: string; content: string; pageNumber: number }[] | undefined

      // Process different file types
      if (file.type === "application/pdf") {
        try {
          // Use the new PDF processor
          const result = await processPDF(file)

          if (result.pages.length === 0) {
            setError("Could not extract any content from this PDF. The PDF might be corrupted or encrypted.")
            setLoading(false)
            return
          }

          // Show warning if the PDF appears to be scanned
          if (result.isScanned) {
            setWarning("This PDF appears to be scanned. Text extraction quality may vary.")
          }

          // Extract paragraphs from all pages
          paragraphs = result.pages.flatMap(page => 
            page.paragraphs.map(paragraph => ({
              id: paragraph.id,
              content: paragraph.content,
              pageNumber: paragraph.pageNumber
            }))
          )

          // Use the specialized PDF page splitting
          pages = splitPDFPages(result.pages, 15) // Target 15 pages max

          // Show a warning if the text might be incomplete
          if (pages.length < 3) {
            setWarning("Limited text was extracted from this PDF. Some content may be missing.")
          }
        } catch (pdfError) {
          console.error("PDF extraction error:", pdfError)
          setError("An error occurred while processing the PDF. Please try a different file.")
          setLoading(false)
          return
        }
      } else {
        // Handle text files (txt, md)
        text = await file.text()

        // Use our standard text splitting for non-PDF files
        pages = splitTextIntoPages(text)
      }

      // If pages are empty, show an error
      if (pages.length === 0) {
        setError("Could not process the text into readable pages. Please try another file.")
        setLoading(false)
        return
      }

      // Check if this book already exists in the library
      const existingBook = checkExistingBooks(file.name)

      // Store the pages in localStorage
      localStorage.setItem(
        "reading-content",
        JSON.stringify({
          title: file.name,
          pages,
          currentPage: existingBook ? existingBook.currentPage : 0,
          paragraphs
        }),
      )

      // Navigate to the reader page
      router.push("/reader")
    } catch (error) {
      console.error("Error processing file:", error)
      setError("An error occurred while processing the file. Please try again.")
      setLoading(false)
    }
  }

  /**
   * Load a sample text and navigate to the reader
   * @param title Title of the sample
   * @param pages Array of page content
   */
  const loadSampleText = (title: string, pages: string[]) => {
    localStorage.setItem(
      "reading-content",
      JSON.stringify({
        title,
        pages,
        currentPage: 0,
      }),
    )
    router.push("/reader")
  }

  return (
    <div className="container max-w-4xl py-8 px-4 sm:px-8 sm:py-16">
      {/* Navigation back to home */}
      <Link href="/" className="inline-flex items-center text-sm mb-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-8">Upload Reading Material</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* File upload card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <div className="space-y-2 text-center">
                  <Label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:underline font-medium">
                    Choose a file
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".txt,.md,.pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-muted-foreground">Support for .txt, .md, and .pdf files</p>
                </div>
              </div>

              {/* PDF support notice */}
              <div className="flex items-center gap-2 text-sm text-blue-600 p-3 bg-blue-50 rounded-md border border-blue-200">
                <FilePdf className="h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>PDF Support:</strong> The app will attempt to extract text from PDFs. Images will be ignored,
                  and some formatting may be lost. For best results with complex PDFs, try converting to plain text
                  first.
                </span>
              </div>

              {/* Display file name and loading state */}
              {fileName && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">{fileName}</span>
                  </div>
                  {loading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  ) : error ? (
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  )}
                </div>
              )}

              {/* Display warning message if any */}
              {warning && (
                <div className="flex items-center gap-2 text-sm text-amber-600 p-3 bg-amber-50 rounded-md border border-amber-200">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{warning}</span>
                </div>
              )}

              {/* Display error message if any */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 rounded-md border border-red-200">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                className="w-full"
                disabled={!fileName || loading || !!error}
                onClick={() => router.push("/reader")}
              >
                {loading ? "Processing..." : "Begin Reading"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sample texts card */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Sample Texts</h2>
            <p className="text-muted-foreground mb-6">
              Don't have a document ready? Try one of our sample texts to get started immediately.
            </p>

            <div className="space-y-3">
              {/* Sample text 1 */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  loadSampleText("The Importance of Reading", [
                    "Reading is one of the most fundamental skills a person can learn. It opens doors to knowledge, imagination, and understanding that might otherwise remain closed. Through reading, we can explore new worlds, meet diverse characters, and gain insights into different perspectives.",
                    "Regular reading has been shown to improve vocabulary, enhance concentration, and boost analytical thinking skills. It can reduce stress, improve memory, and even delay the onset of cognitive decline in older adults.",
                    "In today's digital age, reading remains as important as ever. While formats may change, the cognitive benefits of engaging with text remain constant. Whether it's a physical book, an e-reader, or a smartphone, the act of reading continues to be a powerful tool for personal growth.",
                  ])
                }
              >
                <BookOpen className="h-4 w-4 mr-2" />
                The Importance of Reading
              </Button>

              {/* Sample text 2 */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  loadSampleText("How to Improve Reading Speed", [
                    "Reading speed is a skill that can be developed with practice. The average adult reads at approximately 200-250 words per minute, but with proper techniques, this can be significantly increased without sacrificing comprehension.",
                    "One effective technique is to reduce subvocalization – the habit of pronouncing each word in your head as you read. By training yourself to recognize words visually rather than phonetically, you can process information more quickly.",
                    "Another approach is to use your peripheral vision more effectively. Rather than focusing on each word individually, try to train your eyes to take in groups of words or entire lines at once. This technique, known as chunking, can dramatically increase reading speed.",
                  ])
                }
              >
                <BookOpen className="h-4 w-4 mr-2" />
                How to Improve Reading Speed
              </Button>

              {/* Sample text 3 */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  loadSampleText("The Science of Comprehension", [
                    "Reading comprehension involves multiple cognitive processes working together. When we read, our brains decode symbols into words, interpret their meanings, and integrate this information with our existing knowledge.",
                    "Working memory plays a crucial role in comprehension. As we read, we need to hold information in mind while simultaneously processing new content. This is why distraction can significantly impact understanding.",
                    "Metacognitive strategies – being aware of and regulating your own thinking processes – can significantly improve comprehension. Techniques like summarizing, questioning, and predicting help readers engage more deeply with the text.",
                  ])
                }
              >
                <BookOpen className="h-4 w-4 mr-2" />
                The Science of Comprehension
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
