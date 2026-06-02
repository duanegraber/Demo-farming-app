"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";
import { formatFarmNumber, loadCropSales, loadFieldActivities, loadFields, parseFarmNumber } from "../components/farmStore";

const modules = [
  { title: "Fields", href: "/farming/fields", detail: "Create one record per field with acres, crop, ownership, and notes.", icon: "🗺️" },
  { title: "Crop year", href: "/farming/crop-year", detail: "See the season by field: seeded date, inputs, harvest, yield, and results.", icon: "📅" },
  { title: "Activities", href: "/farming/activities", detail: "Log seeding, fertilizer, spraying, tillage, irrigation, harvest, or a quick note.", icon: "🚜" },
  { title: "Crop Sales", href: "/farming/sales", detail: "Track sold crop, buyers, prices, deductions, revenue, and profit.", icon: "💵" },
  { title: "Profit per acre", href: "/farming/crop-year", detail: "Costs, yields, and sales combine into field profitability.", icon: "📈" },
  { title: "Farming Financials", href: "/finance?department=farming", detail: "Add farm costs and revenue to show department profit quickly.", icon: "💰" },
  { title: "Crop Report", href: "/farming/report", detail: "Clean season summary by crop and field, with copy/share text.", icon: "📋" },
];

export default function FarmingPage() {
  const [fields, setFields] = useState([]);
  const [activity, setActivity] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      Promise.all([loadFields(), loadFieldActivities(), loadCropSales()])
        .then(([fieldRows, activityRows, saleRows]) => {
          setFields(fieldRows);
          setActivity(activityRows);
          setSales(saleRows);
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const totalAcres = fields.reduce((sum, field) => sum + parseFarmNumber(field.acres), 0);
  const cropCount = new Set(fields.map((field) => field.currentCrop).filter((crop) => crop && crop !== "Not set")).size;
  const fieldActivityCount = useMemo(() => {
    if (fields.length === 0) return 0;
    return activity.filter((item) => fields.some((field) => item.fieldId === field.id || item.fieldName === field.name)).length;
  }, [activity, fields]);

  const farmingStats = [
    { value: fields.length.toString(), label: "Fields added" },
    { value: formatFarmNumber(totalAcres), label: "Total acres" },
    { value: cropCount.toString(), label: "Crops" },
    { value: fieldActivityCount.toString(), label: "Field notes" },
    { value: sales.length.toString(), label: "Crop sales" },
  ];

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Farming</h1>
        <p className="muted">The crop side of Demo Farm Manager: fields, crop years, input passes, harvest notes, and simple profitability later.</p>
      </header>

      <section className="stats-grid farming-stats" aria-label="Farming summary">
        {farmingStats.map((stat) => (
          <div className="stat-card" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
        ))}
      </section>

      <section className="hero-card farming-hero">
        <p className="eyebrow">Prospect-friendly demo</p>
        <h2>Start by adding one of your own fields.</h2>
        <p className="muted">A farmer can type a field name, acres, crop, and location, then immediately see how the app starts building useful records around it.</p>
        <Link href="/farming/fields/new" className="button full">Add your field</Link>
      </section>

      <section>
        <div className="section-heading"><h2>Farming tools</h2></div>
        <div className="stack">
          {modules.map((item) => (
            <Link className="list-card farming-feature link-card" href={item.href} key={item.title}>
              <span aria-hidden="true">{item.icon}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="action-grid two farming-actions">
        <Link className="action-card detailed-action" href="/farming/fields/new">
          <span>➕</span>
          <strong>Add your field</strong>
          <small>Try the demo with a real field name</small>
        </Link>
        <Link className="action-card detailed-action" href="/farming/activities/new">
          <span>📝</span>
          <strong>Add activity</strong>
          <small>Log a real field activity</small>
        </Link>
        <Link className="action-card detailed-action" href="/finance?department=farming&type=Cost">
          <span>💰</span>
          <strong>Add cost</strong>
          <small>Show farm profit and expenses</small>
        </Link>
      </section>

      <BottomNav />
    </main>
  );
}
