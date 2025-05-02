import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, ChevronLeft, Clock, LineChart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-8 px-4">
      <Link href="/" className="inline-flex items-center text-sm mb-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">About FastReading</h1>
          <p className="text-xl text-muted-foreground">
            Improve your reading habits with time-managed reading sessions.
          </p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p>
              FastReading was created to help people improve their reading skills through structured practice. By using
              our timed reading approach, you can gradually increase your reading speed while By using our timed reading
              approach, you can gradually increase your reading speed while maintaining comprehension and retention of
              information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Key Features</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col space-y-2">
                <div className="bg-primary/10 p-3 rounded-full w-fit">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold">Timed Reading</h3>
                <p className="text-muted-foreground">
                  Our page timer automatically advances pages, helping you develop a consistent reading pace.
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="bg-primary/10 p-3 rounded-full w-fit">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold">Flexible Content</h3>
                <p className="text-muted-foreground">
                  Upload your own reading materials or choose from our sample texts to practice with.
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="bg-primary/10 p-3 rounded-full w-fit">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your reading speed and comprehension improvements over time.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">How It Helps</h2>
            <p>
              Reading with a timer encourages focus and reduces distractions. The gentle pressure of knowing the page
              will advance after a set time helps train your brain to process information more efficiently.
            </p>
            <p>
              As you use FastReading regularly, you can gradually decrease the time per page, naturally increasing your
              reading speed without sacrificing comprehension.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Get Started</h2>
            <p>Ready to improve your reading skills? Upload your own text or try one of our samples today.</p>
            <Button asChild>
              <Link href="/upload">Start Reading Now</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
