import Link from "next/link";
import { Compass, UtensilsCrossed } from "lucide-react";

export function Header() {
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
          </div>
        </nav>
      </div>
    </header>
  );
}
