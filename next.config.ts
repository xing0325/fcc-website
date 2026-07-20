import type { NextConfig } from "next";

// DEPLOY_TARGET=pages → static export for GitHub Pages (served under /fcc-website).
// Raw <img>/<a> absolute paths are prefixed by scripts/postexport-pages.mjs.
const isPages = process.env.DEPLOY_TARGET === "pages";

const nextConfig: NextConfig = {
  ...(isPages && {
    output: "export",
    basePath: "/fcc-website",
    trailingSlash: true,
  }),
};

export default nextConfig;
