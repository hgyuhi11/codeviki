import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { WeaponCard } from "@/components/ItemCard";
import { itemsQuery, RARITY_LABEL, type ItemRarity } from "@/lib/content";
import { cn } from "@/lib/utils";

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
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState<"all" | ItemRarity>("all");
  const items = (data ?? []).filter((item) => {
    const matchRarity = rarity === "all" || item.rarity === rarity;
    const term = search.trim().toLocaleLowerCase("fa");
    return matchRarity && (!term || `${item.name} ${item.name_en ?? ""} ${item.summary}`.toLocaleLowerCase("fa").includes(term));
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="mb-1 text-2xl font-medium text-foreground">اسلحه‌ها</h1>
        <p className="text-sm text-muted-foreground">
          گان‌های لجندری و متیک با تصویر و معرفی کامل.
        </p>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی نام یا معرفی اسلحه" className="border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-tactical" />
        <div className="no-scrollbar flex gap-2 overflow-x-auto">{(["all", "mythic", "legendary"] as const).map((value) => <button key={value} onClick={() => setRarity(value)} className={cn("rounded-sm border px-3 py-2 text-xs whitespace-nowrap", rarity === value ? "border-tactical text-tactical" : "border-border text-muted-foreground")}>{value === "all" ? "همه" : RARITY_LABEL[value]}</button>)}</div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری…</p>
      ) : items.length === 0 ? (
        <p className="border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {search || rarity !== "all" ? "نتیجه‌ای پیدا نشد." : "هنوز اسلحه‌ای ثبت نشده است."}
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
