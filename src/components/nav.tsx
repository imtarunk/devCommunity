import { UserDropdown } from "./logout";

type NavUser = {
  id: string;
  avatar_url: string;
};

export const Nav = ({ user }: { user: NavUser | null }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-lg bg-white/80">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Feed</h1>
          {user && <UserDropdown user={user} />}
        </div>
      </div>
    </div>
  );
};
