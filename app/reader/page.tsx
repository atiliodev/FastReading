"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, ArrowRight, Home, Pause, Play, RefreshCw, Settings, Timer, X, BookOpen, ChevronUp, ChevronDown } from "lucide-react"
import ReaderSettings from "@/components/reader-settings"
import { v4 as uuidv4 } from "uuid"
import type { BookItem } from "@/lib/types"

// Interface for the reading content structure
interface ReadingContent {
  title: string
  pages: string[]
  currentPage: number
  paragraphs?: {
    id: string
    content: string
    pageNumber: number
  }[]
}

export default function ReaderPage() {
  // Router for navigation
  const router = useRouter()

  // State for reading content and UI
  const [content, setContent] = useState<ReadingContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds per page by default
  const [showSettings, setShowSettings] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [pageTimeSettings, setPageTimeSettings] = useState(30) // Default time per page in seconds
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0)
  const [showParagraphNavigation, setShowParagraphNavigation] = useState(false)

  // Refs and state for timing
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [readingStartTime, setReadingStartTime] = useState<number>(Date.now())
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0)

  /**
   * Load content and settings on component mount
   */
  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("reading-content")
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent) as ReadingContent
        setContent(parsedContent)

        // Get saved settings if they exist
        const savedSettings = localStorage.getItem("reading-settings")
        if (savedSettings) {
          const { pageTime } = JSON.parse(savedSettings)
          setPageTimeSettings(pageTime)
          setTimeLeft(pageTime)
        } else {
          setTimeLeft(30) // Default
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    } else {
      // No content found, redirect to upload page
      router.push("/upload")
    }

    setIsLoading(false)

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [router])

  /**
   * Handle timer functionality
   */
  useEffect(() => {
    if (isRunning && !showSettings) {
      // Start the timer interval
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up, move to next page
            nextPage()
            return pageTimeSettings
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      // Clear the timer if not running or settings are shown
      clearInterval(timerRef.current)
    }

    // Clean up on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, showSettings])

  /**
   * Save current page position when content changes
   */
  useEffect(() => {
    if (content) {
      localStorage.setItem("reading-content", JSON.stringify(content))
    }
  }, [content])

  /**
   * Track reading time when timer is running
   */
  useEffect(() => {
    if (isRunning) {
      // Update total time spent when timer is running
      const interval = setInterval(() => {
        setTotalTimeSpent((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isRunning])

  /**
   * Start the timer and initialize reading start time if needed
   */
  const startTimer = () => {
    setIsRunning(true)
    if (totalTimeSpent === 0) {
      setReadingStartTime(Date.now())
    }
  }

  /**
   * Pause the timer
   */
  const pauseTimer = () => setIsRunning(false)

  /**
   * Save reading progress to the library
   */
  const saveProgress = () => {
    if (!content) return

    try {
      // Calculate time spent in this session
      const timeSpent = totalTimeSpent

      // Get existing library or create new one
      const existingLibraryJSON = localStorage.getItem("reading-library")
      const existingLibrary: BookItem[] = existingLibraryJSON ? JSON.parse(existingLibraryJSON) : []

      // Check if this book is already in the library
      const existingBookIndex = existingLibrary.findIndex((book) => book.title === content.title)

      // Determine if the book is completed
      const isCompleted = content.currentPage >= content.pages.length - 1

      if (existingBookIndex >= 0) {
        // Update existing book
        existingLibrary[existingBookIndex] = {
          ...existingLibrary[existingBookIndex],
          currentPage: content.currentPage,
          timeSpent: existingLibrary[existingBookIndex].timeSpent + timeSpent,
          lastRead: new Date().toISOString(),
          completed: isCompleted,
        }
      } else {
        // Add new book to library
        existingLibrary.push({
          id: uuidv4(),
          title: content.title,
          pages: content.pages,
          currentPage: content.currentPage,
          timeSpent: timeSpent,
          lastRead: new Date().toISOString(),
          completed: isCompleted,
        })
      }

      // Save updated library
      localStorage.setItem("reading-library", JSON.stringify(existingLibrary))

      // Reset timer for next session
      setTotalTimeSpent(0)
      setReadingStartTime(Date.now())
    } catch (error) {
      console.error("Error saving reading progress:", error)
    }
  }

  /**
   * Move to the next page
   */
  const nextPage = () => {
    if (!content) return

    // Save progress before changing page
    saveProgress()

    if (content.currentPage < content.pages.length - 1) {
      // Move to next page
      setContent({
        ...content,
        currentPage: content.currentPage + 1,
      })
      // Reset timer for new page
      setTimeLeft(pageTimeSettings)
    } else {
      // Reached the end
      pauseTimer()
    }
  }

  /**
   * Move to the previous page
   */
  const prevPage = () => {
    if (!content) return

    // Save progress before changing page
    saveProgress()

    if (content.currentPage > 0) {
      // Move to previous page
      setContent({
        ...content,
        currentPage: content.currentPage - 1,
      })
      // Reset timer for new page
      setTimeLeft(pageTimeSettings)
    }
  }

  /**
   * Reset the timer to the full page time
   */
  const resetTimer = () => {
    setTimeLeft(pageTimeSettings)
    if (!isRunning) {
      startTimer()
    }
  }

  /**
   * Handle settings changes
   * @param newSettings New settings object
   */
  const handleSettingsChange = (newSettings: { pageTime: number }) => {
    setPageTimeSettings(newSettings.pageTime)
    setTimeLeft(newSettings.pageTime)
    localStorage.setItem("reading-settings", JSON.stringify(newSettings))
    setShowSettings(false)
  }

  /**
   * Navigate to the next paragraph
   */
  const nextParagraph = () => {
    if (!content?.paragraphs) return
    
    const nextIndex = currentParagraphIndex + 1
    if (nextIndex < content.paragraphs.length) {
      setCurrentParagraphIndex(nextIndex)
      // If the paragraph is on a different page, update the page
      if (content.paragraphs[nextIndex].pageNumber !== content.currentPage + 1) {
        setContent({
          ...content,
          currentPage: content.paragraphs[nextIndex].pageNumber - 1
        })
      }
    }
  }

  /**
   * Navigate to the previous paragraph
   */
  const prevParagraph = () => {
    if (!content?.paragraphs) return
    
    const prevIndex = currentParagraphIndex - 1
    if (prevIndex >= 0) {
      setCurrentParagraphIndex(prevIndex)
      // If the paragraph is on a different page, update the page
      if (content.paragraphs[prevIndex].pageNumber !== content.currentPage + 1) {
        setContent({
          ...content,
          currentPage: content.paragraphs[prevIndex].pageNumber - 1
        })
      }
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  // Show error state if no content
  if (!content) {
    return (
      <div className="container max-w-4xl py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">No reading material found</h1>
        <p className="mb-8">Please upload a document or select a sample text to start reading.</p>
        <Button asChild>
          <Link href="/upload">Go to Upload Page</Link>
        </Button>
      </div>
    )
  }

  // Calculate progress percentage
  const progress = Math.round(100 - (timeLeft / pageTimeSettings) * 100)
  const currentPageNumber = content.currentPage + 1
  const totalPages = content.pages.length

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with navigation and controls */}
      <header className="border-b py-3 px-4">
        <div className="container max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setShowExitDialog(true)}>
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="font-medium truncate max-w-[200px] sm:max-w-md">{content.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Page {currentPageNumber}/{totalPages}
            </div>
            {/* Library button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                saveProgress()
                router.push("/library")
              }}
            >
              <BookOpen className="h-5 w-5" />
            </Button>
            {/* Settings button */}
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="container max-w-4xl">
          {/* Reading content card */}
          <Card className="p-8 md:p-12 h-[60vh] overflow-y-auto mb-6 relative">
            {/* Timer display */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm">
                <Timer className="h-4 w-4" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>

            {/* Page content */}
            <div className="prose prose-lg max-w-full">
              {content?.paragraphs ? (
                // Render paragraphs if available
                content.paragraphs
                  .filter(p => p.pageNumber === content.currentPage + 1)
                  .map((paragraph, index) => (
                    <p
                      key={paragraph.id}
                      id={paragraph.id}
                      className={`mb-4 ${
                        currentParagraphIndex === index ? 'bg-muted/50 rounded-md p-2' : ''
                      }`}
                    >
                      {paragraph.content}
                    </p>
                  ))
              ) : (
                // Fallback to regular page content
                <div dangerouslySetInnerHTML={{ __html: content?.pages[content?.currentPage] || '' }} />
              )}
            </div>
          </Card>

          {/* Controls section */}
          <div className="space-y-4">
            {/* Progress bar */}
            <Progress value={progress} className="h-2" />

            {/* Navigation and timer controls */}
            <div className="flex justify-between items-center">
              {/* Previous page button */}
              <Button variant="outline" size="icon" onClick={prevPage} disabled={content?.currentPage === 0}>
                <ArrowLeft className="h-4 w-4" />
              </Button>

              {/* Timer controls */}
              <div className="flex gap-3">
                {isRunning ? (
                  <Button onClick={pauseTimer}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={startTimer}>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                )}

                <Button variant="outline" onClick={resetTimer}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Timer
                </Button>

                {/* Paragraph navigation toggle */}
                {content?.paragraphs && (
                  <Button
                    variant="outline"
                    onClick={() => setShowParagraphNavigation(!showParagraphNavigation)}
                  >
                    {showParagraphNavigation ? 'Hide Paragraphs' : 'Show Paragraphs'}
                  </Button>
                )}
              </div>

              {/* Next page button */}
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={content?.currentPage === (content?.pages.length || 0) - 1}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Paragraph navigation */}
            {showParagraphNavigation && content?.paragraphs && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevParagraph}
                  disabled={currentParagraphIndex === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Paragraph {currentParagraphIndex + 1} of {content.paragraphs.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextParagraph}
                  disabled={currentParagraphIndex === content.paragraphs.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-background w-full max-w-md h-full p-6 animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Reader Settings</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ReaderSettings
              initialSettings={{ pageTime: pageTimeSettings }}
              onSave={handleSettingsChange}
              onCancel={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Reading Session?</AlertDialogTitle>
            <AlertDialogDescription>Your progress will be saved, but the timer will be stopped.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                saveProgress()
                router.push("/")
              }}
            >
              Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
