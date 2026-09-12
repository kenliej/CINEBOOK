import { ChevronRight } from "lucide-react";

export type NotificationCategory =
  | "New Movie"
  | "Booking Update"
  | "Promotion"
  | "System Alert";

export interface NotificationCardProps {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  image?: string;
  icon?: React.ReactNode;
  isRead?: boolean;
  onClick?: () => void;
}

export function NotificationCard({
  category,
  title,
  message,
  timestamp,
  image,
  icon,
  isRead = false,
  onClick,
}: NotificationCardProps) {
  const getCategoryStyles = (cat: NotificationCategory) => {
    switch (cat) {
      case "New Movie":
        return "bg-red-600/20 text-red-400 border-red-600/30";
      case "Booking Update":
        return "bg-blue-600/20 text-blue-400 border-blue-600/30";
      case "Promotion":
        return "bg-emerald-600/20 text-emerald-400 border-emerald-600/30";
      case "System Alert":
        return "bg-slate-700/40 text-slate-300 border-slate-600/40";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/30";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`w-full bg-[#12171f] border border-[#1f2633] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-red-600/40 transition-all duration-300 shadow-lg group cursor-pointer ${
        !isRead ? "bg-[#141a24]" : ""
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-[#1a212d] flex items-center justify-center border border-gray-800">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="p-2 text-gray-300">{icon}</div>
          )}
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryStyles(
                category
              )}`}
            >
              {category}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white truncate leading-tight">
            {title}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {message}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 hidden sm:inline whitespace-nowrap">
            {timestamp}
          </span>
          
          {!isRead && (
            <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 animate-pulse" />
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
      </div>

    </div>
  );
}