"use client"

import { cn } from "@/lib/utils"

interface GridMotionProps {
  /**
   * Background image URL
   */
  items?: (string | React.ReactNode)[]
  /**
   * Color for the gradient background (unused)
   */
  gradientColor?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

export function GridMotion({ items = [], className }: GridMotionProps) {
  // Get the first image or use default
  const backgroundImage = items.length > 0 && typeof items[0] === "string" 
    ? items[0] 
    : "https://cdn.shopify.com/s/files/1/0788/1932/8253/files/hero-background.jpg?v=1765304899"

  return (
    <div 
      className={cn("relative w-full h-full bg-cover bg-center bg-no-repeat", className)}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/0" />
    </div>
  )
}

