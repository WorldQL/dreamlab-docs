import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import {
  useDocById,
  findFirstSidebarItemLink,
} from "@docusaurus/plugin-content-docs/client";
import { usePluralForm } from "@docusaurus/theme-common";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { translate } from "@docusaurus/Translate";

import type { Props } from "@theme/DocCard";
import Heading from "@theme/Heading";
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from "@docusaurus/plugin-content-docs";

import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";

function useCategoryItemsPlural() {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          message: "1 item|{count} items",
          id: "theme.docs.DocCard.categoryDescription.plurals",
          description:
            "The default description for a category card in the generated index about how many items this category includes",
        },
        { count }
      )
    );
}

function CardContainer({
  href,
  children,
  classes = "padding--lg",
}: {
  href: string;
  children: ReactNode;
  classes?: string;
}): JSX.Element {
  return (
    <Link href={href} className={clsx("card", styles.cardContainer, classes)}>
      {children}
    </Link>
  );
}

function CardLayout({
  href,
  icon,
  title,
  description,
  image,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description?: string;
  image?: string | undefined;
}): JSX.Element {
  return (
    <CardContainer href={href} classes={image ? "padding--md" : undefined}>
      {image && (
        <img
          src={useBaseUrl(image)}
          style={{
            maxHeight: "200px",
            width: "auto",
            display: "block",
            margin: "0 auto 1rem",
          }}
        />
      )}{" "}
      <Heading
        as="h2"
        className={clsx("text--truncate", styles.cardTitle)}
        title={title}
      >
        {icon} {title}
      </Heading>
      {description && (
        <p
          className={clsx("text--truncate", styles.cardDescription)}
          title={description}
        >
          {description}
        </p>
      )}
    </CardContainer>
  );
}

function CardCategory({
  item,
}: {
  item: PropSidebarItemCategory;
}): JSX.Element | null {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();

  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }

  return (
    <CardLayout
      href={href}
      icon="🗃️"
      title={item.label}
      description={item.description ?? categoryItemsPlural(item.items.length)}
    />
  );
}

function CardLink({ item }: { item: PropSidebarItemLink }): JSX.Element {
  let icon = isInternalUrl(item.href) ? "📄️" : "🔗";
  const doc = useDocById(item.docId ?? undefined);
  const image: string | undefined =
    (item.customProps?.cardImage as string) ?? undefined;

  if (image) icon = undefined;
  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={item.description ?? doc?.description}
      image={image}
    />
  );
}

export default function DocCard({ item }: Props): JSX.Element {
  switch (item.type) {
    case "link":
      return <CardLink item={item} />;
    case "category":
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
