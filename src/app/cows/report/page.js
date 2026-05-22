"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { loadActivity, loadBulls, loadCalves, loadCows, loadPastures } from "../../components/farmStore";

function groupByStatus(cows) {
  return Object.values(cows.reduce((groups, cow) => {
    const key = cow.status || "Unknown";
    groups[key] ||= { status: key, count: 0 };
    groups[key].count += 1;
    return groups;
  }, {})).sort((a, b) => b.count - a.count || a.status.localeCompare(b.status));
}

function summarizePastures(pastures, cows, bulls) {
  return pastures.map((pasture) => ({
    pasture,
    cows: cows.filter((cow) => cow.location === pasture),
    bulls: bulls.filter((bull) => bull.location === pasture),
  })).filter((group) => group.cows.length > 0 || group.bulls.length > 0);
}

export default function CattleReportPage() {
  const [cows, setCows] = useState([]);
  const [calves, setCalves] = useState([]);
  const [bulls, setBulls] = useState([]);
  const [pastures, setPastures] = useState([]);
  const [activity, setActivity] = useState([]);
  const [copied, setCopied] = useState(false);

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

  const activeCows = cows.filter((cow) => cow.status === "Active");
  const watchCows = cows.filter((cow) => cow.status === "Watch");
  const activeCalves = calves.filter((calf) => calf.status === "Active");
  const activeBulls = bulls.filter((bull) => bull.status === "Active");
  const cowsWithCalves = cows.filter((cow) => cow.calfTag || calves.some((calf) => calf.cowTag === cow.tag));
  const statusGroups = useMemo(() => groupByStatus(cows), [cows]);
  const pastureGroups = useMemo(() => summarizePastures(pastures, cows, bulls), [bulls, cows, pastures]);
  const recentActivity = activity.slice(0, 5);
  const calvingPercent = activeCows.length ? Math.round((cowsWithCalves.length / activeCows.length) * 100) : 0;

  const reportText = `Demo Farm Manager Cattle Report\nActive cows: ${activeCows.length}\nActive calves: ${activeCalves.length}\nActive bulls: ${activeBulls.length}\nWatch list: ${watchCows.length}\nCow/calf pairs: ${cowsWithCalves.length}\nCalving recorded: ${calvingPercent}%`;

  async function copyReport() {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/cows" className="back-link">← Cows</Link>
        <h1>Cattle Report</h1>
        <p className="muted">A clean herd summary for quick review before chores, sorting, or a family update.</p>
      </header>

      <section className="search-card">
        <button className="button full" type="button" onClick={copyReport}>{copied ? "Copied" : "Copy summary"}</button>
      </section>

      <section className="hero-card farming-hero report-hero">
        <p className="eyebrow">Herd snapshot</p>
        <h2>{activeCows.length} active cows</h2>
        <p className="muted">{activeCalves.length} calves • {activeBulls.length} bulls • {watchCows.length} on watch</p>
      </section>

      <section className="stats-grid crop-year-stats" aria-label="Cattle report totals">
        <div className="stat-card"><strong>{cowsWithCalves.length}</strong><span>Cow/calf pairs</span></div>
        <div className="stat-card"><strong>{calvingPercent}%</strong><span>Calving recorded</span></div>
        <div className="stat-card"><strong>{pastureGroups.length}</strong><span>Used pastures</span></div>
        <div className="stat-card"><strong>{activity.length}</strong><span>Herd notes</span></div>
      </section>

      <section>
        <div className="section-heading"><h2>Status breakdown</h2></div>
        <div className="stack">
          {statusGroups.map((group) => (
            <article className="list-card compact-list-card" key={group.status}>
              <div className="row-between"><h3>{group.status}</h3><span className={`pill ${group.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(group.status) ? "danger" : ""}`}>{group.count}</span></div>
            </article>
          ))}
          {statusGroups.length === 0 && <article className="list-card"><h2>No cow records yet</h2><p>Add cows to start building this report.</p></article>}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Watch list</h2></div>
        <div className="stack">
          {watchCows.map((cow) => (
            <Link className="list-card link-card" href={`/cows/${cow.id}`} key={cow.id}>
              <div className="row-between"><h2>Cow {cow.tag}</h2><span className="pill warning">Watch</span></div>
              <p>{cow.color} • {cow.location}</p>
              <small>{cow.notes || "No notes recorded"}</small>
            </Link>
          ))}
          {watchCows.length === 0 && <article className="list-card"><h2>Nothing on watch</h2><p>No cows are marked Watch right now.</p></article>}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Pasture summary</h2><Link href="/pastures">Manage</Link></div>
        <div className="stack">
          {pastureGroups.map((group) => (
            <article className="list-card" key={group.pasture}>
              <div className="row-between"><h2>{group.pasture}</h2><span className="pill">{group.cows.length} cows • {group.bulls.length} bulls</span></div>
              <p>{group.cows.slice(0, 8).map((cow) => `Cow ${cow.tag}`).join(", ") || "No cows"}{group.cows.length > 8 ? "..." : ""}</p>
            </article>
          ))}
          {pastureGroups.length === 0 && <article className="list-card"><h2>No pasture assignments yet</h2><p>Assign cows or bulls to locations to build this summary.</p></article>}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Recent herd notes</h2><Link href="/activity">All activity</Link></div>
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
