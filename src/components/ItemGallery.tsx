import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MediaImage } from "@/components/Media";
import { itemMediaQuery, type ItemMedia } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ItemGallery({ itemId, fallbackPath, alt, className }: { itemId: string; fallbackPath: string | null; alt: string; className?: string }) {
  const { data } = useQuery(itemMediaQuery(itemId));
  const media: ItemMedia[] = data ?? [];
  const [active, setActive] = useState(0);
  const paths = media.length ? media.map((entry) => ({ path: entry.media_path, alt: entry.alt_text || alt })) : [{ path: fallbackPath, alt }];
  const selected = paths[Math.min(active, paths.length - 1)];

  return <div className={className}>
    <MediaImage path={selected.path} alt={selected.alt} className="aspect-[4/3] w-full rounded-md ring-1 ring-black/10" fallbackLabel="Media" />
    {paths.length > 1 ? <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
      {paths.map((entry, index) => <button key={`${entry.path}-${index}`} type="button" onClick={() => setActive(index)} className={cn("shrink-0 border p-0.5", index === active ? "border-tactical" : "border-border")}> 
        <MediaImage path={entry.path} alt="" className="size-16 rounded-sm" fallbackLabel="" />
      </button>)}
    </div> : null}
  </div>;
}
