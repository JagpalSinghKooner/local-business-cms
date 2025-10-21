import { NextResponse } from "next/server";
import { apiVersion, dataset, projectId } from "@/sanity/env";

function ensureNonProduction() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return null;
}

export async function GET() {
  const guard = ensureNonProduction();
  if (guard) return guard;
  return Response.json({ projectId, dataset, apiVersion });
}
