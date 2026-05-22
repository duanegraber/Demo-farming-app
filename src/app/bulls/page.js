"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadBulls } from "../components/farmStore";

export default function SiresPage() {
  const [sires, setSires] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadBulls().then(setSires).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const filteredSires = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return sires;
    return sires.filter((sire) =>
      [sire.tag, sire.name, sire.breed, sire.location, sire.status]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value))
    );
  }, [sires, query]);

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <div className="row-between">
          <h1>Sire List</h1>
          <Link href="/sires/new" className="button compact">Add</Link>
        </div>
        <p className="muted">Track sires by tag, breed, location, and purchase/sale info.</p>
      </header>

      <section className="search-card">
        <label htmlFor="sire-search">Search sire tag or name</label>
        <input id="sire-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: B12" />
      </section>

      <section className="stack">
        {filteredSires.map((sire) => (
          <Link className="list-card link-card" href={`/sires/${sire.id}`} key={sire.id}>
            <div className="row-between">
              <h2>Sire {sire.tag}</h2>
              <span className={`pill ${sire.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(sire.status) ? "danger" : ""}`}>{sire.status}</span>
            </div>
            <p>{sire.name} • {sire.breed}</p>
            <small>{sire.location}</small>
          </Link>
        ))}
        {filteredSires.length === 0 && <article className="list-card"><h2>No sires found</h2><p>Add a sire to start tracking the sires.</p></article>}
      </section>
    </main>
  );
}
