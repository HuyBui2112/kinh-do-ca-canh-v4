"use client";

import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function LoginPage() {
  return (
    <div className="container mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumbs items={[{ slug: "/dang-nhap", label: "Đăng nhập" }]} />
      </div>
      <div className="max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}
