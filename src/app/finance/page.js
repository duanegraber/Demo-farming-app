"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BottomNav from "../components/BottomNav";
import { createFinanceEntry, loadFinanceEntries, parseFarmNumber } from "../components/farmStore";

const departments = [
  { key: "farming", label: "Farming", icon: "🌾", detail: "Seed, fertilizer, chemical, rent, crop sales, and custom income." },
  { key: "livestock", label: "Livestock", icon: "🐄", detail: "Feed, vet, breeding, purchases, calf sales, culls, and herd income." },
  { key: "equipment", label: "Equipment", icon: "🚜", detail: "Fuel, repairs, maintenance, lease payments, and custom work income." },
];

const categoryOptions = {
  farming: ["Seed", "Fertilizer", "Chemical", "Rent", "Fuel", "Crop sale", "Custom work", "Other"],
  livestock: ["Feed", "Vet", "Breeding", "Purchase", "Calf sale", "Cull sale", "Other"],
  equipment: ["Fuel", "Repair", "Maintenance", "Lease", "Parts", "Custom work", "Other"],
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function money(value) {
  return `$${parseFarmNumber(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function summarize(entries, department) {
  const rows = entries.filter((entry) => entry.department === department);
  const revenue = rows.filter((entry) => entry.type === "Revenue").reduce((sum, entry) => sum + parseFarmNumber(entry.amount), 0);
  const costs = rows.filter((entry) => entry.type === "Cost").reduce((sum, entry) => sum + parseFarmNumber(entry.amount), 0);
  return { rows, revenue, costs, profit: revenue - costs };
}

function FinanceContent() {
  const searchParams = useSearchParams();
  const initialDepartment = searchParams.get("department") || "farming";
  const initialType = searchParams.get("type") || "Cost";
  const [entries, setEntries] = useState([]);
  const [department, setDepartment] = useState(departments.some((item) => item.key === initialDepartment) ? initialDepartment : "farming");
  const [form, setForm] = useState({ department, type: initialType === "Revenue" ? "Revenue" : "Cost", category: "", date: today(), description: "", amount: "", notes: "" });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadFinanceEntries().then(setEntries).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  function selectDepartment(value) {
    setDepartment(value);
    setForm((current) => ({ ...current, department: value, category: "" }));
  }

  const departmentSummary = useMemo(() => summarize(entries, department), [entries, department]);
  const selectedDepartment = departments.find((item) => item.key === department);
  const options = categoryOptions[department] || categoryOptions.farming;

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.amount || !form.description.trim()) return;
    const entry = await createFinanceEntry({ ...form, department });
    setEntries((current) => [entry, ...current]);
    setForm((current) => ({ ...current, category: "", description: "", amount: "", notes: "" }));
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Financials</h1>
        <p className="muted">Separate cost and profit tracking for Farming, Livestock, and Equipment — simple enough for a prospect to try during the demo.</p>
      </header>

      <section className="stats-grid finance-stats" aria-label={`${selectedDepartment.label} financial summary`}>
        <div className="stat-card"><strong>{money(departmentSummary.revenue)}</strong><span>{selectedDepartment.label} revenue</span></div>
        <div className="stat-card"><strong>{money(departmentSummary.costs)}</strong><span>{selectedDepartment.label} costs</span></div>
        <div className="stat-card"><strong>{money(departmentSummary.profit)}</strong><span>{selectedDepartment.label} profit</span></div>
      </section>

      <section className="action-grid two finance-departments" aria-label="Financial departments">
        {departments.map((item) => {
          const summary = summarize(entries, item.key);
          return (
            <button type="button" className={`action-card detailed-action ${department === item.key ? "active" : ""}`} key={item.key} onClick={() => selectDepartment(item.key)}>
              <span>{item.icon}</span>
              <strong>{item.label}</strong>
              <small>{money(summary.profit)} profit • {money(summary.costs)} costs</small>
            </button>
          );
        })}
      </section>

      <section className="hero-card farming-hero">
        <p className="eyebrow">{selectedDepartment.label} financials</p>
        <h2>{money(departmentSummary.profit)} profit</h2>
        <p className="muted">{money(departmentSummary.revenue)} revenue minus {money(departmentSummary.costs)} costs. {selectedDepartment.detail}</p>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Add {selectedDepartment.label.toLowerCase()} financial item</p>
        <label>Type<select value={form.type} onChange={(event) => updateForm("type", event.target.value)}><option>Cost</option><option>Revenue</option></select></label>
        <label>Category<select value={form.category} onChange={(event) => updateForm("category", event.target.value)}><option value="">Choose category</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label>Description<input required value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Example: Seed for North 80" /></label>
        <label>Amount<input required type="number" min="0" step="0.01" value={form.amount} onChange={(event) => updateForm("amount", event.target.value)} placeholder="Example: 1250" inputMode="decimal" /></label>
        <label>Date<input type="date" value={form.date} onChange={(event) => updateForm("date", event.target.value)} /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} placeholder="Optional notes for the demo record" /></label>
        <button type="submit" className="button full">Save {form.type.toLowerCase()}</button>
      </form>

      <section>
        <div className="section-heading"><h2>{selectedDepartment.label} entries</h2></div>
        <div className="stack">
          {departmentSummary.rows.map((entry) => (
            <article className="list-card" key={entry.id}>
              <div className="row-between"><h2>{entry.description}</h2><span className={`pill ${entry.type === "Cost" ? "danger" : ""}`}>{entry.type === "Cost" ? "-" : "+"}{money(entry.amount)}</span></div>
              <p>{entry.category} • {entry.date}</p>
              {entry.notes ? <small>{entry.notes}</small> : null}
            </article>
          ))}
          {departmentSummary.rows.length === 0 && (
            <article className="list-card">
              <h2>No financial entries yet</h2>
              <p>Add a cost or revenue item above to show profit for {selectedDepartment.label.toLowerCase()}.</p>
            </article>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<main className="app-shell"><p>Loading...</p></main>}>
      <FinanceContent />
    </Suspense>
  );
}
