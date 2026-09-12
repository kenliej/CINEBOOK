import { useEffect, useState } from "react"
import { SettingsHeroSection } from "@/components/features/settings/settings-hero-section"
import { SettingsSection1 } from "@/components/features/settings/settings-section1"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/settings")
        if (!response.ok) throw new Error("Failed to load settings")
        await response.json()
      } catch (error) {
        console.error("Settings API error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <>
      <SettingsHeroSection />
      <SettingsSection1 loading={loading} />
    </>
  )
}

