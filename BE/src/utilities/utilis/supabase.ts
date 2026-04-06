import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jbrjjqmiuuigrsyxefzf.supabase.co",
  process.env.SUPABASE_PUBLIC_KEY || "",
);

export async function uploadFile(
  file: any,
  fileName: string,
  bucket: string = "MISK_BUCKET",
  path = "profile_pics/",
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${path}${fileName}`, file.buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.mimetype,
    });

  if (error) {
    console.log(error);
    return { error };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(`${path}${fileName}`);

  return { publicUrl: urlData.publicUrl, error: null };
}
