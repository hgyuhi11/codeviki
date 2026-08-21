-- Additive-only content upgrade. Existing tables and rows are preserved.

CREATE TABLE IF NOT EXISTS public.item_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  media_path text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.item_media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.item_media TO authenticated;
GRANT ALL ON public.item_media TO service_role;
ALTER TABLE public.item_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read item media" ON public.item_media;
CREATE POLICY "Public can read item media" ON public.item_media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can insert item media" ON public.item_media;
CREATE POLICY "Admins can insert item media" ON public.item_media FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update item media" ON public.item_media;
CREATE POLICY "Admins can update item media" ON public.item_media FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete item media" ON public.item_media;
CREATE POLICY "Admins can delete item media" ON public.item_media FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_item_media_item_sort ON public.item_media (item_id, sort_order, created_at);

CREATE TABLE IF NOT EXISTS public.weapon_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL UNIQUE REFERENCES public.items(id) ON DELETE CASCADE,
  damage numeric,
  accuracy numeric,
  range numeric,
  fire_rate numeric,
  mobility numeric,
  control numeric,
  penetration numeric,
  magazine_size integer,
  reload_time numeric,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT weapon_stats_values_nonnegative CHECK (
    (damage IS NULL OR damage >= 0) AND (accuracy IS NULL OR accuracy >= 0) AND
    (range IS NULL OR range >= 0) AND (fire_rate IS NULL OR fire_rate >= 0) AND
    (mobility IS NULL OR mobility >= 0) AND (control IS NULL OR control >= 0) AND
    (penetration IS NULL OR penetration >= 0) AND (magazine_size IS NULL OR magazine_size >= 0) AND
    (reload_time IS NULL OR reload_time >= 0)
  )
);

GRANT SELECT ON public.weapon_stats TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.weapon_stats TO authenticated;
GRANT ALL ON public.weapon_stats TO service_role;
ALTER TABLE public.weapon_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read weapon stats" ON public.weapon_stats;
CREATE POLICY "Public can read weapon stats" ON public.weapon_stats FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can insert weapon stats" ON public.weapon_stats;
CREATE POLICY "Admins can insert weapon stats" ON public.weapon_stats FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') AND EXISTS (SELECT 1 FROM public.items WHERE id = item_id AND category = 'weapon'));
DROP POLICY IF EXISTS "Admins can update weapon stats" ON public.weapon_stats;
CREATE POLICY "Admins can update weapon stats" ON public.weapon_stats FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') AND EXISTS (SELECT 1 FROM public.items WHERE id = item_id AND category = 'weapon'));
DROP POLICY IF EXISTS "Admins can delete weapon stats" ON public.weapon_stats;
CREATE POLICY "Admins can delete weapon stats" ON public.weapon_stats FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER weapon_stats_updated_at BEFORE UPDATE ON public.weapon_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_items_category_rarity_sort ON public.items (category, rarity, sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_name ON public.items (name);
CREATE INDEX IF NOT EXISTS idx_items_name_en ON public.items (name_en);
CREATE INDEX IF NOT EXISTS idx_items_search ON public.items USING gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(name_en, '') || ' ' || coalesce(summary, '')));
CREATE INDEX IF NOT EXISTS idx_weapon_stats_item ON public.weapon_stats (item_id);
