"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/clients/db";
import { toast } from "sonner";

type UpdatePostDialogProps = {
  postId: string;
  defaultContent: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdate: (postId: string, newContent: string) => Promise<void>;
};

export function UpdatePostDialog({
  postId,
  defaultContent,
  open,
  setOpen,
  onUpdate,
}: UpdatePostDialogProps) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(defaultContent);
  }, [defaultContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get user id from session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error("No user session");
      //update posts
      const { data, error } = await supabase
        .from("posts")
        .update({ content: content })
        .eq("id", postId);

      console.log(data, error, "==========");
      await onUpdate(postId, content); // Optionally refresh post list
      setOpen(false);
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post content. Click save when you’re done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="post-content">Post Content</Label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || content.trim() === ""}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
