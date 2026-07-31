type Props = { name: string; className?: string };

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export function ProductThumb({ name, className = "" }: Props) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-secondary ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,var(--color-accent),transparent_60%)] opacity-70" />
      <span className="relative font-display text-3xl font-semibold text-muted-foreground/50">
        {initials(name)}
      </span>
    </div>
  );
}
