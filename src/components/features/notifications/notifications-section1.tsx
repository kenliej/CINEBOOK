import { useEffect, useRef, useState } from "react";
import { 
  Bell, 
  Clapperboard, 
  Ticket, 
  AlertTriangle, 
  Tag, 
  CheckCheck, 
  ChevronLeft, 
  ChevronRight,
  Popcorn
} from "lucide-react";
import { 
  NotificationCard, 
  type NotificationCardProps 
} from "@/components/ui/notification-card";

interface NotificationItem extends NotificationCardProps {
  categoryFilter: "All Notifications" | "New Movies" | "Booking Updates" | "System Alerts" | "Promotions";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    category: "New Movie",
    categoryFilter: "New Movies",
    title: "Kung Fu Panda 4 is now available!",
    message: "The wait is over! Kung Fu Panda 4 is now showing at SM City Cebu. Book your seats now!",
    timestamp: "Aug 30, 2025 • 10:24 AM",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop",
    isRead: false,
  },
  {
    id: "2",
    category: "Booking Update",
    categoryFilter: "Booking Updates",
    title: "Your seat reservation is confirmed!",
    message: "Hi! Your booking for The Batman has been confirmed. Check your transaction for your ticket details.",
    timestamp: "Aug 29, 2025 • 06:15 PM",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop",
    isRead: false,
  },
  {
    id: "3",
    category: "New Movie",
    categoryFilter: "New Movies",
    title: "Inside Out 2 is now available!",
    message: "Get ready for a new adventure in Riley's mind. Now showing at Robinsons Galleria.",
    timestamp: "Aug 28, 2025 • 11:42 AM",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format&fit=crop",
    isRead: false,
  },
  {
    id: "4",
    category: "Promotion",
    categoryFilter: "Promotions",
    title: "Special Discount for Students!",
    message: "Show your valid student ID and get 10% off on all movie tickets this August. Available at SM and Gaisano cinemas.",
    timestamp: "Aug 27, 2025 • 04:20 PM",
    icon: <Popcorn className="w-8 h-8 text-red-500" />,
    isRead: false,
  },
  {
    id: "5",
    category: "System Alert",
    categoryFilter: "System Alerts",
    title: "Scheduled Maintenance",
    message: "The system will be under maintenance on Aug 31, 2025 from 1:00 AM to 4:00 AM. Please plan your bookings accordingly.",
    timestamp: "Aug 26, 2025 • 09:10 AM",
    icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
    isRead: false,
  },
  {
    id: "6",
    category: "Booking Update",
    categoryFilter: "Booking Updates",
    title: "Your ticket is ready!",
    message: "Your transaction for Deadpool & Wolverine is now complete. Check your email or transaction history for your ticket.",
    timestamp: "Aug 25, 2025 • 07:32 PM",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop",
    isRead: false,
  },
];

const SIDEBAR_CATEGORIES = [
  { label: "All Notifications", icon: Bell },
  { label: "New Movies", icon: Clapperboard },
  { label: "Booking Updates", icon: Ticket },
  { label: "System Alerts", icon: AlertTriangle },
  { label: "Promotions", icon: Tag },
] as const;

type CategoryLabel = (typeof SIDEBAR_CATEGORIES)[number]["label"];

interface NotificationsSection1Props {
  notifications?: NotificationItem[];
  loading?: boolean;
}

export function NotificationsSection1({ notifications: apiNotifications = INITIAL_NOTIFICATIONS, loading = false }: NotificationsSection1Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(apiNotifications);
  const [activeCategory, setActiveCategory] = useState<CategoryLabel>("All Notifications");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setNotifications(apiNotifications)
  }, [apiNotifications])

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

  const getUnreadCount = (categoryLabel: CategoryLabel) => {
    if (categoryLabel === "All Notifications") {
      return notifications.filter((n) => !n.isRead).length;
    }
    return notifications.filter((n) => n.categoryFilter === categoryLabel && !n.isRead).length;
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: activeCategory === "All Notifications" || item.categoryFilter === activeCategory ? true : item.isRead,
      }))
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === "All Notifications") return true;
    return item.categoryFilter === activeCategory;
  });

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

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-3 bg-[#12171f] border border-[#1f2633] rounded-2xl p-3 space-y-1">
          {SIDEBAR_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.label;
            const unreadCount = getUnreadCount(cat.label);

            return (
              <button
                key={cat.label}
                onClick={() => {
                  setActiveCategory(cat.label);
                  setCurrentPage(1);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                  <span>{cat.label}</span>
                </div>

                {unreadCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-red-600"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-9 space-y-6">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-4">
            <h2 className="text-xl font-bold text-white">{activeCategory}</h2>
            
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
            >
              <CheckCheck className="w-4 h-4 text-gray-400" />
              <span>Mark all as read</span>
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400">Loading notifications...</div>
          ) : filteredNotifications.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredNotifications.map((notif, index) => (
                <div
                  key={notif.id}
                  className={`w-full opacity-0 ${
                    isVisible ? "animate-card-up" : ""
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <NotificationCard
                    id={notif.id}
                    category={notif.category}
                    title={notif.title}
                    message={notif.message}
                    timestamp={notif.timestamp}
                    image={notif.image}
                    icon={notif.icon}
                    isRead={notif.isRead}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-2 bg-[#12171f]/50 rounded-2xl border border-gray-800/50">
              <p className="text-gray-400 text-sm">No notifications found in this category.</p>
            </div>
          )}

          {filteredNotifications.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-6 text-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                    currentPage === page
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}