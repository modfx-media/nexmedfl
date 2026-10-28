import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildTeamSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { TeamPageBody } from "@/components/TeamPageBody";
import { TEAM_MEMBERS } from "@/lib/team-content";

const PAGE = getStaticPage("/meet-our-team/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/meet-our-team/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/meet-our-team/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <JsonLd
        data={buildTeamSchema(
          TEAM_MEMBERS.map((member) => ({
            name: member.name,
            jobTitle: member.credentials
              ? `${member.title}, ${member.credentials}`
              : member.title,
            description: member.bio,
          })),
        )}
      />
      <TeamPageBody />
    </>
    </CMSRoute>
  );
}
