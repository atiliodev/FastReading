"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Props for the ReaderSettings component
 */
interface ReaderSettingsProps {
  /** Initial settings values */
  initialSettings: {
    /** Time per page in seconds */
    pageTime: number
  }
  /** Callback when settings are saved */
  onSave: (settings: { pageTime: number }) => void
  /** Callback when settings are canceled */
  onCancel: () => void
}

/**
 * Component for adjusting reader settings
 */
export default function ReaderSettings({ initialSettings, onSave, onCancel }: ReaderSettingsProps) {
  // State for page time setting
  const [pageTime, setPageTime] = useState(initialSettings.pageTime)

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ pageTime })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Timer Settings</CardTitle>
          <CardDescription>Adjust how long the timer waits before advancing to the next page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Page time slider */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="page-time">Seconds per page</Label>
                <span className="text-sm font-medium">{pageTime} seconds</span>
              </div>
              <Slider
                id="page-time"
                min={5}
                max={120}
                step={5}
                value={[pageTime]}
                onValueChange={(value) => setPageTime(value[0])}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Faster (5s)</span>
              <span>Slower (120s)</span>
            </div>
          </div>

          {/* Reading speed guide */}
          <div className="space-y-2">
            <h3 className="font-medium">Reading Speed Guide</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded-md">
                <div className="font-medium">5-15 seconds</div>
                <div className="text-muted-foreground">Speed reading</div>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <div className="font-medium">15-30 seconds</div>
                <div className="text-muted-foreground">Fast reader</div>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <div className="font-medium">30-60 seconds</div>
                <div className="text-muted-foreground">Average reader</div>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <div className="font-medium">60+ seconds</div>
                <div className="text-muted-foreground">Deep reading</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Settings</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
