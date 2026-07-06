import { Link, useParams } from 'react-router-dom';
import { ChevronRight, MapPin, Wrench } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PageMeta } from '../components/PageMeta';
import { locationPages } from '../data/locations';
import { equipmentPages } from '../data/equipment';

function buildLocationSchema(page: (typeof locationPages)[number]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://tooli.uk/#organization',
        name: 'Tooli',
        alternateName: 'Tooli.uk',
        url: 'https://tooli.uk',
        logo: 'https://tooli.uk/images/logo.png',
        email: 'info@tooli.uk',
        areaServed: {
          '@type': 'Country',
          name: 'United Kingdom',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${page.canonicalUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tooli.uk/' },
          { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://tooli.uk/locations' },
          { '@type': 'ListItem', position: 3, name: page.name, item: page.canonicalUrl },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${page.canonicalUrl}#webpage`,
        name: page.metaTitle,
        description: page.metaDescription,
        url: page.canonicalUrl,
        isPartOf: { '@id': 'https://tooli.uk/#website' },
        about: {
          '@type': 'Service',
          name: `Tool and plant hire comparison in ${page.name}`,
          areaServed: page.name,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${page.canonicalUrl}#faq`,
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

export function LocationPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = locationPages.find((item) => item.slug === slug);

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-extrabold text-[#030213]">Location not found</h1>
        <p className="mb-8 text-gray-500">The location page you are looking for does not exist yet.</p>
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
        image={`https://tooli.uk${page.image}`}
        type="website"
        jsonLd={buildLocationSchema(page)}
      />

      <section className="relative overflow-hidden bg-[#F8F9FC] py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-gray-500">
            <Link to="/" className="hover:text-brand-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Locations</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{page.name}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-brand-primary shadow-sm">
                <MapPin className="h-4 w-4" />
                {page.name}
              </div>
              <h1 className="max-w-5xl text-4xl font-extrabold leading-tight text-[#030213] sm:text-5xl lg:text-6xl">
                {page.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-gray-500">
                {page.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/search">
                  <Button className="h-12 rounded-xl bg-brand-primary px-6 font-bold text-white shadow-lg shadow-orange-500/10 hover:bg-brand-primary-hover">
                    Compare Prices
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" className="h-12 rounded-xl border-gray-200 bg-white px-6 font-bold text-gray-900 hover:bg-gray-50">
                    How Tooli Works
                  </Button>
                </Link>
              </div>
            </div>

            <img
              src={page.image}
              alt={`Construction equipment available for hire in ${page.name}`}
              className="w-full rounded-2xl border border-gray-100 bg-gray-900 object-contain shadow-sm"
            />
          </div>
        </div>
      </section>

      <article className="py-16 md:py-24">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[minmax(0,840px)_minmax(260px,1fr)]">
          <div className="space-y-14">{page.content}</div>

          <aside className="lg:sticky lg:top-28 lg:self-start space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Compare {page.name} Hire Prices</h2>
              <p className="mb-6 text-sm font-medium leading-relaxed text-gray-500">
                Search by equipment type and location to compare local and national hire suppliers.
              </p>
              <Link to="/search">
                <Button className="h-11 w-full rounded-xl bg-brand-primary px-5 text-sm font-bold text-white hover:bg-brand-primary-hover">
                  Start Comparing
                </Button>
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Other Locations</h2>
              <ul className="space-y-2">
                {locationPages
                  .filter((loc) => loc.slug !== page.slug)
                  .map((loc) => (
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

            {/* Equipments */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Equipments</h2>
              <ul className="space-y-2">
                {equipmentPages.map((equip) => (
                  <li key={equip.slug}>
                    <Link
                      to={equip.path}
                      className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline"
                    >
                      <Wrench className="h-3.5 w-3.5 shrink-0" />
                      {equip.name}
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
