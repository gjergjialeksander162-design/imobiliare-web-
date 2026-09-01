import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { uploadPropertyImage } from "@/lib/storage";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "I paautorizuar" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Asnjë foto e zgjedhur" }, { status: 400 });
  }

  try {
    const urls = await Promise.all(files.map(uploadPropertyImage));
    return NextResponse.json({ urls });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ngarkimi dështoi" },
      { status: 500 },
    );
  }
}
