import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { WeaponCard } from "@/components/ItemCard";
import { itemsQuery } from "@/lib/content";

export const Route = createFileRoute("/weapons/")({
  head: () => ({
    meta: [
      { title: "اسلحه‌ها — زرادخانه گان‌های کالاف دیوتی" },
      {
        name: "description",
        content: "زرادخانه کامل گان‌های کال آف دیوتی همراه با تصویر و معرفی هر اسلحه.",
      },
      { property: "og:title", content: "اسلحه‌ها — زرادخانه گان‌های کالاف دیوتی" },
      {
        property: "og:description",
        content: "تصویر و معرفی گان‌های لجندری و متیک کال آف دیوتی.",
      },
    ],
  }),
  component: WeaponsPage,
});

function WeaponsPage() {
  const { data, isLoading } = useQuery(itemsQuery("weapon"));
  const items = data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="mb-1 text-2xl font-medium text-foreground">اسلحه‌ها</h1>
        <p className="text-sm text-muted-foreground">
          گان‌های لجندری و متیک با تصویر و معرفی کامل.
        </p>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری…</p>
      ) : items.length === 0 ? (
        <p className="border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          هنوز اسلحه‌ای ثبت نشده است.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item) => (
            <WeaponCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
