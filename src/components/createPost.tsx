import React from "react";
import { Plus } from "lucide-react";

interface CreatePostCardProps {
  newPost: string;
  setNewPost: React.Dispatch<React.SetStateAction<string>>;
  handleCreatePost: () => void;
  avatarUrl: string;
}

export const CreatePostCard = ({
  newPost,
  setNewPost,
  handleCreatePost,
  avatarUrl,
}: CreatePostCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            <img
              src={
                avatarUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s"
              }
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full resize-none border-none focus:outline-none text-gray-900 placeholder-gray-500 text-base leading-relaxed"
              rows={3}
            />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
              <Plus className="w-5 h-5" />
              <span className="text-sm">Photo</span>
            </button>
          </div>
          <button
            onClick={handleCreatePost}
            disabled={!newPost.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
