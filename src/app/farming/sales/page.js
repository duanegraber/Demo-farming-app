"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { loadCropSales } from "../../components/farmStore";

function formatMoney(value) {
  return `$${(Number(value) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function CropSalesPage() {
  const [sales, setSales] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadCropSales().then(setSales).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const filteredSales = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return sales;
    return sales.filter((sale) => [sale.fieldName, sale.crop, sale.saleDate, sale.buyer, sale.notes].filter(Boolean).some((field) => String(field).toLowerCase().includes(value)));
  }, [sales, query]);

  const netRevenue = sales.reduce((sum, sale) => sum + (Number(sale.netRevenue) || 0), 0);
  const amountSold = sales.reduce((sum, sale) => sum + (Number(sale.amount) || 0), 0);

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming" className="back-link">← Farming</Link>
        <div className="row-between">
          <h1>Crop Sales</h1>
          <Link href="/farming/sales/new" className="button compact">Add</Link>
        </div>
        <p className="muted">Track grain/crop sales so Crop Year can calculate revenue and profit.</p>
      </header>

      <section className="stats-grid" aria-label="Crop sales summary">
        <div className="stat-card"><strong>{sales.length}</strong><span>Sales</span></div>
        <div className="stat-card"><strong>{amountSold.toLocaleString()}</strong><span>Units sold</span></div>
        <div className="stat-card"><strong>{formatMoney(netRevenue)}</strong><span>Net revenue</span></div>
      </section>

      <section className="search-card">
        <label htmlFor="sale-search">Find crop sale</label>
        <input id="sale-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by field, crop, buyer, date..." />
      </section>

      <section className="stack">
        {filteredSales.map((sale) => (
          <Link className="list-card link-card" href={`/farming/sales/${sale.id}`} key={sale.id}>
            <p className="eyebrow">{sale.saleDate} • {sale.crop}</p>
            <div className="row-between">
              <h2>{sale.fieldName}</h2>
              <span className="pill">{formatMoney(sale.netRevenue)}</span>
            </div>
            <p>{Number(sale.amount || 0).toLocaleString()} {sale.unit} • {sale.pricePerUnit ? `$${Number(sale.pricePerUnit).toLocaleString()}/${sale.unit}` : "No price"}</p>
            <small>{sale.buyer || "Buyer not recorded"}</small>
          </Link>
        ))}
        {filteredSales.length === 0 && (
          <article className="list-card">
            <h2>No crop sales yet</h2>
            <p>Add the first sale to start tracking revenue and profit.</p>
            <Link href="/farming/sales/new" className="button full">Add sale</Link>
          </article>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
