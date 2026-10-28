import type { Access, FieldHook } from "payload";

/** Unique text columns treat "" as a value. Store null so drafts can be created blank. */
export const emptyToNull: FieldHook = ({ value }) => (value === "" ? null : value);

export const slugifyFromName: FieldHook = ({ value, data, siblingData }) => {
  if (typeof value === "string" && value.trim()) return value.trim();
  const source =
    (typeof siblingData?.title === "string" && siblingData.title) ||
    (typeof siblingData?.name === "string" && siblingData.name) ||
    (typeof data?.title === "string" && data.title) ||
    (typeof data?.name === "string" && data.name) ||
    "";
  if (!source.trim()) return null;
  const slug = source
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || null;
};

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;
  return {
    _status: {
      equals: "published",
    },
  };
};

export const authenticated: Access = ({ req }) => Boolean(req.user);

export const contentVersions = {
  drafts: {
    schedulePublish: true,
  },
  maxPerDoc: 50,
} as const;

export const globalVersions = {
  drafts: {
    schedulePublish: true,
  },
  max: 50,
} as const;
