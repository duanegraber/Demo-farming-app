"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";
import { formatFarmNumber, loadEquipment, loadEquipmentLogs, parseFarmNumber } from "../components/farmStore";

const years = [2026, 2027, 2028, 2029, 2030];

function money(value) {
  return `$${formatFarmNumber(value, { maximumFractionDigits: 0 })}`;
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      Promise.all([loadEquipment(), loadEquipmentLogs()])
        .then(([equipmentRows, logRows]) => {
          setEquipment(equipmentRows);
          setLogs(logRows);
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const yearLogs = useMemo(() => logs.filter((log) => Number(log.logYear) === Number(selectedYear)), [logs, selectedYear]);
  const totalCost = yearLogs.reduce((sum, log) => sum + parseFarmNumber(log.cost), 0);
  const fuelCost = yearLogs.filter((log) => log.type === "Fuel").reduce((sum, log) => sum + parseFarmNumber(log.cost), 0);
  const repairCost = yearLogs.filter((log) => log.type === "Repair").reduce((sum, log) => sum + parseFarmNumber(log.cost), 0);

  const filteredEquipment = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return equipment;
    return equipment.filter((item) => [item.name, item.type, item.status, item.identifier, item.notes].filter(Boolean).some((field) => String(field).toLowerCase().includes(value)));
  }, [equipment, query]);

  const costsByEquipment = useMemo(() => yearLogs.reduce((groups, log) => {
    const key = log.equipmentId || log.equipmentName;
    groups[key] = (groups[key] || 0) + parseFarmNumber(log.cost);
    return groups;
  }, {}), [yearLogs]);

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <div className="row-between">
          <h1>Equipment</h1>
          <Link href="/equipment/new" className="button compact">Add</Link>
        </div>
        <p className="muted">Track machines, repairs, maintenance, fuel, and yearly equipment cost.</p>
      </header>

      <section className="search-card">
        <label>Cost year<select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>{years.map((year) => <option key={year}>{year}</option>)}</select></label>
      </section>

      <section className="stats-grid" aria-label="Equipment cost summary">
        <div className="stat-card"><strong>{equipment.length}</strong><span>Units</span></div>
        <div className="stat-card"><strong>{money(totalCost)}</strong><span>{selectedYear} cost</span></div>
        <div className="stat-card"><strong>{money(fuelCost)}</strong><span>Fuel</span></div>
        <div className="stat-card"><strong>{money(repairCost)}</strong><span>Repairs</span></div>
        <div className="stat-card"><strong>{yearLogs.length}</strong><span>Logs</span></div>
      </section>

      <section className="action-grid two">
        <Link className="action-card detailed-action" href="/equipment/new"><span>➕</span><strong>Add equipment</strong><small>Set up a tractor, truck, combine, or tool</small></Link>
        <Link className="action-card detailed-action" href="/equipment/logs/new"><span>🧾</span><strong>Add log</strong><small>Fuel, maintenance, or repair cost</small></Link>
      </section>

      <section className="search-card">
        <label htmlFor="equipment-search">Find equipment</label>
        <input id="equipment-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by unit, type, serial, or notes..." />
      </section>

      <section className="stack">
        {filteredEquipment.map((item) => {
          const yearCost = costsByEquipment[item.id] || costsByEquipment[item.name] || 0;
          return (
            <Link className="list-card link-card" href={`/equipment/${item.id}`} key={item.id}>
              <div className="row-between"><h2>{item.name}</h2><span className="pill">{money(yearCost)}</span></div>
              <p>{item.type} • {item.status}{item.currentMeter ? ` • ${formatFarmNumber(item.currentMeter)} ${item.meterUnit}` : ""}</p>
              <small>{item.identifier || "No serial/VIN recorded"}</small>
            </Link>
          );
        })}
        {filteredEquipment.length === 0 && (
          <article className="list-card">
            <h2>No equipment yet</h2>
            <p>Add the first machine so fuel, repairs, and maintenance costs have somewhere to land.</p>
            <Link href="/equipment/new" className="button full">Add equipment</Link>
          </article>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
