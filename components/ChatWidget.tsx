"use client";

import Script from "next/script";
import { useEffect } from "react";

// The widget renders inside a <chat-widget> custom element's shadow DOM
// and hardcodes an inline `bottom: 20px`, which sits under the sticky
// BookNowBanner (~65px tall). Nudge it up above the banner and keep
// re-applying in case the widget's own script resets the style attribute.
const BUBBLE_BOTTOM_OFFSET = "90px";

function raiseChatBubble() {
  const chatWidget = document.querySelector("chat-widget");
  const shadowRoot = chatWidget?.shadowRoot;
  if (!shadowRoot) return false;

  const targets = [
    shadowRoot.getElementById("lc_text-widget"),
    shadowRoot.getElementById("lc_text-widget--btn"),
  ].filter((el): el is HTMLElement => el !== null);

  if (targets.length === 0) return false;

  for (const el of targets) {
    if (el.style.bottom !== BUBBLE_BOTTOM_OFFSET) {
      el.style.bottom = BUBBLE_BOTTOM_OFFSET;
    }
  }
  return true;
}

// LeadConnector (GoHighLevel) chat widget, loaded site-wide.
export function ChatWidget() {
  useEffect(() => {
    let attributeObserver: MutationObserver | null = null;

    const watchAttributes = () => {
      const shadowRoot = document.querySelector("chat-widget")?.shadowRoot;
      if (!shadowRoot || attributeObserver) return;
      attributeObserver = new MutationObserver(() => raiseChatBubble());
      attributeObserver.observe(shadowRoot, {
        attributes: true,
        attributeFilter: ["style"],
        subtree: true,
      });
    };

    if (raiseChatBubble()) {
      watchAttributes();
    }

    const bodyObserver = new MutationObserver(() => {
      if (raiseChatBubble()) watchAttributes();
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      bodyObserver.disconnect();
      attributeObserver?.disconnect();
    };
  }, []);

  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="6ad9d4f64e3a6a8f955c2002"
      strategy="lazyOnload"
    />
  );
}
