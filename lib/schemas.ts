import { z } from "zod";

export const entityId = z.uuid({ error: "Invalid id" });

export const titleField = (min: number, max: number) =>
  z
    .string({ error: "Title is required" })
    .trim()
    .min(min, { error: "Title is too short" })
    .max(max, { error: `Title must be ${max} characters or fewer` });

const LOCAL_COVER = /^\/covers\/[\w-]+\.svg$/;

const coverImageUrl = z
  .string()
  .refine(
    (url) => LOCAL_COVER.test(url) || url.startsWith("https://images.unsplash.com/"),
    { error: "Unsupported image source" }
  );

const coverCreditUrl = z
  .string()
  .refine((url) => LOCAL_COVER.test(url) || url.startsWith("https://unsplash.com/"), {
    error: "Unsupported image source",
  });

/**
 * The cover radio submits "id|thumb|full|link|user". Every part ends up in a
 * CSS url() or a link, so only bundled covers and Unsplash hosts get through.
 */
export const coverImage = z
  .string({ error: "Image is required" })
  .transform((value) => value.split("|"))
  .pipe(
    z.tuple(
      [
        z.string().regex(/^[\w-]{1,64}$/, { error: "Invalid image" }),
        coverImageUrl,
        coverImageUrl,
        coverCreditUrl,
        z.string().trim().min(1).max(120),
      ],
      { error: "Image is required" }
    )
  )
  .transform(([imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName]) => ({
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHtml,
    imageUserName,
  }));
