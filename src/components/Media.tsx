import { useQuery } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";
import { mediaUrlQuery } from "@/lib/media";
import { cn } from "@/lib/utils";

export function MediaImage({
  path,
  alt,
  className,
  fallbackLabel = "بدون تصویر",
}: {
  path: string | null | undefined;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}) {
  const { data: url } = useQuery(mediaUrlQuery(path));

  if (!path || !url) {
    return (
      <div
        className={cn(
          "grid place-items-center gap-2 bg-surface-2 text-muted-foreground",
          className,
        )}
      >
        <ImageOff className="size-5 opacity-40" aria-hidden />
        <span className="text-[10px] text-stencil">{fallbackLabel}</span>
      </div>
    );
  }

  return <img src={url} alt={alt} loading="lazy" className={cn("object-cover", className)} />;
}

export function MediaVideo({
  path,
  className,
  poster,
}: {
  path: string | null | undefined;
  className?: string;
  poster?: string;
}) {
  const { data: url } = useQuery(mediaUrlQuery(path));

  if (!path || !url) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-surface text-muted-foreground",
          className,
        )}
      >
        <span className="text-[10px] text-stencil">تیزر گیم‌پلی هنوز بارگذاری نشده</span>
      </div>
    );
  }

  return (
    <video
      src={url}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className={cn("bg-black object-cover", className)}
    />
  );
}
