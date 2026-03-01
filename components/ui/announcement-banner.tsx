"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnnouncementBannerProps {
  desktopImage: string
  mobileImage: string
  altText?: string
  link?: string
  className?: string
}

export function AnnouncementBanner({
  desktopImage,
  mobileImage,
  altText = "Announcement Banner",
  link,
  className,
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const content = (
    <div className={cn("relative w-full overflow-hidden bg-background", className)}>
      {/* Desktop Image */}
      <a
        href={link}
        target={link ? "_blank" : undefined}
        rel={link ? "noopener noreferrer" : undefined}
        className="hidden md:block relative w-full cursor-pointer hover:opacity-95 transition-opacity"
      >
        <img
          src={desktopImage}
          alt={altText}
          className="w-full h-auto block"
        />
      </a>

      {/* Mobile Image */}
      <a
        href={link}
        target={link ? "_blank" : undefined}
        rel={link ? "noopener noreferrer" : undefined}
        className="md:hidden relative w-full cursor-pointer hover:opacity-95 transition-opacity"
      >
        <img
          src={mobileImage}
          alt={altText}
          className="w-full h-auto block"
        />
      </a>

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 md:top-4 md:right-4 z-50 bg-black/50 hover:bg-black/75 text-white p-1.5 md:p-2 rounded-full transition-all duration-200"
        aria-label="Fechar banner"
      >
        <X className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  )

  return content
}
