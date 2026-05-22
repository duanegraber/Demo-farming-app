"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { loadActivity, loadSires, loadCalves, loadLivestock, loadLocations } from "../../components/farmStore";

function groupByStatus(livestock) {
  return Object.values(livestock.reduce((groups, cow) => {
    const key = cow.status || "Unknown";
    groups[key] ||= { status: key, count: 0 };
    groups[key].count += 1;
    return groups;
  }, {})).sort((a, b) => b.count - a.count || a.status.localeCompare(b.status));
}

function summarizeLocations(locations, livestock, sires) {
  return locations.map((location) => ({
    location,
    livestock: livestock.filter((cow) => cow.location === location),
    sires: sires.filter((sire) => sire.location === location),
  })).filter((group) => group.livestock.length > 0 || group.sires.length > 0);
}

export default function CattleReportPage() {
  const [livestock, setLivestock] = useState([]);
  const [offspring, setCalves] = useState([]);
  const [sires, setSires] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activity, setActivity] = useState([]);
  const [copied, setCopied] = useState(false);

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

  const activeLivestock = livestock.filter((cow) => cow.status === "Active");
  const watchLivestock = livestock.filter((cow) => cow.status === "Watch");
  const activeCalves = offspring.filter((offspring) => offspring.status === "Active");
  const activeSires = sires.filter((sire) => sire.status === "Active");
  const livestockWithCalves = livestock.filter((cow) => cow.offspringTag || offspring.some((offspring) => offspring.cowTag === cow.tag));
  const statusGroups = useMemo(() => groupByStatus(livestock), [livestock]);
  const locationGroups = useMemo(() => summarizeLocations(locations, livestock, sires), [sires, livestock, locations]);
  const recentActivity = activity.slice(0, 5);
  const offspringPercent = activeLivestock.length ? Math.round((livestockWithCalves.length / activeLivestock.length) * 100) : 0;

  const reportText = `Demo Farm Manager Livestock Report\nActive livestock: ${activeLivestock.length}\nActive offspring: ${activeCalves.length}\nActive sires: ${activeSires.length}\nWatch list: ${watchLivestock.length}\nAnimal pairs: ${livestockWithCalves.length}\nOffspring recorded: ${offspringPercent}%`;

  async function copyReport() {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/livestock" className="back-link">← Livestock</Link>
        <h1>Livestock Report</h1>
        <p className="muted">A clean livestock summary for quick review before chores, sorting, or a family update.</p>
      </header>

      <section className="search-card">
        <button className="button full" type="button" onClick={copyReport}>{copied ? "Copied" : "Copy summary"}</button>
      </section>

      <section className="hero-card farming-hero report-hero">
        <p className="eyebrow">Livestock snapshot</p>
        <h2>{activeLivestock.length} active livestock</h2>
        <p className="muted">{activeCalves.length} offspring • {activeSires.length} sires • {watchLivestock.length} on watch</p>
      </section>

      <section className="stats-grid crop-year-stats" aria-label="Livestock report totals">
        <div className="stat-card"><strong>{livestockWithCalves.length}</strong><span>Animal pairs</span></div>
        <div className="stat-card"><strong>{offspringPercent}%</strong><span>Offspring recorded</span></div>
        <div className="stat-card"><strong>{locationGroups.length}</strong><span>Used locations</span></div>
        <div className="stat-card"><strong>{activity.length}</strong><span>Livestock notes</span></div>
      </section>

      <section>
        <div className="section-heading"><h2>Status breakdown</h2></div>
        <div className="stack">
          {statusGroups.map((group) => (
            <article className="list-card compact-list-card" key={group.status}>
              <div className="row-between"><h3>{group.status}</h3><span className={`pill ${group.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(group.status) ? "danger" : ""}`}>{group.count}</span></div>
            </article>
          ))}
          {statusGroups.length === 0 && <article className="list-card"><h2>No animal records yet</h2><p>Add livestock to start building this report.</p></article>}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Watch list</h2></div>
        <div className="stack">
          {watchLivestock.map((cow) => (
            <Link className="list-card link-card" href={`/livestock/${cow.id}`} key={cow.id}>
              <div className="row-between"><h2>Animal {cow.tag}</h2><span className="pill warning">Watch</span></div>
              <p>{cow.color} • {cow.location}</p>
              <small>{cow.notes || "No notes recorded"}</small>
            </Link>
          ))}
          {watchLivestock.length === 0 && <article className="list-card"><h2>Nothing on watch</h2><p>No livestock are marked Watch right now.</p></article>}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Location summary</h2><Link href="/locations">Manage</Link></div>
        <div className="stack">
          {locationGroups.map((group) => (
            <article className="list-card" key={group.location}>
              <div className="row-between"><h2>{group.location}</h2><span className="pill">{group.livestock.length} livestock • {group.sires.length} sires</span></div>
              <p>{group.livestock.slice(0, 8).map((cow) => `Animal ${cow.tag}`).join(", ") || "No livestock"}{group.livestock.length > 8 ? "..." : ""}</p>
            </article>
          ))}
          {locationGroups.length === 0 && <article className="list-card"><h2>No location assignments yet</h2><p>Assign livestock or sires to locations to build this summary.</p></article>}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Recent livestock notes</h2><Link href="/activity">All activity</Link></div>
        <div className="stack">
          {recentActivity.map((item) => (
            <article className="list-card" key={item.id}>
              <p className="eyebrow">{item.type} • {item.time}</p>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <small>Added by {item.user}{item.cowTag ? ` • Tag ${item.cowTag}` : ""}</small>
            </article>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
