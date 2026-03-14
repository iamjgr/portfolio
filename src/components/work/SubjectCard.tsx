"use client";

import { Flex, Heading, Icon, Text } from "@once-ui-system/core";
import styles from "./SubjectCard.module.scss";

interface SubjectCardProps {
  name: string;
  activityCount: number;
  latestDate?: string;
  onSelect: () => void;
  isSelected?: boolean;
  index?: number;
}

export function SubjectCard({
  name,
  activityCount,
  latestDate,
  onSelect,
  isSelected = false,
  index = 0,
}: SubjectCardProps) {
  return (
    <button
      type="button"
      className={styles.button}
      style={{ "--stagger": `${index * 60}ms` } as React.CSSProperties}
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={`Open ${name} subject with ${activityCount} activities`}
    >
      <Flex
        direction="column"
        horizontal="start"
        fillWidth
        gap="20"
        padding="24"
        radius="l"
        border={isSelected ? "brand-alpha-medium" : "neutral-alpha-weak"}
        background="surface"
        shadow={isSelected ? "l" : "m"}
        className={styles.card}
      >
        <Flex fillWidth horizontal="between" vertical="start" gap="16">
          <Heading as="h2" variant="heading-strong-l" wrap="balance">
            {name}
          </Heading>
          <Icon size="s" name="chevronRight" className={styles.indicator} />
        </Flex>

        <Flex fillWidth direction="column" gap="4">
          <Text variant="label-default-s" onBackground="neutral-weak">
            {activityCount} activit{activityCount === 1 ? "y" : "ies"}
          </Text>
          {latestDate && (
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Latest update {latestDate}
            </Text>
          )}
        </Flex>
      </Flex>
    </button>
  );
}
