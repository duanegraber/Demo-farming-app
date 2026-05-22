import Link from "next/link";
import BottomNav from "./components/BottomNav";

const sections = [
  {
    eyebrow: "Cow/calf records",
    title: "Cows",
    href: "/cows",
    icon: "🐄",
    description: "Search tags, add cows and calves, check bulls, pastures, and herd activity.",
    actions: [
      { label: "Cow list", href: "/cows" },
      { label: "Add cow", href: "/cows/new" },
      { label: "Add calf", href: "/calves/new" },
      { label: "Bulls", href: "/bulls" },
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
];

export default function Home() {
  return (
    <main className="app-shell">
      <section className="hero-card landing-hero">
        <p className="eyebrow">Demo Farm Manager</p>
        <h1>A simple farm app demo.</h1>
        <p className="muted">Show cattle, field, equipment, and crop-year records with sample data already loaded.</p>
      </section>

      <section className="search-card">
        <p className="eyebrow">Presentation mode</p>
        <p className="muted">This is a safe demo. Records are fictional and stored locally unless Supabase is connected later.</p>
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
