"use client";

import React from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function DangNhapPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}
