import type { ContactCardProps } from "@/types/types";
import { Award, Phone, Mail } from "lucide-react";

export const ContactCard = ({ userInfo }: ContactCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full">
    <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
      <Mail className="w-5 h-5" />
      Contact Information
    </h2>

    <div className="space-y-4 text-sm text-gray-700">
      {/* Email */}
      <div className="flex items-start sm:items-center gap-3">
        <Mail className="w-4 h-4 text-blue-500 shrink-0" />
        <div>
          <p className="font-medium">Email</p>
          <p className="text-gray-600">{userInfo.email}</p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start sm:items-center gap-3">
        <Phone className="w-4 h-4 text-green-500 shrink-0" />
        <div>
          <p className="font-medium">Phone</p>
          <p className="text-gray-600">{userInfo.phone}</p>
        </div>
      </div>

      {/* Education */}
      <div className="flex items-start sm:items-center gap-3">
        <Award className="w-4 h-4 text-yellow-500 shrink-0" />
        <div>
          <p className="font-medium">Education</p>
          <p className="text-gray-600">{userInfo.education}</p>
        </div>
      </div>
    </div>
  </div>
);
