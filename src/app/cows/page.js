"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";
import { loadActivity, loadBulls, loadCalves, loadCows, loadPastures } from "../components/farmStore";

const cattleModules = [
  { title: "Cow records", href: "/cows", icon: "🐄", detail: "Search tags, open profiles, and keep each cow's status current." },
  { title: "Calving", href: "/calves/new", icon: "🐮", detail: "Add calves and connect them to their mother cow right away." },
  { title: "Bulls", href: "/bulls", icon: "🐂", detail: "Manage herd sires by tag, breed, location, and sale/purchase info." },
  { title: "Pastures", href: "/pastures", icon: "🌱", detail: "See where cows and bulls are assigned and add new pasture names." },
  { title: "Herd notes", href: "/activity", icon: "📝", detail: "Review notes, vaccinations, pasture updates, and other cattle events." },
  { title: "Cattle Report", href: "/cows/report", icon: "📋", detail: "Copy a clean herd snapshot with watch list and pasture summaries." },
];

const quickActions = [
  { label: "Add Cow", href: "/cows/new", icon: "➕", detail: "Start a new cow record" },
  { label: "Add Calf", href: "/calves/new", icon: "🐮", detail: "Link a calf to its mother" },
  { label: "Log Note", href: "/notes/new", icon: "📝", detail: "Save a herd or cow note" },
];

function CowsContent() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") || "";
  const [cows, setCows] = useState([]);
  const [calves, setCalves] = useState([]);
  const [bulls, setBulls] = useState([]);
  const [pastures, setPastures] = useState([]);
  const [activity, setActivity] = useState([]);
  const [query, setQuery] = useState(initialTag);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      Promise.all([loadCows(), loadCalves(), loadBulls(), loadPastures(), loadActivity()])
        .then(([cowRows, calfRows, bullRows, pastureRows, activityRows]) => {
          setCows(cowRows);
          setCalves(calfRows);
          setBulls(bullRows);
          setPastures(pastureRows);
          setActivity(activityRows);
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const filteredCows = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return cows;
    return cows.filter((cow) =>
      [cow.tag, cow.calfTag, cow.color, cow.location, cow.status]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value))
    );
  }, [cows, query]);

  const activeCows = cows.filter((cow) => cow.status === "Active").length;
  const watchCows = cows.filter((cow) => cow.status === "Watch").length;
  const activeBulls = bulls.filter((bull) => bull.status === "Active").length;
  const activeCalves = calves.filter((calf) => calf.status === "Active").length;

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Cows</h1>
        <p className="muted">The cattle side of Demo Farm Manager: tags, calves, bulls, pastures, and recent herd notes.</p>
      </header>

      <section className="stats-grid cow-stats" aria-label="Herd summary">
        <div className="stat-card"><strong>{activeCows}</strong><span>Active cows</span></div>
        <div className="stat-card"><strong>{activeCalves}</strong><span>Active calves</span></div>
        <div className="stat-card"><strong>{activeBulls}</strong><span>Active bulls</span></div>
        <div className="stat-card"><strong>{watchCows}</strong><span>Need watching</span></div>
        <div className="stat-card"><strong>{pastures.length}</strong><span>Pastures</span></div>
        <div className="stat-card"><strong>{activity.length}</strong><span>Recent notes</span></div>
      </section>

      <section className="search-card">
        <label htmlFor="cow-search">Find cow or calf by tag</label>
        <input id="cow-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: 83" inputMode="numeric" />
      </section>

      <section className="hero-card farming-hero">
        <p className="eyebrow">Start with tags</p>
        <h2>Keep the herd easy to check from the truck.</h2>
        <p className="muted">Fast search stays first, then the deeper tools are grouped underneath for calving, pastures, bulls, and reports.</p>
      </section>

      <section>
        <div className="section-heading"><h2>Cattle tools</h2></div>
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
          <h2>Cow records</h2>
          <Link href="/cows/new">Add cow</Link>
        </div>
        <div className="stack">
          {filteredCows.map((cow) => (
            <Link className="list-card link-card" href={`/cows/${cow.id}`} key={cow.id}>
              <div className="row-between">
                <h2>Cow {cow.tag}</h2>
                <span className={`pill ${cow.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(cow.status) ? "danger" : ""}`}>{cow.status}</span>
              </div>
              <p>{cow.color} • {cow.location}</p>
              <small>{cow.calfTag ? `Calf ${cow.calfTag}` : "No calf recorded yet"}</small>
            </Link>
          ))}
          {filteredCows.length === 0 && <article className="list-card"><h2>No cows found</h2><p>Try another tag number or add a new cow.</p></article>}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="app-shell"><p>Loading...</p></main>}>
      <CowsContent />
    </Suspense>
  );
}
