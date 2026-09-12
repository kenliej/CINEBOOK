import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Search, ChevronLeft, ChevronRight, X, Ticket, Calendar, MapPin, Clock, CreditCard } from "lucide-react";
import { TransactionCard } from "@/components/ui/transaction-card";

type TransactionCardItemProps = ComponentProps<typeof TransactionCard>;

type Transaction = TransactionCardItemProps & {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  genres: string[];
  refCode: string;
  seats: string[];
  paymentMethod: string;
  amount: number;
  status: string;
};

interface TransactionsSection1Props {
  transactions?: Transaction[];
  loading?: boolean;
  onRefresh?: () => void;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Demon Slayer: Infinity Castle",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop",
    date: "Aug 30, 2025",
    time: "1:00 PM",
    location: "SM City Cebu",
    genres: ["Action", "Adventure", "Fantasy"],
    refCode: "CB-20250830-0012",
    seats: ["B12", "B13", "B14"],
    paymentMethod: "GCash",
    amount: 450.0,
    status: "Completed",
  },
  {
    id: "2",
    title: "John Wick 4",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop",
    date: "Aug 30, 2025",
    time: "6:00 PM",
    location: "SM City Cebu",
    genres: ["Action", "Thriller", "Crime"],
    refCode: "CB-20250830-0013",
    seats: ["E7", "E8"],
    paymentMethod: "Maya",
    amount: 360.0,
    status: "Completed",
  },
  {
    id: "3",
    title: "Inside Out 2",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format&fit=crop",
    date: "Aug 30, 2025",
    time: "8:30 PM",
    location: "Robinsons Galleria",
    genres: ["Animation", "Comedy", "Family"],
    refCode: "CB-20250830-0014",
    seats: ["C5", "C6"],
    paymentMethod: "GCash",
    amount: 320.0,
    status: "Completed",
  },
  {
    id: "4",
    title: "The Batman",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop",
    date: "Aug 29, 2025",
    time: "4:00 PM",
    location: "SM City Cebu",
    genres: ["Action", "Crime", "Drama"],
    refCode: "CB-20250829-0008",
    seats: ["A10", "A11"],
    paymentMethod: "Maya",
    amount: 400.0,
    status: "Completed",
  },
  {
    id: "5",
    title: "Kung Fu Panda 4",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop",
    date: "Aug 31, 2025",
    time: "2:00 PM",
    location: "SM City Cebu",
    genres: ["Animation", "Action", "Comedy"],
    refCode: "CB-20250831-0007",
    seats: ["D9", "D10"],
    paymentMethod: "GCash",
    amount: 300.0,
    status: "Pending",
  },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type TabType = (typeof TABS)[number];

export function TransactionsSection1({ transactions = MOCK_TRANSACTIONS, loading = false, onRefresh }: TransactionsSection1Props & { onRefresh?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<Transaction | null>(null);
  const ITEMS_PER_PAGE = 9;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const filteredTransactions = transactions.filter((item) => {
    let matchesTab = true;
    if (activeTab === "Pending") matchesTab = item.status === "Pending";
    else if (activeTab === "Completed") matchesTab = item.status === "Completed";
    else if (activeTab === "Cancelled") matchesTab = item.status === "Cancelled";

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.refCode.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0b0e13] text-white py-10 px-6 md:px-12 relative"
    >
      <style>{`
        @keyframes fadeInUpCard {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-card-up {
          animation: fadeInUpCard 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                    isActive
                      ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30"
                      : "bg-[#12171f] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-80 flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by movie title or reference code..."
              className="w-full bg-[#12171f] border border-gray-800 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading transactions...</div>
        ) : filteredTransactions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {paginatedTransactions.map((tx, index) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTicket(tx)}
                className={`w-full opacity-0 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] ${
                  isVisible ? "animate-card-up" : ""
                }`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <TransactionCard {...tx} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-2 bg-[#12171f]/50 rounded-2xl border border-gray-800/50">
            <p className="text-gray-400 text-sm">No transactions found.</p>
          </div>
        )}

        {filteredTransactions.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-3 pt-6 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                  currentPage === page
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] transition-all"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#12171f] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-card-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2 text-red-500 font-semibold text-sm">
                <Ticket className="w-4 h-4" />
                <span>Ticket Details</span>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 items-start">
              <img
                src={selectedTicket.image}
                alt={selectedTicket.title}
                className="w-20 h-28 object-cover rounded-xl border border-gray-800 shrink-0"
              />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-white">
                  {selectedTicket.title}
                </h3>
                <p className="text-xs text-gray-400">
                  Ref Code: <span className="font-mono text-gray-200">{selectedTicket.refCode}</span>
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedTicket.genres.map((genre) => (
                    <span
                      key={genre}
                      className="text-[10px] bg-gray-800/80 text-gray-300 px-2 py-0.5 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#0b0e13] p-4 rounded-xl border border-gray-800/80 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{selectedTicket.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{selectedTicket.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 col-span-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">{selectedTicket.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CreditCard className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{selectedTicket.paymentMethod}</span>
              </div>
              <div className="text-gray-300 font-semibold">
                Seats: <span className="text-red-400">{selectedTicket.seats.join(", ")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-[10px] text-gray-400">Total Amount</p>
                <p className="text-lg font-bold text-white">
                  ₱{selectedTicket.amount.toFixed(2)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedTicket.status === "Completed"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : selectedTicket.status === "Cancelled"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}
              >
                {selectedTicket.status}
              </span>
            </div>

            <div className="flex gap-3">
              {selectedTicket.status === "Pending" && (
                <>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await fetch(`http://localhost:8000/api/reservations/${selectedTicket.id}/complete`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                          },
                          body: JSON.stringify({
                            payment_method: "GCash",
                            seats: selectedTicket.seats.length > 0
                              ? selectedTicket.seats
                              : Array.from({ length: Math.max(1, Math.ceil((selectedTicket.amount || 0) / 350)) }, (_, idx) => {
                                  const row = String.fromCharCode(65 + (idx % 8));
                                  return `${row}${idx + 1}`;
                                }),
                          }),
                        });

                        if (response.ok) {
                          onRefresh?.();
                          setSelectedTicket(null);
                          return;
                        }
                      } catch {}
                      setSelectedTicket(null);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
                  >
                    Continue Payment
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await fetch(`http://localhost:8000/api/reservations/${selectedTicket.id}/cancel`, {
                          method: "POST",
                          headers: { Accept: "application/json" },
                        });

                        if (response.ok) {
                          onRefresh?.();
                          setSelectedTicket(null);
                          return;
                        }
                      } catch {}
                      setSelectedTicket(null);
                    }}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
                  >
                    Cancel Reservation
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}