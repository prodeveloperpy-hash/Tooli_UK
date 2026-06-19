import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, MapPin, ShieldCheck } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

const pageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.tooli.uk/#organization',
      name: 'Tooli',
      alternateName: 'Tooli.uk',
      url: 'https://www.tooli.uk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tooli.uk/images/logo.png',
      },
      description:
        'Tooli is a free online comparison platform for tool hire and plant hire across the UK. Search by equipment type, postcode, and hire period to compare prices from multiple local and national hire suppliers side by side.',
      email: 'info@tooli.uk',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'GB',
      },
      areaServed: {
        '@type': 'Country',
        name: 'United Kingdom',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.tooli.uk/#website',
      name: 'Tooli',
      url: 'https://www.tooli.uk',
      description: 'Compare tool hire and plant hire prices across the UK. Free to use, no account required.',
      publisher: {
        '@id': 'https://www.tooli.uk/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.tooli.uk/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.tooli.uk/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.tooli.uk/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.tooli.uk/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I compare tool hire prices in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Search on Tooli.uk by equipment type, postcode, and hire period. We return supplier options from multiple local and national hire companies side by side.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the cheapest way to hire tools in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Compare before you book, choose the right hire period for your project, and check collection or delivery options before committing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why are tool hire prices higher in London?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Depot operating costs, delivery logistics, and congestion charges push London rates above the national average, but the dense supplier market creates strong competition.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I compare plant hire on Tooli as well as tool hire?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Tooli covers both tool hire and plant hire, including mini diggers, dumpers, scissor lifts, telehandlers, boom lifts, and compressors.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Tooli free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Comparing tool hire prices on Tooli.uk is completely free, and no account is required to search or view supplier rates.',
          },
        },
      ],
    },
  ],
};

const locations = [
  'London',
  'Birmingham',
  'Manchester',
  'Bristol',
  'Leeds',
  'Reading',
  'Nottingham',
  'Liverpool',
  'Cambridge',
  'Sheffield',
  'Essex',
  'Glasgow',
  'Newcastle',
  'Edinburgh',
  'Belfast',
];

const equipmentCategories = [
  ['Excavators and Mini Diggers', 'Used for foundations, drainage, site preparation and landscaping projects.'],
  ['Dumpers', 'Ideal for moving materials efficiently around site.'],
  ['Telehandlers', 'Used for lifting and moving materials on construction projects.'],
  ['Access Equipment', 'Including boom lifts, scissor lifts and powered access platforms.'],
  ['Compaction Equipment', 'Including rollers, trench compactors and wacker plates.'],
  ['Generators', 'Providing temporary power for construction and maintenance projects.'],
  ['Site Equipment', 'Including fencing, compressors, lighting towers and welfare equipment.'],
];

const comparisonPoints = [
  ['Weekly Hire Options', 'Many contractors hire equipment for several days or weeks. Comparing weekly hire options helps identify suppliers suited to project duration.'],
  ['Availability', 'Availability remains one of the most important factors when selecting a supplier.'],
  ['Delivery and Collection', 'Review service areas, delivery arrangements and collection procedures.'],
  ['Equipment Specifications', 'Not all machines within a category are identical. Confirm suitability before booking.'],
  ['Support and Replacement Procedures', 'Understand supplier support arrangements in case equipment becomes unavailable or develops a fault.'],
];

const commonMistakes = [
  ['Only Contacting One Supplier', 'Comparing suppliers provides better visibility of available options.'],
  ['Leaving Equipment Hire Too Late', 'Popular equipment categories can become difficult to source during busy periods.'],
  ['Ignoring Local Alternatives', 'Regional suppliers may provide excellent availability and support.'],
  ['Focusing on One Factor', 'Availability, service and support all matter.'],
  ['Assuming Equipment Is Identical', 'Always verify machine specifications before booking.'],
];

const faqs = [
  ['What equipment can be compared?', 'Categories include excavators, mini diggers, dumpers, telehandlers, generators, access equipment, compactors, rollers and site equipment.'],
  ['Can I book through Tooli UK?', 'Users compare suppliers and then visit the supplier website directly to complete the booking.'],
  ['Who uses Tooli UK?', 'Builders, contractors, landscapers, groundworkers, utilities contractors and civil engineering teams.'],
  ['Why compare suppliers?', 'Comparison provides better visibility into supplier availability, service coverage and equipment options.'],
];

export function BlogPage() {
  return (
    <div className="w-full bg-white">
      <PageMeta
        title="Tool Hire Comparison UK: Compare Construction Equipment & Plant Hire Suppliers | Tooli UK"
        description="Compare construction equipment and plant hire suppliers across major UK cities. Compare suppliers, review weekly hire options, and find the right equipment faster with Tooli UK."
        jsonLd={pageSchema}
      />

      <section className="bg-[#F8F9FC] py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500">
            <Link to="/" className="hover:text-brand-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Blog</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.15em] text-brand-primary">Tooli UK Blog</p>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-[#030213] sm:text-5xl lg:text-6xl">
                Tool Hire Comparison UK: Compare Construction Equipment & Plant Hire Suppliers
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-gray-500">
                Tooli UK helps contractors compare construction equipment and plant hire suppliers across major UK cities, making it faster to review availability, weekly hire options and supplier coverage.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/search"
                  className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition-colors hover:bg-brand-primary-hover"
                >
                  Compare Suppliers
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex h-12 items-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50"
                >
                  How Tooli Works
                </Link>
              </div>
            </div>

            <img
              src="/images/blog/tool-hire-comparison-uk.png"
              alt="Tooli UK construction equipment hire comparison platform"
              className="aspect-square w-full rounded-2xl border border-gray-100 bg-white object-cover shadow-sm"
            />
          </div>
        </div>
      </section>

      <article className="py-16 md:py-24">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[minmax(0,760px)_minmax(260px,1fr)]">
          <div className="space-y-12">
            <section className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
              <p>
                Finding the right equipment for a construction project is often more difficult than it should be. Contractors regularly spend valuable time contacting multiple suppliers, checking availability, reviewing delivery arrangements and trying to determine which supplier is best suited to a particular project.
              </p>
              <p>
                The construction industry moves quickly. Delays in sourcing equipment can impact labour schedules, subcontractors, project timelines and client expectations. Whether you are managing a residential development, commercial construction project, civil engineering contract or landscaping job, access to suitable equipment is critical.
              </p>
              <p>
                Tooli UK was created to simplify this process. Rather than contacting suppliers individually, users can compare suppliers in one place and then visit the supplier&apos;s website directly to complete their booking.
              </p>
            </section>

            <section>
              <h2 className="mb-5 text-3xl font-extrabold text-[#030213]">Why Tool Hire Comparison Matters</h2>
              <div className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
                <p>
                  Many contractors have preferred suppliers they use regularly. While those relationships remain valuable, relying exclusively on a single supplier can sometimes reduce visibility into other available options.
                </p>
                <p>
                  Equipment availability changes constantly. Demand fluctuates throughout the year and availability can vary significantly between locations. A supplier with limited availability in Manchester may have excellent availability in Birmingham. A supplier unable to support a project in London may have strong coverage in Leeds or Glasgow.
                </p>
                <p>Comparison helps contractors make decisions based on current availability, project requirements and supplier coverage.</p>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
              <h2 className="mb-5 text-3xl font-extrabold text-[#030213]">Why Contractors Use Tooli UK</h2>
              <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
                The biggest advantage is efficiency. Instead of spending hours researching suppliers, contractors can review supplier options more quickly and focus on managing projects.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Builders', 'Groundworkers', 'Landscapers', 'Civil engineering contractors', 'Utilities contractors', 'Facilities management companies', 'Site managers'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm font-bold text-gray-900">
                    <CheckCircle className="h-5 w-5 shrink-0 text-brand-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-3xl font-extrabold text-[#030213]">Construction Equipment Categories</h2>
              <div className="grid gap-4">
                {equipmentCategories.map(([title, description]) => (
                  <div key={title} className="rounded-2xl border border-gray-100 p-5">
                    <h3 className="mb-2 text-xl font-extrabold text-gray-900">{title}</h3>
                    <p className="font-medium leading-relaxed text-gray-500">{description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-3xl font-extrabold text-[#030213]">What To Compare</h2>
              <div className="space-y-4">
                {comparisonPoints.map(([title, description]) => (
                  <div key={title} className="flex gap-4">
                    <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-brand-primary" />
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
                      <p className="font-medium leading-relaxed text-gray-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-5 text-3xl font-extrabold text-[#030213]">National Suppliers vs Independent Depots</h2>
              <div className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
                <p>National suppliers often provide wider coverage and larger fleets.</p>
                <p>Independent depots frequently provide strong local knowledge and flexible service.</p>
                <p>Both options can be valuable depending on project requirements.</p>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-3xl font-extrabold text-[#030213]">Location-Based Comparison</h2>
              <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
                Location is a major factor in plant hire. Tooli UK currently supports:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {locations.map((location) => (
                  <div key={location} className="flex items-center gap-2 rounded-xl bg-[#F8F9FC] px-4 py-3 text-sm font-bold text-gray-900">
                    <MapPin className="h-4 w-4 text-brand-primary" />
                    {location}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-5 text-3xl font-extrabold text-[#030213]">Safety And Compliance</h2>
              <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
                Equipment selection should never be based solely on convenience. Depending on the equipment being used, CPCS, IPAF or PASMA training requirements may apply.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Inspection records', 'Maintenance procedures', 'Operator competency requirements', 'Site-specific safety requirements', 'Equipment suitability'].map((item) => (
                  <div key={item} className="rounded-xl border border-gray-100 p-4 text-sm font-bold text-gray-900">{item}</div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-3xl font-extrabold text-[#030213]">Common Mistakes</h2>
              <div className="grid gap-4">
                {commonMistakes.map(([title, description]) => (
                  <div key={title} className="rounded-2xl bg-[#F8F9FC] p-5">
                    <h3 className="mb-2 text-lg font-extrabold text-gray-900">{title}</h3>
                    <p className="font-medium leading-relaxed text-gray-500">{description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-3xl font-extrabold text-[#030213]">Frequently Asked Questions</h2>
              <div className="grid gap-4">
                {faqs.map(([question, answer]) => (
                  <div key={question} className="rounded-2xl border border-gray-100 p-5">
                    <h3 className="mb-2 text-lg font-extrabold text-gray-900">{question}</h3>
                    <p className="font-medium leading-relaxed text-gray-500">{answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
              <h2 className="mb-4 text-3xl font-extrabold">Conclusion</h2>
              <p className="mb-5 text-base font-medium leading-relaxed text-white/75 md:text-lg">
                Construction equipment comparison is about more than finding equipment. It is about improving efficiency, reviewing supplier options and helping contractors make informed decisions.
              </p>
              <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
                Tooli UK simplifies supplier comparison by bringing supplier options together in one place. Search your location, compare suppliers and visit the supplier website that best suits your project requirements.
              </p>
              <Link
                to="/search"
                className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
              >
                Start Comparing
              </Link>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Compare Faster With Tooli</h2>
              <p className="mb-6 text-sm font-medium leading-relaxed text-gray-500">
                Search by equipment type and location to review supplier options for your next construction project.
              </p>
              <Link
                to="/search"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
              >
                Compare Equipment
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
