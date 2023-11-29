export type Cover = {
  id: string;
  thumbUrl: string;
  fullUrl: string;
  linkHtml: string;
  userName: string;
  alt: string;
};

const local = (id: string, alt: string): Cover => ({
  id,
  thumbUrl: `/covers/${id}.svg`,
  fullUrl: `/covers/${id}.svg`,
  linkHtml: `/covers/${id}.svg`,
  userName: "Taskify",
  alt,
});

// Shipped with the app, used when no Unsplash key is configured or the API fails.
export const LOCAL_COVERS: Cover[] = [
  local("harbour", "Teal bands under a marigold sun"),
  local("columns", "Four rounded columns on ink"),
  local("hills", "Layered sage and moss hills"),
  local("dots", "Grid of marigold and paper dots on teal"),
  local("arcs", "Concentric arcs rising from a corner"),
  local("diagonal", "Clay and ink split diagonally"),
  local("notes", "Scattered sticky notes on teal"),
  local("waves", "Rolling waves from sage to ink"),
  local("blocks", "Colour-blocked rectangles"),
];

/** The value a cover radio submits; createBoard's schema parses it back. */
export const coverFormValue = (cover: Cover) =>
  [cover.id, cover.thumbUrl, cover.fullUrl, cover.linkHtml, cover.userName].join("|");

export const isUnsplashCredit = (linkHtml: string) =>
  linkHtml.startsWith("https://unsplash.com/");
