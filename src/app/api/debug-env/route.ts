import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function GET() {
  return Response.json({ projectId, dataset, apiVersion });
}
