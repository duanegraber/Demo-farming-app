"use client";

import { pastures as defaultPastures } from "../data";
import { hasSupabaseConfig, supabase } from "./supabaseClient";

const COWS_KEY = "demo-farming-app-cows";
const ACTIVITY_KEY = "demo-farming-app-activity";
const CALVES_KEY = "demo-farming-app-calves";
const BULLS_KEY = "demo-farming-app-bulls";
const PASTURES_KEY = "demo-farming-app-pastures";
const FIELDS_KEY = "demo-farming-app-fields";
const FIELD_ACTIVITIES_KEY = "demo-farming-app-field-activities";
const CROP_SALES_KEY = "demo-farming-app-crop-sales";
const EQUIPMENT_KEY = "demo-farming-app-equipment";
const EQUIPMENT_LOGS_KEY = "demo-farming-app-equipment-logs";
const DEMO_SEED_KEY = "demo-farming-app-seed-version";
const DEMO_SEED_VERSION = "2026-05-21-c";

const demoCows = [
  { id: "demo-cow-101", tag: "101", status: "Active", color: "Black", location: "North Quarter", lastCalved: "2026-03-28", calfTag: "501", purchaseCost: 2400, dateBought: "2023-11-12", sellingAmount: "", dateSold: "", notes: "Quiet mature cow. Good demo record for calving history." },
  { id: "demo-cow-118", tag: "118", status: "Active", color: "Red", location: "River Bend", lastCalved: "2026-04-02", calfTag: "506", purchaseCost: 2200, dateBought: "2024-01-18", sellingAmount: "", dateSold: "", notes: "Strong pair; watch mineral intake on grass." },
  { id: "demo-cow-124", tag: "124", status: "Watch", color: "Black brockle", location: "Yard Pasture", lastCalved: "2026-04-11", calfTag: "512", purchaseCost: 2600, dateBought: "2024-02-05", sellingAmount: "", dateSold: "", notes: "Demo watch-list animal: treated for foot soreness May 3." },
  { id: "demo-cow-137", tag: "137", status: "Active", color: "Red whiteface", location: "South Lease", lastCalved: "2026-03-21", calfTag: "498", purchaseCost: 2350, dateBought: "2023-12-01", sellingAmount: "", dateSold: "", notes: "Early calver with a healthy bull calf." },
  { id: "demo-cow-144", tag: "144", status: "Open", color: "Black", location: "North Quarter", lastCalved: "", calfTag: "", purchaseCost: 2100, dateBought: "2022-10-20", sellingAmount: "", dateSold: "", notes: "Marked open after preg check; good example for status filtering." },
];

const demoCalves = [
  { id: "demo-calf-501", tag: "501", cowTag: "101", sex: "Heifer", born: "2026-03-28", status: "Active", notes: "Unassisted birth. Tagged at turnout." },
  { id: "demo-calf-506", tag: "506", cowTag: "118", sex: "Bull", born: "2026-04-02", status: "Active", notes: "Strong calf. Good nursing record." },
  { id: "demo-calf-512", tag: "512", cowTag: "124", sex: "Heifer", born: "2026-04-11", status: "Active", notes: "Used for demoing mother/calf links." },
  { id: "demo-calf-498", tag: "498", cowTag: "137", sex: "Bull", born: "2026-03-21", status: "Active", notes: "Early calf; candidate for weaning group." },
];

const demoBulls = [
  { id: "demo-bull-7", tag: "B7", name: "Northline", status: "Active", breed: "Red Angus", location: "North Quarter", purchaseCost: 5200, dateBought: "2024-03-15", sellingAmount: "", dateSold: "", notes: "Main Red Angus bull for mature cows." },
  { id: "demo-bull-12", tag: "B12", name: "Ridge", status: "Resting", breed: "Black Angus", location: "Yard Pasture", purchaseCost: 6100, dateBought: "2025-02-20", sellingAmount: "", dateSold: "", notes: "Backup bull; feet checked May 8." },
];

const demoActivity = [
  { id: "demo-event-1", type: "Calving", title: "Cow 101 had heifer calf 501", detail: "Unassisted birth. Tagged at turnout.", user: "Sam", cowTag: "101", time: "Mar 28, 8:15 AM" },
  { id: "demo-event-2", type: "Treatment", title: "Cow 124 foot soreness", detail: "Treated and moved to Yard Pasture for easier checking.", user: "Maya", cowTag: "124", time: "May 3, 6:30 PM" },
  { id: "demo-event-3", type: "Pasture move", title: "Pairs moved to River Bend", detail: "Moved 26 pairs after fencing check.", user: "Alex", cowTag: null, time: "May 10, 2:10 PM" },
];

const demoFields = [
  { id: "demo-field-1", name: "East Pivot", acres: 132, ownership: "Owned", rentCostPerAcre: "", currentCrop: "Hard red spring wheat", legalLocation: "Demo Sec 12", notes: "Irrigated field. Good for showing activity timeline and crop-year report." },
  { id: "demo-field-2", name: "West Dryland", acres: 247, ownership: "Rented", rentCostPerAcre: 78, currentCrop: "Canola", legalLocation: "Demo Sec 8", notes: "Rented field with rent cost included in planning notes." },
  { id: "demo-field-3", name: "South Quarter", acres: 156, ownership: "Owned", rentCostPerAcre: "", currentCrop: "Barley", legalLocation: "Demo Sec 21", notes: "Used for feed barley and straw planning." },
];

const demoFieldActivities = [
  { id: "demo-field-activity-1", fieldId: "demo-field-1", fieldName: "East Pivot", type: "Seeding", activityDate: "2026-04-22", cropYear: 2026, crop: "Hard red spring wheat", product: "AAC Wheat Demo", rate: "130 lb/ac", acres: 132, cost: 7392, yieldAmount: "", yieldUnit: "bushels", moisture: "", grade: "", destination: "", notes: "Seeded in good moisture. Demo input cost included.", user: "Sam", time: "Apr 22, 7:45 PM" },
  { id: "demo-field-activity-2", fieldId: "demo-field-1", fieldName: "East Pivot", type: "Fertilizer", activityDate: "2026-04-24", cropYear: 2026, crop: "Hard red spring wheat", product: "Urea + MAP", rate: "Blend per soil test", acres: 132, cost: 18480, yieldAmount: "", yieldUnit: "bushels", moisture: "", grade: "", destination: "", notes: "Pre-seed blend logged for profitability demo.", user: "Maya", time: "Apr 24, 5:20 PM" },
  { id: "demo-field-activity-3", fieldId: "demo-field-2", fieldName: "West Dryland", type: "Seeding", activityDate: "2026-05-02", cropYear: 2026, crop: "Canola", product: "Canola seed + starter", rate: "5.2 lb/ac", acres: 247, cost: 29640, yieldAmount: "", yieldUnit: "bushels", moisture: "", grade: "", destination: "", notes: "Seeded into firm dryland seedbed.", user: "Alex", time: "May 2, 9:10 PM" },
  { id: "demo-field-activity-4", fieldId: "demo-field-3", fieldName: "South Quarter", type: "Harvest", activityDate: "2026-08-18", cropYear: 2026, crop: "Barley", product: "", rate: "", acres: 156, cost: 3900, yieldAmount: 17160, yieldUnit: "bushels", moisture: 13.4, grade: "Feed", destination: "Yard bins", notes: "Example harvest entry so reports show yield and destination.", user: "Riley", time: "Aug 18, 8:40 PM" },
];

const demoCropSales = [
  { id: "demo-sale-1", fieldId: "demo-field-3", fieldName: "South Quarter", crop: "Barley", saleDate: "2026-09-04", cropYear: 2026, amount: 9000, unit: "bushels", pricePerUnit: 5.65, grossRevenue: 50850, deductions: 420, netRevenue: 50430, buyer: "Prairie Feed Demo", notes: "Partial barley sale for profitability demo.", user: "Alex", time: "Sep 4, 11:25 AM" },
];

const demoEquipment = [
  { id: "demo-equipment-1", name: "John Deere 6155R", type: "Tractor", status: "Active", identifier: "DEMO-6155R", currentMeter: 2840, meterUnit: "hours", notes: "Main loader/field tractor. Demo maintenance history included." },
  { id: "demo-equipment-2", name: "Case IH 8240 Combine", type: "Combine", status: "Active", identifier: "DEMO-8240", currentMeter: 1735, meterUnit: "hours", notes: "Harvest cost tracking example." },
  { id: "demo-equipment-3", name: "Brandt 1322 Auger", type: "Auger", status: "Active", identifier: "DEMO-AUGER", currentMeter: "", meterUnit: "hours", notes: "Simple equipment record without a meter." },
];

const demoEquipmentLogs = [
  { id: "demo-equipment-log-1", equipmentId: "demo-equipment-1", equipmentName: "John Deere 6155R", type: "Maintenance", logDate: "2026-04-15", logYear: 2026, vendor: "Demo Ag Service", description: "Spring service: oil, filters, inspection", meterReading: 2798, fuelAmount: "", fuelUnit: "litres", cost: 1180, notes: "Ready for seeding season.", user: "Sam", time: "Apr 15, 4:10 PM" },
  { id: "demo-equipment-log-2", equipmentId: "demo-equipment-1", equipmentName: "John Deere 6155R", type: "Fuel", logDate: "2026-05-05", logYear: 2026, vendor: "Co-op Demo Fuel", description: "Dyed diesel fill", meterReading: 2832, fuelAmount: 420, fuelUnit: "litres", cost: 612, notes: "Seeding fuel entry.", user: "Maya", time: "May 5, 7:00 PM" },
  { id: "demo-equipment-log-3", equipmentId: "demo-equipment-2", equipmentName: "Case IH 8240 Combine", type: "Repair", logDate: "2026-08-12", logYear: 2026, vendor: "Harvest Parts Demo", description: "Replaced belt and inspected feeder chain", meterReading: 1728, fuelAmount: "", fuelUnit: "litres", cost: 2450, notes: "Pre-harvest repair example.", user: "Alex", time: "Aug 12, 1:35 PM" },
];

function isLegacyDemoData(key, value) {
  if (!Array.isArray(value)) return false;
  if (key === COWS_KEY) {
    return value.some((item) => item?.notes === "Seeded legacy herd record.") || (value.length === 120 && value[0]?.tag === "1" && value[119]?.tag === "120");
  }
  if (key === CALVES_KEY) {
    return value.length === 102 && value[0]?.tag === "121" && value[101]?.tag === "222";
  }
  if (key === ACTIVITY_KEY) {
    return value.some((item) => item?.title === "Demo herd loaded" || item?.type === "Herd seeded");
  }
  return false;
}

function removeJson(key) {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(key);
}

function canUseStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function readJson(key, fallback) {
  if (!canUseStorage()) return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (isLegacyDemoData(key, parsed)) {
      removeJson(key);
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function cowFromDb(row) {
  return {
    id: row.id,
    tag: row.tag,
    status: row.status,
    color: row.color,
    location: row.location,
    lastCalved: row.last_calved,
    calfTag: row.calf_tag,
    purchaseCost: row.purchase_cost ?? "",
    dateBought: row.date_bought || "",
    sellingAmount: row.selling_amount ?? "",
    dateSold: row.date_sold || "",
    notes: row.notes,
  };
}

function calfFromDb(row) {
  return {
    id: row.id,
    tag: row.tag,
    cowTag: row.cow_tag,
    sex: row.sex,
    born: row.born,
    status: row.status,
    notes: row.notes,
  };
}

function bullFromDb(row) {
  return {
    id: row.id,
    tag: row.tag,
    name: row.name,
    status: row.status,
    breed: row.breed,
    location: row.location,
    purchaseCost: row.purchase_cost ?? "",
    dateBought: row.date_bought || "",
    sellingAmount: row.selling_amount ?? "",
    dateSold: row.date_sold || "",
    notes: row.notes,
  };
}

function pastureFromDb(row) {
  return row.name;
}

function fieldFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    acres: row.acres ?? "",
    ownership: row.ownership,
    rentCostPerAcre: row.rent_cost_per_acre ?? "",
    currentCrop: row.current_crop,
    legalLocation: row.legal_location,
    notes: row.notes,
  };
}

function fieldActivityFromDb(row) {
  return {
    id: row.id,
    fieldId: row.field_id,
    fieldName: row.field_name,
    type: row.type,
    activityDate: row.activity_date,
    cropYear: row.crop_year || cropYearFromDate(row.activity_date),
    crop: row.crop,
    product: row.product,
    rate: row.rate,
    acres: row.acres ?? "",
    cost: row.cost ?? "",
    yieldAmount: row.yield_amount ?? "",
    yieldUnit: row.yield_unit || "bushels",
    moisture: row.moisture ?? "",
    grade: row.grade || "",
    destination: row.destination || "",
    notes: row.notes,
    user: row.created_by,
    time: formatEventTime(row.created_at),
  };
}

function cropSaleFromDb(row) {
  return {
    id: row.id,
    fieldId: row.field_id,
    fieldName: row.field_name,
    crop: row.crop,
    saleDate: row.sale_date,
    cropYear: row.crop_year || cropYearFromDate(row.sale_date),
    amount: row.amount ?? "",
    unit: row.unit || "bushels",
    pricePerUnit: row.price_per_unit ?? "",
    grossRevenue: row.gross_revenue ?? "",
    deductions: row.deductions ?? "",
    netRevenue: row.net_revenue ?? "",
    buyer: row.buyer || "",
    notes: row.notes,
    user: row.created_by,
    time: formatEventTime(row.created_at),
  };
}

function equipmentFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    identifier: row.identifier || "",
    currentMeter: row.current_meter ?? "",
    meterUnit: row.meter_unit || "hours",
    notes: row.notes,
  };
}

function equipmentLogFromDb(row) {
  return {
    id: row.id,
    equipmentId: row.equipment_id,
    equipmentName: row.equipment_name,
    type: row.type,
    logDate: row.log_date,
    logYear: row.log_year || cropYearFromDate(row.log_date),
    vendor: row.vendor || "",
    description: row.description,
    meterReading: row.meter_reading ?? "",
    fuelAmount: row.fuel_amount ?? "",
    fuelUnit: row.fuel_unit || "litres",
    cost: row.cost ?? "",
    notes: row.notes,
    user: row.created_by,
    time: formatEventTime(row.created_at),
  };
}

function uniquePastureNames(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function eventFromDb(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    detail: row.detail,
    user: row.user_name,
    cowTag: row.cow_tag,
    time: formatEventTime(row.event_time),
  };
}

function formatEventTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatInputDate(value) {
  if (!value) return "Unknown";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
}

function formatOptionalDate(value) {
  if (!value) return null;
  return formatInputDate(value);
}

function parseOptionalFarmNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const cleaned = String(value)
    .trim()
    .replace(/,/g, "")
    .match(/-?\d+(?:\.\d+)?/);
  if (!cleaned) return null;

  const amount = Number(cleaned[0]);
  return Number.isFinite(amount) ? amount : null;
}

export function parseFarmNumber(value) {
  return parseOptionalFarmNumber(value) ?? 0;
}

export function formatFarmNumber(value, options = {}) {
  return parseFarmNumber(value).toLocaleString(undefined, { maximumFractionDigits: 2, ...options });
}

function formatMoney(value) {
  return parseOptionalFarmNumber(value);
}

function cropYearFromDate(value) {
  const year = Number(String(value || "").slice(0, 4));
  return Number.isFinite(year) && year > 1900 ? year : new Date().getFullYear();
}

function stripCowFinancialFields(cowInput) {
  const { purchase_cost, date_bought, selling_amount, date_sold, ...basicCowInput } = cowInput;
  return basicCowInput;
}

function isMissingCowFinancialColumn(error) {
  return /purchase_cost|date_bought|selling_amount|date_sold/i.test(error?.message || "");
}

async function insertCowWithFallback(cowInput) {
  const result = await supabase.from("cows").insert(cowInput).select("*").single();
  if (!result.error || !isMissingCowFinancialColumn(result.error)) return result;
  return supabase.from("cows").insert(stripCowFinancialFields(cowInput)).select("*").single();
}

async function updateCowWithFallback(id, cowInput) {
  const result = await supabase.from("cows").update(cowInput).eq("id", id).select("*").single();
  if (!result.error || !isMissingCowFinancialColumn(result.error)) return result;
  return supabase.from("cows").update(stripCowFinancialFields(cowInput)).eq("id", id).select("*").single();
}

function stripFieldActivityHarvestFields(fieldActivityInput) {
  const { yield_amount, yield_unit, moisture, grade, destination, ...basicFieldActivityInput } = fieldActivityInput;
  return basicFieldActivityInput;
}

function isMissingFieldActivityHarvestColumn(error) {
  return /yield_amount|yield_unit|moisture|grade|destination/i.test(error?.message || "");
}

async function insertFieldActivityWithFallback(fieldActivityInput) {
  const result = await supabase.from("field_activities").insert(fieldActivityInput).select("*").single();
  if (!result.error || !isMissingFieldActivityHarvestColumn(result.error)) return result;
  return supabase.from("field_activities").insert(stripFieldActivityHarvestFields(fieldActivityInput)).select("*").single();
}

async function updateFieldActivityWithFallback(id, fieldActivityInput) {
  const result = await supabase.from("field_activities").update(fieldActivityInput).eq("id", id).select("*").single();
  if (!result.error || !isMissingFieldActivityHarvestColumn(result.error)) return result;
  return supabase.from("field_activities").update(stripFieldActivityHarvestFields(fieldActivityInput)).eq("id", id).select("*").single();
}

function stripFieldRentFields(fieldInput) {
  const { rent_cost_per_acre, ...basicFieldInput } = fieldInput;
  return basicFieldInput;
}

function isMissingFieldRentColumn(error) {
  return /rent_cost_per_acre/i.test(error?.message || "");
}

async function insertFieldWithFallback(fieldInput) {
  const result = await supabase.from("fields").insert(fieldInput).select("*").single();
  if (!result.error || !isMissingFieldRentColumn(result.error)) return result;
  return supabase.from("fields").insert(stripFieldRentFields(fieldInput)).select("*").single();
}

async function updateFieldWithFallback(id, fieldInput) {
  const result = await supabase.from("fields").update(fieldInput).eq("id", id).select("*").single();
  if (!result.error || !isMissingFieldRentColumn(result.error)) return result;
  return supabase.from("fields").update(stripFieldRentFields(fieldInput)).eq("id", id).select("*").single();
}

function isLegacyDemoCow(row) {
  return row?.notes === "Seeded legacy herd record.";
}

function isLegacyDemoCalf(row) {
  const tagNumber = Number(row?.tag);
  return tagNumber >= 121 && tagNumber <= 222 && /^Linked to cow \d+\.$/.test(row?.notes || "");
}

function isLegacyDemoEvent(row) {
  return row?.title === "Demo herd loaded" || row?.title === "Cows assigned to starter pastures" || row?.type === "Herd seeded";
}

function isLegacyDemoCowRows(rows) {
  return rows.some(isLegacyDemoCow) || (rows.length === 120 && rows[0]?.tag === "1" && rows.some((row) => row?.tag === "120"));
}

function isLegacyDemoCalfRows(rows) {
  return rows.some(isLegacyDemoCalf) || (rows.length === 102 && rows.some((row) => row?.tag === "121") && rows.some((row) => row?.tag === "222"));
}

async function purgeLegacyDemoRows() {
  if (!hasSupabaseConfig) return;

  const demoCalfTags = Array.from({ length: 102 }, (_, index) => String(index + 121));
  const demoEventTitles = ["Demo herd loaded", "Cows assigned to starter pastures"];

  await supabase.from("farm_events").delete().in("title", demoEventTitles);
  await supabase.from("calves").delete().in("tag", demoCalfTags);
  await supabase.from("cows").delete().eq("notes", "Seeded legacy herd record.");
}

export function getCows() {
  return readJson(COWS_KEY, []);
}

export function getActivity() {
  return readJson(ACTIVITY_KEY, []);
}

export function getCalves() {
  return readJson(CALVES_KEY, []);
}

export function getBulls() {
  return readJson(BULLS_KEY, []);
}

export function getPastures() {
  return uniquePastureNames([...defaultPastures, ...readJson(PASTURES_KEY, [])]);
}

export function getFields() {
  return readJson(FIELDS_KEY, []);
}

export function getFieldActivities() {
  return readJson(FIELD_ACTIVITIES_KEY, []);
}

export function getCropSales() {
  return readJson(CROP_SALES_KEY, []);
}

export function getEquipment() {
  return readJson(EQUIPMENT_KEY, []);
}

export function getEquipmentLogs() {
  return readJson(EQUIPMENT_LOGS_KEY, []);
}

function writeDemoJsonIfEmpty(key, value) {
  if (readJson(key, []).length > 0) return;
  writeJson(key, value);
}

function writeDemoSeedData() {
  writeJson(COWS_KEY, demoCows);
  writeJson(CALVES_KEY, demoCalves);
  writeJson(BULLS_KEY, demoBulls);
  writeJson(ACTIVITY_KEY, demoActivity);
  writeJson(FIELDS_KEY, demoFields);
  writeJson(FIELD_ACTIVITIES_KEY, demoFieldActivities);
  writeJson(CROP_SALES_KEY, demoCropSales);
  writeJson(EQUIPMENT_KEY, demoEquipment);
  writeJson(EQUIPMENT_LOGS_KEY, demoEquipmentLogs);
  window.localStorage.setItem(DEMO_SEED_KEY, DEMO_SEED_VERSION);
}

export function seedDemoFarmData() {
  if (hasSupabaseConfig || !canUseStorage()) return;
  if (window.localStorage.getItem(DEMO_SEED_KEY) === DEMO_SEED_VERSION) return;

  writeDemoSeedData();
}

export function resetDemoFarmData() {
  if (hasSupabaseConfig || !canUseStorage()) return;
  writeDemoSeedData();
}

function throwIfSupabaseError(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }
}

export async function clearAllFarmRecords() {
  removeJson(ACTIVITY_KEY);
  removeJson(CALVES_KEY);
  removeJson(BULLS_KEY);
  removeJson(PASTURES_KEY);
  removeJson(FIELDS_KEY);
  removeJson(FIELD_ACTIVITIES_KEY);
  removeJson(CROP_SALES_KEY);
  removeJson(EQUIPMENT_KEY);
  removeJson(EQUIPMENT_LOGS_KEY);
  removeJson(COWS_KEY);

  if (!hasSupabaseConfig) {
    window.localStorage.setItem(DEMO_SEED_KEY, DEMO_SEED_VERSION);
    return;
  }


  throwIfSupabaseError(await supabase.from("equipment_logs").delete().not("id", "is", null), "Could not clear equipment logs");
  throwIfSupabaseError(await supabase.from("equipment").delete().not("id", "is", null), "Could not clear equipment records");
  throwIfSupabaseError(await supabase.from("crop_sales").delete().not("id", "is", null), "Could not clear crop sales");
  throwIfSupabaseError(await supabase.from("field_activities").delete().not("id", "is", null), "Could not clear field activity records");
  throwIfSupabaseError(await supabase.from("fields").delete().not("id", "is", null), "Could not clear field records");
  throwIfSupabaseError(await supabase.from("farm_events").delete().not("id", "is", null), "Could not clear activity records");
  throwIfSupabaseError(await supabase.from("calves").delete().not("id", "is", null), "Could not clear calf records");
  throwIfSupabaseError(await supabase.from("bulls").delete().not("id", "is", null), "Could not clear bull records");
  throwIfSupabaseError(await supabase.from("cows").delete().not("id", "is", null), "Could not clear cow records");
}

export async function loadCows() {
  if (!hasSupabaseConfig) return getCows();
  const { data, error } = await supabase.from("cows").select("*").order("tag", { ascending: true });
  if (error) throw error;
  if (isLegacyDemoCowRows(data)) {
    await purgeLegacyDemoRows();
    return data.filter((row) => !isLegacyDemoCow(row)).map(cowFromDb);
  }
  return data.map(cowFromDb);
}

export async function loadActivity() {
  if (!hasSupabaseConfig) return getActivity();
  const { data, error } = await supabase.from("farm_events").select("*").order("event_time", { ascending: false }).limit(100);
  if (error) throw error;
  return data.filter((row) => !isLegacyDemoEvent(row)).map(eventFromDb);
}

export async function loadCalves() {
  if (!hasSupabaseConfig) return getCalves();
  const { data, error } = await supabase.from("calves").select("*").order("tag", { ascending: true });
  if (error) throw error;
  if (isLegacyDemoCalfRows(data)) {
    await purgeLegacyDemoRows();
    return data.filter((row) => !isLegacyDemoCalf(row)).map(calfFromDb);
  }
  return data.map(calfFromDb);
}



export async function loadPastures() {
  if (!hasSupabaseConfig) return getPastures();
  const { data, error } = await supabase.from("pastures").select("name").order("name", { ascending: true });
  if (error) return getPastures();
  return uniquePastureNames([...defaultPastures, ...data.map(pastureFromDb)]);
}

export async function createPasture(values) {
  const name = values.name.trim();
  if (!name) throw new Error("Pasture name is required.");

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("pastures").insert({ name, notes: values.notes?.trim() || "", created_by: values.user || "Alex" }).select("name").single();
    if (!error) {
      await addActivity({ type: "Pasture added", title: `${data.name} pasture added`, detail: values.notes?.trim() || "Ready to use for cow and bull locations.", user: values.user || "Alex", cowTag: null });
      return pastureFromDb(data);
    }
  }

  const nextPastures = uniquePastureNames([...getPastures(), name]);
  writeJson(PASTURES_KEY, nextPastures.filter((pasture) => !defaultPastures.includes(pasture)));
  await addActivity({ type: "Pasture added", title: `${name} pasture added`, detail: values.notes?.trim() || "Ready to use for cow and bull locations.", user: values.user || "Alex", cowTag: null });
  return name;
}

export async function loadFields() {
  if (!hasSupabaseConfig) return getFields();
  const { data, error } = await supabase.from("fields").select("*").order("name", { ascending: true });
  if (error) return getFields();
  return data.map(fieldFromDb);
}

export async function loadFieldActivities() {
  if (!hasSupabaseConfig) return getFieldActivities();
  const { data, error } = await supabase.from("field_activities").select("*").order("activity_date", { ascending: false }).order("created_at", { ascending: false });
  if (error) return getFieldActivities();
  return data.map(fieldActivityFromDb);
}

export async function createFieldActivity(values) {
  const fieldActivityInput = {
    field_id: values.fieldId || null,
    field_name: values.fieldName.trim(),
    type: values.type || "Other note",
    activity_date: values.activityDate || new Date().toISOString().slice(0, 10),
    crop_year: Number(values.cropYear) || cropYearFromDate(values.activityDate),
    crop: values.crop.trim() || "Not set",
    product: values.product.trim() || "",
    rate: values.rate.trim() || "",
    acres: formatMoney(values.acres),
    cost: formatMoney(values.cost),
    yield_amount: formatMoney(values.yieldAmount),
    yield_unit: values.yieldUnit || "bushels",
    moisture: formatMoney(values.moisture),
    grade: values.grade?.trim() || "",
    destination: values.destination?.trim() || "",
    notes: values.notes.trim() || "No notes yet.",
    created_by: values.user || "Alex",
    updated_by: values.user || "Alex",
  };

  if (hasSupabaseConfig) {
    const { data, error } = await insertFieldActivityWithFallback(fieldActivityInput);
    if (error) throw error;
    return fieldActivityFromDb(data);
  }

  const activities = getFieldActivities();
  const activity = {
    id: `field-activity-${Date.now()}`,
    fieldId: fieldActivityInput.field_id,
    fieldName: fieldActivityInput.field_name,
    type: fieldActivityInput.type,
    activityDate: fieldActivityInput.activity_date,
    cropYear: fieldActivityInput.crop_year,
    crop: fieldActivityInput.crop,
    product: fieldActivityInput.product,
    rate: fieldActivityInput.rate,
    acres: fieldActivityInput.acres ?? "",
    cost: fieldActivityInput.cost ?? "",
    yieldAmount: fieldActivityInput.yield_amount ?? "",
    yieldUnit: fieldActivityInput.yield_unit,
    moisture: fieldActivityInput.moisture ?? "",
    grade: fieldActivityInput.grade,
    destination: fieldActivityInput.destination,
    notes: fieldActivityInput.notes,
    user: fieldActivityInput.created_by,
    time: "Just now",
  };
  writeJson(FIELD_ACTIVITIES_KEY, [activity, ...activities]);
  return activity;
}

export async function updateFieldActivity(id, values) {
  const fieldActivityInput = {
    field_id: values.fieldId || null,
    field_name: values.fieldName.trim(),
    type: values.type || "Other note",
    activity_date: values.activityDate || new Date().toISOString().slice(0, 10),
    crop_year: Number(values.cropYear) || cropYearFromDate(values.activityDate),
    crop: values.crop.trim() || "Not set",
    product: values.product.trim() || "",
    rate: values.rate.trim() || "",
    acres: formatMoney(values.acres),
    cost: formatMoney(values.cost),
    yield_amount: formatMoney(values.yieldAmount),
    yield_unit: values.yieldUnit || "bushels",
    moisture: formatMoney(values.moisture),
    grade: values.grade?.trim() || "",
    destination: values.destination?.trim() || "",
    notes: values.notes.trim() || "No notes yet.",
    updated_by: values.user || "Alex",
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig) {
    const { data, error } = await updateFieldActivityWithFallback(id, fieldActivityInput);
    if (error) throw error;
    return fieldActivityFromDb(data);
  }

  const activities = getFieldActivities();
  const updated = activities.map((activity) => activity.id === id ? {
    ...activity,
    fieldId: fieldActivityInput.field_id,
    fieldName: fieldActivityInput.field_name,
    type: fieldActivityInput.type,
    activityDate: fieldActivityInput.activity_date,
    cropYear: fieldActivityInput.crop_year,
    crop: fieldActivityInput.crop,
    product: fieldActivityInput.product,
    rate: fieldActivityInput.rate,
    acres: fieldActivityInput.acres ?? "",
    cost: fieldActivityInput.cost ?? "",
    yieldAmount: fieldActivityInput.yield_amount ?? "",
    yieldUnit: fieldActivityInput.yield_unit,
    moisture: fieldActivityInput.moisture ?? "",
    grade: fieldActivityInput.grade,
    destination: fieldActivityInput.destination,
    notes: fieldActivityInput.notes,
    user: fieldActivityInput.updated_by,
  } : activity);
  writeJson(FIELD_ACTIVITIES_KEY, updated);
  return updated.find((activity) => activity.id === id);
}

export async function deleteFieldActivity(id) {
  if (hasSupabaseConfig) {
    const { error } = await supabase.from("field_activities").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  writeJson(FIELD_ACTIVITIES_KEY, getFieldActivities().filter((activity) => activity.id !== id));
}

function cropSaleInputFromValues(values) {
  const amount = formatMoney(values.amount);
  const pricePerUnit = formatMoney(values.pricePerUnit);
  const deductions = formatMoney(values.deductions) || 0;
  const grossRevenue = amount !== null && pricePerUnit !== null ? amount * pricePerUnit : formatMoney(values.grossRevenue);
  const netRevenue = grossRevenue !== null ? grossRevenue - deductions : null;

  return {
    field_id: values.fieldId || null,
    field_name: values.fieldName.trim(),
    crop: values.crop.trim() || "Not set",
    sale_date: values.saleDate || new Date().toISOString().slice(0, 10),
    crop_year: Number(values.cropYear) || cropYearFromDate(values.saleDate),
    amount,
    unit: values.unit || "bushels",
    price_per_unit: pricePerUnit,
    gross_revenue: grossRevenue,
    deductions,
    net_revenue: netRevenue,
    buyer: values.buyer?.trim() || "",
    notes: values.notes.trim() || "No notes yet.",
    updated_by: values.user || "Alex",
  };
}

export async function loadCropSales() {
  if (!hasSupabaseConfig) return getCropSales();
  const { data, error } = await supabase.from("crop_sales").select("*").order("sale_date", { ascending: false }).order("created_at", { ascending: false });
  if (error) return getCropSales();
  return data.map(cropSaleFromDb);
}

export async function createCropSale(values) {
  const cropSaleInput = { ...cropSaleInputFromValues(values), created_by: values.user || "Alex" };

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("crop_sales").insert(cropSaleInput).select("*").single();
    if (error) throw error;
    return cropSaleFromDb(data);
  }

  const sale = {
    id: `crop-sale-${Date.now()}`,
    fieldId: cropSaleInput.field_id,
    fieldName: cropSaleInput.field_name,
    crop: cropSaleInput.crop,
    saleDate: cropSaleInput.sale_date,
    cropYear: cropSaleInput.crop_year,
    amount: cropSaleInput.amount ?? "",
    unit: cropSaleInput.unit,
    pricePerUnit: cropSaleInput.price_per_unit ?? "",
    grossRevenue: cropSaleInput.gross_revenue ?? "",
    deductions: cropSaleInput.deductions ?? "",
    netRevenue: cropSaleInput.net_revenue ?? "",
    buyer: cropSaleInput.buyer,
    notes: cropSaleInput.notes,
    user: cropSaleInput.created_by,
    time: "Just now",
  };
  writeJson(CROP_SALES_KEY, [sale, ...getCropSales()]);
  return sale;
}

export async function updateCropSale(id, values) {
  const cropSaleInput = { ...cropSaleInputFromValues(values), updated_at: new Date().toISOString() };

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("crop_sales").update(cropSaleInput).eq("id", id).select("*").single();
    if (error) throw error;
    return cropSaleFromDb(data);
  }

  const updated = getCropSales().map((sale) => sale.id === id ? {
    ...sale,
    fieldId: cropSaleInput.field_id,
    fieldName: cropSaleInput.field_name,
    crop: cropSaleInput.crop,
    saleDate: cropSaleInput.sale_date,
    cropYear: cropSaleInput.crop_year,
    amount: cropSaleInput.amount ?? "",
    unit: cropSaleInput.unit,
    pricePerUnit: cropSaleInput.price_per_unit ?? "",
    grossRevenue: cropSaleInput.gross_revenue ?? "",
    deductions: cropSaleInput.deductions ?? "",
    netRevenue: cropSaleInput.net_revenue ?? "",
    buyer: cropSaleInput.buyer,
    notes: cropSaleInput.notes,
    user: cropSaleInput.updated_by,
  } : sale);
  writeJson(CROP_SALES_KEY, updated);
  return updated.find((sale) => sale.id === id);
}

export async function deleteCropSale(id) {
  if (hasSupabaseConfig) {
    const { error } = await supabase.from("crop_sales").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  writeJson(CROP_SALES_KEY, getCropSales().filter((sale) => sale.id !== id));
}

export async function loadEquipment() {
  if (!hasSupabaseConfig) return getEquipment();
  const { data, error } = await supabase.from("equipment").select("*").order("name", { ascending: true });
  if (error) return getEquipment();
  return data.map(equipmentFromDb);
}

export async function loadEquipmentLogs() {
  if (!hasSupabaseConfig) return getEquipmentLogs();
  const { data, error } = await supabase.from("equipment_logs").select("*").order("log_date", { ascending: false }).order("created_at", { ascending: false });
  if (error) return getEquipmentLogs();
  return data.map(equipmentLogFromDb);
}

export async function createEquipment(values) {
  const equipmentInput = {
    name: values.name.trim(),
    type: values.type || "Other",
    status: values.status || "Active",
    identifier: values.identifier?.trim() || "",
    current_meter: formatMoney(values.currentMeter),
    meter_unit: values.meterUnit || "hours",
    notes: values.notes.trim() || "No notes yet.",
    created_by: values.user || "Alex",
    updated_by: values.user || "Alex",
  };

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("equipment").insert(equipmentInput).select("*").single();
    if (error) throw error;
    return equipmentFromDb(data);
  }

  const item = {
    id: `equipment-${Date.now()}`,
    name: equipmentInput.name,
    type: equipmentInput.type,
    status: equipmentInput.status,
    identifier: equipmentInput.identifier,
    currentMeter: equipmentInput.current_meter ?? "",
    meterUnit: equipmentInput.meter_unit,
    notes: equipmentInput.notes,
  };
  writeJson(EQUIPMENT_KEY, [item, ...getEquipment()]);
  return item;
}

export async function updateEquipment(id, values) {
  const equipmentInput = {
    name: values.name.trim(),
    type: values.type || "Other",
    status: values.status || "Active",
    identifier: values.identifier?.trim() || "",
    current_meter: formatMoney(values.currentMeter),
    meter_unit: values.meterUnit || "hours",
    notes: values.notes.trim() || "No notes yet.",
    updated_by: values.user || "Alex",
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("equipment").update(equipmentInput).eq("id", id).select("*").single();
    if (error) throw error;
    return equipmentFromDb(data);
  }

  const updated = getEquipment().map((item) => item.id === id ? {
    ...item,
    name: equipmentInput.name,
    type: equipmentInput.type,
    status: equipmentInput.status,
    identifier: equipmentInput.identifier,
    currentMeter: equipmentInput.current_meter ?? "",
    meterUnit: equipmentInput.meter_unit,
    notes: equipmentInput.notes,
  } : item);
  writeJson(EQUIPMENT_KEY, updated);
  return updated.find((item) => item.id === id);
}

function equipmentLogInputFromValues(values) {
  return {
    equipment_id: values.equipmentId || null,
    equipment_name: values.equipmentName.trim(),
    type: values.type || "Maintenance",
    log_date: values.logDate || new Date().toISOString().slice(0, 10),
    log_year: Number(values.logYear) || cropYearFromDate(values.logDate),
    vendor: values.vendor?.trim() || "",
    description: values.description.trim() || values.type || "Equipment log",
    meter_reading: formatMoney(values.meterReading),
    fuel_amount: formatMoney(values.fuelAmount),
    fuel_unit: values.fuelUnit || "litres",
    cost: formatMoney(values.cost),
    notes: values.notes.trim() || "No notes yet.",
    updated_by: values.user || "Alex",
  };
}

function equipmentLogFromInput(id, equipmentLogInput, user) {
  return {
    id,
    equipmentId: equipmentLogInput.equipment_id,
    equipmentName: equipmentLogInput.equipment_name,
    type: equipmentLogInput.type,
    logDate: equipmentLogInput.log_date,
    logYear: equipmentLogInput.log_year,
    vendor: equipmentLogInput.vendor,
    description: equipmentLogInput.description,
    meterReading: equipmentLogInput.meter_reading ?? "",
    fuelAmount: equipmentLogInput.fuel_amount ?? "",
    fuelUnit: equipmentLogInput.fuel_unit,
    cost: equipmentLogInput.cost ?? "",
    notes: equipmentLogInput.notes,
    user,
    time: "Just now",
  };
}

export async function createEquipmentLog(values) {
  const equipmentLogInput = { ...equipmentLogInputFromValues(values), created_by: values.user || "Alex" };

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("equipment_logs").insert(equipmentLogInput).select("*").single();
    if (error) throw error;
    return equipmentLogFromDb(data);
  }

  const log = equipmentLogFromInput(`equipment-log-${Date.now()}`, equipmentLogInput, equipmentLogInput.created_by);
  writeJson(EQUIPMENT_LOGS_KEY, [log, ...getEquipmentLogs()]);
  return log;
}

export async function updateEquipmentLog(id, values) {
  const equipmentLogInput = { ...equipmentLogInputFromValues(values), updated_at: new Date().toISOString() };

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("equipment_logs").update(equipmentLogInput).eq("id", id).select("*").single();
    if (error) throw error;
    return equipmentLogFromDb(data);
  }

  const updated = getEquipmentLogs().map((log) => log.id === id ? equipmentLogFromInput(id, equipmentLogInput, equipmentLogInput.updated_by) : log);
  writeJson(EQUIPMENT_LOGS_KEY, updated);
  return updated.find((log) => log.id === id);
}

export async function createField(values) {
  const fieldInput = {
    name: values.name.trim(),
    acres: formatMoney(values.acres),
    ownership: values.ownership || "Owned",
    rent_cost_per_acre: values.ownership === "Rented" ? formatMoney(values.rentCostPerAcre) : null,
    current_crop: values.currentCrop.trim() || "Not set",
    legal_location: values.legalLocation.trim() || "Not recorded",
    notes: values.notes.trim() || "No notes yet.",
    created_by: values.user || "Alex",
    updated_by: values.user || "Alex",
  };

  if (hasSupabaseConfig) {
    const { data, error } = await insertFieldWithFallback(fieldInput);
    if (error) throw error;
    await addActivity({ type: "Field added", title: `${data.name} field added`, detail: `${data.acres ?? "Unknown"} acres • ${data.current_crop}.`, user: values.user || "Alex", cowTag: null });
    return fieldFromDb(data);
  }

  const fields = getFields();
  const field = { id: `field-${Date.now()}`, name: fieldInput.name, acres: fieldInput.acres ?? "", ownership: fieldInput.ownership, rentCostPerAcre: fieldInput.rent_cost_per_acre ?? "", currentCrop: fieldInput.current_crop, legalLocation: fieldInput.legal_location, notes: fieldInput.notes };
  writeJson(FIELDS_KEY, [field, ...fields]);
  await addActivity({ type: "Field added", title: `${field.name} field added`, detail: `${field.acres || "Unknown"} acres • ${field.currentCrop}.`, user: values.user || "Alex", cowTag: null });
  return field;
}

export async function updateField(id, values) {
  const fieldInput = {
    name: values.name.trim(),
    acres: formatMoney(values.acres),
    ownership: values.ownership || "Owned",
    rent_cost_per_acre: values.ownership === "Rented" ? formatMoney(values.rentCostPerAcre) : null,
    current_crop: values.currentCrop.trim() || "Not set",
    legal_location: values.legalLocation.trim() || "Not recorded",
    notes: values.notes.trim() || "No notes yet.",
    updated_by: values.user || "Alex",
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig) {
    const { data, error } = await updateFieldWithFallback(id, fieldInput);
    if (error) throw error;
    await addActivity({ type: "Field updated", title: `${data.name} field updated`, detail: `${data.acres ?? "Unknown"} acres • ${data.current_crop}.`, user: values.user || "Alex", cowTag: null });
    return fieldFromDb(data);
  }

  const fields = getFields();
  const updated = fields.map((field) => field.id === id ? { ...field, name: fieldInput.name, acres: fieldInput.acres ?? "", ownership: fieldInput.ownership, rentCostPerAcre: fieldInput.rent_cost_per_acre ?? "", currentCrop: fieldInput.current_crop, legalLocation: fieldInput.legal_location, notes: fieldInput.notes } : field);
  writeJson(FIELDS_KEY, updated);
  const field = updated.find((item) => item.id === id);
  await addActivity({ type: "Field updated", title: `${field.name} field updated`, detail: `${field.acres || "Unknown"} acres • ${field.currentCrop}.`, user: values.user || "Alex", cowTag: null });
  return field;
}

export async function loadBulls() {
  if (!hasSupabaseConfig) return getBulls();
  const { data, error } = await supabase.from("bulls").select("*").order("tag", { ascending: true });
  if (error) throw error;
  return data.map(bullFromDb);
}

export async function createBull(values) {
  const bullInput = {
    tag: values.tag.trim(),
    name: values.name.trim() || "No name recorded",
    status: values.status || "Active",
    breed: values.breed.trim() || "Not set",
    location: values.location.trim() || "Not set",
    purchase_cost: formatMoney(values.purchaseCost),
    date_bought: formatOptionalDate(values.dateBought),
    selling_amount: formatMoney(values.sellingAmount),
    date_sold: formatOptionalDate(values.dateSold),
    notes: values.notes.trim() || "No notes yet.",
    created_by: values.user || "Alex",
    updated_by: values.user || "Alex",
  };

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("bulls").insert(bullInput).select("*").single();
    if (error) throw error;
    await addActivity({ type: "Bull added", title: `Bull ${data.tag} added`, detail: data.notes, user: values.user || "Alex", cowTag: null });
    return bullFromDb(data);
  }

  const bulls = getBulls();
  const bull = {
    id: `bull-${Date.now()}`,
    tag: bullInput.tag,
    name: bullInput.name,
    status: bullInput.status,
    breed: bullInput.breed,
    location: bullInput.location,
    purchaseCost: bullInput.purchase_cost ?? "",
    dateBought: bullInput.date_bought || "",
    sellingAmount: bullInput.selling_amount ?? "",
    dateSold: bullInput.date_sold || "",
    notes: bullInput.notes,
  };
  writeJson(BULLS_KEY, [bull, ...bulls]);
  await addActivity({ type: "Bull added", title: `Bull ${bull.tag} added`, detail: bull.notes, user: values.user || "Alex", cowTag: null });
  return bull;
}

export async function updateBull(id, values) {
  const bullInput = {
    tag: values.tag.trim(),
    name: values.name.trim() || "No name recorded",
    status: values.status,
    breed: values.breed.trim() || "Not set",
    location: values.location.trim() || "Not set",
    purchase_cost: formatMoney(values.purchaseCost),
    date_bought: formatOptionalDate(values.dateBought),
    selling_amount: formatMoney(values.sellingAmount),
    date_sold: formatOptionalDate(values.dateSold),
    notes: values.notes.trim() || "No notes yet.",
    updated_by: values.user || "Alex",
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("bulls").update(bullInput).eq("id", id).select("*").single();
    if (error) throw error;
    await addActivity({ type: "Bull updated", title: `Bull ${data.tag} updated`, detail: `Status: ${data.status}. Location: ${data.location}.`, user: values.user || "Alex", cowTag: null });
    return bullFromDb(data);
  }

  const bulls = getBulls();
  const updated = bulls.map((bull) => bull.id === id ? { ...bull, tag: bullInput.tag, name: bullInput.name, status: bullInput.status, breed: bullInput.breed, location: bullInput.location, purchaseCost: bullInput.purchase_cost ?? "", dateBought: bullInput.date_bought || "", sellingAmount: bullInput.selling_amount ?? "", dateSold: bullInput.date_sold || "", notes: bullInput.notes } : bull);
  writeJson(BULLS_KEY, updated);
  const newBull = updated.find((bull) => bull.id === id);
  await addActivity({ type: "Bull updated", title: `Bull ${newBull.tag} updated`, detail: `Status: ${newBull.status}. Location: ${newBull.location}.`, user: values.user || "Alex", cowTag: null });
  return newBull;
}

export async function createCow(values) {
  const cowInput = {
    tag: values.tag.trim(),
    status: values.status || "Active",
    color: values.color.trim() || "No description yet",
    location: values.location.trim() || "Not set",
    last_calved: values.lastCalved ? formatInputDate(values.lastCalved) : "Not calved yet",
    calf_tag: values.calfTag.trim() || null,
    purchase_cost: formatMoney(values.purchaseCost),
    date_bought: formatOptionalDate(values.dateBought),
    selling_amount: formatMoney(values.sellingAmount),
    date_sold: formatOptionalDate(values.dateSold),
    notes: values.notes.trim() || "No notes yet.",
    created_by: values.user || "Alex",
    updated_by: values.user || "Alex",
  };

  if (hasSupabaseConfig) {
    const { data, error } = await insertCowWithFallback(cowInput);
    if (error) throw error;
    await addActivity({
      type: "Cow added",
      title: `Cow ${data.tag} added`,
      detail: data.notes,
      user: values.user || "Alex",
      cowTag: data.tag,
    });
    return cowFromDb(data);
  }

  const cows = getCows();
  const cow = {
    id: `cow-${Date.now()}`,
    tag: cowInput.tag,
    status: cowInput.status,
    color: cowInput.color,
    location: cowInput.location,
    lastCalved: cowInput.last_calved,
    calfTag: cowInput.calf_tag,
    purchaseCost: cowInput.purchase_cost ?? "",
    dateBought: cowInput.date_bought || "",
    sellingAmount: cowInput.selling_amount ?? "",
    dateSold: cowInput.date_sold || "",
    notes: cowInput.notes,
  };
  writeJson(COWS_KEY, [cow, ...cows]);
  addActivity({ type: "Cow added", title: `Cow ${cow.tag} added`, detail: cow.notes, user: values.user || "Alex", cowTag: cow.tag });
  return cow;
}

export async function updateCow(id, values) {
  const cowInput = {
    tag: values.tag.trim(),
    status: values.status,
    color: values.color.trim() || "No description yet",
    location: values.location.trim() || "Not set",
    last_calved: values.lastCalved ? formatInputDate(values.lastCalved) : "Not calved yet",
    calf_tag: values.calfTag.trim() || null,
    purchase_cost: formatMoney(values.purchaseCost),
    date_bought: formatOptionalDate(values.dateBought),
    selling_amount: formatMoney(values.sellingAmount),
    date_sold: formatOptionalDate(values.dateSold),
    notes: values.notes.trim() || "No notes yet.",
    updated_by: values.user || "Alex",
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseConfig) {
    const { data, error } = await updateCowWithFallback(id, cowInput);
    if (error) throw error;
    await addActivity({
      type: "Cow updated",
      title: `Cow ${data.tag} updated`,
      detail: `Status: ${data.status}. Location: ${data.location}.`,
      user: values.user || "Alex",
      cowTag: data.tag,
    });
    return cowFromDb(data);
  }

  const cows = getCows();
  const updated = cows.map((cow) =>
    cow.id === id
      ? { ...cow, tag: cowInput.tag, status: cowInput.status, color: cowInput.color, location: cowInput.location, lastCalved: cowInput.last_calved, calfTag: cowInput.calf_tag, purchaseCost: cowInput.purchase_cost ?? "", dateBought: cowInput.date_bought || "", sellingAmount: cowInput.selling_amount ?? "", dateSold: cowInput.date_sold || "", notes: cowInput.notes }
      : cow
  );
  writeJson(COWS_KEY, updated);
  const newCow = updated.find((cow) => cow.id === id);
  addActivity({ type: "Cow updated", title: `Cow ${newCow.tag} updated`, detail: `Status: ${newCow.status}. Location: ${newCow.location}.`, user: values.user || "Alex", cowTag: newCow.tag });
  return newCow;
}

export async function createCalf(values) {
  const calfInput = {
    tag: values.tag.trim(),
    cow_tag: values.cowTag.trim(),
    sex: values.sex || "Unknown",
    born: formatInputDate(values.born),
    status: values.status || "Active",
    notes: values.notes.trim() || "",
    created_by: values.user || "Alex",
    updated_by: values.user || "Alex",
  };

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from("calves").insert(calfInput).select("*").single();
    if (error) throw error;

    await supabase.from("cows").update({ calf_tag: data.tag, last_calved: data.born, updated_by: values.user || "Alex", updated_at: new Date().toISOString() }).eq("tag", data.cow_tag);

    await addActivity({
      type: "Calf added",
      title: `Cow ${data.cow_tag} had ${data.sex.toLowerCase()} calf ${data.tag}`,
      detail: data.notes || `Born ${data.born}.`,
      user: values.user || "Alex",
      cowTag: data.cow_tag,
    });
    return calfFromDb(data);
  }

  const calves = getCalves();
  const calf = { id: `calf-${Date.now()}`, tag: calfInput.tag, cowTag: calfInput.cow_tag, sex: calfInput.sex, born: calfInput.born, status: calfInput.status, notes: calfInput.notes };
  writeJson(CALVES_KEY, [calf, ...calves]);

  const cows = getCows().map((cow) => cow.tag === calf.cowTag ? { ...cow, calfTag: calf.tag, lastCalved: calf.born } : cow);
  writeJson(COWS_KEY, cows);

  await addActivity({ type: "Calf added", title: `Cow ${calf.cowTag} had ${calf.sex.toLowerCase()} calf ${calf.tag}`, detail: calf.notes || `Born ${calf.born}.`, user: values.user || "Alex", cowTag: calf.cowTag });
  return calf;
}

export async function addActivity(event) {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from("farm_events")
      .insert({ cow_tag: event.cowTag || null, type: event.type, title: event.title, detail: event.detail, user_name: event.user || "Sam" })
      .select("*")
      .single();
    if (error) throw error;
    return eventFromDb(data);
  }

  const activity = getActivity();
  const nextEvent = { id: Date.now(), time: "Just now", ...event };
  writeJson(ACTIVITY_KEY, [nextEvent, ...activity]);
  return nextEvent;
}

export function addNote(values) {
  const tag = values.tag.trim();
  const note = values.note.trim();
  return addActivity({ type: "Note", title: tag ? `Note for tag ${tag}` : "General note", detail: note, user: values.user || "Sam", cowTag: tag || null });
}

export function addVaccination(values) {
  const tag = values.tag.trim();
  const vaccine = values.vaccine.trim();
  const date = formatInputDate(values.date);
  const animalType = values.animalType || "Cow";
  const notes = values.notes.trim();
  return addActivity({
    type: "Vaccination",
    title: `${animalType} ${tag} vaccinated`,
    detail: `${vaccine} given ${date}.${notes ? ` ${notes}` : ""}`,
    user: values.user || "Sam",
    cowTag: tag || null,
  });
}
