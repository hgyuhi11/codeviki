import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { ItemGallery } from "@/components/ItemGallery";
import { WeaponStatsPanel } from "@/components/WeaponStatsPanel";
import { RarityBadge } from "@/components/ItemCard";
import { itemQuery, weaponStatsQuery } from "@/lib/content";

export const Route = createFileRoute("/weapons/$id")({
  head: () => ({
    meta: [
      { title: "معرفی اسلحه — کالاف دیوتی ویکی" },
      {
        name: "description",
        content: "تصویر، سطح نایابی و معرفی کامل گان کال آف دیوتی.",
      },
      { property: "og:title", content: "معرفی اسلحه — کالاف دیوتی ویکی" },
      {
        property: "og:description",
        content: "تصویر، سطح نایابی و معرفی کامل گان کال آف دیوتی.",
      },
    ],
  }),
  component: WeaponDetail,
});

function WeaponDetail() {
  const { id } = Route.useParams();
  const { data: item, isLoading } = useQuery(itemQuery(id));
  const { data: stats } = useQuery(weaponStatsQuery(id));

  if (isLoading) {
    return <p className="mx-auto max-w-5xl px-4 py-10 text-sm text-muted-foreground">در حال بارگذاری…</p>;
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="mb-4 text-sm text-muted-foreground">این اسلحه پیدا نشد.</p>
        <Link to="/weapons" className="text-sm text-tactical hover:underline">
          بازگشت به اسلحه‌ها
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-8">
      <Link
        to="/weapons"
        className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-3" aria-hidden />
        بازگشت به اسلحه‌ها
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <ItemGallery itemId={item.id} fallbackPath={item.image_path} alt={item.name} />
        <div>
          <div className="mb-3 flex items-center gap-3">
            <RarityBadge rarity={item.rarity} />
            {item.name_en ? (
              <span className="text-[10px] text-stencil text-muted-foreground">{item.name_en}</span>
            ) : null}
          </div>
          <h1 className="mb-3 text-2xl font-medium text-foreground">{item.name}</h1>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
          <h2 className="mb-2 text-xs text-stencil text-tactical">معرفی گان</h2>
          <p className="text-sm leading-loose whitespace-pre-line text-foreground/85">
            {item.bio || "توضیحی برای این اسلحه ثبت نشده است."}
          </p>
          <WeaponStatsPanel stats={stats ?? null} />
        </div>
      </div>
    </article>
  );
}
