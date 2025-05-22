"use client";

import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function RegisterPage() {
  return (
    <div className="container mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumbs items={[{ slug: "/dang-ky", label: "Đăng ký" }]} />
      </div>
      <div className="mx-auto pb-8">
        <RegisterForm />
      </div>
    </div>
  );
}
