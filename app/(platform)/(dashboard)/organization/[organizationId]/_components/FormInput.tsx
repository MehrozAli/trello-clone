"use client";

import { useFormStatus } from "react-dom";

import { Input } from "@/components/ui/input";

interface Props {
  errors?: {
    title?: string[];
  };
}

export const FormInput = ({ errors }: Props) => {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col space-y-2">
      <Input
        placeholder="Enter a board title"
        id="title"
        name="title"
        disabled={pending}
        required
      />

      {errors?.title ? (
        <div>
          {errors.title.map((error: string) => (
            <p key={error} className="text-rose-500">
              {error}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
};
