import React from "react";

// app/(main)/layout.tsx
export default function MainLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen bg-customGray">
        {children}
      </div>
    );
  }