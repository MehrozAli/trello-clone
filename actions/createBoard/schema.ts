import { z } from "zod";

import { coverImage, titleField } from "@/lib/schemas";

export const CreateBoard = z.object({
  title: titleField(3, 60),
  image: coverImage,
});
