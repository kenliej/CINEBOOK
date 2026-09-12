import { useEffect, useState } from "react"
import { NotificationHeroSection } from "@/components/features/notifications/notifications-hero-section"
import { NotificationsSection1 } from "@/components/features/notifications/notifications-section1"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/notifications")
        if (!response.ok) throw new Error("Failed to load notifications")
        const result = await response.json()
        setNotifications(result.data ?? [])
      } catch (error) {
        console.error("Notifications API error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  return (
    <>
      <NotificationHeroSection />
      <NotificationsSection1 notifications={notifications} loading={loading} />
    </>
  )
}


