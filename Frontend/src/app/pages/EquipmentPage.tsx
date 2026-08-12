import { Link, useParams } from 'react-router-dom';
import { ChevronRight, MapPin, Wrench } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PageMeta } from '../components/PageMeta';
import { SearchWidget, SearchWidgetBadges } from '../components/SearchWidget';
import { equipmentPages } from '../data/equipment';
import { locationPages } from '../data/locations';

function buildEquipmentSchema(page: (typeof equipmentPages)[number]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.tooli.uk/#organization',
        name: 'Tooli UK',
        url: 'https://www.tooli.uk',
        logo: 'https://www.tooli.uk/images/logo.webp',
        email: 'info@tooli.uk',
        areaServed: { '@type': 'Country', name: 'United Kingdom' },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${page.canonicalUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tooli.uk/' },
          { '@type': 'ListItem', position: 2, name: 'Equipment', item: 'https://www.tooli.uk/equipment' },
          { '@type': 'ListItem', position: 3, name: page.name, item: page.canonicalUrl },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${page.canonicalUrl}#webpage`,
        name: page.metaTitle,
        description: page.metaDescription,
        url: page.canonicalUrl,
        isPartOf: { '@id': 'https://www.tooli.uk/#website' },
        about: {
          '@type': 'Service',
          name: page.name,
          areaServed: 'United Kingdom',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${page.canonicalUrl}#faq`,
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}

export function EquipmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = equipmentPages.find((item) => item.slug === slug);

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-extrabold text-[#030213]">Equipment page not found</h1>
        <p className="mb-8 text-gray-500">The equipment page you are looking for does not exist yet.</p>
        <Link to="/">
          <Button className="h-12 rounded-xl bg-brand-primary px-6 font-bold text-white hover:bg-brand-primary-hover">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <PageMeta
        title={page.metaTitle}
        description={page.metaDescription}
        canonicalUrl={page.canonicalUrl}
        image={`https://www.tooli.uk${page.image}`}
        type="website"
        jsonLd={buildEquipmentSchema(page)}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F8F9FC] py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-gray-500">
            <Link to="/" className="hover:text-brand-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Equipment</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{page.name}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-brand-primary shadow-sm">
                <Wrench className="h-4 w-4" />
                Equipment Guide
              </div>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-[#030213] sm:text-5xl lg:text-6xl">
                {page.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-gray-500">
                {page.description}
              </p>
              <div className="mt-8">
                <SearchWidget showBadges={false} />
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <SearchWidgetBadges />
                  <Link
                    to="/how-it-works"
                    className="inline-flex h-11 items-center rounded-xl bg-gray-900 px-6 text-sm font-bold text-white transition-colors hover:bg-gray-800 shrink-0"
                  >
                    How Tooli Works
                  </Link>
                </div>
              </div>
            </div>

            <img
              src={page.image}
              alt={page.imageAlt}
              className="w-full rounded-2xl border border-gray-100 bg-gray-900 object-contain shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <article className="py-16 md:py-24">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[minmax(0,840px)_minmax(260px,1fr)]">
          <div className="space-y-14">{page.content}</div>

          <aside className="lg:sticky lg:top-28 lg:self-start space-y-4">
            {/* CTA */}
            <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
              <h2 className="mb-2 text-base font-extrabold text-[#030213]">Compare {page.name}</h2>
              <p className="mb-4 text-sm font-medium leading-relaxed text-gray-500">
                Use the search above to compare trusted UK hire suppliers by location and dates.
              </p>
              <Link to="/search" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                <ChevronRight className="h-4 w-4" /> Browse all listings
              </Link>
            </div>

            {/* Related Equipment */}
            {page.relatedEquipment.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Related Equipment</h2>
                <ul className="space-y-2">
                  {page.relatedEquipment.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline"
                      >
                        <Wrench className="h-3.5 w-3.5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Locations We Serve */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Locations We Serve</h2>
              <ul className="space-y-2">
                {locationPages.map((loc) => (
                  <li key={loc.slug}>
                    <Link
                      to={loc.path}
                      className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      Tool Hire in {loc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
