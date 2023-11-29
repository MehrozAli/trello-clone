import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MAX_FREE_BOARDS } from "@/constants/boards";

const previewLists = [
  { title: "Backlog", cards: ["Draft launch email", "Collect beta quotes"] },
  { title: "In progress", cards: ["Pricing page copy", "Onboarding checklist"] },
  { title: "Done", cards: ["Pick launch date"] },
];

const facts = [
  { heading: "Drag to reorder", body: "Move cards within and between lists; the order is saved for everyone." },
  { heading: "Every change logged", body: "Each card keeps its own activity, and the workspace keeps the full log." },
  { heading: `${MAX_FREE_BOARDS} boards free`, body: "Per workspace. Pro removes the limit through Stripe billing." },
];

const BoardPreview = () => (
  <div
    aria-hidden
    className="relative overflow-hidden rounded-2xl border bg-[url('/covers/harbour.svg')] bg-cover bg-center p-4 shadow-xl sm:p-6"
  >
    <div className="mb-4 inline-flex rounded-md bg-foreground/70 px-3 py-1 font-display text-sm text-primary-foreground">
      Spring launch
    </div>
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {previewLists.map((list) => (
        <div key={list.title} className="rounded-lg bg-secondary/95 p-2">
          <p className="mb-2 px-1 text-[11px] font-semibold sm:text-xs">{list.title}</p>
          <div className="space-y-1.5">
            {list.cards.map((card) => (
              <div key={card} className="rounded-md border bg-card px-2 py-1.5 text-[10px] shadow-sm sm:text-xs">
                {card}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MarketingPage = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <section className="grid items-center gap-12 md:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Boards · lists · cards
          </p>
          <h1 className="mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            Plan the week on one board your team can see.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Taskify organises work by workspace. Create a board, add lists for each
            stage, and drag cards across as things move.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="primary" asChild>
              <Link href="/sign-up">
                Start a workspace <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>

        <BoardPreview />
      </section>

      <section className="mt-16 grid gap-6 border-t pt-10 sm:grid-cols-3" aria-label="Features">
        {facts.map((fact) => (
          <div key={fact.heading}>
            <h2 className="text-lg">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-marigold align-middle" aria-hidden />
              {fact.heading}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{fact.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MarketingPage;
