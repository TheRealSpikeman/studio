"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from 'lucide-react';

export default function DashboardRouter() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wacht tot de authenticatiestatus is vastgesteld.
    if (isLoading) {
      return; 
    }
    
    if (user && user.role) {
      // Geldige rol → doorsturen naar het specifieke dashboard.
      router.replace(`/dashboard/${user.role}`);
    } else if (user && !user.role) {
      // Gebruiker is ingelogd maar heeft geen rol → stuur naar profielpagina.
      router.replace("/dashboard/profile");
    } else {
      // Gebruiker is niet ingelogd → stuur naar loginpagina.
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Toon een laadindicator terwijl de logica wordt uitgevoerd.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Even geduld, je wordt doorgestuurd...</p>
    </div>
  );
}
