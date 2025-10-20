import { sanity } from "@/sanity/client";
import { groq } from "next-sanity";

export async function GET() {
  const q = groq`{
    "services": count(*[_type=="service"]),
    "locations": count(*[_type=="location"])
  }`;
  const res = await sanity.fetch(q, {}, { perspective: "published" });
  return Response.json(res);
}
