"use client";

import Image from "next/image";
import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { coverFormValue, isUnsplashCredit, LOCAL_COVERS, type Cover } from "@/lib/covers";
import { FormErrors } from "./FormErrors";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

const fetchCovers = async (): Promise<Cover[]> => {
  const response = await fetch("/api/covers");

  if (!response.ok) {
    throw new Error("Could not load covers");
  }

  return response.json();
};

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { pending } = useFormStatus();
  const { data: covers, isPending, isError } = useQuery({
    queryKey: ["covers"],
    queryFn: fetchCovers,
    staleTime: 5 * 60_000,
  });

  if (isPending) {
    return (
      <div className="p-6 flex items-center justify-center" role="status">
        <LoaderCircle className="h-6 w-6 text-primary animate-spin" aria-hidden />
        <span className="sr-only">Loading covers</span>
      </div>
    );
  }

  const options = isError || !covers?.length ? LOCAL_COVERS : covers;

  return (
    <fieldset className="relative" aria-describedby={`${id}-error`}>
      <legend className="text-xs font-semibold text-muted-foreground mb-2">
        Cover
      </legend>

      <div className="grid grid-cols-3 gap-2 mb-2">
        {options.map((cover) => {
          const checked = selectedId === cover.id;

          return (
            <label
              key={cover.id}
              className={cn(
                "cursor-pointer relative aspect-video rounded-sm overflow-hidden bg-muted transition",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
                checked ? "ring-2 ring-primary" : "hover:opacity-80",
                { "opacity-50 cursor-not-allowed": pending }
              )}
            >
              <input
                type="radio"
                name={id}
                className="sr-only"
                checked={checked}
                disabled={pending}
                onChange={() => setSelectedId(cover.id)}
                value={coverFormValue(cover)}
                aria-label={cover.alt}
              />

              <Image
                alt=""
                src={cover.thumbUrl}
                className="object-cover"
                unoptimized={cover.thumbUrl.endsWith(".svg")}
                sizes="96px"
                fill
              />

              {checked ? (
                <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" aria-hidden />
                </span>
              ) : null}

              {isUnsplashCredit(cover.linkHtml) ? (
                <span className="absolute bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50">
                  {cover.userName}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>

      <FormErrors id={id} errors={errors} />
    </fieldset>
  );
};
