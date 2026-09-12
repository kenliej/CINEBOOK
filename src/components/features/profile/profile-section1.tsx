import { useEffect, useRef, useState } from "react";
import { User, Mail, Phone, Calendar, MapPin, Hash, Users } from "lucide-react";

interface ProfileSection1Props {
  profile?: any;
  loading?: boolean;
}

export function ProfileSection1({ profile, loading = false }: ProfileSection1Props) {
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
      className="w-full bg-[#0b0e13] text-white py-10 px-6 md:px-12"
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

      <div className="container mx-auto max-w-4xl space-y-6">
        
        {/* Section Header */}
        <div className="border-b border-gray-800/80 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Personal Information</h2>
            <p className="text-xs text-gray-400 mt-1">Manage your personal details and account info.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading profile...</div>
        ) : profile ? (
          <div 
            className={`bg-[#12171f] border border-[#1f2633] rounded-2xl p-6 md:p-8 opacity-0 ${
              isVisible ? "animate-card-up" : ""
            }`}
          >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-red-500" />
                First Name
              </label>
              <input
                type="text"
                value={profile.first_name || ""}
                readOnly
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-default"
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-red-500" />
                Middle Name
              </label>
              <input
                type="text"
                value={profile.middle_name || ""}
                readOnly
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-default"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-red-500" />
                Last Name
              </label>
              <input
                type="text"
                value={profile.last_name || ""}
                readOnly
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-default"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-red-500" />
                Age
              </label>
              <input
                type="text"
                value={profile.age || ""}
                readOnly
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-default"
              />
            </div>

            {/* Birthday */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                Birthday
              </label>
              <input
                type="text"
                value={profile.birthday || ""}
                readOnly
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-default"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-red-500" />
                Gender
              </label>
              <input
                type="text"
                value={profile.gender || ""}
                readOnly
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-default"
              />
            </div>

            {/* Phone Number (Spans 3 cols on medium screens) */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phone || ""}
                readOnly
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-default"
              />
            </div>

            {/* Email Address (Spans 3 cols on medium screens) */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email || ""}
                readOnly
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-default"
              />
            </div>

            {/* Physical Address (Spans 3 cols on medium screens) */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                Address
              </label>
              <input
                type="text"
                value={profile.address || ""}
                readOnly
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-default"
              />
            </div>

          </div>
        </div>
        ) : (
          <div className="py-12 text-center text-gray-400">Profile data unavailable.</div>
        )}

      </div>
    </section>
  );
}