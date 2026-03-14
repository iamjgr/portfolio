import Image from "next/image";
import { Button, Column, Flex, Heading, Text } from "@once-ui-system/core";
import { getPosts } from "@/utils/utils";
import styles from "./HomeProjectsPreview.module.scss";

interface ProjectImage {
  src: string;
  caption?: string;
}

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
    images: ProjectImage[];
    team?: Team[];
    link?: string;
    category?: string;
    publishedAt: string;
  };
}

interface SubjectGroup {
  subject: string;
  projects: Project[];
}

function getPreviewImage(images: ProjectImage[] = []) {
  const firstImage = images.find((image) => typeof image?.src === "string" && image.src.length > 0);
  return firstImage?.src;
}

function groupProjectsBySubject(projects: Project[]): SubjectGroup[] {
  const grouped = projects.reduce<Record<string, Project[]>>((accumulator, project) => {
    const subject = project.metadata.category || "Uncategorized";
    if (!accumulator[subject]) {
      accumulator[subject] = [];
    }

    accumulator[subject].push(project);
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([subject, entries]) => ({
      subject,
      projects: [...entries].sort(
        (first, second) =>
          new Date(second.metadata.publishedAt).getTime() -
          new Date(first.metadata.publishedAt).getTime(),
      ),
    }))
    .sort((first, second) => first.subject.localeCompare(second.subject));
}

export function HomeProjectsPreview() {
  const allProjects = getPosts(["src", "app", "work", "projects"]);
  const groupedProjects = groupProjectsBySubject(allProjects as Project[]);

  return (
    <Column as="section" fillWidth gap="32" marginBottom="40" paddingX="l">
      <Heading as="h2" variant="heading-strong-xl">
        Projects
      </Heading>

      <Column fillWidth gap="32">
        {groupedProjects.map((group) => (
          <Column key={group.subject} fillWidth gap="16">
            <Heading as="h3" variant="heading-strong-l">
              {group.subject}
            </Heading>

            <div className={styles.grid}>
              {group.projects.map((project, index) => {
                const previewImage = getPreviewImage(project.metadata.images);

                return (
                  <article
                    key={project.slug}
                    className={styles.card}
                    style={{ "--stagger": `${index * 40}ms` } as React.CSSProperties}
                  >
                    <Flex
                      direction="column"
                      fillWidth
                      gap="16"
                      radius="l"
                      border="neutral-alpha-weak"
                      background="surface"
                      shadow="m"
                      overflow="hidden"
                      className={styles.surface}
                    >
                      {previewImage && (
                        <div className={styles.mediaWrap}>
                          <Image
                            src={previewImage}
                            alt={`${project.metadata.title} preview image`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                            className={styles.image}
                          />
                        </div>
                      )}

                      <Flex direction="column" gap="12" paddingX="20" paddingBottom="20" paddingTop="4">
                        <Heading as="h4" variant="heading-strong-m" wrap="balance">
                          {project.metadata.title}
                        </Heading>
                        <Text className={styles.summary} variant="body-default-s" onBackground="neutral-weak" wrap="pretty">
                          {project.metadata.summary}
                        </Text>
                        <Flex>
                          <Button
                            href={`/work/${project.slug}`}
                            variant="secondary"
                            size="s"
                            suffixIcon="arrowRight"
                            label="Details"
                          />
                        </Flex>
                      </Flex>
                    </Flex>
                  </article>
                );
              })}
            </div>
          </Column>
        ))}
      </Column>
    </Column>
  );
}
