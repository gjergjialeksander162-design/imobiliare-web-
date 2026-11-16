import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { countNewLeads } from "@/lib/crm/new-leads";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { count: await countNewLeads() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
