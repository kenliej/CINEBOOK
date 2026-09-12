import { useEffect, useState } from "react"
import { ProfileHeroSection } from "@/components/features/profile/profile-hero-section"
import { ProfileSection1 } from "@/components/features/profile/profile-section1"
import { getAuthSession } from "@/lib/auth"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const session = getAuthSession()
      const email = session?.user?.email
      const response = await fetch(
        email ? `http://localhost:8000/api/profile?email=${encodeURIComponent(email)}` : "http://localhost:8000/api/profile",
        {
          headers: {
            Accept: "application/json",
            ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
          },
        }
      )
      if (!response.ok) throw new Error("Failed to load profile")
      const result = await response.json()
      setProfile(result.data ?? null)
    } catch (error) {
      console.error("Profile API error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = async (updatedData: any) => {
    const session = getAuthSession()
    if (!session?.token) return

    try {
      const response = await fetch("http://localhost:8000/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          avatar_url: updatedData.avatarUrl || null,
          first_name: updatedData.firstName,
          middle_name: updatedData.middleName,
          last_name: updatedData.lastName,
          age: Number(updatedData.age || 0),
          birthday: updatedData.birthday || null,
          gender: updatedData.gender,
          phone: updatedData.phone,
          email: updatedData.email,
          address: updatedData.address,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile")
      }

      const user = result.data?.user ?? {
        ...session.user,
        email: updatedData.email,
        name: `${updatedData.firstName || ""} ${updatedData.lastName || ""}`.trim() || session.user.name,
      }

      localStorage.setItem(
        "cinebook_session",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("cinebook_session") || "{}"),
          user,
        })
      )
      window.dispatchEvent(new Event("auth:changed"))
      await fetchProfile()
    } catch (error) {
      console.error("Profile update error:", error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <>
      <ProfileHeroSection profile={profile} loading={loading} onSave={handleProfileSave} />
      <ProfileSection1 profile={profile} loading={loading} />
    </>
  )
}


