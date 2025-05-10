"use client";

import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";

export default function DangKyPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
}
