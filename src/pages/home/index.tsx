import { useEffect, useState } from "react"
import { HomeHeroSection } from "@/components/features/home/home-hero-section"
import { HomeSection1 } from "@/components/features/home/home-section1"
import { getAuthSession } from "@/lib/auth"

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const refreshFavorites = async (email?: string) => {
    const sessionEmail = email ?? getAuthSession()?.user?.email
    if (!sessionEmail) {
      setFavoriteIds([])
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/favorites?email=${encodeURIComponent(sessionEmail)}`)
      if (!response.ok) throw new Error("Failed to load favorites")
      const result = await response.json()
      const ids = (result.data ?? []).map((item: any) => String(item.movie_id ?? item.id))
      setFavoriteIds(ids)
    } catch (error) {
      console.error("Favorites refresh error:", error)
      setFavoriteIds([])
    }
  }

  const handleFavoriteToggle = async (movieId: string | number, isFav: boolean) => {
    const session = getAuthSession()
    if (!session?.user?.email) return

    try {
      const response = await fetch("http://localhost:8000/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          movie_id: String(movieId),
          is_favorite: isFav,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update favorites")
      }

      await refreshFavorites(session.user.email)
    } catch (error) {
      console.error("Favorite toggle error:", error)
    }
  }

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/movies")
        if (!response.ok) throw new Error("Failed to load movies")
        const result = await response.json()
        setMovies(result.data ?? [])
      } catch (error) {
        console.error("Home API error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
    refreshFavorites()
  }, [])

  return (
    <>
      <HomeHeroSection />
      <HomeSection1
        movies={movies}
        loading={loading}
        favoriteIds={favoriteIds}
        onToggleFavorite={handleFavoriteToggle}
      />
    </>
  )
}


