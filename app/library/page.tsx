"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ChevronLeft, Clock, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { formatReadingTime } from "@/lib/utils"
import type { BookItem } from "@/lib/types"

export default function LibraryPage() {
  // Router for navigation
  const router = useRouter()

  // State for books and UI
  const [books, setBooks] = useState<BookItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bookToDelete, setBookToDelete] = useState<string | null>(null)

  /**
   * Load reading history from localStorage on component mount
   */
  useEffect(() => {
    const loadLibrary = () => {
      try {
        const libraryData = localStorage.getItem("reading-library")
        if (libraryData) {
          const parsedLibrary = JSON.parse(libraryData) as BookItem[]
          setBooks(parsedLibrary)
        }
      } catch (error) {
        console.error("Error loading library:", error)
      }
      setIsLoading(false)
    }

    loadLibrary()
  }, [])

  /**
   * Continue reading a book from the library
   * @param book The book to continue reading
   */
  const handleContinueReading = (book: BookItem) => {
    // Set the current reading content to this book
    localStorage.setItem(
      "reading-content",
      JSON.stringify({
        title: book.title,
        pages: book.pages,
        currentPage: book.currentPage,
      }),
    )
    router.push("/reader")
  }

  /**
   * Mark a book for deletion
   * @param bookId ID of the book to delete
   */
  const handleDeleteBook = (bookId: string) => {
    setBookToDelete(bookId)
  }

  /**
   * Confirm and execute book deletion
   */
  const confirmDelete = () => {
    if (bookToDelete) {
      const updatedBooks = books.filter((book) => book.id !== bookToDelete)
      setBooks(updatedBooks)
      localStorage.setItem("reading-library", JSON.stringify(updatedBooks))
      setBookToDelete(null)
    }
  }

  // Filter books by completion status
  const inProgressBooks = books.filter((book) => !book.completed)
  const completedBooks = books.filter((book) => book.completed)

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 px-4">
      {/* Navigation back to home */}
      <Link href="/" className="inline-flex items-center text-sm mb-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Your Library</h1>
          <p className="text-muted-foreground">Track your reading progress and revisit books you've already read.</p>
        </div>

        {/* Tabs for in-progress and completed books */}
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="in-progress">In Progress ({inProgressBooks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedBooks.length})</TabsTrigger>
          </TabsList>

          {/* In-progress books tab */}
          <TabsContent value="in-progress" className="mt-6">
            {inProgressBooks.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {inProgressBooks.map((book) => (
                  <BookCard key={book.id} book={book} onContinue={handleContinueReading} onDelete={handleDeleteBook} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No books in progress</h3>
                <p className="text-muted-foreground mb-6">Start reading a book to see it appear in your library.</p>
                <Button asChild>
                  <Link href="/upload">Upload Reading Material</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Completed books tab */}
          <TabsContent value="completed" className="mt-6">
            {completedBooks.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {completedBooks.map((book) => (
                  <BookCard key={book.id} book={book} onContinue={handleContinueReading} onDelete={handleDeleteBook} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No completed books yet</h3>
                <p className="text-muted-foreground">Books will appear here once you've finished reading them.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!bookToDelete} onOpenChange={(open) => !open && setBookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete book from library?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the book and all reading progress from your library. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/**
 * Book card component for displaying a book in the library
 */
interface BookCardProps {
  book: BookItem
  onContinue: (book: BookItem) => void
  onDelete: (bookId: string) => void
}

function BookCard({ book, onContinue, onDelete }: BookCardProps) {
  // Calculate progress percentage
  const progress = Math.round((book.currentPage / book.pages.length) * 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{book.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onContinue(book)}>Continue reading</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(book.id)} className="text-red-600">
                Delete from library
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {/* Book stats */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>
                {book.currentPage + 1}/{book.pages.length} pages
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatReadingTime(book.timeSpent)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Last read date */}
          {book.lastRead && (
            <div className="text-xs text-muted-foreground">
              Last read: {new Date(book.lastRead).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onContinue(book)}>
          {book.completed ? "Read Again" : "Continue Reading"}
        </Button>
      </CardFooter>
    </Card>
  )
}
