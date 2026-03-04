"use client"

import { useTheme } from "@/context/theme-context"
import AnimatedCursor from "react-animated-cursor"

export function Cursor() {
  const { theme } = useTheme()

  // Pull RGB from hex for the cursor color
  const hex = theme.colors.accent
  const r   = parseInt(hex.slice(1, 3), 16)
  const g   = parseInt(hex.slice(3, 5), 16)
  const b   = parseInt(hex.slice(5, 7), 16)

  return (
    <AnimatedCursor
      innerSize={8}
      outerSize={32}
      innerScale={1}
      outerScale={2.2}
      outerAlpha={0}
      innerStyle={{
        backgroundColor: theme.colors.accent,
        mixBlendMode: "normal",
      }}
      outerStyle={{
        border: `2px solid ${theme.colors.accent}`,
        mixBlendMode: "normal",
        transition: "border-color 0.3s ease",
      }}
      clickables={[
        "a",
        "button",
        'input[type="text"]',
        'input[type="email"]',
        'input[type="submit"]',
        "select",
        "textarea",
        ".cursor-pointer",
      ]}
      color={`${r}, ${g}, ${b}`}
      trailingSpeed={8}
    />
  )
}