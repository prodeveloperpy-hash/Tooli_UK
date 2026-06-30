import { useEffect } from 'react';

type PageMetaProps = {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'blog';
  robots?: string;
  publishedTime?: string;
  jsonLd?: Record<string, unknown>;
};

function setMeta(selector: string, key: 'name' | 'property', keyValue: string, content?: string) {
  let meta = document.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    if (meta?.dataset.pageMeta === 'true') meta.remove();
    return;
  }

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(key, keyValue);
    meta.dataset.pageMeta = 'true';
    document.head.appendChild(meta);
  }

  meta.content = content;
}

function setCanonical(canonicalUrl?: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonicalUrl) {
    if (link?.dataset.pageMeta === 'true') link.remove();
    return;
  }

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    link.dataset.pageMeta = 'true';
    document.head.appendChild(link);
  }

  link.href = canonicalUrl;
}

export function PageMeta({
  title,
  description,
  canonicalUrl,
  image,
  type = 'website',
  robots = 'index, follow',
  publishedTime,
  jsonLd,
}: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', robots);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[property="article:published_time"]', 'property', 'article:published_time', publishedTime);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    setCanonical(canonicalUrl);

    const scriptId = 'page-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [canonicalUrl, description, image, jsonLd, publishedTime, robots, title, type]);

  return null;
}
