import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FavoriteCard } from "@/components/ui/favorite-card";

interface FavoritesSection1Props {
  favorites?: any[];
  loading?: boolean;
  refreshFavorites?: () => Promise<void>;
}

export function FavoritesSection1({ favorites: savedFavorites = [], loading = false, refreshFavorites }: FavoritesSection1Props) {
  const [favorites, setFavorites] = useState(savedFavorites);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(favorites.length / ITEMS_PER_PAGE));
  const paginatedFavorites = favorites.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setFavorites(savedFavorites)
    setCurrentPage((prev) => Math.min(prev, Math.max(1, Math.ceil(savedFavorites.length / ITEMS_PER_PAGE))))
  }, [savedFavorites])

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

  const handleRemove = async (id: string) => {
    const session = localStorage.getItem("cinebook_session");
    if (!session) return;

    try {
      const parsed = JSON.parse(session);
      const email = parsed?.user?.email;
      if (!email) return;

      const response = await fetch("http://localhost:8000/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          movie_id: String(id),
          is_favorite: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      setFavorites((prev) => prev.filter((item) => String(item.id ?? item.movie_id) !== String(id)));
      if (refreshFavorites) {
        await refreshFavorites();
      }
    } catch (error) {
      console.error("Remove favorite error:", error);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0b0e13] text-white py-12 px-6 md:px-12"
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

      <div className="container mx-auto">
        {/* Responsive Grid Layout */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading favorites...</div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedFavorites.map((movie, index) => (
              <div
                key={movie.id ?? movie.movie_id}
                className={`w-full flex justify-center opacity-0 ${
                  isVisible ? "animate-card-up" : ""
                }`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <FavoriteCard
                  id={String(movie.id ?? movie.movie_id ?? "")}
                  image={movie.image}
                  title={movie.title ?? movie.movie_title ?? "Favorite Movie"}
                  genres={movie.genres ?? []}
                  date={movie.date}
                  time={movie.time}
                  availableSeats={movie.availableSeats ?? 0}
                  totalSeats={movie.totalSeats ?? 0}
                  location={movie.location}
                  onRemove={() => handleRemove(String(movie.id ?? movie.movie_id ?? ""))}
                  onViewDetails={() => {
                    // Navigate to details page
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty Favorites Fallback */
          <div className="py-20 text-center space-y-3">
            <p className="text-lg text-gray-400">No favorite movies saved yet.</p>
          </div>
        )}

        {/* Pagination Bar */}
        {favorites.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-3 mt-12 text-sm">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
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

            {/* Next Button */}
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
    </section>
  );
}