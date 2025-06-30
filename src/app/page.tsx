// src/app/page.tsx
"use client";
import { Header } from '@/components/layout/header';

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="p-8">
        <h1>Header component loaded!</h1>
      </div>
    </>
  );
}