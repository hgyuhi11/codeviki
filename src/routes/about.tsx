import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Shield, Users, Swords } from "lucide-react";
import { settingsQuery } from "@/lib/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "درباره ما — کالاف دیوتی ویکی" },
      {
        name: "description",
        content:
          "درباره تیم کالاف دیوتی ویکی؛ مرجع فارسی اسکین‌های لجندری و متیک، اسلحه‌ها و اخبار میدان نبرد.",
      },
      { property: "og:title", content: "درباره ما — کالاف دیوتی ویکی" },
      {
        property: "og:description",
        content: "مرجع فارسی اسکین‌ها، اسلحه‌ها و معرفی بازی کال آف دیوتی.",
      },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  { icon: Users, title: "اپراتورها", text: "بیوگرافی و تصویر اسکین‌های لجندری و متیک." },
  { icon: Swords, title: "زرادخانه", text: "معرفی گان‌ها و سلاح‌های محبوب بازی." },
  { icon: Shield, title: "بی‌طرف و رایگان", text: "بدون تبلیغات مزاحم، فقط محتوای بازی." },
];

function AboutPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-medium text-foreground">درباره ما</h1>
      <p className="mb-10 max-w-[62ch] text-sm leading-loose whitespace-pre-line text-muted-foreground">
        {settings?.about_text ?? ""}
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="border border-border/60 bg-card p-5">
            <pillar.icon className="mb-3 size-5 text-tactical" aria-hidden />
            <h2 className="mb-1 text-sm font-medium text-foreground">{pillar.title}</h2>
            <p className="text-xs leading-relaxed text-muted-foreground">{pillar.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
