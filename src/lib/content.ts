import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ItemCategory = "character" | "weapon";
export type ItemRarity = "legendary" | "mythic";

export type Item = {
  id: string;
  category: ItemCategory;
  name: string;
  name_en: string | null;
  rarity: ItemRarity;
  summary: string;
  bio: string;
  image_path: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  game_intro: string;
  about_text: string;
  teaser_video_path: string | null;
};

export const RARITY_LABEL: Record<ItemRarity, string> = {
  legendary: "لجندری",
  mythic: "متیک",
};

export const CATEGORY_LABEL: Record<ItemCategory, string> = {
  character: "کاراکتر",
  weapon: "اسلحه",
};

export const itemsQuery = (category?: ItemCategory) =>
  queryOptions({
    queryKey: ["items", category ?? "all"],
    queryFn: async () => {
      let query = supabase
        .from("items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Item[];
    },
  });

export const itemQuery = (id: string) =>
  queryOptions({
    queryKey: ["item", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("items").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return (data ?? null) as Item | null;
    },
  });

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as SiteSettings | null;
  },
});
