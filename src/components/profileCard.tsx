"use client";

import React, { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { userInfoProps } from "@/types/types";
import { Briefcase, Calendar, Edit3, MapPin } from "lucide-react";
import { toast } from "sonner";
import { uploadAvatar } from "@/lib/upload";
import supabase from "@/clients/db";

export const ProfileCard = ({ userInfo }: userInfoProps) => {
  const [showCrop, setShowCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageSrc(URL.createObjectURL(file));
      setShowCrop(true);
    }
  };

  const onCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }

  async function getCroppedImg(imageSrc: string, crop: any): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Blob generation failed"));
      }, "image/jpeg");
    });
  }

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setLoading(true);

      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([blob], "avatar.jpg", {
        type: "image/jpeg",
      });

      const publicUrl = await uploadAvatar(croppedFile, userInfo.id);

      const { error } = await supabase
        .from("accounts")
        .update({ avatar_url: publicUrl })
        .eq("id", userInfo.id);

      if (error) {
        toast.error("Failed to upload avatar");
        return;
      }

      toast.success("Avatar updated!");
      setShowCrop(false);
      setImageSrc(null);
      location.reload(); // Optional: refresh avatar instantly
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-2xl" />
        <div className="absolute top-4 right-4">
          <button
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            aria-label="Edit cover"
          >
            <Edit3 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex items-start justify-between -mt-14 mb-4 relative">
          {/* Avatar */}
          <div className="relative group">
            <img
              src={
                userInfo.avatar_url ||
                "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
              }
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer group-hover:opacity-80 transition duration-300"
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileChange}
            />
            <span className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md">
              <Edit3 className="w-4 h-4 text-gray-600" />
            </span>
          </div>
        </div>

        <div className="space-y-3 mt-6 text-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userInfo.fullName}
            </h1>
            <p className="text-gray-600">@{userInfo.username || "imtarnu"}</p>
          </div>

          <p className="text-gray-700">{userInfo.bio}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              India, Lucknow
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              Adgent.ai
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            Joined {new Date(userInfo.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      {showCrop && imageSrc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90vw] max-w-md space-y-4">
            <div className="relative w-full h-72 rounded-md overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="flex justify-between items-center gap-3">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(+e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCrop(false)}
                className="px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
