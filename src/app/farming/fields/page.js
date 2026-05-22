"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { formatFarmNumber, loadFields, parseFarmNumber } from "../../components/farmStore";

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadFields().then(setFields).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const filteredFields = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return fields;
    return fields.filter((field) =>
      [field.name, field.currentCrop, field.ownership, field.legalLocation, field.notes]
        .filter(Boolean)
        .some((fieldValue) => String(fieldValue).toLowerCase().includes(value))
    );
  }, [fields, query]);

  const totalAcres = fields.reduce((sum, field) => sum + parseFarmNumber(field.acres), 0);
  const cropCount = new Set(fields.map((field) => field.currentCrop).filter((crop) => crop && crop !== "Not set")).size;

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming" className="back-link">← Farming</Link>
        <div className="row-between">
          <h1>Fields</h1>
          <Link href="/farming/fields/new" className="button compact">Add</Link>
        </div>
        <p className="muted">Every field Demo Farm Manager tracks, rents, or does custom work on.</p>
      </header>

      <section className="stats-grid" aria-label="Field summary">
        <div className="stat-card"><strong>{fields.length}</strong><span>Fields</span></div>
        <div className="stat-card"><strong>{formatFarmNumber(totalAcres)}</strong><span>Acres</span></div>
        <div className="stat-card"><strong>{cropCount}</strong><span>Crops</span></div>
      </section>

      <section className="search-card">
        <label htmlFor="field-search">Search fields</label>
        <input id="field-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Field, crop, legal location..." />
      </section>

      <section className="stack">
        {filteredFields.map((field) => (
          <Link className="list-card link-card" href={`/farming/fields/${field.id}`} key={field.id}>
            <div className="row-between">
              <h2>{field.name}</h2>
              <span className="pill">{field.ownership}</span>
            </div>
            <p>{field.currentCrop} • {field.acres || "Unknown"} acres</p>
            <small>{field.legalLocation}</small>
          </Link>
        ))}
        {filteredFields.length === 0 && (
          <article className="list-card">
            <h2>No fields yet</h2>
            <p>Add the first field to start building crop records.</p>
            <Link href="/farming/fields/new" className="button full">Add field</Link>
          </article>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
