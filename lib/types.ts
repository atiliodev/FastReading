/**
 * Type definitions for the reading application
 */

/**
 * Represents a book in the user's library
 */
export interface BookItem {
  /** Unique identifier for the book */
  id: string

  /** Title of the book */
  title: string

  /** Array of page content strings */
  pages: string[]

  /** Current page index (0-based) */
  currentPage: number

  /** Total time spent reading in seconds */
  timeSpent: number

  /** ISO string of when the book was last read */
  lastRead: string

  /** Whether the book has been completed */
  completed: boolean
}
