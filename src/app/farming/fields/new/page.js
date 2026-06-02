"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createField } from "../../../components/farmStore";

function parseBulkFieldLine(line) {
  const [name = "", acres = "", ownership = "Owned", currentCrop = "", legalLocation = "", notes = ""] = line
    .split(",")
    .map((part) => part.trim());

  return {
    name,
    acres,
    ownership: ownership || "Owned",
    rentCostPerAcre: "",
    currentCrop,
    legalLocation,
    notes,
    user: "Demo visitor",
  };
}

export default function AddFieldPage() {
  const router = useRouter();
  const [mode, setMode] = useState("single");
  const [form, setForm] = useState({ name: "", acres: "", ownership: "Owned", rentCostPerAcre: "", currentCrop: "", legalLocation: "", notes: "", user: "Demo visitor" });
  const [bulkText, setBulkText] = useState("");
  const [bulkError, setBulkError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    const field = await createField(form);
    router.push(`/farming/fields/${field.id}`);
  }

  async function handleBulkSubmit(event) {
    event.preventDefault();
    setBulkError("");

    const fields = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseBulkFieldLine)
      .filter((field) => field.name);

    if (fields.length === 0) {
      setBulkError("Add at least one field name before saving.");
      return;
    }

    for (const field of fields) {
      await createField(field);
    }

    router.push("/farming/fields");
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming/fields" className="back-link">← Field list</Link>
        <h1>Add your field</h1>
        <p className="muted">Try the demo with a field from your own farm. Only the field name is required, and the record stays local to this browser.</p>
      </header>

      <section className="action-grid two">
        <button type="button" className={`action-card detailed-action ${mode === "single" ? "active" : ""}`} onClick={() => setMode("single")}>
          <span>➕</span>
          <strong>Add one field</strong>
          <small>Best for trying the demo</small>
        </button>
        <button type="button" className={`action-card detailed-action ${mode === "bulk" ? "active" : ""}`} onClick={() => setMode("bulk")}>
          <span>📋</span>
          <strong>Paste a list</strong>
          <small>Quick setup for several fields</small>
        </button>
      </section>

      {mode === "single" ? (
        <form className="form-card" onSubmit={handleSubmit}>
          <label>Field name<input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Example: North 80" /></label>
          <label>Acres<input type="number" min="0" step="0.01" value={form.acres} onChange={(event) => updateField("acres", event.target.value)} placeholder="Example: 80" inputMode="decimal" /></label>
          <label>Ownership<select value={form.ownership} onChange={(event) => updateField("ownership", event.target.value)}><option>Owned</option><option>Rented</option><option>Custom</option><option>Other</option></select></label>
          {form.ownership === "Rented" && <label>Rent cost per acre<input type="number" min="0" step="0.01" value={form.rentCostPerAcre} onChange={(event) => updateField("rentCostPerAcre", event.target.value)} placeholder="Example: 75" inputMode="decimal" /></label>}
          <label>Current crop<input value={form.currentCrop} onChange={(event) => updateField("currentCrop", event.target.value)} placeholder="Wheat, barley, canola..." /></label>
          <label>Legal location / directions<input value={form.legalLocation} onChange={(event) => updateField("legalLocation", event.target.value)} placeholder="Quarter, road, or directions" /></label>
          <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Drainage, rocks, rental notes, access, history, etc." /></label>
          <button type="submit" className="button full">Save and view field</button>
        </form>
      ) : (
        <form className="form-card" onSubmit={handleBulkSubmit}>
          <label>
            Field list
            <textarea
              value={bulkText}
              onChange={(event) => setBulkText(event.target.value)}
              placeholder={"One field per line:\nNorth 80, 80, Owned, Wheat, NW-12, Irrigated\nRiver Bottom, 145, Rented, Canola, SE-8, Heavy soil"}
              rows={9}
            />
          </label>
          <p className="muted">Format: name, acres, ownership, crop, legal location, notes. Only the field name is required.</p>
          {bulkError && <p className="error-text">{bulkError}</p>}
          <button type="submit" className="button full">Save fields</button>
        </form>
      )}
    </main>
  );
}
