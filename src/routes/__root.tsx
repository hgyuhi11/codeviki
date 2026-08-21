import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Crosshair } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

const NAV = [
  { to: "/", label: "خانه" },
  { to: "/characters", label: "کاراکترها" },
  { to: "/weapons", label: "اسلحه‌ها" },
  { to: "/about", label: "درباره ما" },
] as const;

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-sm bg-tactical">
            <Crosshair className="size-4 text-tactical-foreground" aria-hidden />
          </span>
          <span className="text-sm font-medium tracking-tight text-foreground">
            کالاف دیوتی ویکی
          </span>
        </Link>
        <Link to="/admin" className="text-xs font-medium text-tactical hover:underline">
          ورود مدیریت
        </Link>
      </div>
      <nav className="border-t border-border/50">
        <div className="no-scrollbar mx-auto flex max-w-5xl gap-6 overflow-x-auto px-4 py-3">
          {NAV.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-foreground border-b-2 border-tactical pb-1" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="text-sm font-medium whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-surface py-10">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
          این یک سایت طرفداری برای بازی کال آف دیوتی است و هیچ ارتباط رسمی با اکتیویژن ندارد.
        </p>
        <div className="flex justify-center gap-8 text-xs text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">
            درباره ما
          </Link>
          <Link to="/characters" className="hover:text-foreground">
            کاراکترها
          </Link>
          <Link to="/weapons" className="hover:text-foreground">
            اسلحه‌ها
          </Link>
        </div>
      </div>
    </footer>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">۴۰۴</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">صفحه پیدا نشد</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          این صفحه وجود ندارد یا جابه‌جا شده است.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          این صفحه بارگذاری نشد
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          مشکلی پیش آمد. می‌توانید دوباره تلاش کنید یا به خانه برگردید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            تلاش دوباره
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            بازگشت به خانه
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "کالاف دیوتی ویکی — اسکین‌ها و اسلحه‌ها" },
      {
        name: "description",
        content: "مرجع فارسی اسکین‌های لجندری و متیک، اسلحه‌ها و معرفی بازی کال آف دیوتی.",
      },
      { property: "og:title", content: "کالاف دیوتی ویکی" },
      {
        property: "og:description",
        content: "اسکین‌های لجندری و متیک، زرادخانه و تیزر گیم‌پلی کال آف دیوتی.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
