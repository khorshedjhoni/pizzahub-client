// src/components/home/HowItWorks.jsx
const STEPS = [
  { step: "01", title: "Pick Your Pizza", desc: "Search or filter approved menu items by category, price, or location." },
  { step: "02", title: "Set Delivery Details", desc: "Choose your delivery date, address, and any special kitchen instructions." },
  { step: "03", title: "Track Your Order", desc: "Watch your order move from pending to accepted and enjoy." },
];

export default function HowItWorks() {
  return (
    <section className="bg-amber-50/40 dark:bg-card/30 py-14 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            How PizzaHub Works
          </h2>
          <p className="text-sm text-muted-foreground">
            From menu discovery to doorstep delivery in three easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <div key={item.step} className="rounded-xl border bg-card p-6 space-y-2">
              <span className="text-xs font-bold text-orange-600">
                STEP {item.step}
              </span>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}