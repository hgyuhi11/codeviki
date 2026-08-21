import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";

/** Media lives in a private bucket, so every URL is signed on read. */
export async function getMediaUrl(path: string | null | undefined) {
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, 60 * 60 * 6);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export function mediaUrlQuery(path: string | null | undefined) {
  return {
    queryKey: ["media-url", path] as const,
    queryFn: () => getMediaUrl(path),
    enabled: Boolean(path),
    staleTime: 1000 * 60 * 60,
  };
}
