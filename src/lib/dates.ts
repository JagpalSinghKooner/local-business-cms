export function formatOfferValidity(from?: string, to?: string) {
  if (!from && !to) return null;

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const start = from ? formatter.format(new Date(from)) : null;
  const end = to ? formatter.format(new Date(to)) : null;

  if (start && end) return `Valid ${start} – ${end}`;
  if (start) return `Valid from ${start}`;
  if (end) return `Valid until ${end}`;
  return null;
}
