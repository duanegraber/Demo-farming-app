import { createClient } from "@supabase/supabase-js";

function cleanEnvValue(value) {
  return (value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");
}

function jwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(globalThis.atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function projectRefFromUrl(value) {
  try {
    return new URL(value).hostname.split(".")[0];
  } catch {
    return null;
  }
}

function validAnonKeyForUrl(key, url) {
  const payload = jwtPayload(key);
  const ref = projectRefFromUrl(url);
  return Boolean(key.length < 300 && payload?.role === "anon" && payload?.ref === ref);
}

export const supabaseUrl = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
const envSupabaseAnonKey = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const supabaseAnonKey = validAnonKeyForUrl(envSupabaseAnonKey, supabaseUrl) ? envSupabaseAnonKey : "";

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const hasSupabaseConfig = Boolean(
  isValidHttpUrl(supabaseUrl) && supabaseAnonKey.length > 0
);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
