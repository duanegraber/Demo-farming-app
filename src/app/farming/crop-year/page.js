"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { loadCropSales, loadFieldActivities, loadFields, parseFarmNumber } from "../../components/farmStore";

const cropYears = [2026, 2027, 2028, 2029, 2030];

function formatMoney(value) {
  const amount = parseFarmNumber(value);
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatNumber(value) {
  const amount = parseFarmNumber(value);
  return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function CropYearPage() {
  const [fields, setFields] = useState([]);
  const [activities, setActivities] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      Promise.all([loadFields(), loadFieldActivities(), loadCropSales()])
        .then(([fieldRows, activityRows, saleRows]) => {
          setFields(fieldRows);
          setActivities(activityRows);
          setSales(saleRows);
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const filteredActivities = useMemo(() => activities.filter((activity) => Number(activity.cropYear) === Number(selectedYear)), [activities, selectedYear]);
  const filteredSales = useMemo(() => sales.filter((sale) => Number(sale.cropYear) === Number(selectedYear)), [sales, selectedYear]);

  const cropOptions = useMemo(() => [...new Set(fields.map((field) => field.currentCrop).concat(filteredActivities.map((activity) => activity.crop)).concat(filteredSales.map((sale) => sale.crop)).filter(Boolean).filter((crop) => crop !== "Not set"))].sort(), [fields, filteredActivities, filteredSales]);
  const [selectedCrop, setSelectedCrop] = useState("All crops");

  const summaries = useMemo(() => fields.map((field) => {
    const fieldActivities = filteredActivities.filter((activity) => activity.fieldId === field.id || activity.fieldName === field.name);
    const fieldSales = filteredSales.filter((sale) => sale.fieldId === field.id || sale.fieldName === field.name);
    const cropForFilter = fieldActivities[0]?.crop || fieldSales[0]?.crop || field.currentCrop;
    if (selectedCrop !== "All crops" && cropForFilter !== selectedCrop) return null;
    const seeded = fieldActivities.find((activity) => activity.type === "Seeding");
    const harvests = fieldActivities.filter((activity) => activity.type === "Harvest");
    const activityCost = fieldActivities.reduce((sum, activity) => sum + parseFarmNumber(activity.cost), 0);
    const revenue = fieldSales.reduce((sum, sale) => sum + parseFarmNumber(sale.netRevenue), 0);
    const soldAmount = fieldSales.reduce((sum, sale) => sum + parseFarmNumber(sale.amount), 0);
    const acres = parseFarmNumber(field.acres);
    const rentCost = field.ownership === "Rented" ? acres * parseFarmNumber(field.rentCostPerAcre) : 0;
    const cost = activityCost + rentCost;
    const yieldAmount = harvests.reduce((sum, activity) => sum + parseFarmNumber(activity.yieldAmount), 0);
    const yieldUnit = harvests.find((activity) => activity.yieldUnit)?.yieldUnit || fieldSales.find((sale) => sale.unit)?.unit || "bushels";
    const profit = revenue - cost;
    return {
      field,
      activities: fieldActivities,
      sales: fieldSales,
      seededDate: seeded?.activityDate || "Not seeded",
      cost,
      rentCost,
      revenue,
      profit,
      soldAmount,
      costPerAcre: acres > 0 ? cost / acres : 0,
      revenuePerAcre: acres > 0 ? revenue / acres : 0,
      profitPerAcre: acres > 0 ? profit / acres : 0,
      yieldAmount,
      yieldUnit,
      yieldPerAcre: acres > 0 ? yieldAmount / acres : 0,
      unsoldAmount: Math.max(yieldAmount - soldAmount, 0),
    };
  }).filter(Boolean), [fields, filteredActivities, filteredSales, selectedCrop]);

  const totalAcres = summaries.reduce((sum, summary) => sum + parseFarmNumber(summary.field.acres), 0);
  const totalCost = summaries.reduce((sum, summary) => sum + summary.cost, 0);
  const totalRevenue = summaries.reduce((sum, summary) => sum + summary.revenue, 0);
  const totalProfit = totalRevenue - totalCost;
  const totalYield = summaries.reduce((sum, summary) => sum + summary.yieldAmount, 0);
  const primaryYieldUnit = summaries.find((summary) => summary.yieldAmount > 0)?.yieldUnit || "bushels";

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming" className="back-link">← Farming</Link>
        <h1>Crop Year</h1>
        <p className="muted">A season view that separates field records by year and crop.</p>
      </header>

      <section className="search-card">
        <label>Crop year<select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>{cropYears.map((year) => <option key={year}>{year}</option>)}</select></label>
        <label>Crop filter<select value={selectedCrop} onChange={(event) => setSelectedCrop(event.target.value)}><option>All crops</option>{cropOptions.map((crop) => <option key={crop}>{crop}</option>)}</select></label>
      </section>

      <section className="stats-grid crop-year-stats" aria-label="Crop year summary">
        <div className="stat-card"><strong>{summaries.length}</strong><span>Fields</span></div>
        <div className="stat-card"><strong>{totalAcres.toLocaleString()}</strong><span>Acres</span></div>
        <div className="stat-card"><strong>{formatMoney(totalCost)}</strong><span>Costs</span></div>
        <div className="stat-card"><strong>{formatMoney(totalRevenue)}</strong><span>Revenue</span></div>
        <div className="stat-card"><strong>{formatMoney(totalProfit)}</strong><span>Profit</span></div>
        <div className="stat-card"><strong>{formatNumber(totalYield)}</strong><span>{primaryYieldUnit}</span></div>
      </section>

      <section className="hero-card farming-hero">
        <p className="eyebrow">{selectedYear} season</p>
        <h2>Field profitability.</h2>
        <p className="muted">Costs, harvest yields, and crop sales are filtered to the selected crop year.</p>
        <Link className="button full" href="/farming/report">Open crop report</Link>
      </section>

      <section>
        <div className="section-heading"><h2>Fields this year</h2></div>
        <div className="stack">
          {summaries.map((summary) => (
            <Link className="list-card link-card" href={`/farming/fields/${summary.field.id}`} key={summary.field.id}>
              <div className="row-between">
                <h2>{summary.field.name}</h2>
                <span className={`pill ${summary.profit < 0 ? "danger" : ""}`}>{formatMoney(summary.profit)}</span>
              </div>
              <p>{summary.field.currentCrop} • {summary.field.acres || "Unknown"} acres • {summary.sales.length} sales</p>
              <small>Revenue/ac: {formatMoney(summary.revenuePerAcre)} • Profit/ac: {formatMoney(summary.profitPerAcre)}</small>
              {summary.rentCost > 0 && <small>Includes rent: {formatMoney(summary.rentCost)} total • {formatMoney(summary.rentCost / (parseFarmNumber(summary.field.acres) || 1))}/ac</small>}
              <small>Yield/ac: {formatNumber(summary.yieldPerAcre)} {summary.yieldUnit}/ac • Unsold: {formatNumber(summary.unsoldAmount)} {summary.yieldUnit}</small>
            </Link>
          ))}
          {summaries.length === 0 && <article className="list-card"><h2>No records for {selectedYear}</h2><p>Add activities or sales for this crop year, or switch years above.</p></article>}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
