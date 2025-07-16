import { useEffect, useState } from "react";
import axios from "axios";
import supabase from "@/clients/db";
import { toast } from "sonner";
import { type Post } from "@/types/types";
import { PostCard } from "@/components/postCard";
import { CreatePostCard } from "@/components/createPost";
import { Nav } from "@/components/nav";
const AppleFeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 2,
      user: "Emily Rodriguez",
      avatar: "👩‍🎨",
      time: "4h ago",
      content:
        "Beautiful sunset from my studio today. Sometimes the best inspiration comes from nature! 🌅✨",
      likes: 89,
      comments: [
        {
          id: 1,
          user: "David Kim",
          content: "Absolutely stunning! Nature is the best artist.",
          time: "3h ago",
        },
      ],
      liked: true,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState<string>("");
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [user, setUser] = useState<{ id: string; avatar_url: string } | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // Get session once and reuse
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error("Failed to get session:", sessionError);
          return;
        }

        const accessToken = session.access_token;
        const userId = session.user.id;

        // Fetch posts and user in parallel
        const [postsRes, accountRes] = await Promise.all([
          axios.get(
            "https://rzyogbkxuvfftybhuahp.supabase.co/functions/v1/get-allpost",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ),
          supabase.from("accounts").select("*").eq("id", userId).single(),
        ]);

        // Handle posts
        if (postsRes.data) {
          const formattedPosts = postsRes.data.map((post: any) => ({
            ...post,
            comments: Array.isArray(post.comments) ? post.comments : [],
          }));
          setPosts(formattedPosts);
        }

        // Handle user
        const { data: account, error: accountError } = accountRes;
        if (accountError) {
          console.error("Failed to fetch account:", accountError);
        } else if (account) {
          setUser({ id: account.id, avatar_url: account.avatar_url });
        }
      } catch (err) {
        console.error("Error during initialization:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) return <p className="text-center">Loading posts...</p>;
  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    // Get the current user's access token from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    try {
      const response = await axios.post(
        "https://rzyogbkxuvfftybhuahp.supabase.co/functions/v1/create-post",
        {
          // should not be empty
          content: newPost || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );
      console.log(response.data);
      if (response.status === 201 || response.status === 200) {
        toast("Post created!");
        setNewPost("");
      } else {
        toast("Failed to create post");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = (postId: number) => {
    const comment = newComment[postId];
    if (comment && comment.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: post.comments.length + 1,
                    user: "You",
                    content: comment,
                    time: "now",
                  },
                ],
              }
            : post
        )
      );
      setNewComment({ ...newComment, [postId]: "" });
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Nav user={user} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post */}
        <CreatePostCard
          newPost={newPost}
          setNewPost={setNewPost}
          handleCreatePost={handleCreatePost}
          avatarUrl={user?.avatar_url as string}
        />

        {/* Posts */}
        <PostCard
          posts={posts}
          newComment={newComment}
          showComments={showComments}
          handleComment={handleComment}
          toggleComments={toggleComments}
          setNewComment={setNewComment}
          loggedInUserId={user?.id || ""}
        />
      </div>
    </div>
  );
};

export default AppleFeedPage;
