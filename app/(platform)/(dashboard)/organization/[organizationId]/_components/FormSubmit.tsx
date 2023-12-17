"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export const FormSubmit = () => {
  const { pending } = useFormStatus();

  return <Button disabled={pending}>Submit</Button>;
};
