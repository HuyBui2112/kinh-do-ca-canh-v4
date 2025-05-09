import React from "react";
import { Phone, Mail } from "lucide-react";
export default function TopBar() {
  return (
    <div className="hidden lg:block bg-sky-600 text-sm text-sky-100 py-1">
      <div className="container flex items-center justify-between">
        {/* Contact Info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>0987 654 321</span>
          </div>
          <span>|</span>
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span>kinhdocacanh@gmail.com</span>
          </div>
        </div>

        {/* Register/Login Button */}
        <div className=""></div>
      </div>
    </div>
  );
}
