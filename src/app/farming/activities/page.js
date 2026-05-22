"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { loadFieldActivities } from "../../components/farmStore";

function formatMoney(value) {
  if (!value) return null;
  return `$${Number(value).toLocaleString()}`;
}

export default function FarmingActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadFieldActivities().then(setActivities).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const filteredActivities = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return activities;
    return activities.filter((activity) =>
      [activity.fieldName, activity.type, activity.activityDate, activity.crop, activity.product, activity.rate, activity.notes]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value))
    );
  }, [activities, query]);

  const totalCost = activities.reduce((sum, activity) => sum + (Number(activity.cost) || 0), 0);

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming" className="back-link">← Farming</Link>
        <div className="row-between">
          <h1>Activities</h1>
          <Link href="/farming/activities/new" className="button compact">Add</Link>
        </div>
        <p className="muted">Fast field logs for seeding, fertilizer, spraying, harvest, and field notes.</p>
      </header>

      <section className="stats-grid" aria-label="Field activity summary">
        <div className="stat-card"><strong>{activities.length}</strong><span>Activities</span></div>
        <div className="stat-card"><strong>{new Set(activities.map((item) => item.fieldName)).size}</strong><span>Fields</span></div>
        <div className="stat-card"><strong>{formatMoney(totalCost) || "$0"}</strong><span>Costs</span></div>
      </section>

      <section className="search-card">
        <label htmlFor="activity-search">Find field activity</label>
        <input id="activity-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by field, crop, product, or date..." />
      </section>

      <section className="stack">
        {filteredActivities.map((activity) => (
          <Link className="list-card link-card" href={`/farming/activities/${activity.id}`} key={activity.id}>
            <p className="eyebrow">{activity.type} • {activity.activityDate}</p>
            <div className="row-between">
              <h2>{activity.fieldName}</h2>
              {activity.cost ? <span className="pill">{formatMoney(activity.cost)}</span> : null}
            </div>
            <p>{activity.crop}{activity.product ? ` • ${activity.product}` : ""}{activity.rate ? ` • ${activity.rate}` : ""}</p>
            <small>{activity.notes}</small>
          </Link>
        ))}
        {filteredActivities.length === 0 && (
          <article className="list-card">
            <h2>No field activities yet</h2>
            <p>Add the first seeding, fertilizer, spraying, harvest, or field note.</p>
            <Link href="/farming/activities/new" className="button full">Add activity</Link>
          </article>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
