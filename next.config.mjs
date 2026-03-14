import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";
const githubRepository = process.env.GITHUB_REPOSITORY || "";
const repoName = githubRepository.split("/")[1] || "";
const ownerName = githubRepository.split("/")[0] || "";
const isUserSite = Boolean(repoName && ownerName && repoName === `${ownerName}.github.io`);
const basePath = isGithubPages && !isUserSite && repoName ? `/${repoName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isGithubPages ? "export" : undefined,
  trailingSlash: isGithubPages,
  basePath,
  assetPrefix: basePath,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  devIndicators: false,
  transpilePackages: ["next-mdx-remote"],
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
