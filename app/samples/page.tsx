"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ChevronLeft } from "lucide-react"

export default function SamplesPage() {
  return (
    <div className="container max-w-4xl py-8 px-4">
      <Link href="/" className="inline-flex items-center text-sm mb-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Sample Texts</h1>
          <p className="text-muted-foreground">
            Choose from our collection of sample texts to practice your reading skills. These texts vary in length and
            complexity to help you progress at your own pace.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <SampleCard
            title="The Importance of Reading"
            category="Educational"
            readingTime="2 min"
            difficulty="Easy"
            description="A brief exploration of why reading remains an essential skill in the digital age."
            pageCount={3}
          />

          <SampleCard
            title="How to Improve Reading Speed"
            category="Educational"
            readingTime="2 min"
            difficulty="Easy"
            description="Practical techniques to help you read faster without sacrificing comprehension."
            pageCount={3}
          />

          <SampleCard
            title="The Science of Comprehension"
            category="Educational"
            readingTime="2 min"
            difficulty="Medium"
            description="An overview of the cognitive processes involved in reading comprehension."
            pageCount={3}
          />

          <SampleCard
            title="Digital vs. Print Reading"
            category="Research"
            readingTime="3 min"
            difficulty="Medium"
            description="Comparing the effects of reading digital content versus traditional printed materials."
            pageCount={4}
          />

          <SampleCard
            title="The History of Books"
            category="History"
            readingTime="4 min"
            difficulty="Medium"
            description="A journey through the evolution of books from ancient scrolls to modern e-readers."
            pageCount={5}
          />

          <SampleCard
            title="Why Deep Reading Matters"
            category="Opinion"
            readingTime="5 min"
            difficulty="Hard"
            description="An exploration of deep reading in an age of distraction and information overload."
            pageCount={6}
          />
        </div>
      </div>
    </div>
  )
}

interface SampleCardProps {
  title: string
  category: string
  readingTime: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  pageCount: number
}

function SampleCard({ title, category, readingTime, difficulty, description, pageCount }: SampleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{category}</CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-md text-xs font-medium">{readingTime}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{description}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span>{pageCount} pages</span>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                difficulty === "Easy"
                  ? "bg-green-100 text-green-800"
                  : difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {difficulty}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            // In a real implementation, we would load different content based on the selected sample
            localStorage.setItem(
              "reading-content",
              JSON.stringify({
                title: title,
                pages: Array(pageCount)
                  .fill(undefined)
                  .map(
                    (_, i) =>
                      `This is sample content for "${title}" - page ${i + 1} of ${pageCount}. The actual content would be more substantial and relate to the topic described. This placeholder text is here to demonstrate how the page would look with real content. In the full implementation, each sample would have unique, informative content related to its title and description.`,
                  ),
                currentPage: 0,
              }),
            )

            // Redirect would happen here in a client component with useRouter
            window.location.href = "/reader"
          }}
        >
          Start Reading
        </Button>
      </CardFooter>
    </Card>
  )
}
