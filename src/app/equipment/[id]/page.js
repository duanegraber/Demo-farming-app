"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { formatFarmNumber, loadEquipment, loadEquipmentLogs, parseFarmNumber } from "../../components/farmStore";

function money(value) {
  return `$${formatFarmNumber(value, { maximumFractionDigits: 0 })}`;
}

export default function EquipmentDetailPage() {
  const params = useParams();
  const [equipment, setEquipment] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadEquipment().then(setEquipment).catch(console.error);
      loadEquipmentLogs().then(setLogs).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const item = equipment.find((entry) => entry.id === params.id);
  const itemLogs = useMemo(() => {
    if (!item) return [];
    return logs.filter((log) => log.equipmentId === item.id || log.equipmentName === item.name);
  }, [item, logs]);

  const currentYear = new Date().getFullYear();
  const yearLogs = itemLogs.filter((log) => Number(log.logYear) === currentYear);
  const totalCost = yearLogs.reduce((sum, log) => sum + parseFarmNumber(log.cost), 0);
  const allTimeCost = itemLogs.reduce((sum, log) => sum + parseFarmNumber(log.cost), 0);

  if (!item) {
    return <main className="app-shell"><Link href="/equipment" className="back-link">← Equipment</Link><h1>Loading equipment...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/equipment" className="back-link">← Equipment</Link>
        <div className="row-between"><h1>{item.name}</h1><span className="pill">{item.status}</span></div>
        <p className="muted">{item.type}{item.currentMeter ? ` • ${formatFarmNumber(item.currentMeter)} ${item.meterUnit}` : ""}</p>
      </header>

      <section className="stats-grid" aria-label="Equipment costs">
        <div className="stat-card"><strong>{money(totalCost)}</strong><span>{currentYear} cost</span></div>
        <div className="stat-card"><strong>{itemLogs.length}</strong><span>Logs</span></div>
        <div className="stat-card"><strong>{money(allTimeCost)}</strong><span>All cost</span></div>
      </section>

      <section className="detail-grid">
        <div><span>Type</span><strong>{item.type}</strong></div>
        <div><span>Status</span><strong>{item.status}</strong></div>
        <div><span>Serial/VIN/unit</span><strong>{item.identifier || "Not recorded"}</strong></div>
        <div><span>Meter</span><strong>{item.currentMeter ? `${formatFarmNumber(item.currentMeter)} ${item.meterUnit}` : "Not recorded"}</strong></div>
        <div><span>Notes</span><strong>{item.notes}</strong></div>
      </section>

      <section>
        <div className="section-heading"><h2>Quick update</h2></div>
        <div className="action-grid two">
          <Link className="action-card" href={`/equipment/${item.id}/edit`}><span>✏️</span><strong>Edit equipment</strong></Link>
          <Link className="action-card" href={`/equipment/logs/new?equipmentId=${item.id}`}><span>🧾</span><strong>Add cost log</strong></Link>
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Recent logs</h2><Link href="/equipment/logs/new">Add log</Link></div>
        <div className="stack">
          {itemLogs.map((log) => (
            <Link className="list-card link-card" href={`/equipment/logs/${log.id}/edit`} key={log.id}>
              <p className="eyebrow">{log.type} • {log.logDate}</p>
              <div className="row-between"><h3>{log.description}</h3>{log.cost ? <span className="pill">{money(log.cost)}</span> : null}</div>
              <p>{log.vendor || "No vendor"}{log.meterReading ? ` • ${formatFarmNumber(log.meterReading)} ${item.meterUnit}` : ""}</p>
              <small>{log.notes} • Tap to edit</small>
            </Link>
          ))}
          {itemLogs.length === 0 && <article className="list-card"><h3>No logs yet</h3><p>Add fuel, maintenance, or repair costs for {item.name}.</p></article>}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
