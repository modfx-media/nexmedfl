import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import config from "@payload-config";
import { previewFromPath } from "@/lib/cms/preview";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.PREVIEW_SECRET;
  const url = new URL(request.url);
  const given = url.searchParams.get("secret");
  const path = url.searchParams.get("path");

  if (!secret || !given || given !== secret) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const destination = previewFromPath(path);
  if (!destination) {
    return new Response("Invalid path", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();
  redirect(destination);
}
