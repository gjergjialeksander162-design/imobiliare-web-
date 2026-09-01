import { localCrm } from "@/lib/crm/local";
import type { CrmRepository } from "@/lib/crm/repo-types";
import { supabaseCrm } from "@/lib/crm/supabase";

export function getCrm(): CrmRepository {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  return hasSupabase ? supabaseCrm : localCrm;
}

export type { CrmRepository };
