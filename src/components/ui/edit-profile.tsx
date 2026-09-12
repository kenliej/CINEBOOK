import React, { useState } from "react";
import { X, Camera, User, Mail, Phone, Calendar, MapPin, Hash, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    avatarUrl?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    age: string;
    birthday: string;
    gender: string;
    phone: string;
    email: string;
    address: string;
  };
  onSave?: (data: any) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  initialData = {
    avatarUrl: "",
    firstName: "",
    middleName: "",
    lastName: "",
    age: "",
    birthday: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
  },
  onSave,
}: EditProfileProps) {
  const [formData, setFormData] = useState(initialData);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatarUrl || "");

  React.useEffect(() => {
    setFormData(initialData);
    setAvatarPreview(initialData.avatarUrl || "");
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("0")) {
      return digits.slice(0, 11);
    }
    return digits.slice(0, 11);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phone = normalizePhone(formData.phone);
    if (!/^09\d{9}$/.test(phone)) {
      alert("Phone number must start with 09 and contain exactly 11 digits.");
      return;
    }

    const payload = {
      ...formData,
      phone,
      avatarUrl: formData.avatarUrl || avatarPreview || "",
    };

    if (onSave) onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12171f] border border-[#1f2633] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#12171f]/95 backdrop-blur-md border-b border-gray-800 p-5 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-red-600/50 bg-[#18202c] flex items-center justify-center group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-500" />
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs gap-1">
                <Camera className="w-5 h-5" />
                <span>Change</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-xs text-gray-400">Click avatar to change picture</span>
            <div className="w-full space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Profile image link</label>
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl || ""}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }));
                  setAvatarPreview(e.target.value || "");
                }}
                placeholder="https://..."
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-500" />
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-500" />
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-500" />
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-red-500" />
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            {/* Birthday */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                Birthday
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-red-500" />
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Phone Number (Spans full width) */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: normalizePhone(e.target.value) }))}
                inputMode="numeric"
                maxLength={11}
                placeholder="09123456789"
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            {/* Email Address (Spans full width) */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            {/* Address (Spans full width) */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#18202c] border border-[#232d3f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Save Changes
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}