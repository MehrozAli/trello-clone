// TASKIFY_DEMO_AUTH=1 swaps Clerk for the local stand-ins in demo/ at build
// time, so the app can run (and be screenshotted) without a Clerk account.
// Never deploy a demo build: everyone who clicks "Enter" shares one user.
const demoAuth = process.env.TASKIFY_DEMO_AUTH === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the Docker image.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  ...(demoAuth && {
    turbopack: {
      resolveAlias: {
        "@clerk/nextjs/server": "./demo/clerk-server.ts",
        "@clerk/nextjs": "./demo/clerk.tsx",
      },
    },
  }),
};

module.exports = nextConfig;
