import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

const readEnv = (key: string): string | undefined => {
  const importMetaEnv = (import.meta as { env?: Record<string, string | undefined> }).env;
  if (importMetaEnv?.[key]) return importMetaEnv[key];

  const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return processEnv?.[key];
};

export const getSupabaseClient = (): SupabaseClient => {
  if (client) return client;

  const supabaseUrl = readEnv("VITE_SUPABASE_URL") ?? readEnv("SUPABASE_URL");
  const supabaseAnonKey = readEnv("VITE_SUPABASE_ANON_KEY") ?? readEnv("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
};
