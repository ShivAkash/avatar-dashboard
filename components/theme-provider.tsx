"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRef, ReactNode } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  attribute = "data-theme",
  enableSystem = false,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      root.style.colorScheme = systemTheme
      root.setAttribute(attribute, systemTheme)
      return
    }

    if (disableTransitionOnChange) {
      root.classList.add("[&_*]:!transition-none")
      setTimeout(() => {
        root.classList.remove("[&_*]:!transition-none")
      }, 0)
    }

    root.classList.add(theme)
    root.style.colorScheme = theme
    root.setAttribute(attribute, theme)
  }, [theme, attribute, enableSystem, disableTransitionOnChange])

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored && (stored === "dark" || stored === "light" || stored === "system")) {
      setTheme(stored)
    }
  }, [storageKey])

  useEffect(() => {
    if (enableSystem) {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      
      const listener = (event: MediaQueryListEvent) => {
        if (theme === "system") {
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(
            event.matches ? "dark" : "light"
          )
          document.documentElement.setAttribute(
            attribute,
            event.matches ? "dark" : "light"
          )
        }
      }

      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    }
  }, [theme, attribute, enableSystem])

  useEffect(() => {
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

interface ScrollAnimateInProps {
  children: ReactNode;
  delay?: number;
}

export default function ScrollAnimateIn({ children, delay = 0 }: ScrollAnimateInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { y: 30, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut",
            delay: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}