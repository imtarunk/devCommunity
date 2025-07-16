import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "@/clients/db";

export const UserDropdown = ({
  user,
}: {
  user: { id: string; avatar_url: string };
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          src={
            user.avatar_url ||
            "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleProfile}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
