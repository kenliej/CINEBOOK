import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import wallpaper1 from "@/assets/wallpaper1.webp";

export function FavoritesHeroSection() {
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

      <div className="absolute inset-0 z-0">
        <img
          src={wallpaper1}
          alt="Cinema seats background"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex items-center">
        <div className="max-w-xl space-y-3">
          
          <div 
            className={`flex items-center gap-3 opacity-0 ${
              isVisible ? "animate-up" : ""
            }`}
            style={{ animationDelay: "100ms" }}
          >
            <Heart className="w-9 h-9 md:w-11 md:h-11 text-red-600 fill-red-600 shrink-0" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              My Favorites
            </h1>
          </div>

          <p 
            className={`text-sm md:text-base text-gray-300 font-normal leading-relaxed opacity-0 ${
              isVisible ? "animate-up" : ""
            }`}
            style={{ animationDelay: "300ms" }}
          >
            Your saved movies are listed here. <br />
            Keep track of the movies you're excited to watch!
          </p>

        </div>
      </div>
    </section>
  );
}