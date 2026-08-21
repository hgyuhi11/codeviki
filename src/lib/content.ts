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

export type ItemMedia = {
  id: string;
  item_id: string;
  media_path: string;
  alt_text: string | null;
  sort_order: number;
};

export type WeaponStats = {
  item_id: string;
  damage: number | null;
  accuracy: number | null;
  range: number | null;
  fire_rate: number | null;
  mobility: number | null;
  control: number | null;
  penetration: number | null;
  magazine_size: number | null;
  reload_time: number | null;
  description: string | null;
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

export const itemMediaQuery = (itemId: string) =>
  queryOptions({
    queryKey: ["item-media", itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("item_media")
        .select("*")
        .eq("item_id", itemId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ItemMedia[];
    },
  });

export const weaponStatsQuery = (itemId: string) =>
  queryOptions({
    queryKey: ["weapon-stats", itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weapon_stats")
        .select("*")
        .eq("item_id", itemId)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as WeaponStats | null;
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
