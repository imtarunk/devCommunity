import supabase from "@/clients/db";
import { useEffect, useState } from "react";
// adjust path based on your project structure

type Author = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  // Add other fields if they exist in your `accounts` table
};

export const useAuthor = (authorId: string | null) => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState<boolean>(!!authorId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorId) {
      setAuthor(null);
      setLoading(false);
      return;
    }

    const fetchAuthor = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("id", authorId)
        .single();

      if (error) {
        setError(error.message);
        setAuthor(null);
      } else {
        setAuthor(data);
      }

      setLoading(false);
    };

    fetchAuthor();
  }, [authorId]);

  return { author, loading, error };
};
