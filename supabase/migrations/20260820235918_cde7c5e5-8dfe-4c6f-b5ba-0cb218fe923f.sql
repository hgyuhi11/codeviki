CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TYPE public.item_category AS ENUM ('character', 'weapon');
CREATE TYPE public.item_rarity AS ENUM ('legendary', 'mythic');

CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category public.item_category NOT NULL,
  name text NOT NULL,
  name_en text,
  rarity public.item_rarity NOT NULL DEFAULT 'legendary',
  summary text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  image_path text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.items TO authenticated;
GRANT ALL ON public.items TO service_role;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view items"
ON public.items FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert items"
ON public.items FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update items"
ON public.items FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete items"
ON public.items FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER items_updated_at BEFORE UPDATE ON public.items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  hero_title text NOT NULL DEFAULT '',
  hero_subtitle text NOT NULL DEFAULT '',
  game_intro text NOT NULL DEFAULT '',
  about_text text NOT NULL DEFAULT '',
  teaser_video_path text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert settings"
ON public.site_settings FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
ON public.site_settings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (id, hero_title, hero_subtitle, game_intro, about_text)
VALUES (
  1,
  'گزارش عملیات: نسل جدید نبردهای تاکتیکی',
  'به پایگاه داده نهایی خوش آمدید. در اینجا جزئیات دقیق اسکین‌های لجندری، سلاح‌های متیک و استراتژی‌های میدان نبرد را بررسی می‌کنیم.',
  'کال آف دیوتی یکی از پرطرفدارترین سری بازی‌های شوتر اول‌شخص جهان است. از نبردهای جنگ جهانی دوم تا عملیات‌های مدرن و بتل رویال، این سری با گیم‌پلی سریع، گان‌پلی دقیق و مپ‌های افسانه‌ای، میلیون‌ها بازیکن را در سراسر دنیا به میدان نبرد کشانده است.',
  'این سایت یک پلتفرم طرفداری برای بازی کال آف دیوتی است و هیچ ارتباط رسمی با اکتیویژن ندارد. هدف ما جمع‌آوری و معرفی اسکین‌های لجندری و متیک، اسلحه‌ها و اخبار میدان نبرد برای فارسی‌زبان‌هاست.'
);

CREATE POLICY "Public can read media"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));