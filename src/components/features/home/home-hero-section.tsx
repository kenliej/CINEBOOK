import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import wallpaper1 from "@/assets/wallpaper1.webp";

export function HomeHeroSection() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-[350px] md:h-[400px] flex items-center overflow-hidden bg-black text-white"
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

      <div className="absolute inset-0 z-0">
        <img
          src={wallpaper1}
          alt="Cinema seats background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="max-w-md space-y-3">
          <h1 
            className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-tight opacity-0 ${
              isVisible ? "animate-up" : ""
            }`}
            style={{ animationDelay: "100ms" }}
          >
            Your Next <br />
            <span className="text-red-600">Movie Awaits</span>
          </h1>

          <p 
            className={`text-sm md:text-base text-gray-300 font-normal leading-relaxed opacity-0 ${
              isVisible ? "animate-up" : ""
            }`}
            style={{ animationDelay: "300ms" }}
          >
            Skip the line. Book your seat online. <br />
            Fast. Easy. Convenient.
          </p>
        </div>

        <div 
          className={`flex items-center gap-3 w-full max-w-lg opacity-0 ${
            isVisible ? "animate-up" : ""
          }`}
          style={{ animationDelay: "500ms" }}
        >
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for movies..."
              className="w-full bg-[#11161d]/90 border border-gray-700/60 rounded-full py-3 pl-12 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <Button variant="primary" className="flex items-center gap-2 py-3 px-5">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>

      </div>
    </section>
  );
}