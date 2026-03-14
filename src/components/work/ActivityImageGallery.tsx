"use client";

import { useState } from "react";
import { Column, Dialog, Flex, IconButton, Media, Row, Text } from "@once-ui-system/core";

interface ActivityImageGalleryProps {
  images: ProjectImage[];
  title: string;
}

interface ProjectImage {
  src: string;
  caption?: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
const YOUTUBE_PATTERN = /(?:youtube\.com|youtu\.be)\//i;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(2))));
}

function isZoomableImage(src: string) {
  return !src.endsWith(".mp4") && !YOUTUBE_PATTERN.test(src);
}

export function ActivityImageGallery({ images, title }: ActivityImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  const openImage = (index: number) => {
    if (!isZoomableImage(images[index].src)) {
      return;
    }

    setSelectedIndex(index);
    setZoom(MIN_ZOOM);
  };

  const closeDialog = () => {
    setSelectedIndex(null);
    setZoom(MIN_ZOOM);
  };

  const goToImage = (index: number) => {
    setSelectedIndex(index);
    setZoom(MIN_ZOOM);
  };

  const showPrevious = () => {
    if (selectedIndex === null) {
      return;
    }

    goToImage(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const showNext = () => {
    if (selectedIndex === null) {
      return;
    }

    goToImage(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  const zoomIn = () => {
    setZoom((currentZoom) => clampZoom(currentZoom + ZOOM_STEP));
  };

  const zoomOut = () => {
    setZoom((currentZoom) => clampZoom(currentZoom - ZOOM_STEP));
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          width: "100%",
          gap: "var(--static-space-24)",
          gridTemplateColumns:
            images.length === 1 ? "minmax(0, 1fr)" : "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
        }}
      >
        {images.map((image, index) => {
          const zoomable = isZoomableImage(image.src);

          return (
            <Column key={`${image.src}-${index}`} gap="8">
              {zoomable ? (
                <button
                  type="button"
                  onClick={() => openImage(index)}
                  aria-label={`Open ${title} image ${index + 1}`}
                  style={{
                    appearance: "none",
                    padding: 0,
                    margin: 0,
                    border: "none",
                    background: "transparent",
                    width: "100%",
                    cursor: "zoom-in",
                  }}
                >
                  <Media
                    priority={index === 0}
                    fillWidth
                    aspectRatio="16 / 9"
                    radius="l"
                    alt={`${title} image ${index + 1}`}
                    src={image.src}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 960px"
                  />
                </button>
              ) : (
                <Media
                  priority={index === 0}
                  fillWidth
                  aspectRatio="16 / 9"
                  radius="l"
                  alt={`${title} media ${index + 1}`}
                  src={image.src}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 960px"
                />
              )}

              {image.caption && (
                <Text variant="body-default-xs" onBackground="neutral-weak" wrap="pretty">
                  {image.caption}
                </Text>
              )}
            </Column>
          );
        })}
      </div>

      <Dialog
        isOpen={selectedImage !== null}
        onClose={closeDialog}
        title={title}
        description={
          selectedIndex !== null ? `Image ${selectedIndex + 1} of ${images.length}` : undefined
        }
        style={{ maxWidth: "min(92vw, 72rem)" }}
      >
        {selectedImage && (
          <Column gap="16">
            <Row fillWidth horizontal="between" vertical="center" gap="12" wrap>
              <Text variant="label-default-s" onBackground="neutral-weak">
                Zoom {Math.round(zoom * 100)}%
              </Text>

              <Row gap="8" wrap>
                {images.length > 1 && (
                  <>
                    <IconButton
                      icon="chevronLeft"
                      variant="secondary"
                      tooltip="Previous image"
                      onClick={showPrevious}
                    />
                    <IconButton
                      icon="chevronRight"
                      variant="secondary"
                      tooltip="Next image"
                      onClick={showNext}
                    />
                  </>
                )}
                <IconButton
                  icon="minus"
                  variant="secondary"
                  tooltip="Zoom out"
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM}
                />
                <IconButton
                  icon="plus"
                  variant="secondary"
                  tooltip="Zoom in"
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM}
                />
              </Row>
            </Row>

            <Flex
              center
              fillWidth
              radius="l"
              border="neutral-medium"
              background="surface"
              overflow="auto"
              padding="12"
              style={{ minHeight: "min(28rem, 60vh)", maxHeight: "70vh" }}
            >
              <div
                style={{
                  width: "100%",
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 180ms ease",
                }}
              >
                <Media
                  fillWidth
                  aspectRatio="original"
                  objectFit="contain"
                  alt={`${title} image ${selectedIndex !== null ? selectedIndex + 1 : 1}`}
                  src={selectedImage.src}
                  sizes="100vw"
                />
              </div>
            </Flex>

            {selectedImage.caption && (
              <Text variant="body-default-s" onBackground="neutral-weak" wrap="pretty">
                {selectedImage.caption}
              </Text>
            )}
          </Column>
        )}
      </Dialog>
    </>
  );
}