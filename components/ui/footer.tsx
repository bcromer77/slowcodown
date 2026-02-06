import Link from "next/link";
import { EDITOR_TITLE, EDITOR_ROLE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-stone/30 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p className="font-serif text-lg text-charcoal">Slow County Down</p>
            <p className="text-sm text-charcoal/60 mt-1">
              Eat slowly. Stay longer. Notice more.
            </p>
            <p className="text-xs text-charcoal/40 mt-4">
              {EDITOR_TITLE}, {EDITOR_ROLE}
            </p>
          </div>
          <div className="flex gap-8 text-sm text-charcoal/60">
            <Link href="/wander" className="hover:text-charcoal transition-colors">
              Wander
            </Link>
            <Link href="/courses" className="hover:text-charcoal transition-colors">
              Courses
            </Link>
            <Link href="/login" className="hover:text-charcoal transition-colors">
              For Restaurants
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-charcoal/10 text-xs text-charcoal/40">
          County Down, Northern Ireland
        </div>
      </div>
    </footer>
  );
}
