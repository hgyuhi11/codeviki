import { Link } from "@tanstack/react-router";
import { MediaImage } from "@/components/Media";
import { RARITY_LABEL, type Item } from "@/lib/content";
import { cn } from "@/lib/utils";

export function RarityBadge({ rarity }: { rarity: Item["rarity"] }) {
  return (
    <span
      className={cn(
        "rounded-sm border px-2 py-0.5 text-[10px] font-medium",
        rarity === "mythic"
          ? "border-mythic/40 bg-mythic/20 text-mythic"
          : "border-legend/40 bg-legend/20 text-legend",
      )}
    >
      {RARITY_LABEL[rarity]}
    </span>
  );
}

export function CharacterCard({ item }: { item: Item }) {
  return (
    <article className="overflow-hidden rounded-md border border-border/60 bg-card ring-1 ring-black/5">
      <div className="relative">
        <MediaImage
          path={item.image_path}
          alt={item.name}
          className="aspect-[4/5] w-full"
          fallbackLabel="Operator"
        />
        <div className="absolute top-3 left-3">
          <RarityBadge rarity={item.rarity} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-medium text-foreground">{item.name}</h3>
        {item.name_en ? (
          <p className="mb-1 text-[10px] text-stencil text-muted-foreground">{item.name_en}</p>
        ) : null}
        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>
        <Link
          to="/characters/$id"
          params={{ id: item.id }}
          className="block w-full border border-border bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
        >
          مشاهده بیوگرافی کامل
        </Link>
      </div>
    </article>
  );
}

export function WeaponCard({ item }: { item: Item }) {
  return (
    <Link to="/weapons/$id" params={{ id: item.id }} className="group block">
      <MediaImage
        path={item.image_path}
        alt={item.name}
        className="mb-2 aspect-[4/3] w-full rounded-sm ring-1 ring-black/5 transition-transform group-hover:scale-[1.02]"
        fallbackLabel="Weapon"
      />
      <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
      <span
        className={cn(
          "text-[10px]",
          item.rarity === "mythic" ? "text-mythic" : "text-legend",
        )}
      >
        {RARITY_LABEL[item.rarity]}
      </span>
    </Link>
  );
}
