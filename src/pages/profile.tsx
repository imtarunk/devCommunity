import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Mail, Code, Pencil } from "lucide-react";
import { ContactCard } from "@/components/contact";
import { SkillsCard } from "@/components/skillsCard";
import { ProfileCard } from "@/components/profileCard";
import UpdateUserDrawer from "@/components/UpdateUserDrawer";
import supabase from "@/clients/db";
import { PostCard } from "@/components/postCard";

const DEFAULT_USER_INFO = {
  id: "",
  fullName: "",
  username: "",
  bio: "",
  email: "",
  avatar_url: "",
  skills: [],
  posts: [],
};

const Profile = () => {
  const { userid } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const fetchUserById = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;
      if (!token) return navigate("/auth");

      setLoggedInUserId(session.user.id);

      const res = await fetch(
        `https://rzyogbkxuvfftybhuahp.supabase.co/functions/v1/get-user/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        setNotFound(true);
        return;
      }

      const user = await res.json();
      setUserData(user);
    } catch (err) {
      console.error("User fetch error:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) return;

      const res = await fetch(
        "https://rzyogbkxuvfftybhuahp.supabase.co/functions/v1/get-userpost",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Post fetch error:", data);
        return;
      }

      setPosts(data);
    } catch (err) {
      console.error("Unexpected post error:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    const storedTab = localStorage.getItem("profile-tab");
    if (storedTab) setActiveTab(storedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem("profile-tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (userid) {
      fetchUserById();
      fetchPosts();
    }
  }, [userid]);

  const userInfo = userData || DEFAULT_USER_INFO;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (notFound || !userInfo?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        User not found.
      </div>
    );
  }

  const isOwner = loggedInUserId === userInfo.id;

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "skills", label: "Skills", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl space-y-6">
        {/* Header tabs + edit button */}
        <div className="flex flex-wrap justify-between items-center gap-2 bg-white rounded-xl p-3 shadow border border-gray-200">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {isOwner && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={() => setOpenDrawer(true)}
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {openDrawer && (
          <UpdateUserDrawer
            userInfo={userInfo}
            onUpdate={async () => {
              setOpenDrawer(false);
              await fetchUserById();
            }}
          />
        )}

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "profile" && <ProfileCard userInfo={userInfo} />}
            {activeTab === "contact" && <ContactCard userInfo={userInfo} />}
            {activeTab === "skills" && <SkillsCard userInfo={userInfo} />}
          </div>

          <div className="hidden lg:block space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-semibold text-sm mb-2">
                Quick Links
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>→ Edit Profile</li>
                <li>→ Change Password</li>
                <li>→ Privacy Settings</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-semibold text-sm mb-2">Tips</h3>
              <p className="text-sm text-gray-500">
                Keep your skills updated to get better opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {isOwner ? "Your Posts" : "Posts by " + userInfo.fullName}
          </h2>

          {postsLoading ? (
            <div className="text-gray-400 text-sm">Loading posts...</div>
          ) : posts.length > 0 ? (
            <PostCard
              posts={posts}
              newComment={{}} // implement later
              showComments={{}} // implement later
              handleComment={() => {}} // implement later
              toggleComments={() => {}} // implement later
              setNewComment={() => {}} // implement later
            />
          ) : (
            <div className="text-gray-400 text-sm">
              {isOwner ? "You haven't posted anything yet." : "No posts found."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
