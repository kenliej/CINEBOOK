import { useEffect, useState } from "react";
import { useNavigate } from "react-router"; // Use "react-router" for v7
import { Calendar, Armchair, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/lib/auth";

interface MovieCardProps {
  id?: string | number;
  image: string;
  title: string;
  genres: string[];
  date: string;
  time: string;
  availableSeats: number;
  totalSeats: number;
  location: string;
  status?: "Available" | "Sold Out" | "Coming Soon";
  isFavorite?: boolean;
  onToggleFavorite?: (id: string | number, isFav: boolean) => void;
  onViewDetails?: () => void;
}

export function MovieCard({
  id = "1",
  image,
  title,
  genres,
  date,
  time,
  availableSeats,
  totalSeats,
  location,
  status = "Available",
  isFavorite = false,
  onToggleFavorite,
  onViewDetails,
}: MovieCardProps) {
  const navigate = useNavigate();
  const { requireAuth } = useAuthGuard();
  const [fav, setFav] = useState(isFavorite);

  useEffect(() => {
    setFav(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!requireAuth()) {
      return;
    }

    const nextState = !fav;
    setFav(nextState);
    if (onToggleFavorite) {
      onToggleFavorite(id, nextState);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails();
    navigate(`/movie/${id}`);
  };

  return (
    <div className="w-full max-w-[280px] bg-[#11161d] border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col text-white">
      {/* Poster Image & Badges */}
      <div className="relative w-full h-[180px] overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Favorite Button (Top-Left) */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 left-3 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white transition-all duration-200 active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              fav ? "fill-red-600 text-red-600" : "text-white hover:text-red-400"
            }`}
          />
        </button>

        {/* Status Badge (Top-Right) */}
        <div className="absolute top-3 right-3">
          <span className="bg-emerald-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
            {status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Title & Genres */}
        <div>
          <h3 className="font-bold text-base leading-snug text-white line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {genres.join("  •  ")}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="space-y-2 text-xs text-gray-300 my-1">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              {date} <span className="mx-1">•</span> {time}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Armchair className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              {availableSeats} / {totalSeats} seats left
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <Button
            variant="primary"
            className="w-full py-2.5 text-xs font-semibold rounded-xl"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}