// src/components/home/WhyChooseUs.jsx
import { ShieldCheck, Clock, Award } from "lucide-react";

const BENEFITS = [
  {
    icon: Clock,
    title: "Fast & Hot Delivery",
    desc: "Orders are prepared fresh upon acceptance and delivered right to your address.",
  },
  {
    icon: Award,
    title: "Verified Local Pizzerias",
    desc: "Every vendor and menu item is reviewed so you always get quality ingredients.",
  },
  {
    icon: ShieldCheck,
    title: "Simple & Transparent Ordering",
    desc: "Pick your delivery date, add special notes, and track order status in real time.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why Choose PizzaHub?
          </h2>
          <p className="text-sm text-muted-foreground">
            Built for pizza lovers and local restaurant kitchens
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-6 space-y-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}