"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadBulls } from "../components/farmStore";

export default function BullsPage() {
  const [bulls, setBulls] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadBulls().then(setBulls).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const filteredBulls = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return bulls;
    return bulls.filter((bull) =>
      [bull.tag, bull.name, bull.breed, bull.location, bull.status]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value))
    );
  }, [bulls, query]);

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <div className="row-between">
          <h1>Bull List</h1>
          <Link href="/bulls/new" className="button compact">Add</Link>
        </div>
        <p className="muted">Track herd bulls by tag, breed, location, and purchase/sale info.</p>
      </header>

      <section className="search-card">
        <label htmlFor="bull-search">Search bull tag or name</label>
        <input id="bull-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: B12" />
      </section>

      <section className="stack">
        {filteredBulls.map((bull) => (
          <Link className="list-card link-card" href={`/bulls/${bull.id}`} key={bull.id}>
            <div className="row-between">
              <h2>Bull {bull.tag}</h2>
              <span className={`pill ${bull.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(bull.status) ? "danger" : ""}`}>{bull.status}</span>
            </div>
            <p>{bull.name} • {bull.breed}</p>
            <small>{bull.location}</small>
          </Link>
        ))}
        {filteredBulls.length === 0 && <article className="list-card"><h2>No bulls found</h2><p>Add a bull to start tracking the herd sires.</p></article>}
      </section>
    </main>
  );
}
