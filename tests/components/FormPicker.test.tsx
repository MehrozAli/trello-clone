// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImgHTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FormPicker } from "@/components/Form/FormPicker";
import { LOCAL_COVERS } from "@/lib/covers";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; unoptimized?: boolean }) => {
    const imgProps = { ...props };
    delete imgProps.fill;
    delete imgProps.unoptimized;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...imgProps} />;
  },
}));

const renderPicker = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <form>
        <FormPicker id="image" errors={{ image: ["Pick a cover"] }} />
      </form>
    </QueryClientProvider>
  );

describe("FormPicker", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(LOCAL_COVERS.slice(0, 3))))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("offers each cover as a labelled radio and tracks the choice", async () => {
    renderPicker();

    const radios = await screen.findAllByRole("radio");
    expect(radios).toHaveLength(3);

    await userEvent.click(screen.getByRole("radio", { name: LOCAL_COVERS[1].alt }));

    expect(screen.getByRole("radio", { name: LOCAL_COVERS[1].alt })).toBeChecked();
    expect(screen.getByRole("radio", { name: LOCAL_COVERS[0].alt })).not.toBeChecked();
    expect(screen.getByText("Pick a cover")).toBeInTheDocument();
  });

  it("falls back to bundled covers when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));

    renderPicker();

    expect(await screen.findAllByRole("radio")).toHaveLength(LOCAL_COVERS.length);
  });
});
