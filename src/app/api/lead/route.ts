import { z } from "zod";

const LeadZ = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  service: z.string().optional(),
  city: z.string().optional(),
  message: z.string().optional(),
  hp: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  const data = await req.json();
  const lead = LeadZ.parse(data);

  if (lead.hp) return Response.json({ ok: true }); // bot ignored

  // TODO: send to Jobber webhook/API using process.env.JOBBER_WEBHOOK_URL
  // await fetch(process.env.JOBBER_WEBHOOK_URL!, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(lead) });

  return Response.json({ ok: true });
}
