"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Compass, UtensilsCrossed, ChefHat, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<{ user?: SessionUser } | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setSession(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-warm-white/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-charcoal tracking-tight">
            Slow County Down
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/wander"
              className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors"
            >
              <Compass size={16} />
              <span className="hidden sm:inline">Wander</span>
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors"
            >
              <UtensilsCrossed size={16} />
              <span className="hidden sm:inline">Courses</span>
            </Link>
            {mounted && session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors"
                >
                  <ChefHat size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors"
              >
                <span>For Restaurants</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
