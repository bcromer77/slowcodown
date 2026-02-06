import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { WanderClient } from "./_components/wander-client";

export default function WanderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-warm-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-14">
            <h1 className="font-serif text-4xl text-charcoal">Wander.</h1>
            <p className="mt-2 text-charcoal/50">Take your time.</p>
          </div>
          <WanderClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
