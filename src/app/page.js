import Link from "next/link";
import BottomNav from "./components/BottomNav";

const sections = [
  {
    eyebrow: "Livestock records",
    title: "Livestock",
    href: "/cows",
    icon: "🐄",
    description: "Search tags, add livestock and offspring, check sires, locations, and herd activity.",
    actions: [
      { label: "Cows", href: "/cows" },
      { label: "Bulls", href: "/bulls" },
      { label: "Calves", href: "/calves/new" },
      { label: "Pigs / goats / sheep", href: "/cows?type=pigs" },
      { label: "Report", href: "/cows/report" },
    ],
  },
  {
    eyebrow: "Crop records",
    title: "Farming",
    href: "/farming",
    icon: "🌾",
    description: "Track fields, crop years, seeding, spraying, fertilizer, harvest, and profit per acre.",
    actions: [
      { label: "Fields", href: "/farming/fields" },
      { label: "Activities", href: "/farming/activities" },
      { label: "Crop year", href: "/farming/crop-year" },
      { label: "Report", href: "/farming/report" },
    ],
  },
  {
    eyebrow: "Machine costs",
    title: "Equipment",
    href: "/equipment",
    icon: "🚜",
    description: "Track equipment, maintenance, repairs, fuel, and yearly cost by machine.",
    actions: [
      { label: "Equipment list", href: "/equipment" },
      { label: "Add equipment", href: "/equipment/new" },
      { label: "Add log", href: "/equipment/logs/new" },
    ],
  },
  {
    eyebrow: "Profit and cost",
    title: "Financials",
    href: "/finance",
    icon: "💰",
    description: "Separate cost, revenue, and profit tracking for Farming, Livestock, and Equipment.",
    actions: [
      { label: "Farming", href: "/finance?department=farming" },
      { label: "Livestock", href: "/finance?department=livestock" },
      { label: "Equipment", href: "/finance?department=equipment" },
      { label: "Add cost", href: "/finance?type=Cost" },
    ],
  },
];

export default function Home() {
  return (
    <main className="app-shell">
      <section className="hero-card landing-hero">
        <p className="eyebrow">Demo Farm Manager</p>
        <h1>A simple farm app demo.</h1>
        <p className="muted">Show livestock, field, equipment, and crop-year records with sample data already loaded.</p>
      </section>

      <section className="search-card">
        <p className="eyebrow">Presentation mode</p>
        <p className="muted">Demo records are fictional and anything prospects add stays local to this browser.</p>
      </section>

      <section className="section-tabs" aria-label="Demo Farm Manager sections">
        {sections.map((section) => (
          <article className="section-tab-card" key={section.title}>
            <Link href={section.href} className="section-tab-main">
              <span className="section-tab-icon" aria-hidden="true">{section.icon}</span>
              <span>
                <span className="eyebrow">{section.eyebrow}</span>
                <strong>{section.title}</strong>
                <span className="muted">{section.description}</span>
              </span>
            </Link>
            <div className="section-tab-actions">
              {section.actions.map((action) => (
                <Link href={action.href} key={action.label}>{action.label}</Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <BottomNav />
    </main>
  );
}
