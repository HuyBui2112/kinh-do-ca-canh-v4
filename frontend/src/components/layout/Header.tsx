import React from "react";
import TopBar from "../ui/TopBar";

export default function Header() {
  return (
    <header className="min-w-[320px] bg-white border-b border-sky-950/15 sticky top-0 z-40">
      {/* Top Bar - only visible on large screen */}
      <TopBar />
    </header>
  );
}
