import { localRepository } from "@/lib/repo/local";
import { supabaseRepository } from "@/lib/repo/supabase";
import type { PropertyRepository } from "@/lib/repo/types";

export function getRepository(): PropertyRepository {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  return hasSupabase ? supabaseRepository : localRepository;
}

export type { PropertyRepository };
