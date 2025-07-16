import supabase from "@/clients/db";

export const uploadAvatar = async (file: File, userId: string) => {
  const filePath = `${userId}_${Date.now()}.${file.type.split("/")[1]}`;
  console.log(filePath);
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });
  console.log(data);
  console.log(error, "=============");
  if (error) {
    console.error("Upload failed:", error.message);
    return null;
  }

  const publicURL = supabase.storage.from("avatars").getPublicUrl(filePath)
    .data.publicUrl;
  return publicURL;
};
