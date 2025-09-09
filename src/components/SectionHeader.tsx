export default function SectionHeader({
  eyebrow, title, subtitle, center = true
}: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && <div className="mb-2 text-xs font-medium uppercase tracking-widest text-blue-600">{eyebrow}</div>}
      <h1 className="font-playfair text-4xl text-gray-900 sm:text-5xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-3 max-w-3xl text-gray-600">{subtitle}</p>}
    </div>
  );
}
