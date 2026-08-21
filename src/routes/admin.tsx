import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Trash2, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { MediaImage } from "@/components/Media";
import {
  CATEGORY_LABEL,
  RARITY_LABEL,
  itemsQuery,
  settingsQuery,
  type Item,
  type ItemCategory,
  type ItemRarity,
} from "@/lib/content";
import { MEDIA_BUCKET } from "@/lib/media";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "پنل مدیریت — کالاف دیوتی ویکی" },
      { name: "description", content: "پنل مدیریت محتوای سایت کالاف دیوتی ویکی." },
      { property: "og:title", content: "پنل مدیریت — کالاف دیوتی ویکی" },
      { property: "og:description", content: "بارگذاری و مدیریت کاراکترها، اسلحه‌ها و تیزر بازی." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const inputClass =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-tactical";
const labelClass = "mb-1 block text-xs text-muted-foreground";

function AdminPage() {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);

  if (loading) {
    return <p className="mx-auto max-w-md px-4 py-16 text-center text-sm text-muted-foreground">در حال بررسی…</p>;
  }

  if (!user) return <AuthCard />;

  if (isAdmin === null) {
    return <p className="mx-auto max-w-md px-4 py-16 text-center text-sm text-muted-foreground">در حال بررسی دسترسی…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 text-lg font-medium text-foreground">دسترسی مدیریت ندارید</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          حساب شما ({user.email}) نقش مدیر ندارد. از بخش کاربران در پنل کلود، نقش «admin» را به این
          حساب بدهید.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="border border-border px-4 py-2 text-sm text-foreground hover:bg-accent"
        >
          خروج از حساب
        </button>
      </div>
    );
  }

  return <AdminDashboard email={user.email ?? ""} />;
}

function AuthCard() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("خوش آمدید");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("حساب ساخته شد. اگر تأیید ایمیل فعال باشد، ایمیل خود را بررسی کنید.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ورود");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="border border-tactical/20 bg-card p-6 shadow-panel">
        <div className="mb-6 flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-tactical" />
          <h1 className="text-sm text-stencil text-tactical">پنل مدیریت مرکزی</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="email">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-tactical py-3 text-sm font-semibold text-tactical-foreground transition-transform active:scale-95 disabled:opacity-60"
          >
            {mode === "signin" ? "ورود به سیستم" : "ساخت حساب"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "حساب ندارید؟ ثبت‌نام" : "حساب دارید؟ ورود"}
        </button>
      </div>
    </div>
  );
}

type FormState = {
  id: string | null;
  category: ItemCategory;
  name: string;
  name_en: string;
  rarity: ItemRarity;
  summary: string;
  bio: string;
  sort_order: number;
  image_path: string | null;
};

const emptyForm: FormState = {
  id: null,
  category: "character",
  name: "",
  name_en: "",
  rarity: "legendary",
  summary: "",
  bio: "",
  sort_order: 0,
  image_path: null,
};

async function uploadFile(file: File, folder: string) {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

function AdminDashboard({ email }: { email: string }) {
  const queryClient = useQueryClient();
  const { data: items } = useQuery(itemsQuery());
  const { data: settings } = useQuery(settingsQuery);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [texts, setTexts] = useState({
    hero_title: "",
    hero_subtitle: "",
    game_intro: "",
    about_text: "",
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (settings) {
      setTexts({
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        game_intro: settings.game_intro,
        about_text: settings.about_text,
      });
    }
  }, [settings]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["items"] });
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
  }

  async function saveItem(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      let imagePath = form.image_path;
      if (file) imagePath = await uploadFile(file, form.category === "weapon" ? "weapons" : "characters");

      const payload = {
        category: form.category,
        name: form.name,
        name_en: form.name_en || null,
        rarity: form.rarity,
        summary: form.summary,
        bio: form.bio,
        sort_order: Number(form.sort_order) || 0,
        image_path: imagePath,
      };

      if (form.id) {
        const { error } = await supabase.from("items").update(payload).eq("id", form.id);
        if (error) throw error;
        toast.success("آیتم بروزرسانی شد");
      } else {
        const { error } = await supabase.from("items").insert(payload);
        if (error) throw error;
        toast.success("آیتم در پایگاه داده ثبت شد");
      }
      setForm(emptyForm);
      setFile(null);
      invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  const removeItem = useMutation({
    mutationFn: async (item: Item) => {
      if (item.image_path) await supabase.storage.from(MEDIA_BUCKET).remove([item.image_path]);
      const { error } = await supabase.from("items").delete().eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("آیتم حذف شد");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      let videoPath = settings?.teaser_video_path ?? null;
      if (videoFile) videoPath = await uploadFile(videoFile, "teaser");
      const { error } = await supabase
        .from("site_settings")
        .update({ ...texts, teaser_video_path: videoPath })
        .eq("id", 1);
      if (error) throw error;
      setVideoFile(null);
      toast.success("تنظیمات سایت ذخیره شد");
      invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره تنظیمات");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm text-stencil text-tactical">پنل مدیریت مرکزی</h1>
          <p dir="ltr" className="text-xs text-muted-foreground">
            {email}
          </p>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-2 border border-border px-3 py-2 text-xs text-foreground hover:bg-accent"
        >
          <LogOut className="size-3.5" aria-hidden />
          خروج
        </button>
      </div>

      <section className="border border-tactical/20 bg-card p-6">
        <h2 className="mb-4 text-sm font-medium text-foreground">
          {form.id ? "ویرایش آیتم" : "افزودن کاراکتر یا اسلحه"}
        </h2>
        <form onSubmit={saveItem} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>دسته‌بندی</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ItemCategory })}
                className={inputClass}
              >
                <option value="character">{CATEGORY_LABEL.character}</option>
                <option value="weapon">{CATEGORY_LABEL.weapon}</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>سطح نایابی</label>
              <select
                value={form.rarity}
                onChange={(e) => setForm({ ...form, rarity: e.target.value as ItemRarity })}
                className={inputClass}
              >
                <option value="mythic">{RARITY_LABEL.mythic}</option>
                <option value="legendary">{RARITY_LABEL.legendary}</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>نام (فارسی)</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثلاً: گوست - فک استخوانی"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>نام انگلیسی</label>
              <input
                dir="ltr"
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                placeholder="Ghost Jawbone"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>توضیح کوتاه</label>
            <textarea
              rows={2}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>بیوگرافی / معرفی کامل</label>
            <textarea
              rows={5}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>ترتیب نمایش</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>تصویر</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full border border-dashed border-border bg-background px-3 py-2 text-xs text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-tactical py-3 text-sm font-semibold text-tactical-foreground transition-transform active:scale-95 disabled:opacity-60"
            >
              {form.id ? "ذخیره تغییرات" : "ثبت در پایگاه داده"}
            </button>
            {form.id ? (
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setFile(null);
                }}
                className="flex items-center gap-1 border border-border px-4 text-xs text-muted-foreground hover:bg-accent"
              >
                <X className="size-3.5" aria-hidden />
                انصراف
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-8 border-t border-border pt-6">
          <h3 className="mb-4 text-xs font-medium text-muted-foreground">آیتم‌های ثبت‌شده</h3>
          {(items ?? []).length === 0 ? (
            <p className="text-xs text-muted-foreground">هنوز آیتمی ثبت نشده است.</p>
          ) : (
            <ul className="divide-y divide-border">
              {(items ?? []).map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <MediaImage
                      path={item.image_path}
                      alt={item.name}
                      className="size-10 rounded-sm"
                      fallbackLabel=""
                    />
                    <div>
                      <p className="text-xs text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {CATEGORY_LABEL[item.category]} · {RARITY_LABEL[item.rarity]}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setForm({
                          id: item.id,
                          category: item.category,
                          name: item.name,
                          name_en: item.name_en ?? "",
                          rarity: item.rarity,
                          summary: item.summary,
                          bio: item.bio,
                          sort_order: item.sort_order,
                          image_path: item.image_path,
                        })
                      }
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3" aria-hidden />
                      ویرایش
                    </button>
                    <button
                      onClick={() => removeItem.mutate(item)}
                      className="flex items-center gap-1 text-[10px] text-destructive"
                    >
                      <Trash2 className="size-3" aria-hidden />
                      حذف
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="border border-border/60 bg-card p-6">
        <h2 className="mb-4 text-sm font-medium text-foreground">متن‌های سایت و تیزر گیم‌پلی</h2>
        <form onSubmit={saveSettings} className="space-y-4">
          <div>
            <label className={labelClass}>عنوان صفحه اصلی</label>
            <input
              value={texts.hero_title}
              onChange={(e) => setTexts({ ...texts, hero_title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>زیرعنوان صفحه اصلی</label>
            <textarea
              rows={2}
              value={texts.hero_subtitle}
              onChange={(e) => setTexts({ ...texts, hero_subtitle: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>معرفی بازی</label>
            <textarea
              rows={5}
              value={texts.game_intro}
              onChange={(e) => setTexts({ ...texts, game_intro: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>متن درباره ما</label>
            <textarea
              rows={5}
              value={texts.about_text}
              onChange={(e) => setTexts({ ...texts, about_text: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>ویدیو تیزر گیم‌پلی (mp4)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="w-full border border-dashed border-border bg-background px-3 py-2 text-xs text-muted-foreground"
            />
            {settings?.teaser_video_path ? (
              <p dir="ltr" className="mt-1 text-[10px] text-muted-foreground">
                {settings.teaser_video_path}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-tactical py-3 text-sm font-semibold text-tactical-foreground transition-transform active:scale-95 disabled:opacity-60"
          >
            ذخیره تنظیمات
          </button>
        </form>
      </section>
    </div>
  );
}
