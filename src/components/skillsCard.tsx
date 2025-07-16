import { Code } from "lucide-react";
import { SkillBadge } from "./badge";
import type { SkillsCardProps } from "@/types/types";

export const SkillsCard = ({ userInfo }: SkillsCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full">
    <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
      <Code className="w-5 h-5 text-purple-500" />
      Skills & Technologies
    </h2>

    <div className="flex flex-wrap gap-2">
      {userInfo.skills.map((skill, index) => (
        <SkillBadge key={index} skill={skill} />
      ))}
    </div>
  </div>
);
