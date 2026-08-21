import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Radio } from "lucide-react";
import { MediaVideo } from "@/components/Media";
import { CharacterCard, WeaponCard } from "@/components/ItemCard";
import { itemsQuery, settingsQuery } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "کالاف دیوتی ویکی — معرفی بازی، اسکین‌ها و اسلحه‌ها" },
      {
        name: "description",
        content:
          "معرفی بازی کال آف دیوتی همراه با تیزر گیم‌پلی، اسکین‌های لجندری و متیک کاراکترها و زرادخانه اسلحه‌ها.",
      },
      { property: "og:title", content: "کالاف دیوتی ویکی — معرفی بازی و اسکین‌ها" },
      {
        property: "og:description",
        content: "تیزر گیم‌پلی، اسکین‌های لجندری و متیک و زرادخانه کامل کال آف دیوتی.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: characters } = useQuery(itemsQuery("character"));
  const { data: weapons } = useQuery(itemsQuery("weapon"));

  const topCharacters = (characters ?? []).slice(0, 2);
  const topWeapons = (weapons ?? []).slice(0, 4);

  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 py-6">
        <MediaVideo path={settings?.teaser_video_path} className="aspect-video w-full rounded-md" />
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <Radio className="size-3.5 text-tactical" aria-hidden />
            <span className="text-[10px] text-stencil text-muted-foreground">
              Operation Briefing
            </span>
          </div>
          <h1 className="mb-3 text-3xl leading-tight font-medium text-balance text-foreground">
            {settings?.hero_title ?? "گزارش عملیات"}
          </h1>
          <p className="max-w-[56ch] text-base leading-relaxed text-pretty text-muted-foreground">
            {settings?.hero_subtitle ?? ""}
          </p>
        </div>
      </section>

      <section className="border-t border-border/60 bg-surface/40 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-4 text-xl font-medium text-foreground">معرفی بازی</h2>
          <p className="text-sm leading-loose whitespace-pre-line text-muted-foreground">
            {settings?.game_intro ?? ""}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium text-foreground">اپراتورهای ویژه</h2>
          <Link
            to="/characters"
            className="flex items-center gap-1 text-xs text-tactical hover:underline"
          >
            همه کاراکترها
            <ArrowLeft className="size-3" aria-hidden />
          </Link>
        </div>
        {topCharacters.length === 0 ? (
          <EmptyHint />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {topCharacters.map((item) => (
              <CharacterCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border/60 bg-surface/40 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-foreground">زرادخانه پیشرفته</h2>
            <Link
              to="/weapons"
              className="flex items-center gap-1 text-xs text-tactical hover:underline"
            >
              همه اسلحه‌ها
              <ArrowLeft className="size-3" aria-hidden />
            </Link>
          </div>
          {topWeapons.length === 0 ? (
            <EmptyHint />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {topWeapons.map((item) => (
                <WeaponCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyHint() {
  return (
    <p className="border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      هنوز محتوایی ثبت نشده است. از پنل مدیریت اولین آیتم را اضافه کنید.
    </p>
  );
}
