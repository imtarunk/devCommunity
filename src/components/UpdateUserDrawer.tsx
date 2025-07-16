import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import supabase from "@/clients/db";
import { MultiSelect } from "./MultiSelect";
import { toast } from "sonner";

const skillOptions = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Solidity",
  "Tailwind",
];

const UpdateUserDrawer = ({
  userInfo,
  onUpdate,
}: {
  userInfo: any;
  onUpdate: () => void;
}) => {
  const [username, setUsername] = useState(userInfo.username || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [bio, setBio] = useState(userInfo.bio || "");
  const [skills, setSkills] = useState<string[]>(userInfo.skills || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("accounts")
      .update({
        username,
        email,
        bio,
        skills,
      })
      .eq("id", userInfo.id);

    console.log(data);
    setLoading(false);

    if (error) {
      toast(error.message);
      console.error("Update error:", error);
      setError("Failed to update profile.");
    } else {
      onUpdate(); // close drawer
    }
  };

  return (
    <Drawer open onOpenChange={onUpdate}>
      <DrawerContent className="sm:max-w-md  ml-auto">
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <Label>Skills</Label>
            <MultiSelect
              options={skillOptions}
              selected={skills}
              onChange={setSkills}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <DrawerFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="ghost" onClick={onUpdate}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UpdateUserDrawer;
