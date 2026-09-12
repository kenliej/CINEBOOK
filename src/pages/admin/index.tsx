import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ShieldCheck, LogOut, PlusCircle, Film, Clock, Users, Calendar, MapPin, FileText, Tag, Banknote, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAuthSession } from "@/lib/auth";
import wallpaper1 from "@/assets/wallpaper1.webp";

export default function AdminPanel() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const [movieData, setMovieData] = useState({
    title: "",
    genre: "",
    duration: "",
    availableSeats: "",
    showtime: "",
    location: "",
    synopsis: "",
    ticketPrice: "",
    posterUrl: "",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/admin/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...movieData,
          availableSeats: Number(movieData.availableSeats),
          ticketPrice: Number(movieData.ticketPrice),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to add movie");
      }

      setMovieData({
        title: "",
        genre: "",
        duration: "",
        availableSeats: "",
        showtime: "",
        location: "",
        synopsis: "",
        ticketPrice: "",
        posterUrl: "",
      });

      alert("Movie added successfully!");
    } catch (error) {
      console.error("Admin API error:", error);
      alert(error instanceof Error ? error.message : "Failed to add movie");
    }
  };

  const handlePosterUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:8000/api/admin/movies/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to upload image");
      }

      setMovieData((prev) => ({
        ...prev,
        posterUrl: result.data?.image_url || "",
      }));

      alert("Poster uploaded successfully.");
    } catch (error) {
      console.error("Poster upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      event.target.value = "";
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section 
        ref={sectionRef} 
        className="relative w-full h-[280px] md:h-[320px] flex items-center overflow-hidden bg-black text-white"
      >
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-up {
            animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={wallpaper1}
            alt="Cinema seats background"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="max-w-xl space-y-2">
            
            {/* Animated Heading with Admin Icon */}
            <div 
              className={`flex items-center gap-3 opacity-0 ${
                isVisible ? "animate-up" : ""
              }`}
              style={{ animationDelay: "100ms" }}
            >
              <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-red-600 fill-red-600/20 shrink-0" />
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Admin Portal
              </h1>
            </div>

            {/* Animated Tagline */}
            <p 
              className={`text-sm md:text-base text-gray-300 font-normal leading-relaxed opacity-0 ${
                isVisible ? "animate-up" : ""
              }`}
              style={{ animationDelay: "300ms" }}
            >
              Manage platform listings, create upcoming movie showtimes, <br className="hidden sm:inline" />
              and maintain cinema seat allocations efficiently.
            </p>

          </div>

          {/* Logout Button using variant="primary" */}
          <div 
            className={`opacity-0 ${isVisible ? "animate-up" : ""}`}
            style={{ animationDelay: "400ms" }}
          >
            <Button
              type="button"
              variant="primary"
              onClick={handleLogout}
              className="flex items-center gap-2 py-2.5 px-5 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 1: ADD A MOVIE FORM */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto bg-[#12171f] border border-[#1f2633] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[#1f2633] pb-6 mb-8">
            <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Add a New Movie</h2>
              <p className="text-xs text-gray-400">Fill in the details below to schedule a new movie screening.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Genre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-red-500" />
                  Movie Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={movieData.title}
                  onChange={handleChange}
                  placeholder="e.g. Inception"
                  className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-red-500" />
                  Genre
                </label>
                <input
                  type="text"
                  name="genre"
                  required
                  value={movieData.genre}
                  onChange={handleChange}
                  placeholder="e.g. Sci-Fi / Action"
                  className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>

            {/* Duration, Available Seats & Ticket Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  required
                  value={movieData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 2h 28m"
                  className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-red-500" />
                  Available Seats
                </label>
                <input
                  type="number"
                  name="availableSeats"
                  required
                  value={movieData.availableSeats}
                  onChange={handleChange}
                  placeholder="e.g. 42"
                  className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-red-500" />
                  Ticket Price (₱)
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  required
                  value={movieData.ticketPrice}
                  onChange={handleChange}
                  placeholder="e.g. 350"
                  className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>

            {/* Showtime & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  Showtime Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="showtime"
                  required
                  value={movieData.showtime}
                  onChange={handleChange}
                  className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors [color-scheme:dark]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  Location / Cinema
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={movieData.location}
                  onChange={handleChange}
                  placeholder="e.g. Cinema 1 - SM Seaside Cebu"
                  className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>

            {/* Poster URL / Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-red-500" />
                Poster Image URL or Upload
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="url"
                  name="posterUrl"
                  value={movieData.posterUrl}
                  onChange={handleChange}
                  placeholder="https://image-link.com/poster.jpg"
                  className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
                <label className="inline-flex items-center justify-center rounded-xl border border-dashed border-red-600/40 bg-red-600/5 px-4 py-3 text-xs font-semibold text-red-200 cursor-pointer hover:bg-red-600/10">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePosterUpload}
                  />
                </label>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-500" />
                Synopsis
              </label>
              <textarea
                name="synopsis"
                rows={4}
                required
                value={movieData.synopsis}
                onChange={handleChange}
                placeholder="Provide a short plot summary..."
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Movie</span>
              </Button>
            </div>

          </form>

        </div>
      </section>

    </div>
  );
}