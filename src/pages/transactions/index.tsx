import { useEffect, useState } from "react"
import { TransactionsHeroSection } from "@/components/features/transactions/transactions-hero-section"
import { TransactionsSection1 } from "@/components/features/transactions/transactions-section1"
import { getAuthSession } from "@/lib/auth"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const refreshTransactions = async () => {
    const session = getAuthSession()
    if (!session?.user?.email) {
      setTransactions([])
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/transactions?email=${encodeURIComponent(session.user.email)}`)
      if (!response.ok) throw new Error("Failed to load transactions")
      const result = await response.json()
      setTransactions((result.data ?? []).map(normalizeTransaction))
    } catch (error) {
      console.error("Transactions API error:", error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const normalizeTransaction = (transaction: any) => ({
    id: String(transaction?.id ?? transaction?.movie_id ?? "tx-unknown"),
    title: transaction?.movie_title ?? transaction?.title ?? "Movie Reservation",
    image: transaction?.image ?? "",
    date: transaction?.date ?? "TBD",
    time: transaction?.time ?? "",
    location: transaction?.location ?? "N/A",
    genres: Array.isArray(transaction?.genres) && transaction.genres.length > 0 ? transaction.genres : ["Movie"],
    refCode: transaction?.ref_code ?? transaction?.refCode ?? "Pending",
    seats: Array.isArray(transaction?.seats) ? transaction.seats.filter(Boolean) : [],
    paymentMethod: transaction?.payment_method ?? transaction?.paymentMethod ?? "GCash",
    amount: Number(transaction?.amount ?? 0),
    status: transaction?.status ?? "Pending",
  })

  useEffect(() => {
    refreshTransactions()
  }, [])

  return (
    <>
      <TransactionsHeroSection />
      <TransactionsSection1 transactions={transactions} loading={loading} onRefresh={refreshTransactions} />
    </>
  )
}


