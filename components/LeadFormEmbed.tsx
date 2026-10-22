"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const FORM_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";
const FORM_SRC =
  "https://api.leadconnectorhq.com/widget/form/OB3hsku9oEPy4qe17xy0";
const FORM_ID = "OB3hsku9oEPy4qe17xy0";

/**
 * Embeds the client-provided LeadConnector ("Website Form")
 * inline iframe form. The companion `form_embed.js` script (which
 * handles the iframe's auto-resize behavior) is injected once per page
 * load via `useEffect` rather than a raw inline `<script>` tag, so it
 * behaves correctly under React/Next.js and is never duplicated on
 * re-render.
 *
 * A branded loading overlay covers the iframe until it's ready, so the
 * form doesn't appear as a blank white box while LeadConnector's widget
 * boots up. Note: `form_embed.js` itself manages the iframe's own inline
 * `opacity`/`visibility`/position (it briefly renders off-screen to
 * measure the form's height before revealing it), this overlay just
 * sits on top of that process for a clean transition, it doesn't need to
 * (and shouldn't) fight LeadConnector's own styles.
 */
export function LeadFormEmbed({
  title = "Website Form",
}: {
  title?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector(`script[src="${FORM_SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = FORM_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Safety net: hide the loading overlay after a few seconds even if the
  // cross-origin `onLoad` event is delayed (slow network, ad-blocker
  // interference, etc.) so it can never get stuck showing forever.
  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <div className="relative h-[960px] w-full overflow-hidden rounded-2xl border border-surface-border/70 bg-white shadow-[0_18px_48px_-32px_rgba(15,23,42,0.22)] sm:h-[880px]">
        {!loaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-bg-tinted to-white">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand-cyan/25 border-t-brand-deep" />
            <p className="text-[13px] font-medium text-ink-muted">
              Loading form…
            </p>
          </div>
        ) : null}
        <iframe
          src={FORM_SRC}
          style={{ width: "100%", height: "100%", border: "none", borderRadius: "8px" }}
          id={`inline-${FORM_ID}`}
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Website Form"
          data-height="797"
          data-layout-iframe-id={`inline-${FORM_ID}`}
          data-form-id={FORM_ID}
          data-cookie-consent="true"
          data-cookie-consent-provider="auto"
          title={title}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <p className="mt-3 text-center text-[12px] leading-relaxed text-ink-muted">
        By submitting this form, you agree to our{" "}
        <Link href="/privacy-policy/" className="underline hover:text-brand-deep">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms-and-conditions/" className="underline hover:text-brand-deep">
          Terms &amp; Conditions
        </Link>
        .
      </p>
    </div>
  );
}

