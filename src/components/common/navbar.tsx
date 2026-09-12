import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  Home,
  Heart,
  Ticket,
  Bell,
  User,
  Settings,
  Film,
  Menu,
  X,
  LogIn,
  LogOut
} from "lucide-react";
import { clearAuthSession, useAuthState } from "@/lib/auth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const loggedIn = useAuthState();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Favorites", path: "/favorites", icon: Heart },
    { label: "Transactions", path: "/transactions", icon: Ticket },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  useEffect(() => {
    const syncAuth = () => {
      return;
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleAuthButton = () => {
    if (loggedIn) {
      clearAuthSession();
      navigate("/auth", { replace: true });
      return;
    }

    navigate("/auth", { replace: true });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 text-white ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-[#0b0e13]/95 backdrop-blur-md border-b border-gray-800/60 shadow-lg"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <NavLink to={loggedIn ? "/" : "/auth"} className="flex items-center gap-2 group z-50">
            <div className="text-red-600 transition-transform group-hover:scale-105">
              <Film className="w-7 h-7 fill-red-600/20" />
            </div>
            <span className="text-xl font-black tracking-wider text-white">
              CINE<span className="text-red-600">BOOK</span>
            </span>
          </NavLink>

          {loggedIn ? (
            <>
              <nav className="hidden lg:flex items-center gap-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `relative flex items-center gap-2 py-5 px-3 text-sm font-medium transition-colors ${
                          isActive ? "text-red-600" : "text-gray-400 hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>

                          {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-red-600 rounded-t-full shadow-[0_-2px_8px_rgba(229,46,61,0.5)]" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="hidden lg:flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAuthButton}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-100 transition hover:bg-red-600/20"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={handleAuthButton}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700"
            >
              <LogIn className="w-4 h-4" />
              Log In
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden z-50 p-2 text-gray-300 hover:text-white focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 text-red-600" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-[#0b0e13] border-l border-gray-800/80 z-40 lg:hidden pt-20 px-6 flex flex-col gap-2 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {loggedIn ? (
          navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-600/10 text-red-600 border border-red-600/20"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate("/auth");
            }}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white"
          >
            <LogIn className="w-4 h-4" />
            Log In
          </button>
        )}

        {loggedIn && (
          <button
            type="button"
            onClick={() => {
              clearAuthSession();
              setIsOpen(false);
              navigate("/auth", { replace: true });
            }}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </aside>
    </>
  );
}