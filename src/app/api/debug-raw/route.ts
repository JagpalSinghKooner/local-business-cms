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

  const q = `{"services": count(*[_type=="service"]), "locations": count(*[_type=="location"])}`;
  const base = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(q)}`;

  const publishedUrl = `${base}&perspective=published`;
  const draftsUrl = `${base}&perspective=drafts`; // likely 401 if dataset is not public or no token

  const [pubRes, drfRes] = await Promise.all([
    fetch(publishedUrl, { cache: "no-store" }).then(r => r.json()).catch(e => ({ error: String(e) })),
    fetch(draftsUrl, { cache: "no-store" }).then(r => r.json()).catch(e => ({ error: String(e) })),
  ]);

  return Response.json({ publishedUrl, draftsUrl, published: pubRes, drafts: drfRes });
}
