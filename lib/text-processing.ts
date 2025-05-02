/**
 * Text processing utilities for the reading application
 */

/**
 * Splits text into pages with approximately equal content
 * @param text Full text content to split
 * @param wordsPerPage Approximate number of words per page
 * @returns Array of page content strings
 */
export function splitTextIntoPages(text: string, wordsPerPage = 100): string[] {
  // Clean up text - remove extra whitespace
  const cleanedText = text.replace(/\s+/g, " ").trim()

  // Split text into words
  const words = cleanedText.split(" ")

  // If the text is very short, return it as a single page
  if (words.length <= wordsPerPage) {
    return [cleanedText]
  }

  const pages: string[] = []
  let currentPage: string[] = []
  let wordCount = 0

  // Process the text word by word
  for (const word of words) {
    currentPage.push(word)
    wordCount++

    // When we reach the target words per page, create a new page
    if (wordCount >= wordsPerPage) {
      // Try to find a good breaking point (end of sentence)
      const currentText = currentPage.join(" ")
      const sentenceBreak = findSentenceBreak(currentText)

      if (sentenceBreak > 0 && sentenceBreak < currentText.length - 20) {
        // We found a good breaking point - split at the end of a sentence
        const pageText = currentText.substring(0, sentenceBreak + 1).trim()
        pages.push(pageText)

        // Start the next page with the remaining text
        const remainingText = currentText.substring(sentenceBreak + 1).trim()
        currentPage = remainingText.split(" ")
      } else {
        // No good breaking point found, just use the current page
        pages.push(currentText)
        currentPage = []
      }

      wordCount = currentPage.length
    }
  }

  // Add the last page if there's anything left
  if (currentPage.length > 0) {
    pages.push(currentPage.join(" "))
  }

  return pages
}

/**
 * Find the last sentence break in a text
 * @param text Text to analyze
 * @returns Index of the last sentence-ending punctuation, or -1 if none found
 */
function findSentenceBreak(text: string): number {
  // Look for sentence-ending punctuation followed by a space or end of string
  const matches = [...text.matchAll(/[.!?]\s/g)]

  if (matches.length === 0) {
    return -1
  }

  // Return the index of the last match
  const lastMatch = matches[matches.length - 1]
  return lastMatch.index as number
}
