import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-8 px-4">
      <Link href="/" className="inline-flex items-center text-sm mb-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Introduction</h2>
          <p>
            FastReading ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how
            we collect, use, and safeguard your information when you use our reading application.
          </p>
          <p>
            By using the FastReading application, you agree to the collection and use of information in accordance with
            this policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Information Collection</h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Reading Content:</span> When you upload documents, we temporarily store this
              content to facilitate your reading experience.
            </li>
            <li>
              <span className="font-medium">User Settings:</span> We store your preferences, such as reading speed
              settings, to provide a customized experience.
            </li>
            <li>
              <span className="font-medium">Usage Data:</span> We collect anonymous data about how you use the
              application, such as features used and reading statistics.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our application</li>
            <li>To personalize your experience</li>
            <li>To improve our application based on how it's being used</li>
            <li>To analyze usage patterns and optimize performance</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Data Storage</h2>
          <p>
            Your reading content and preferences are stored locally on your device using browser technologies like
            localStorage. This means your reading materials are not transmitted to our servers by default.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
            are effective when they are posted on this page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@fastreading.app</p>
        </section>

        <div className="text-sm text-muted-foreground">Last updated: May 2, 2024</div>
      </div>
    </div>
  )
}
