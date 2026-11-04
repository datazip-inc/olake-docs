import React, { useEffect, useRef, useState } from "react";
import { PiCheck, PiShareNetwork } from 'react-icons/pi'

/**
 * "Share" button in the DocsInfo row. Uses the browser's native share sheet (Web Share API) where it
 * exists; elsewhere it copies the page link and says so. Nothing browser-specific is read during
 * render, so the server and client HTML match. Styles: `.olake-docsinfo__action`.
 */
function ShareButton(props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Clipboard blocked: fall back to a prompt so the visitor can still copy the link.
      window.prompt("Copy this link", url);
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: props.title, url });
      } catch (error) {
        // The visitor closed the share sheet (AbortError): nothing to do.
        if (error && error.name !== "AbortError") await copyLink(url);
      }
      return;
    }
    await copyLink(url);
  };

  return (
    <button
      type="button"
      className="olake-docsinfo__action share-button"
      aria-label="Share this page"
      onClick={share}
    >
      {copied ? <PiCheck aria-hidden="true" size={16} /> : <PiShareNetwork aria-hidden="true" size={16} />}
      {copied ? "Link copied" : "Share"}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Link copied to the clipboard" : ""}
      </span>
    </button>
  );
}

export default ShareButton;
