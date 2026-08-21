import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { MediaImage } from "@/components/Media";
import { RarityBadge } from "@/components/ItemCard";
import { itemQuery } from "@/lib/content";

export const Route = createFileRoute("/characters/$id")({
  head: () => ({
    meta: [
      { title: "بیوگرافی اپراتور — کالاف دیوتی ویکی" },
      {
        name: "description",
        content: "تصویر، سطح نایابی و بیوگرافی کامل اسکین اپراتور کال آف دیوتی.",
      },
      { property: "og:title", content: "بیوگرافی اپراتور — کالاف دیوتی ویکی" },
      {
        property: "og:description",
        content: "تصویر، سطح نایابی و بیوگرافی کامل اسکین اپراتور کال آف دیوتی.",
      },
    ],
  }),
  component: CharacterDetail,
});

function CharacterDetail() {
  const { id } = Route.useParams();
  const { data: item, isLoading } = useQuery(itemQuery(id));

  if (isLoading) {
    return <p className="mx-auto max-w-5xl px-4 py-10 text-sm text-muted-foreground">در حال بارگذاری…</p>;
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="mb-4 text-sm text-muted-foreground">این کاراکتر پیدا نشد.</p>
        <Link to="/characters" className="text-sm text-tactical hover:underline">
          بازگشت به کاراکترها
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-8">
      <Link
        to="/characters"
        className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-3" aria-hidden />
        بازگشت به کاراکترها
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <MediaImage
          path={item.image_path}
          alt={item.name}
          className="aspect-[4/5] w-full rounded-md ring-1 ring-black/10"
          fallbackLabel="Operator"
        />
        <div>
          <div className="mb-3 flex items-center gap-3">
            <RarityBadge rarity={item.rarity} />
            {item.name_en ? (
              <span className="text-[10px] text-stencil text-muted-foreground">{item.name_en}</span>
            ) : null}
          </div>
          <h1 className="mb-3 text-2xl font-medium text-foreground">{item.name}</h1>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
          <h2 className="mb-2 text-xs text-stencil text-tactical">بیوگرافی</h2>
          <p className="text-sm leading-loose whitespace-pre-line text-foreground/85">
            {item.bio || "بیوگرافی برای این اپراتور ثبت نشده است."}
          </p>
        </div>
      </div>
    </article>
  );
}
