import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, MapPin, Ticket, Film, Clock, Star } from "lucide-react";
import wallpaper1 from "@/assets/wallpaper1.webp";
import ReservePopup from "@/components/ui/reserve-popup";
import { useAuthGuard } from "@/lib/auth";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuthGuard();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/movie/${id ?? 1}`);
        if (!response.ok) throw new Error("Movie not found");
        const result = await response.json();
        setMovie(result.data ?? null);
      } catch (error) {
        console.error("Movie API error:", error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#0b0e13] text-white flex items-center justify-center">Loading movie details...</div>;
  }

  if (!movie) {
    return <div className="min-h-screen bg-[#0b0e13] text-white flex items-center justify-center">Movie not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white flex flex-col">
      {/* HERO BANNER SECTION */}
      <section className="relative w-full h-[220px] md:h-[280px] overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img src={wallpaper1} alt="Background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e13] via-[#0b0e13]/70 to-transparent" />
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="relative z-20 container mx-auto px-6 md:px-12 -mt-36 md:-mt-44 pb-16 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Back Button + Poster */}
          <div className="flex flex-col gap-3 shrink-0">
            <button
              onClick={() => navigate("/")}
              className="w-fit flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 hover:bg-red-600/20 border border-gray-700/60 hover:border-red-600/50 text-gray-300 hover:text-white font-medium text-xs transition-all duration-200 backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <div className="bg-[#12171f] p-3 rounded-2xl border border-[#1f2633] shadow-2xl shadow-black/80">
              <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-400/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Movie Details Info */}
          <div className="md:col-span-2 space-y-6 pt-0 md:pt-10">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 text-red-500 border border-red-600/30">
                {movie.genres?.join(' / ') ?? movie.genre}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2">
                {movie.title}
              </h1>
            </div>

            {/* Quick Meta Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#12171f] border border-[#1f2633] rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-500" /> Duration
                </span>
                <span className="text-xs font-bold text-white">{movie.duration}</span>
              </div>
              <div className="bg-[#12171f] border border-[#1f2633] rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-red-500" /> Available Seats
                </span>
                <span className="text-xs font-bold text-emerald-400">{movie.availableSeats} Left</span>
              </div>
              <div className="bg-[#12171f] border border-[#1f2633] rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-red-500" /> Showtime
                </span>
                <span className="text-xs font-bold text-white truncate">{movie.showtime}</span>
              </div>
              <div className="bg-[#12171f] border border-[#1f2633] rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" /> Location
                </span>
                <span className="text-xs font-bold text-white truncate">{movie.location}</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="bg-[#12171f] border border-[#1f2633] rounded-2xl p-6 space-y-2">
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" /> Synopsis
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">{movie.description}</p>
            </div>

            {/* Price & Trigger Button */}
            <div className="bg-[#12171f] border border-[#1f2633] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 block">Ticket Price</span>
                <span className="text-2xl font-black text-white">
                  ₱{movie.price} <span className="text-xs font-normal text-gray-400">/ seat</span>
                </span>
              </div>
              <button
                onClick={() => {
                  if (!requireAuth()) {
                    return;
                  }
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 active:scale-95 flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Reserve a Seat</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REUSABLE RESERVATION POPUP COMPONENT */}
      <ReservePopup 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        movie={movie} 
      />
    </div>
  );
}