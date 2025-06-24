"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Tablet, Monitor, RotateCcw } from "lucide-react"

interface MobileTestPreviewProps {
  children: React.ReactNode
}

export default function MobileTestPreview({ children }: MobileTestPreviewProps) {
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("mobile")
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")

  const getDeviceClasses = () => {
    const baseClasses = "mx-auto bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"

    switch (deviceType) {
      case "mobile":
        return orientation === "portrait"
          ? `${baseClasses} w-[375px] h-[812px]` // iPhone 12 Pro dimensions
          : `${baseClasses} w-[812px] h-[375px]`
      case "tablet":
        return orientation === "portrait"
          ? `${baseClasses} w-[768px] h-[1024px]` // iPad dimensions
          : `${baseClasses} w-[1024px] h-[768px]`
      case "desktop":
        return `${baseClasses} w-[1200px] h-[800px]`
      default:
        return baseClasses
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile Device Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex gap-2">
              <Button
                variant={deviceType === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setDeviceType("mobile")}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                Mobile
              </Button>
              <Button
                variant={deviceType === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setDeviceType("tablet")}
              >
                <Tablet className="h-4 w-4 mr-1" />
                Tablet
              </Button>
              <Button
                variant={deviceType === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setDeviceType("desktop")}
              >
                <Monitor className="h-4 w-4 mr-1" />
                Desktop
              </Button>
            </div>

            {deviceType !== "desktop" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOrientation(orientation === "portrait" ? "landscape" : "portrait")}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                {orientation === "portrait" ? "Landscape" : "Portrait"}
              </Button>
            )}
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p>
              <strong>Current:</strong> {deviceType} - {deviceType !== "desktop" ? orientation : "responsive"}
            </p>
            <p>
              <strong>Dimensions:</strong>{" "}
              {deviceType === "mobile"
                ? orientation === "portrait"
                  ? "375×812px"
                  : "812×375px"
                : deviceType === "tablet"
                  ? orientation === "portrait"
                    ? "768×1024px"
                    : "1024×768px"
                  : "1200×800px"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <div className={getDeviceClasses()}>
          <div className="w-full h-full overflow-auto">{children}</div>
        </div>
      </div>

      {/* Mobile Testing Checklist */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Mobile Testing Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">✅ Touch & Interaction</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Buttons are at least 44px tall</li>
                <li>• Touch targets have adequate spacing</li>
                <li>• Form inputs are easily tappable</li>
                <li>• Language selector works on touch</li>
                <li>• Social auth buttons are accessible</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">✅ Layout & Spacing</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Content fits without horizontal scroll</li>
                <li>• Adequate padding on small screens</li>
                <li>• Text is readable (16px+ base size)</li>
                <li>• Form fields stack properly</li>
                <li>• Cards adapt to screen width</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">✅ Performance</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Fast loading on mobile networks</li>
                <li>• Smooth animations and transitions</li>
                <li>• Optimized images and assets</li>
                <li>• Minimal JavaScript bundle</li>
                <li>• Efficient re-renders</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">✅ Accessibility</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Screen reader compatible</li>
                <li>• High contrast ratios</li>
                <li>• Keyboard navigation support</li>
                <li>• Focus indicators visible</li>
                <li>• Error messages are clear</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
