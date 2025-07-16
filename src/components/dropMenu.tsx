import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

// Add props for logged-in user and post author
type DropdownMenuDemoProps = {
  onEdit: () => void;
  onDelete: () => void;
  loggedInUserId: string;
  authorId: string;
};

export function DropdownMenuDemo({
  onEdit,
  onDelete,
  loggedInUserId,
  authorId,
}: DropdownMenuDemoProps) {
  const isOwner = loggedInUserId === authorId;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuGroup>
          {isOwner && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                Edit Post
                <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                Delete Post
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem disabled>Report</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
