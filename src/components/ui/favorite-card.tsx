import { useNavigate } from "react-router";
import { Heart, Calendar, MapPin, Film, Armchair, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FavoriteCardProps {
  id: string;
  image: string;
  title: string;
  genres: string[];
  date: string;
  time: string;
  availableSeats: number;
  totalSeats: number;
  location: string;
  onViewDetails?: () => void;
  onRemove?: () => void;
}

export function FavoriteCard({
  id = "1",
  image,
  title,
  genres,
  date,
  time,
  availableSeats,
  totalSeats,
  location,
  onViewDetails,
  onRemove,
}: FavoriteCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails();
    navigate(`/movie/${id}`);
  };

  return (
    <div className="w-full bg-[#12171f] border border-[#1f2633] rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-red-600/40 transition-all duration-300 shadow-lg">
      
      {/* Top Details Section */}
      <div className="flex gap-4">
        
        {/* Movie Poster Thumbnail */}
        <div className="relative w-28 h-40 sm:w-32 sm:h-44 rounded-xl overflow-hidden shrink-0 bg-black/40">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          
          {/* Header & Heart Badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white truncate leading-snug">
              {title}
            </h3>
            <button
              type="button"
              aria-label="Remove from favorites"
              onClick={onRemove}
              className="p-1.5 rounded-full bg-red-600/10 text-red-600 shrink-0 transition hover:bg-red-600/20"
            >
              <Heart className="w-4 h-4 fill-red-600" />
            </button>
          </div>

          {/* Metadata List */}
          <div className="space-y-1.5 text-xs text-gray-400 mt-2">
            
            {/* Genres */}
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{genres.join(" • ")}</span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{date} • {time}</span>
            </div>

            {/* Seats */}
            <div className="flex items-center gap-2">
              <Armchair className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{availableSeats} / {totalSeats} seats left</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>

          </div>
        </div>
      </div>

      {/* Action Button Section */}
      <div className="pt-2 border-t border-gray-800/60">
        <Button
          variant="primary"
          onClick={handleViewDetails}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}