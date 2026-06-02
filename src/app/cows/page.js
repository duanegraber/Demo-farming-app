"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";
import { loadActivity, loadBulls, loadCalves, loadCows, loadPastures } from "../components/farmStore";

const cattleModules = [
  { title: "Cow records", href: "/cows", icon: "🐄", detail: "Search tags, open profiles, and keep each cow's status current." },
  { title: "Calving", href: "/calves/new", icon: "🐮", detail: "Add calves and connect them to their mother cow right away." },
  { title: "Bulls", href: "/bulls", icon: "🐂", detail: "Manage herd sires by tag, breed, location, and sale/purchase info." },
  { title: "Pastures", href: "/pastures", icon: "🌱", detail: "See where cows and bulls are assigned and add new pasture names." },
  { title: "Herd notes", href: "/activity", icon: "📝", detail: "Review notes, vaccinations, pasture updates, and other cattle events." },
  { title: "Cattle Report", href: "/cows/report", icon: "📋", detail: "Copy a clean herd snapshot with watch list and pasture summaries." },
];

const animalGroups = [
  { type: "cows", title: "Cows", href: "/cows?type=cows", icon: "🐄", detail: "Breeding cows, tag records, calving history, and watch list." },
  { type: "bulls", title: "Bulls", href: "/cows?type=bulls", icon: "🐂", detail: "Herd sires, breeding notes, purchase/sale details, and locations." },
  { type: "calves", title: "Calves", href: "/cows?type=calves", icon: "🐮", detail: "Calf tags, birth dates, mother cow links, and health notes." },
  { type: "pigs", title: "Pigs", href: "/cows?type=pigs", icon: "🐖", detail: "Pig groups, weights, treatments, farrowing, and feed notes." },
  { type: "goats", title: "Goats", href: "/cows?type=goats", icon: "🐐", detail: "Goats, kidding notes, health checks, and breeding groups." },
  { type: "sheep", title: "Sheep", href: "/cows?type=sheep", icon: "🐑", detail: "Ewes, lambs, rams, wool notes, and lambing records." },
  { type: "chickens", title: "Chickens", href: "/cows?type=chickens", icon: "🐓", detail: "Layers, broilers, egg counts, flock health, and coop notes." },
  { type: "milk-cows", title: "Milk cows", href: "/cows?type=milk-cows", icon: "🥛", detail: "Dairy cows, milk production, fresh dates, and treatments." },
];

const demoAnimalRecords = {
  cows: [
    ["101", "Black Angus", "Active", "North Quarter", "Calved Mar 28 • calf 501"],
    ["118", "Red Angus", "Active", "River Bend", "Calved Apr 2 • calf 506"],
    ["124", "Black brockle", "Watch", "Yard Pasture", "Foot soreness treated May 3"],
    ["137", "Red whiteface", "Active", "South Lease", "Early calver • calf 498"],
    ["144", "Black Angus", "Open", "North Quarter", "Open after preg check"],
    ["152", "Charolais cross", "Active", "West Grass", "Quiet cow • bred Apr 19"],
    ["166", "Simmental cross", "Active", "River Bend", "Twin history • watch condition"],
    ["173", "Hereford cross", "Active", "Home Pen", "Good udder • easy to handle"],
    ["181", "Black baldy", "Watch", "Yard Pasture", "Needs mineral follow-up"],
    ["194", "Red Angus", "Active", "South Lease", "Late-cycle breeding group"],
  ],
  bulls: [
    ["B7", "Red Angus", "Active", "North Quarter", "Main mature-cow sire"],
    ["B12", "Black Angus", "Resting", "Yard Pasture", "Backup sire • feet checked"],
    ["B18", "Charolais", "Active", "West Grass", "Terminal sire for cross calves"],
    ["B21", "Hereford", "Active", "River Bend", "Calving-ease group"],
    ["B25", "Simmental", "Watch", "Home Pen", "Shoulder soreness monitored"],
    ["B31", "Red Angus", "Active", "South Lease", "Yearling bull group"],
    ["B34", "Black Angus", "Sold", "Sold", "Sold after breeding season"],
    ["B40", "Gelbvieh", "Active", "North Quarter", "Good temperament"],
    ["B44", "Angus cross", "Resting", "Yard Pasture", "Condition recovery pen"],
    ["B52", "Hereford", "Active", "River Bend", "Easy keeper"],
  ],
  calves: [
    ["501", "Heifer", "Active", "North Quarter", "Cow 101 • born Mar 28"],
    ["506", "Bull", "Active", "River Bend", "Cow 118 • born Apr 2"],
    ["512", "Heifer", "Active", "Yard Pasture", "Cow 124 • born Apr 11"],
    ["498", "Bull", "Active", "South Lease", "Cow 137 • born Mar 21"],
    ["519", "Heifer", "Watch", "Home Pen", "Small calf • nursing check"],
    ["523", "Bull", "Active", "West Grass", "Strong birth weight"],
    ["527", "Heifer", "Active", "River Bend", "Tagged at turnout"],
    ["531", "Bull", "Active", "North Quarter", "Castration due next handling"],
    ["536", "Heifer", "Active", "South Lease", "Replacement candidate"],
    ["540", "Bull", "Sold", "Sold", "Demo sale record"],
  ],
  pigs: [
    ["P-01", "Yorkshire sow", "Active", "Barn Pen 1", "Due to farrow Jun 4"],
    ["P-02", "Duroc sow", "Active", "Barn Pen 1", "Litter weaned May 12"],
    ["P-03", "Hampshire gilt", "Watch", "Barn Pen 2", "Off feed yesterday"],
    ["P-04", "Duroc boar", "Active", "Boar Pen", "Breeding group A"],
    ["P-05", "Feeder pig", "Active", "Grower Pen", "142 lb check weight"],
    ["P-06", "Feeder pig", "Active", "Grower Pen", "138 lb check weight"],
    ["P-07", "Berkshire sow", "Active", "Barn Pen 3", "Good mothering record"],
    ["P-08", "Market hog", "Sold", "Sold", "Shipped May 18"],
    ["P-09", "Gilt", "Active", "Barn Pen 2", "Replacement candidate"],
    ["P-10", "Feeder pig", "Watch", "Sick Pen", "Treated for cough"],
  ],
  goats: [
    ["G-01", "Nubian doe", "Active", "Goat Pen", "Kidded twins Apr 9"],
    ["G-02", "Boer doe", "Active", "South Shelter", "Good body condition"],
    ["G-03", "Alpine doe", "Milking", "Milk Stand", "2.1 L morning milk"],
    ["G-04", "Boer buck", "Active", "Buck Pen", "Breeding group B"],
    ["G-05", "Nubian kid", "Active", "Kid Pen", "Bottle backup twice daily"],
    ["G-06", "Boer kid", "Active", "Kid Pen", "Weaning soon"],
    ["G-07", "Pygmy wether", "Active", "Goat Pen", "Companion animal"],
    ["G-08", "Alpine doe", "Watch", "Sick Pen", "Hoof trim scheduled"],
    ["G-09", "Saanen doe", "Active", "Milk Stand", "Freshened May 1"],
    ["G-10", "Boer doe", "Sold", "Sold", "Sold as breeding doe"],
  ],
  sheep: [
    ["S-01", "Suffolk ewe", "Active", "Ewe Pen", "Lambed Apr 6"],
    ["S-02", "Dorset ewe", "Active", "Ewe Pen", "Twin lambs tagged"],
    ["S-03", "Rambouillet ewe", "Watch", "Barn Pen", "Thin condition score"],
    ["S-04", "Suffolk ram", "Active", "Ram Pen", "Breeding group 1"],
    ["S-05", "Market lamb", "Active", "Lamb Pen", "72 lb check weight"],
    ["S-06", "Market lamb", "Active", "Lamb Pen", "68 lb check weight"],
    ["S-07", "Dorset ewe", "Active", "North Shelter", "Good fleece note"],
    ["S-08", "Katahdin ewe", "Active", "Pasture Lane", "Hair sheep group"],
    ["S-09", "Bottle lamb", "Watch", "Warm Pen", "Bottle 3x daily"],
    ["S-10", "Market lamb", "Sold", "Sold", "Finished group sale"],
  ],
  chickens: [
    ["CH-01", "Layer hen", "Active", "Coop A", "Rhode Island Red"],
    ["CH-02", "Layer hen", "Active", "Coop A", "Daily egg layer"],
    ["CH-03", "Layer hen", "Watch", "Coop A", "Pale comb check"],
    ["CH-04", "Rooster", "Active", "Coop A", "Flock rooster"],
    ["CH-05", "Broiler", "Active", "Brooder", "4-week weight check"],
    ["CH-06", "Broiler", "Active", "Brooder", "Fast grower"],
    ["CH-07", "Leghorn hen", "Active", "Coop B", "White egg layer"],
    ["CH-08", "Pullet", "Active", "Coop B", "Near point-of-lay"],
    ["CH-09", "Silkie hen", "Active", "Small Coop", "Broody note"],
    ["CH-10", "Layer hen", "Sold", "Sold", "Sold as laying hen"],
  ],
  "milk-cows": [
    ["M-01", "Holstein", "Milking", "Dairy Barn", "31 L/day • fresh Apr 3"],
    ["M-02", "Jersey", "Milking", "Dairy Barn", "22 L/day • high butterfat"],
    ["M-03", "Brown Swiss", "Dry", "Dry Cow Pen", "Due Jun 18"],
    ["M-04", "Holstein", "Watch", "Hospital Pen", "Mastitis treatment follow-up"],
    ["M-05", "Jersey cross", "Milking", "Dairy Barn", "18 L/day • calm milker"],
    ["M-06", "Ayrshire", "Milking", "Dairy Barn", "24 L/day"],
    ["M-07", "Holstein", "Fresh", "Fresh Pen", "Freshened May 12"],
    ["M-08", "Guernsey", "Milking", "Dairy Barn", "20 L/day"],
    ["M-09", "Holstein", "Dry", "Dry Cow Pen", "Dry-off May 20"],
    ["M-10", "Jersey", "Sold", "Sold", "Sold as family milk cow"],
  ],
};

const quickActions = [
  { label: "Add Cow", href: "/cows/new", icon: "➕", detail: "Start a new cow record" },
  { label: "Add Calf", href: "/calves/new", icon: "🐮", detail: "Link a calf to its mother" },
  { label: "Log Note", href: "/notes/new", icon: "📝", detail: "Save a herd or cow note" },
];

function CowsContent() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") || "";
  const selectedType = searchParams.get("type") || "";
  const [cows, setCows] = useState([]);
  const [calves, setCalves] = useState([]);
  const [bulls, setBulls] = useState([]);
  const [pastures, setPastures] = useState([]);
  const [activity, setActivity] = useState([]);
  const [query, setQuery] = useState(initialTag);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      Promise.all([loadCows(), loadCalves(), loadBulls(), loadPastures(), loadActivity()])
        .then(([cowRows, calfRows, bullRows, pastureRows, activityRows]) => {
          setCows(cowRows);
          setCalves(calfRows);
          setBulls(bullRows);
          setPastures(pastureRows);
          setActivity(activityRows);
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const filteredCows = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return cows;
    return cows.filter((cow) =>
      [cow.tag, cow.calfTag, cow.color, cow.location, cow.status]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value))
    );
  }, [cows, query]);

  const activeCows = cows.filter((cow) => cow.status === "Active").length;
  const watchCows = cows.filter((cow) => cow.status === "Watch").length;
  const activeBulls = bulls.filter((bull) => bull.status === "Active").length;
  const activeCalves = calves.filter((calf) => calf.status === "Active").length;
  const selectedGroup = animalGroups.find((group) => group.type === selectedType);
  const selectedRecords = selectedGroup ? demoAnimalRecords[selectedGroup.type] || [] : [];
  const selectedActiveRecords = selectedRecords.filter(([, , status]) => ["Active", "Milking", "Fresh"].includes(status)).length;
  const selectedWatchRecords = selectedRecords.filter(([, , status]) => status === "Watch").length;
  const selectedSoldOrDryRecords = selectedRecords.filter(([, , status]) => ["Sold", "Dry"].includes(status)).length;
  const selectedLocations = new Set(selectedRecords.map(([, , , location]) => location).filter((location) => location && location !== "Sold")).size;
  const summaryCards = selectedGroup
    ? [
        { value: selectedRecords.length, label: selectedGroup.title },
        { value: selectedActiveRecords, label: selectedGroup.type === "milk-cows" ? "Milking/fresh" : "Active" },
        { value: selectedWatchRecords, label: "Need watching" },
        { value: selectedSoldOrDryRecords, label: selectedGroup.type === "milk-cows" ? "Sold/dry" : "Sold" },
        { value: selectedLocations, label: "Locations" },
        { value: selectedRecords.length, label: "Demo records" },
      ]
    : [
        { value: activeCows, label: "Active cows" },
        { value: activeCalves, label: "Active calves" },
        { value: activeBulls, label: "Active bulls" },
        { value: watchCows, label: "Need watching" },
        { value: pastures.length, label: "Pastures" },
        { value: activity.length, label: "Recent notes" },
      ];

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Livestock</h1>
        <p className="muted">Choose the animal group first, then drill into tags, health notes, locations, and reports.</p>
      </header>

      <section className="stats-grid cow-stats" aria-label={selectedGroup ? `${selectedGroup.title} summary` : "Herd summary"}>
        {summaryCards.map((card) => (
          <div className="stat-card" key={card.label}><strong>{card.value}</strong><span>{card.label}</span></div>
        ))}
      </section>

      <section>
        <div className="section-heading"><h2>Animal groups</h2></div>
        <div className="action-grid two farming-actions">
          {animalGroups.map((group) => (
            <Link className="action-card detailed-action" href={group.href} key={group.title}>
              <span>{group.icon}</span>
              <strong>{group.title}</strong>
              <small>{group.detail}</small>
            </Link>
          ))}
        </div>
      </section>

      {selectedGroup && (
        <section>
          <div className="section-heading"><h2>{selectedGroup.title} records</h2><Link href="/cows">All groups</Link></div>
          <div className="stack">
            {selectedRecords.map(([tag, breed, status, location, note]) => (
              <article className="list-card" key={tag}>
                <div className="row-between">
                  <h2>{selectedGroup.icon} {tag}</h2>
                  <span className={`pill ${status === "Watch" ? "warning" : ""} ${["Sold", "Dry"].includes(status) ? "danger" : ""}`}>{status}</span>
                </div>
                <p>{breed} • {location}</p>
                <small>{note}</small>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="search-card">
        <label htmlFor="cow-search">Find cow or calf by tag</label>
        <input id="cow-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: 83" inputMode="numeric" />
      </section>

      <section className="hero-card farming-hero">
        <p className="eyebrow">Start with tags</p>
        <h2>Keep the herd easy to check from the truck.</h2>
        <p className="muted">Fast search stays first, then the deeper tools are grouped underneath for calving, pastures, bulls, and reports.</p>
      </section>

      <section>
        <div className="section-heading"><h2>Cattle tools</h2></div>
        <div className="stack">
          {cattleModules.map((item) => (
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
        {quickActions.map((action) => (
          <Link className="action-card detailed-action" href={action.href} key={action.label}>
            <span>{action.icon}</span>
            <strong>{action.label}</strong>
            <small>{action.detail}</small>
          </Link>
        ))}
      </section>

      <section>
        <div className="section-heading">
          <h2>Cow records</h2>
          <Link href="/cows/new">Add cow</Link>
        </div>
        <div className="stack">
          {filteredCows.map((cow) => (
            <Link className="list-card link-card" href={`/cows/${cow.id}`} key={cow.id}>
              <div className="row-between">
                <h2>Cow {cow.tag}</h2>
                <span className={`pill ${cow.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(cow.status) ? "danger" : ""}`}>{cow.status}</span>
              </div>
              <p>{cow.color} • {cow.location}</p>
              <small>{cow.calfTag ? `Calf ${cow.calfTag}` : "No calf recorded yet"}</small>
            </Link>
          ))}
          {filteredCows.length === 0 && <article className="list-card"><h2>No cows found</h2><p>Try another tag number or add a new cow.</p></article>}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="app-shell"><p>Loading...</p></main>}>
      <CowsContent />
    </Suspense>
  );
}
