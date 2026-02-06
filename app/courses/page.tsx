import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CoursesClient } from "./_components/courses-client";
import { EDITOR_TAGLINE } from "@/lib/constants";

export default function CoursesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-warm-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="font-serif text-4xl text-charcoal">Courses worth lingering over</h1>
            <p className="mt-3 text-charcoal/60 max-w-xl">
              Dishes as artefacts. Browse by sense, season, or the feeling you&apos;re looking for.
            </p>
            <p className="mt-4 text-xs text-charcoal/40">{EDITOR_TAGLINE}</p>
          </div>
          <CoursesClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
