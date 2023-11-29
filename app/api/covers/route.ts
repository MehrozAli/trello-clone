import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { LOCAL_COVERS, type Cover } from "@/lib/covers";

// Board backgrounds from the tutorial's Unsplash collection.
const COLLECTION_ID = "317099";

type UnsplashPhoto = {
  id: string;
  alt_description: string | null;
  urls: { thumb: string; full: string };
  links: { html: string };
  user: { name: string };
};

const fetchUnsplashCovers = async (accessKey: string): Promise<Cover[] | null> => {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?collections=${COLLECTION_ID}&count=9`,
    { headers: { Authorization: `Client-ID ${accessKey}` }, cache: "no-store" }
  ).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const photos = (await response.json()) as UnsplashPhoto[];

  return photos.map((photo) => ({
    id: photo.id,
    thumbUrl: photo.urls.thumb,
    fullUrl: photo.urls.full,
    linkHtml: photo.links.html,
    userName: photo.user.name,
    alt: photo.alt_description ?? `Photo by ${photo.user.name}`,
  }));
};

// The access key stays on the server; the tutorial shipped it to the browser.
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  const covers = accessKey ? await fetchUnsplashCovers(accessKey) : null;

  return NextResponse.json(covers ?? LOCAL_COVERS);
}
