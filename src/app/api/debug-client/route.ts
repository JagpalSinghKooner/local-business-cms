import { NextResponse } from "next/server";
import { sanity } from "@/sanity/client";
import { groq } from "next-sanity";

function ensureNonProduction() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return null;
}

export async function GET() {
  const guard = ensureNonProduction();
  if (guard) return guard;

  const q = groq`{
    "services": count(*[_type=="service"]),
    "locations": count(*[_type=="location"])
  }`;
  const res = await sanity.fetch(q, {}, { perspective: "published" });
  return Response.json(res);
}
