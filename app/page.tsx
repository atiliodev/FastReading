import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Upload } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold">FastReading</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/library" className="text-sm font-medium hover:underline underline-offset-4">
              Library
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container px-4 py-12 sm:px-8 sm:py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Improve Your Reading Speed and Comprehension
            </h1>
            <p className="text-xl text-muted-foreground">
              FastReading helps you enhance your reading habits through time-managed sessions. Our page-timer
              automatically advances pages, keeping you focused and engaged.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Reading Material
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/samples">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Try Sample Texts
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/library">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Your Library
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container px-4 py-12 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-8 text-center">How It Works</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-3 p-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Upload Your Text</h3>
                <p className="text-muted-foreground">
                  Import your own documents or choose from our sample texts to get started.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 p-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Set Your Pace</h3>
                <p className="text-muted-foreground">Configure the timer to match your reading speed and goals.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 p-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Improve Steadily</h3>
                <p className="text-muted-foreground">
                  The app automatically advances pages, helping you develop a consistent reading rhythm.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex h-16 items-center px-4 sm:px-8 justify-between">
          <p className="text-sm text-muted-foreground">© 2024 FastReading. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:underline">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
