import { useEffect, useRef, useState } from "react";
import { Settings, LogOut } from "lucide-react";
import wallpaper1 from "@/assets/wallpaper1.webp";

export function SettingsHeroSection() {
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

  const handleLogout = () => {
  };

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
        <div 
          className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-6 w-full opacity-0 ${
            isVisible ? "animate-up" : ""
          }`}
          style={{ animationDelay: "100ms" }}
        >
          
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-3">
              <Settings className="w-10 h-10 md:w-12 md:h-12 text-red-600 shrink-0" />
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Settings
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-300 font-normal leading-relaxed">
              Manage your account security and application preferences.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 active:scale-95 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>

        </div>
      </div>
    </section>
  );
}