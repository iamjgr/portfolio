"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flex, Heading, Text } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";
import styles from "./ActivityCard.module.scss";

interface ActivityCardProps {
  title: string;
  description: string;
  publishedAt: string;
  images: string[];
  href: string;
  index?: number;
}

type LayoutMode = "landscape" | "side";

function getLayoutMode(width: number, height: number): LayoutMode {
  if (height === 0) {
    return "landscape";
  }

  const ratio = width / height;
  return ratio > 1.2 ? "landscape" : "side";
}

export function ActivityCard({
  title,
  description,
  publishedAt,
  images,
  href,
  index = 0,
}: ActivityCardProps) {
  const displayImages = useMemo(() => {
    const normalized = images.filter((image) => !image.endsWith(".mp4"));
    return normalized.length > 0 ? normalized : ["/images/og/home.jpg"];
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const [layoutByIndex, setLayoutByIndex] = useState<Record<number, LayoutMode>>({});

  const formattedDate = useMemo(() => formatDate(publishedAt), [publishedAt]);
  const layoutMode = layoutByIndex[activeIndex] ?? "landscape";
  const isActiveImageLoaded = loadedMap[activeIndex] ?? false;

  const showPrevious = () => {
    setActiveIndex((previousValue) =>
      previousValue === 0 ? displayImages.length - 1 : previousValue - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((previousValue) =>
      previousValue === displayImages.length - 1 ? 0 : previousValue + 1,
    );
  };

  return (
    <article className={styles.card} style={{ "--stagger": `${index * 70}ms` } as React.CSSProperties}>
      <Flex
        className={`${styles.surface} ${layoutMode === "landscape" ? styles.landscape : styles.side}`}
        direction="column"
        fillWidth
        radius="l"
        border="neutral-alpha-weak"
        background="surface"
        shadow="m"
        overflow="hidden"
      >
        <div className={styles.mediaWrap}>
          {displayImages.map((image, imageIndex) => (
            <div
              key={image}
              className={`${styles.slide} ${imageIndex === activeIndex ? styles.slideActive : ""}`}
              aria-hidden={imageIndex !== activeIndex}
            >
              <Image
                src={image}
                alt={`${title} brochure image ${imageIndex + 1}`}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 840px"
                className={`${styles.image} ${loadedMap[imageIndex] ? styles.loaded : ""}`}
                onLoad={(event) => {
                  const element = event.currentTarget;
                  setLayoutByIndex((currentState) => ({
                    ...currentState,
                    [imageIndex]: getLayoutMode(element.naturalWidth, element.naturalHeight),
                  }));
                  setLoadedMap((currentState) => ({
                    ...currentState,
                    [imageIndex]: true,
                  }));
                }}
              />
            </div>
          ))}

          <div className={`${styles.skeleton} ${isActiveImageLoaded ? styles.skeletonHidden : ""}`} />

          {displayImages.length > 1 && (
            <>
              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.controlButton}
                  aria-label={`Previous image for ${title}`}
                  onClick={showPrevious}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={styles.controlButton}
                  aria-label={`Next image for ${title}`}
                  onClick={showNext}
                >
                  ›
                </button>
              </div>

              <div className={styles.dots} aria-label="Image pagination">
                {displayImages.map((image, imageIndex) => (
                  <button
                    key={`${image}-dot`}
                    type="button"
                    className={`${styles.dot} ${imageIndex === activeIndex ? styles.dotActive : ""}`}
                    aria-label={`Go to image ${imageIndex + 1}`}
                    aria-current={imageIndex === activeIndex}
                    onClick={() => setActiveIndex(imageIndex)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <Flex className={styles.content} direction="column" gap="12" padding="20">
          <Text variant="label-default-s" onBackground="neutral-weak">
            {formattedDate}
          </Text>
          <Heading as="h3" variant="heading-strong-m" wrap="balance">
            <Link href={href} className={styles.titleLink} aria-label={`Open activity ${title}`}>
              {title}
            </Link>
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak" wrap="pretty">
            {description}
          </Text>

          <Link href={href} className={styles.readMoreLink}>
            View activity details
          </Link>
        </Flex>
      </Flex>
    </article>
  );
}
