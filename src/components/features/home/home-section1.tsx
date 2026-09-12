import { useEffect, useRef, useState, type ComponentProps } from "react";
import { MovieCard } from "@/components/ui/movie-card";

type MovieCardStatus = ComponentProps<typeof MovieCard>["status"];

interface Movie {
  id: string;
  title: string;
  genres: string[];
  date: string;
  time: string;
  availableSeats: number;
  totalSeats: number;
  location: string;
  status: MovieCardStatus;
  image: string;
}

interface HomeSection1Props {
  movies?: Movie[];
  loading?: boolean;
  favoriteIds?: Array<string | number>;
  onToggleFavorite?: (movieId: string | number, isFav: boolean) => void;
}

export function HomeSection1({ movies = [], loading = false, favoriteIds = [], onToggleFavorite }: HomeSection1Props) {
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

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-cine-bg text-white py-12 px-6 md:px-12"
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Now Showing
            </h2>
            <div className="w-8 h-1 bg-cine-red rounded-full mt-1.5" />
          </div>
        </div>

        {!loading && movies.length === 0 ? (
          <div className="py-12 text-center text-gray-400">No movies available right now.</div>
        ) : null}

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading movies...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className={`w-full flex justify-center opacity-0 ${
                  isVisible ? "animate-card-up" : ""
                }`}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <MovieCard
                  id={movie.id}
                  image={movie.image}
                  title={movie.title}
                  genres={movie.genres}
                  date={movie.date}
                  time={movie.time}
                  availableSeats={movie.availableSeats}
                  totalSeats={movie.totalSeats}
                  location={movie.location}
                  status={movie.status}
                  isFavorite={favoriteIds.includes(String(movie.id))}
                  onToggleFavorite={onToggleFavorite}
                  onViewDetails={() => {
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}