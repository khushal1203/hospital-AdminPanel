"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton";
import { toast } from "@/utils/toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    profileImage: "/images/user/user-03.png"
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/sign-in");
        return;
      }

      const res = await fetch(`/api/auth/getUserLocal`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setFormData({
          fullName: data.user.fullName,
          email: data.user.email,
          profileImage: data.user.profileImage || "/images/user/user-03.png"
        });
        setImagePreview(data.user.profileImage || "/images/user/user-03.png");
      } else {
        toast.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      
      let imageUrl = formData.profileImage;
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);
        
        const imageRes = await fetch("/api/users/upload-image", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageFormData,
        });

        const imageData = await imageRes.json();
        if (imageData.success) {
          imageUrl = imageData.imageUrl;
        } else {
          toast.error("Failed to upload image");
          return;
        }
      }

      const res = await fetch(`/api/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user._id,
          fullName: formData.fullName,
          email: formData.email,
          profileImage: imageUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully");
        setUser(data.user);
        setFormData({
          fullName: data.user.fullName,
          email: data.user.email,
          profileImage: data.user.profileImage || "/images/user/user-03.png"
        });
        setImagePreview(data.user.profileImage || "/images/user/user-03.png");
        setEditing(false);
        setImageFile(null);
        
        window.dispatchEvent(new CustomEvent('profileUpdated'));
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton href="/dashboard" label="Back to Dashboard" />
        </div>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Profile Settings
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage your account information and preferences
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600"></div>
              
              {/* Profile Content */}
              <div className="relative px-6 pb-6">
                {/* Profile Image */}
                <div className="flex justify-center -mt-16 mb-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white">
                      <Image
                        src={imagePreview}
                        width={128}
                        height={128}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {editing && (
                      <label
                        htmlFor="profile"
                        className="absolute bottom-2 right-2 bg-primary hover:bg-primary/90 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all transform hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          id="profile"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {user?.fullName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {user?.email}
                  </p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300 capitalize">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    {user?.role}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(user?.createdAt).getFullYear() || new Date().getFullYear()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Joined</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      Active
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Personal Information
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Update your personal details and account settings
                    </p>
                  </div>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-blue-600 to-purple-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white transition-all text-lg"
                        placeholder="Enter your full name"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white transition-all text-lg"
                        placeholder="Enter your email address"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={user?.role || ""}
                        disabled
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed dark:text-white text-lg capitalize"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Account Status
                    </label>
                    <div className="flex items-center space-x-3 px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Active Account</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {editing && (
                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          fullName: user.fullName,
                          email: user.email,
                          profileImage: user.profileImage || "/images/user/user-03.png"
                        });
                        setImagePreview(user.profileImage || "/images/user/user-03.png");
                        setImageFile(null);
                      }}
                      className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3 bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-xl hover:from-blue-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold inline-flex items-center shadow-lg"
                    >
                      {saving && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}