"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";
import { loadActivity, loadSires, loadCalves, loadLivestock, loadLocations } from "../components/farmStore";

const cattleModules = [
  { title: "Animal records", href: "/livestock", icon: "🐄", detail: "Search tags, open profiles, and keep each animal's status current." },
  { title: "Offspring", href: "/offspring/new", icon: "🐮", detail: "Add offspring and connect them to the parent animal right away." },
  { title: "Sires", href: "/sires", icon: "🐂", detail: "Manage herd sires by tag, breed, location, and sale/purchase info." },
  { title: "Locations", href: "/locations", icon: "🌱", detail: "See where livestock and sires are assigned and add new location names." },
  { title: "Livestock notes", href: "/activity", icon: "📝", detail: "Review notes, vaccinations, location updates, and other livestock events." },
  { title: "Livestock Report", href: "/livestock/report", icon: "📋", detail: "Copy a clean livestock snapshot with watch list and location summaries." },
];

const quickActions = [
  { label: "Add Animal", href: "/livestock/new", icon: "➕", detail: "Start a new animal record" },
  { label: "Add Offspring", href: "/offspring/new", icon: "🐮", detail: "Link offspring to a parent animal" },
  { label: "Log Note", href: "/notes/new", icon: "📝", detail: "Save a livestock note" },
];

function LivestockContent() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") || "";
  const [livestock, setLivestock] = useState([]);
  const [offspring, setCalves] = useState([]);
  const [sires, setSires] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activity, setActivity] = useState([]);
  const [query, setQuery] = useState(initialTag);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      Promise.all([loadLivestock(), loadCalves(), loadSires(), loadLocations(), loadActivity()])
        .then(([cowRows, offspringRows, sireRows, locationRows, activityRows]) => {
          setLivestock(cowRows);
          setCalves(offspringRows);
          setSires(sireRows);
          setLocations(locationRows);
          setActivity(activityRows);
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const filteredLivestock = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return livestock;
    return livestock.filter((cow) =>
      [cow.tag, cow.calfTag, cow.color, cow.location, cow.status]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value))
    );
  }, [livestock, query]);

  const activeLivestock = livestock.filter((cow) => cow.status === "Active").length;
  const watchLivestock = livestock.filter((cow) => cow.status === "Watch").length;
  const activeSires = sires.filter((sire) => sire.status === "Active").length;
  const activeCalves = offspring.filter((offspring) => offspring.status === "Active").length;

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Livestock</h1>
        <p className="muted">The livestock side of Demo Farm Manager: tags, offspring, sires, locations, and recent livestock notes.</p>
      </header>

      <section className="stats-grid cow-stats" aria-label="Livestock summary">
        <div className="stat-card"><strong>{activeLivestock}</strong><span>Active livestock</span></div>
        <div className="stat-card"><strong>{activeCalves}</strong><span>Active offspring</span></div>
        <div className="stat-card"><strong>{activeSires}</strong><span>Active sires</span></div>
        <div className="stat-card"><strong>{watchLivestock}</strong><span>Watch list</span></div>
        <div className="stat-card"><strong>{locations.length}</strong><span>Locations</span></div>
        <div className="stat-card"><strong>{activity.length}</strong><span>Recent notes</span></div>
      </section>

      <section className="search-card">
        <label htmlFor="cow-search">Find animal by tag</label>
        <input id="cow-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: 83" inputMode="numeric" />
      </section>

      <section className="hero-card farming-hero">
        <p className="eyebrow">Start with tags</p>
        <h2>Keep the livestock easy to check from the truck.</h2>
        <p className="muted">Fast search stays first, then the deeper tools are grouped underneath for offspring, locations, sires, and reports.</p>
      </section>

      <section>
        <div className="section-heading"><h2>Livestock tools</h2></div>
        <div className="stack">
          {cattleModules.map((item) => (
            <Link className="list-card farming-feature link-card" href={item.href} key={item.title}>
              <span aria-hidden="true">{item.icon}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="action-grid two farming-actions">
        {quickActions.map((action) => (
          <Link className="action-card detailed-action" href={action.href} key={action.label}>
            <span>{action.icon}</span>
            <strong>{action.label}</strong>
            <small>{action.detail}</small>
          </Link>
        ))}
      </section>

      <section>
        <div className="section-heading">
          <h2>Animal records</h2>
          <Link href="/livestock/new">Add animal</Link>
        </div>
        <div className="stack">
          {filteredLivestock.map((cow) => (
            <Link className="list-card link-card" href={`/livestock/${cow.id}`} key={cow.id}>
              <div className="row-between">
                <h2>Animal {cow.tag}</h2>
                <span className={`pill ${cow.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(cow.status) ? "danger" : ""}`}>{cow.status}</span>
              </div>
              <p>{cow.color} • {cow.location}</p>
              <small>{cow.calfTag ? `Offspring ${cow.calfTag}` : "No offspring recorded yet"}</small>
            </Link>
          ))}
          {filteredLivestock.length === 0 && <article className="list-card"><h2>No livestock found</h2><p>Try another tag number or add a new animal.</p></article>}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="app-shell"><p>Loading...</p></main>}>
      <LivestockContent />
    </Suspense>
  );
}
