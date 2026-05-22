"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { loadCropSales, loadFieldActivities, loadFields, parseFarmNumber } from "../../components/farmStore";

const cropYears = [2026, 2027, 2028, 2029, 2030];

function money(value) {
  return `$${parseFarmNumber(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function number(value) {
  return parseFarmNumber(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function summarizeField(field, activities, sales) {
  const fieldActivities = activities.filter((activity) => activity.fieldId === field.id || activity.fieldName === field.name);
  const fieldSales = sales.filter((sale) => sale.fieldId === field.id || sale.fieldName === field.name);
  const harvests = fieldActivities.filter((activity) => activity.type === "Harvest");
  const acres = parseFarmNumber(field.acres);
  const activityCost = fieldActivities.reduce((sum, activity) => sum + parseFarmNumber(activity.cost), 0);
  const rentCost = field.ownership === "Rented" ? acres * parseFarmNumber(field.rentCostPerAcre) : 0;
  const cost = activityCost + rentCost;
  const revenue = fieldSales.reduce((sum, sale) => sum + parseFarmNumber(sale.netRevenue), 0);
  const yieldAmount = harvests.reduce((sum, activity) => sum + parseFarmNumber(activity.yieldAmount), 0);
  const soldAmount = fieldSales.reduce((sum, sale) => sum + parseFarmNumber(sale.amount), 0);
  const yieldUnit = harvests.find((activity) => activity.yieldUnit)?.yieldUnit || fieldSales.find((sale) => sale.unit)?.unit || "bushels";
  const crop = fieldActivities[0]?.crop || fieldSales[0]?.crop || field.currentCrop;
  const profit = revenue - cost;

  return {
    field,
    crop,
    acres,
    logs: fieldActivities.length,
    sales: fieldSales.length,
    cost,
    rentCost,
    revenue,
    profit,
    yieldAmount,
    yieldUnit,
    yieldPerAcre: acres ? yieldAmount / acres : 0,
    soldAmount,
    unsoldAmount: Math.max(yieldAmount - soldAmount, 0),
    revenuePerAcre: acres ? revenue / acres : 0,
    profitPerAcre: acres ? profit / acres : 0,
  };
}

function groupByCrop(summaries) {
  return Object.values(summaries.reduce((groups, summary) => {
    const key = summary.crop || "Unknown";
    groups[key] ||= { crop: key, acres: 0, cost: 0, rentCost: 0, revenue: 0, profit: 0, yieldAmount: 0, yieldUnit: summary.yieldUnit, fields: 0 };
    groups[key].fields += 1;
    groups[key].acres += summary.acres;
    groups[key].cost += summary.cost;
    groups[key].rentCost += summary.rentCost;
    groups[key].revenue += summary.revenue;
    groups[key].profit += summary.profit;
    groups[key].yieldAmount += summary.yieldAmount;
    return groups;
  }, {}));
}

export default function CropYearReportPage() {
  const [fields, setFields] = useState([]);
  const [activities, setActivities] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [copied, setCopied] = useState(false);

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

  const yearActivities = useMemo(() => activities.filter((activity) => Number(activity.cropYear) === Number(selectedYear)), [activities, selectedYear]);
  const yearSales = useMemo(() => sales.filter((sale) => Number(sale.cropYear) === Number(selectedYear)), [sales, selectedYear]);
  const summaries = useMemo(() => fields.map((field) => summarizeField(field, yearActivities, yearSales)).filter((summary) => summary.logs > 0 || summary.sales > 0), [fields, yearActivities, yearSales]);
  const cropSummaries = useMemo(() => groupByCrop(summaries), [summaries]);

  const totals = summaries.reduce((total, summary) => ({
    acres: total.acres + summary.acres,
    cost: total.cost + summary.cost,
    revenue: total.revenue + summary.revenue,
    profit: total.profit + summary.profit,
    yieldAmount: total.yieldAmount + summary.yieldAmount,
    rentCost: total.rentCost + summary.rentCost,
  }), { acres: 0, cost: 0, rentCost: 0, revenue: 0, profit: 0, yieldAmount: 0 });
  const primaryYieldUnit = summaries.find((summary) => summary.yieldAmount > 0)?.yieldUnit || "bushels";
  const reportText = `Demo Farm Manager ${selectedYear} Crop Report\nFields: ${summaries.length}\nAcres: ${number(totals.acres)}\nCosts: ${money(totals.cost)}\nRevenue: ${money(totals.revenue)}\nProfit: ${money(totals.profit)}\nProfit/ac: ${money(totals.acres ? totals.profit / totals.acres : 0)}\nYield: ${number(totals.yieldAmount)} ${primaryYieldUnit}`;

  async function copyReport() {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming" className="back-link">← Farming</Link>
        <h1>Crop Report</h1>
        <p className="muted">A clean season summary for sharing or reviewing at a glance.</p>
      </header>

      <section className="search-card">
        <label>Report year<select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>{cropYears.map((year) => <option key={year}>{year}</option>)}</select></label>
        <button className="button full" type="button" onClick={copyReport}>{copied ? "Copied" : "Copy summary"}</button>
      </section>

      <section className="hero-card farming-hero report-hero">
        <p className="eyebrow">{selectedYear} report</p>
        <h2>{money(totals.profit)} profit</h2>
        <p className="muted">{number(totals.acres)} acres • {money(totals.revenue)} revenue • {money(totals.cost)} costs{totals.rentCost > 0 ? ` incl. ${money(totals.rentCost)} rent` : ""}</p>
      </section>

      <section className="stats-grid crop-year-stats" aria-label="Report totals">
        <div className="stat-card"><strong>{summaries.length}</strong><span>Fields</span></div>
        <div className="stat-card"><strong>{number(totals.acres)}</strong><span>Acres</span></div>
        <div className="stat-card"><strong>{money(totals.acres ? totals.profit / totals.acres : 0)}</strong><span>Profit/ac</span></div>
        <div className="stat-card"><strong>{number(totals.yieldAmount)}</strong><span>{primaryYieldUnit}</span></div>
      </section>

      <section>
        <div className="section-heading"><h2>By crop</h2></div>
        <div className="stack">
          {cropSummaries.map((crop) => (
            <article className="list-card" key={crop.crop}>
              <div className="row-between"><h2>{crop.crop}</h2><span className={`pill ${crop.profit < 0 ? "danger" : ""}`}>{money(crop.profit)}</span></div>
              <p>{crop.fields} fields • {number(crop.acres)} acres • {number(crop.yieldAmount)} {crop.yieldUnit}</p>
              <small>Revenue/ac: {money(crop.acres ? crop.revenue / crop.acres : 0)} • Profit/ac: {money(crop.acres ? crop.profit / crop.acres : 0)}{crop.rentCost > 0 ? ` • Rent: ${money(crop.rentCost)}` : ""}</small>
            </article>
          ))}
          {cropSummaries.length === 0 && <article className="list-card"><h2>No report data yet</h2><p>Add activities or sales for {selectedYear} to build this report.</p></article>}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>By field</h2></div>
        <div className="stack">
          {summaries.map((summary) => (
            <Link className="list-card link-card" href={`/farming/fields/${summary.field.id}`} key={summary.field.id}>
              <div className="row-between"><h2>{summary.field.name}</h2><span className={`pill ${summary.profit < 0 ? "danger" : ""}`}>{money(summary.profit)}</span></div>
              <p>{summary.crop} • {number(summary.acres)} acres • {summary.logs} logs • {summary.sales} sales</p>
              <small>Yield/ac: {number(summary.yieldPerAcre)} {summary.yieldUnit}/ac • Profit/ac: {money(summary.profitPerAcre)}{summary.rentCost > 0 ? ` • Rent: ${money(summary.rentCost)}` : ""}</small>
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
