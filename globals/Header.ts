import type { GlobalConfig } from "payload";

import { authenticated, globalVersions } from "@/collections/shared";

export const Header: GlobalConfig = {
  slug: "header",
  label: "Header",
  access: {
    read: () => true,
    update: authenticated,
  },
  versions: globalVersions,
  fields: [
    {
      name: "announcement",
      type: "text",
    },
    {
      name: "navItems",
      type: "array",
      fields: [
        { name: "label", type: "text" },
        { name: "href", type: "text" },
      ],
    },
  ],
};
