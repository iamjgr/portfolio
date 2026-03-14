"use client";

import { useEffect, useMemo, useState } from "react";
import { Column, Flex, Text } from "@once-ui-system/core";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import { ActivityCard } from "./ActivityCard";
import { SubjectCard } from "./SubjectCard";
import { SubjectNavigation } from "./SubjectNavigation";
import styles from "./WorkCategoryView.module.scss";

interface ProjectImage {
  src: string;
  caption?: string;
}

type ProjectImageLike = ProjectImage | string;

interface Team {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
}

interface Project {
  slug: string;
  content: string;
  metadata: {
    title: string;
    summary: string;
    images: ProjectImageLike[];
    team?: Team[];
    link?: string;
    category?: string;
    publishedAt: string;
  };
}

interface WorkCategoryViewProps {
  projects: Project[];
}

interface SubjectGroup {
  name: string;
  activities: Project[];
  latestDate?: string;
}

function getImageSources(images: ProjectImageLike[] = []) {
  const normalized = images
    .map((image) => (typeof image === "string" ? image : image?.src))
    .filter((image): image is string => Boolean(image));

  return normalized.length > 0 ? normalized : ["/images/og/home.jpg"];
}

export function WorkCategoryView({ projects }: WorkCategoryViewProps) {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewKey, setViewKey] = useState(0);

  useEffect(() => {
    if (searchParams.get("view") === "subjects") {
      setSelectedCategory(null);
      setViewKey((previousValue) => previousValue + 1);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const grouped = projects.reduce<Record<string, Project[]>>((acc, project) => {
      const category = project.metadata.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(project);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, entries]) => {
        const sortedEntries = [...entries].sort(
          (a, b) =>
            new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
        );

        return {
          name,
          activities: sortedEntries,
          latestDate: sortedEntries[0]?.metadata.publishedAt,
        } satisfies SubjectGroup;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  const selectedGroup = useMemo(
    () => categories.find((category) => category.name === selectedCategory),
    [categories, selectedCategory],
  );

  const openCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setViewKey((previousValue) => previousValue + 1);
  };

  const goBackToSubjects = () => {
    setSelectedCategory(null);
    setViewKey((previousValue) => previousValue + 1);
  };

  if (!selectedCategory) {
    return (
      <Column fillWidth gap="24" marginBottom="40" paddingX="l">
        <Text variant="body-default-s" onBackground="neutral-weak" align="center">
          Browse by subject to explore related activities.
        </Text>

        <div key={`subjects-${viewKey}`} className={styles.subjectGrid}>
          {categories.map((category, index) => (
            <SubjectCard
              key={category.name}
              name={category.name}
              activityCount={category.activities.length}
              latestDate={category.latestDate ? formatDate(category.latestDate) : undefined}
              onSelect={() => openCategory(category.name)}
              index={index}
            />
          ))}
        </div>
      </Column>
    );
  }

  const displayedProjects = selectedGroup?.activities ?? [];

  return (
    <Column fillWidth gap="24" marginBottom="40" paddingX="l">
      <SubjectNavigation
        subject={selectedCategory}
        activityCount={displayedProjects.length}
        onBack={goBackToSubjects}
      />

      <Flex direction="column" gap="16" className={styles.activitiesWrap} key={`activities-${viewKey}`}>
        {displayedProjects.map((post, index) => (
          <ActivityCard
            key={post.slug}
            index={index}
            href={`/work/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary || "Open activity details to read the full breakdown."}
            publishedAt={post.metadata.publishedAt}
            images={getImageSources(post.metadata.images)}
          />
        ))}

        {displayedProjects.length === 0 && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            No activities are available for this subject yet.
          </Text>
        )}
      </Flex>
    </Column>
  );
}
