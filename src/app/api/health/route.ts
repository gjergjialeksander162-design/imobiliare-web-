import { NextResponse } from "next/server";

import { getRepository } from "@/lib/repo";

export const dynamic = "force-dynamic";

// Thirret çdo ditë nga Vercel Cron (vercel.json) që projekti Supabase në planin falas
// të mos kalojë në pauzë nga mungesa e trafikut; shërben edhe si kontroll shëndeti.
export async function GET() {
  const repo = getRepository();
  try {
    const properties = await repo.list();
    return NextResponse.json({
      ok: true,
      source: repo.name,
      properties: properties.length,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: repo.name,
        error: error instanceof Error ? error.message : "unknown",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
