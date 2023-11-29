export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Taskify: boards, lists and cards for small teams.</p>
        <p>Built with Next.js, Clerk, Prisma and Stripe.</p>
      </div>
    </footer>
  );
};
