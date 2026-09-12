import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { X, Check, ChevronRight } from "lucide-react";
import { getAuthSession } from "@/lib/auth";

interface ReservePopupProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    id?: string | number;
    title: string;
    location: string;
    price: number;
    availableSeats: number;
    time?: string;
    genres?: string[];
    image?: string;
  };
}

const RESERVATION_DRAFT_KEY = "cinebook_reservation_draft";

export default function ReservePopup({ isOpen, onClose, movie }: ReservePopupProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [ticketCount, setTicketCount] = useState<number | "">(1);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "Male"
  });

  useEffect(() => {
    const session = getAuthSession();
    setFormData({
      name: session?.user?.name || session?.user?.first_name && session?.user?.last_name
        ? `${session.user.first_name} ${session.user.last_name}`.trim()
        : "",
      phone: "",
      email: session?.user?.email || "",
      gender: "Male",
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const stored = localStorage.getItem(RESERVATION_DRAFT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { reservationId?: string; step?: number };
        if (parsed.reservationId) {
          setReservationId(parsed.reservationId);
          setCurrentStep(parsed.step && parsed.step > 1 ? parsed.step : 1);
          setHasDraft(true);
          return;
        }
      } catch {
        localStorage.removeItem(RESERVATION_DRAFT_KEY);
      }
    }

    setHasDraft(false);
    setReservationId(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setCurrentStep(1);
    setReservationId(null);
    setHasDraft(false);
    setError("");
    localStorage.removeItem(RESERVATION_DRAFT_KEY);
    onClose();
  };

  const persistDraft = (nextReservationId: string | null, nextStep: number) => {
    localStorage.setItem(
      RESERVATION_DRAFT_KEY,
      JSON.stringify({ reservationId: nextReservationId, step: nextStep })
    );
  };

  const createReservation = async () => {
    const session = getAuthSession();
    if (!session?.user?.email) {
      setError("You need to be logged in to reserve a ticket.");
      return false;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/reservations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          movie_id: String(movie.id ?? ""),
          movie_title: movie.title,
          location: movie.location,
          price: Number(movie.price),
          ticket_count: Number(ticketCount) || 1,
          customer_name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Reservation could not be created.");
      }

      const nextReservationId = result.data?.id ?? null;
      setReservationId(nextReservationId);
      persistDraft(nextReservationId, 2);
      setCurrentStep(2);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reservation could not be created.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeReservation = async () => {
    if (!reservationId) {
      setError("Reservation record is missing. Please create it again.");
      return false;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          payment_method: "GCash",
          seats: Array.from({ length: Number(ticketCount) || 1 }, (_, idx) => {
            const letter = String.fromCharCode(65 + (idx % 8));
            return `${letter}${idx + 1}`;
          }),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Reservation could not be completed.");
      }

      localStorage.removeItem(RESERVATION_DRAFT_KEY);
      setCurrentStep(3);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reservation could not be completed.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      const ok = await createReservation();
      if (!ok) {
        return;
      }
      return;
    }

    if (currentStep === 2) {
      if (!reservationId) {
        setError("Reservation record is missing. Please create it again.");
        return;
      }

      setCurrentStep(3);
      persistDraft(reservationId, 3);
      return;
    }

    if (currentStep === 3) {
      const ok = await completeReservation();
      if (!ok) return;
    }
  };

  const steps = [
    { id: 1, label: "Details" },
    { id: 2, label: "GCash Pay" },
    { id: 3, label: "Finish" }
  ];

  const totalAmount = Number(movie.price) * (Number(ticketCount) || 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12171f] border border-[#1f2633] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Reserve Ticket</h2>
            <p className="text-xs text-gray-400">{movie.title} • {movie.location}</p>
          </div>
          <button 
            onClick={resetAndClose}
            className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {hasDraft && currentStep === 1 && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            <span>Resume your pending reservation</span>
            <button
              type="button"
              onClick={() => {
                setCurrentStep(2);
                setHasDraft(false);
                persistDraft(reservationId, 2);
              }}
              className="rounded-full bg-amber-500/20 px-2.5 py-1 font-semibold text-amber-200 hover:bg-amber-500/30"
            >
              Resume
            </button>
          </div>
        )}

        <div className="flex items-center justify-between px-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep > step.id
                    ? "bg-emerald-500 text-black"
                    : currentStep === step.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={`text-xs font-medium ${
                  currentStep === step.id ? "text-white" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <div className="w-8 md:w-12 h-[2px] bg-gray-800 mx-1" />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleNextStep} className="space-y-4">
          {currentStep === 1 && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0b0e13] border border-[#1f2633] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0b0e13] border border-[#1f2633] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0b0e13] border border-[#1f2633] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Gender</label>
                  <input
                    type="text"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-[#0b0e13] border border-[#1f2633] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-medium text-gray-300">Number of Tickets</label>
                <input
                  type="number"
                  min="1"
                  max={movie.availableSeats}
                  required
                  value={ticketCount}
                  onChange={(e) => setTicketCount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-[#0b0e13] border border-[#1f2633] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="flex justify-between items-center bg-[#0b0e13] p-3 rounded-xl border border-[#1f2633] text-xs">
                <span className="text-gray-400">Total Price:</span>
                <span className="font-bold text-red-500 text-sm">₱{totalAmount}</span>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 py-2 flex flex-col items-center justify-center text-center">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-3 w-full">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Pay via GCash</span>
                <p className="text-[11px] text-gray-400 mt-0.5">Scan the QR code below to transfer ₱{totalAmount}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border-4 border-blue-500/40 shadow-xl flex flex-col items-center gap-2">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GCASH-PAYMENT-AMOUNT-${totalAmount}`} 
                  alt="GCash QR Code" 
                  className="w-44 h-44 object-contain"
                />
                <span className="text-[10px] font-semibold text-gray-800 tracking-wider uppercase">GCash Account: Cinema Reserve</span>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 py-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Thank You!</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Your booking for <span className="text-white font-medium">{movie.title}</span> ({ticketCount} ticket{Number(ticketCount) > 1 ? "s" : ""}) has been submitted successfully.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            {currentStep < 3 ? (
              <>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep((prev) => prev - 1);
                      persistDraft(reservationId, currentStep - 1);
                    }}
                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300"
                  >
                    Back
                  </button>
                ) : <div />}

                <div className="ml-auto flex items-center gap-2">
                  {currentStep === 2 && reservationId && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}/cancel`, {
                            method: "POST",
                            headers: { Accept: "application/json" },
                          });
                          if (response.ok) {
                            localStorage.removeItem(RESERVATION_DRAFT_KEY);
                            resetAndClose();
                            navigate("/transactions");
                            return;
                          }
                        } catch {}
                        localStorage.removeItem(RESERVATION_DRAFT_KEY);
                        resetAndClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-xs font-semibold text-white"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
                  >
                    <span>{isSubmitting ? "Processing..." : currentStep === 1 ? "Create Pending" : "Continue"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  const ok = await completeReservation();
                  if (!ok) return;
                  resetAndClose();
                  navigate("/transactions");
                }}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
              >
                <span>{isSubmitting ? "Completing..." : "View Transactions"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}