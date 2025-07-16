import { z } from "zod";

export const userSignUp = z.object({
  fullname: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type ContactCardProps = {
  userInfo: {
    email: string;
  };
};

export type SkillsCardProps = {
  userInfo: {
    skills: string[];
  };
};

export type userInfoProps = {
  userInfo: {
    id: string;
    fullName: string;
    username: string;
    bio: string;
    email: string;
    avatar_url: string;
    skills: string[];
    posts: string[]; // or posts: PostType[];
  };
};

export type Comment = {
  id: number;
  user: string;
  content: string;
  time: string;
};

export type Post = {
  id: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: Comment[];
  liked: boolean;
};
