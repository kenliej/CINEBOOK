import { useEffect, useState } from "react"
import { FavoritesHeroSection } from "@/components/features/favorites/favorites-hero-section"
import { FavoritesSection1 } from "@/components/features/favorites/favorites-section1"
import { getAuthSession } from "@/lib/auth"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const refreshFavorites = async () => {
    const session = getAuthSession()
    if (!session?.user?.email) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/favorites?email=${encodeURIComponent(session.user.email)}`)
      if (!response.ok) throw new Error("Failed to load favorites")
      const result = await response.json()
      setFavorites(result.data ?? [])
    } catch (error) {
      console.error("Favorites API error:", error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshFavorites()
  }, [])

  return (
    <>
      <FavoritesHeroSection />
      <FavoritesSection1 favorites={favorites} loading={loading} refreshFavorites={refreshFavorites} />
    </>
  )
}

