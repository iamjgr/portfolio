import { notFound } from "next/navigation";
import { getPosts } from "@/utils/utils";
import {
  Meta,
  Schema,
  AvatarGroup,
  Button,
  Column,
  Heading,
  Text,
  SmartLink,
  Row,
} from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import type { Metadata } from "next";
import { ActivityImageGallery } from "@/components/work/ActivityImageGallery";
import styles from "./page.module.scss";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getDetailBodyContent(content: string, summary?: string) {
  let normalizedContent = content.trim();

  if (summary?.trim()) {
    const summaryBlockPattern = new RegExp(
      `(^|\\n\\s*\\n)${escapeRegExp(summary.trim())}(?=\\n\\s*\\n|$)`,
      "m",
    );
    normalizedContent = normalizedContent.replace(summaryBlockPattern, "").trim();
  }

  if (!normalizedContent) {
    return "";
  }

  const blocks = normalizedContent.split(/\n\s*\n/).filter((block) => block.trim().length > 0);
  const hasStructuredMarkdown = /^(#{1,6}\s|[-*]\s|\d+\.\s|>\s|\|)|```|!\[|\[.+\]\(.+\)/m.test(
    normalizedContent,
  );

  if (blocks.length <= 1 && !hasStructuredMarkdown) {
    return "";
  }

  return normalizedContent;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const posts = getPosts(["src", "app", "work", "projects"]);
  const post = posts.find((post) => post.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/api/og/generate?title=${post.metadata.title}`,
    path: `${work.path}/${post.slug}`,
  });
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const post = getPosts(["src", "app", "work", "projects"]).find((post) => post.slug === slugPath);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];
  const detailBodyContent = getDetailBodyContent(post.content, post.metadata.summary);

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l" className={styles.page}>
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${post.slug}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        datePublished={post.metadata.publishedAt}
        dateModified={post.metadata.publishedAt}
        image={
          post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
        }
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth maxWidth="s">
        <Button href="/work?view=subjects" variant="secondary" size="m" prefixIcon="chevronLeft" label="Subjects" />
      </Column>
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
        </Text>
        <Heading variant="display-strong-m">{post.metadata.title}</Heading>
        {post.metadata.summary && (
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="pretty" align="center">
            {post.metadata.summary}
          </Text>
        )}
      </Column>
      <Row marginBottom="32" horizontal="center">
        <Row gap="16" vertical="center">
          {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="s" />}
          <Text variant="label-default-m" onBackground="brand-weak">
            {post.metadata.team?.map((member, idx) => (
              <span key={`${member.name}-${member.linkedIn || idx}`}>
                {idx > 0 && (
                  <Text as="span" onBackground="neutral-weak">
                    ,{" "}
                  </Text>
                )}
                <SmartLink href={member.linkedIn}>{member.name}</SmartLink>
              </span>
            ))}
          </Text>
        </Row>
      </Row>
      {post.metadata.images.length > 0 && <ActivityImageGallery images={post.metadata.images} title={post.metadata.title} />}
      {detailBodyContent && (
        <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
          <CustomMDX source={detailBodyContent} />
        </Column>
      )}
      <ScrollToHash />
    </Column>
  );
}
