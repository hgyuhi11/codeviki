import { type WeaponStats } from "@/lib/content";

const stats: Array<[keyof WeaponStats, string]> = [["damage", "قدرت"], ["accuracy", "دقت"], ["range", "برد"], ["fire_rate", "سرعت شلیک"], ["mobility", "تحرک"], ["control", "کنترل"], ["penetration", "نفوذ"]];

export function WeaponStatsPanel({ stats: weaponStats }: { stats: WeaponStats | null }) {
  if (!weaponStats) return null;
  const visible = stats.filter(([key]) => typeof weaponStats[key] === "number");
  return <section className="mt-8 border border-border/60 bg-card p-5">
    <h2 className="mb-4 text-xs text-stencil text-tactical">مشخصات فنی</h2>
    <div className="grid gap-3 sm:grid-cols-2">{visible.map(([key, label]) => <div key={key} className="flex items-center justify-between border-b border-border/60 pb-2 text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground">{weaponStats[key]}</span></div>)}</div>
    {(weaponStats.magazine_size !== null || weaponStats.reload_time !== null) ? <p className="mt-4 text-xs text-muted-foreground">{weaponStats.magazine_size !== null ? `خشاب: ${weaponStats.magazine_size}` : ""}{weaponStats.magazine_size !== null && weaponStats.reload_time !== null ? " · " : ""}{weaponStats.reload_time !== null ? `زمان بارگذاری: ${weaponStats.reload_time}` : ""}</p> : null}
    {weaponStats.description ? <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{weaponStats.description}</p> : null}
  </section>;
}
