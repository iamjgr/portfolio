"use client";

import { Button, Flex, Heading, Text } from "@once-ui-system/core";
import styles from "./SubjectNavigation.module.scss";

interface SubjectNavigationProps {
  subject: string;
  activityCount: number;
  onBack: () => void;
}

export function SubjectNavigation({ subject, activityCount, onBack }: SubjectNavigationProps) {
  return (
    <Flex className={styles.wrapper} direction="column" gap="12" fillWidth>
      <Flex horizontal="start">
        <Button
          variant="secondary"
          size="s"
          prefixIcon="chevronLeft"
          onClick={onBack}
          label="All subjects"
        />
      </Flex>

      <Flex direction="column" gap="4">
        <Text variant="label-default-s" onBackground="neutral-weak">
          Subject
        </Text>
        <Heading as="h2" variant="heading-strong-xl" wrap="balance">
          {subject}
        </Heading>
        <Text variant="body-default-s" onBackground="neutral-weak">
          {activityCount} activit{activityCount === 1 ? "y" : "ies"}
        </Text>
      </Flex>
    </Flex>
  );
}
