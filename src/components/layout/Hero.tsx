import Image from "next/image";
import Container from "@/components/layout/Container";

export default function Hero({
  image,
  eyebrow,
  heading,
  sub,
  ctas,
}: {
  image?: { src: string; alt?: string };
  eyebrow?: string;
  heading: string;
  sub?: string;
  ctas?: { label: string; href: string }[];
}) {
  return (
    <section className="relative min-h-[720px] w-full overflow-hidden">
      {image?.src && (
        <Image src={image.src} alt={image.alt ?? ""} fill priority sizes="100vw" className="object-cover" fetchPriority="high" />
      )}
      <div className="absolute inset-0 bg-black/25" aria-hidden />
      <div className="relative">
        <Container className="min-h-[720px] flex flex-col justify-center text-white">
          {eyebrow && <p className="text-xs uppercase tracking-wide">{eyebrow}</p>}
          <h1 className="text-4xl md:text-5xl font-semibold">{heading}</h1>
          {sub && <p className="mt-3 max-w-[60ch]">{sub}</p>}
          {ctas?.length ? (
            <div className="mt-5 flex gap-3">
              {ctas.map((c) => (
                <a key={c.href} href={c.href} className="rounded-md bg-white text-black px-4 py-2 text-sm font-medium">
                  {c.label}
                </a>
              ))}
            </div>
          ) : null}
        </Container>
      </div>
    </section>
  );
}
