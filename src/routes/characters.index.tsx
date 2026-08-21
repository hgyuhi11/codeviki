import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CharacterCard } from "@/components/ItemCard";
import { itemsQuery, RARITY_LABEL, type ItemRarity } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/characters/")({
  head: () => ({
    meta: [
      { title: "کاراکترها — اسکین‌های لجندری و متیک کالاف دیوتی" },
      {
        name: "description",
        content:
          "گالری اسکین‌های لجندری و متیک اپراتورهای کال آف دیوتی همراه با تصویر و بیوگرافی کامل.",
      },
      { property: "og:title", content: "کاراکترها — اسکین‌های لجندری و متیک" },
      {
        property: "og:description",
        content: "تصویر و بیوگرافی اسکین‌های لجندری و متیک اپراتورهای کال آف دیوتی.",
      },
    ],
  }),
  component: CharactersPage,
});

const FILTERS: Array<{ value: "all" | ItemRarity; label: string }> = [
  { value: "all", label: "همه" },
  { value: "mythic", label: RARITY_LABEL.mythic },
  { value: "legendary", label: RARITY_LABEL.legendary },
];

function CharactersPage() {
  const { data, isLoading } = useQuery(itemsQuery("character"));
  const [filter, setFilter] = useState<"all" | ItemRarity>("all");

  const items = (data ?? []).filter((item) => filter === "all" || item.rarity === filter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="mb-1 text-2xl font-medium text-foreground">کاراکترها</h1>
        <p className="text-sm text-muted-foreground">
          اسکین‌های لجندری و متیک اپراتورها با تصویر و بیوگرافی.
        </p>
      </header>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              "rounded-sm border px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
              filter === option.value
                ? "border-tactical text-tactical"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری…</p>
      ) : items.length === 0 ? (
        <p className="border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          هنوز کاراکتری ثبت نشده است.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <CharacterCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
