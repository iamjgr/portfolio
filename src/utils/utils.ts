import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type FrontmatterImage =
  | string
  | {
      src?: string;
      caption?: string;
      description?: string;
    };

export type ProjectImage = {
  src: string;
  caption?: string;
};

export type Metadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: ProjectImage[];
  tag?: string;
  team?: Team[];
  link?: string;
  category?: string;
};

import { notFound } from "next/navigation";

function normalizeCaption(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeProjectImage(image: FrontmatterImage): ProjectImage | null {
  if (typeof image === "string") {
    const src = image.trim();
    return src ? { src } : null;
  }

  const src = typeof image.src === "string" ? image.src.trim() : "";

  if (!src) {
    return null;
  }

  const caption = normalizeCaption(image.caption) ?? normalizeCaption(image.description);

  return caption ? { src, caption } : { src };
}

export function normalizeProjectImages(images: unknown): ProjectImage[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.flatMap((image) => {
    const normalized = normalizeProjectImage(image as FrontmatterImage);
    return normalized ? [normalized] : [];
  });
}

export function getImageSource(image: ProjectImage) {
  return image.src;
}

export function getImageSources(images: ProjectImage[] = []) {
  return images.map(getImageSource);
}

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: normalizeProjectImages(data.images),
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
    category: data.category || "Uncategorized",
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}
