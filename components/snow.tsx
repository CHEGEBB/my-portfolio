"use client"

import { useTheme } from "@/context/theme-context"
import Snowfall from "react-snowfall"

export function Snow() {
  const { theme } = useTheme()

  if (theme.mode !== "dark") return null

  return (
    <Snowfall
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
      color={theme.colors.accent + "55"}
      snowflakeCount={80}
      speed={[0.3, 1.2]}
      wind={[-0.3, 0.6]}
      radius={[0.5, 2.5]}
    />
  )
}