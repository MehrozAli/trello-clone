"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { unsplash } from "@/lib/unsplash";
import { defaultUnsplashImages } from "@/constants/images";
import { FormErrors } from "./FormErrors";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const [images, setImages] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (result?.response) {
          const unsplashImages = result.response as Array<Record<string, any>>;

          setImages(unsplashImages);
        } else {
          console.error("Failed to fetch images from unsplash");
        }
      } catch (error) {
        console.log(error);

        setImages(defaultUnsplashImages);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => {
              if (pending) return;

              setSelectedImageId(img.id);
            }}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              { "opacity-50 hover:opacity-50 cursor-auto": pending }
            )}
          >
            <input
              type="radio"
              name={id}
              id={id}
              className="hidden"
              checked={selectedImageId === img.id}
              disabled={pending}
              value={`${img.id}|${img.urls.thumb}|${img.urls.full}|${img.links.html}|${img.user.name}`}
            />

            <Image
              alt="unsplash image"
              src={img.urls.thumb}
              className="rounded-sm object-cover"
              fill
            />

            {selectedImageId === img.id ? (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            ) : null}

            <Link
              href={img.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {img.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id={id} errors={errors} />
    </div>
  );
};
