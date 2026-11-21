import HeroBanner from "@/components/home/HeroBanner";
import PizzaCategories from "@/components/home/PizzaCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import PizzaCard from "@/components/shared/PizzaCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getFeaturedMenu() {
  try {
    const res = await fetch(`${API_URL}/menu?featured=true`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredItems = await getFeaturedMenu();

  return (
    <div>
      <HeroBanner />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Featured Menu Items
            </h2>
            <p className="text-sm text-muted-foreground">
              Fresh picks from our approved pizzerias
            </p>
          </div>
        </div>

        {featuredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            No approved menu items available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredItems.slice(0, 8).map((item) => (
              <PizzaCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      <PizzaCategories />
      <WhyChooseUs />
      <HowItWorks />
    </div>
  );
}