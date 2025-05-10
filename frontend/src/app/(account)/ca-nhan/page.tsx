"use client";

import React from "react";
import UserProfile from "@/components/auth/UserProfile";
import { useAuth } from "@/hooks/useAuth";

export default function TaiKhoanPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <UserProfile />
      </div>
    </div>
  );
}
