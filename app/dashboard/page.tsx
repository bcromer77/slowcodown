import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Header } from "@/components/ui/header";
import { DashboardClient } from "./_components/dashboard-client";
import prisma from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      restaurant: {
        include: {
          courses: { orderBy: { createdAt: "desc" } },
          menus: { orderBy: { date: "desc" }, take: 7 },
        },
      },
    },
  });

  if (!user?.restaurant) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-warm-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <DashboardClient initialRestaurant={JSON.parse(JSON.stringify(user.restaurant))} />
        </div>
      </main>
    </>
  );
}
