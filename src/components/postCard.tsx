import React, { useState } from "react";
import { Heart, MessageCircle, Share } from "lucide-react";
import type { Post } from "@/types/types";
import { toast } from "sonner";
import { UpdatePostDialog } from "./UpdatePostModal";
import { DropdownMenuDemo } from "./dropMenu";
import supabase from "@/clients/db";

interface PostCardProps {
  posts: Post[];
  newComment: Record<number, string>;
  showComments: Record<number, boolean>;
  handleComment: (postId: number) => void;
  toggleComments: (postId: number) => void;
  setNewComment: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  loggedInUserId: string;
}

export const PostCard = ({
  posts,
  newComment,
  showComments,
  handleComment,
  toggleComments,
  setNewComment,
  loggedInUserId,
}: PostCardProps) => {
  const [editPost, setEditPost] = useState<Post | null>(null);

  const handleDeletePost = async (postId: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) toast.error("Failed to delete post");
    else toast.success("Post deleted");
  };

  const handleUpdatePost = async (id: number, newContent: string) => {
    const { error } = await supabase
      .from("posts")
      .update({ content: newContent, edited: true })
      .eq("id", id);
    if (error) toast.error("Update failed");
    else toast.success("Post updated");
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Post Header */}
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s"
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{post.user}</h3>
                  <p className="text-sm text-gray-500">{post.time}</p>
                </div>
              </div>

              <DropdownMenuDemo
                onEdit={() => setEditPost(post)}
                onDelete={() => handleDeletePost(post.id)}
                loggedInUserId={loggedInUserId}
                authorId={post.author_id}
              />
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-4">
            <p className="text-gray-900 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Post Actions */}
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  className={`flex items-center space-x-2 transition-colors ${
                    post.liked
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${post.liked ? "fill-current" : ""}`}
                  />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {post.comments?.length || 0}
                  </span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                  <Share className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {showComments[post.id] && (
            <div className="border-t border-gray-100 bg-gray-50">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm">
                      {comment.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-2xl px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">
                          {comment.user}
                        </p>
                        <p className="text-gray-800 text-sm mt-1">
                          {comment.content}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-4">
                        {comment.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Comment */}
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                    😊
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={newComment[post.id] || ""}
                      onChange={(e) =>
                        setNewComment({
                          ...newComment,
                          [post.id]: e.target.value,
                        })
                      }
                      placeholder="Write a comment..."
                      className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleComment(post.id)
                      }
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      disabled={!newComment[post.id]?.trim()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Edit Post Dialog */}
      {editPost && (
        <UpdatePostDialog
          postId={editPost.id}
          defaultContent={editPost.content}
          open={!!editPost}
          setOpen={(val) => {
            if (!val) setEditPost(null);
          }}
          onUpdate={handleUpdatePost}
        />
      )}
    </div>
  );
};
