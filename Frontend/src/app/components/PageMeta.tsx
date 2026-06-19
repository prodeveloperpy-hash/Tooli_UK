import { useEffect } from 'react';

type PageMetaProps = {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>;
};

export function PageMeta({ title, description, jsonLd }: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }

    metaDescription.content = description;

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
  }, [title, description, jsonLd]);

  return null;
}
