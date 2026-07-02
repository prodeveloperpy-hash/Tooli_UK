import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, ChevronRight, MapPin, ShieldCheck } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

/* ------------------------------------------------------------------ */
/* Shared schema nodes                                                 */
/* ------------------------------------------------------------------ */

const ORGANIZATION_NODE = {
  '@type': 'Organization',
  '@id': 'https://tooli.uk/#organization',
  name: 'Tooli',
  alternateName: 'Tooli.uk',
  url: 'https://tooli.uk',
  logo: {
    '@type': 'ImageObject',
    url: 'https://tooli.uk/images/logo.png',
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
};

const WEBSITE_NODE = {
  '@type': 'WebSite',
  '@id': 'https://tooli.uk/#website',
  name: 'Tooli',
  url: 'https://tooli.uk',
  description: 'Compare tool hire and plant hire prices across the UK. Free to use, no account required.',
  publisher: {
    '@id': 'https://tooli.uk/#organization',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://tooli.uk/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

type Faq = [question: string, answer: string];

function buildPostSchema(post: {
  slug: string;
  title: string;
  metaDescription: string;
  image: string;
  datePublished: string;
  faqs: Faq[];
}): Record<string, unknown> {
  const url = `https://tooli.uk/blog/${post.slug}`;
  const graph: Record<string, unknown>[] = [
    ORGANIZATION_NODE,
    WEBSITE_NODE,
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tooli.uk/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://tooli.uk/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.metaDescription,
      image: `https://tooli.uk${post.image}`,
      datePublished: post.datePublished,
      dateModified: post.datePublished,
      author: {
        '@type': 'Organization',
        name: 'Tooli UK Editorial Team',
        url: 'https://tooli.uk',
      },
      publisher: { '@id': 'https://tooli.uk/#organization' },
      mainEntityOfPage: url,
    },
  ];

  if (post.faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: post.faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function H2({ children }: { children: ReactNode }) {
  return <h2 className="mb-5 text-3xl font-extrabold text-[#030213]">{children}</h2>;
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 text-xl font-extrabold text-gray-900">{children}</h3>;
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">{children}</div>;
}

function CheckList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-xl bg-[#F8F9FC] p-3 text-sm font-bold text-gray-900">
          <CheckCircle className="h-5 w-5 shrink-0 text-brand-primary" />
          {item}
        </div>
      ))}
    </div>
  );
}

function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section>
      <H2>Frequently Asked Questions</H2>
      <div className="grid gap-4">
        {faqs.map(([question, answer]) => (
          <div key={question} className="rounded-2xl border border-gray-100 p-5">
            <h3 className="mb-2 text-lg font-extrabold text-gray-900">{question}</h3>
            <p className="font-medium leading-relaxed text-gray-500">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Article 1 — Tool Hire Comparison UK                                 */
/* ------------------------------------------------------------------ */

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

const equipmentCategories: Faq[] = [
  ['Excavators and Mini Diggers', 'Used for foundations, drainage, site preparation and landscaping projects.'],
  ['Dumpers', 'Ideal for moving materials efficiently around site.'],
  ['Telehandlers', 'Used for lifting and moving materials on construction projects.'],
  ['Access Equipment', 'Including boom lifts, scissor lifts and powered access platforms.'],
  ['Compaction Equipment', 'Including rollers, trench compactors and wacker plates.'],
  ['Generators', 'Providing temporary power for construction and maintenance projects.'],
  ['Site Equipment', 'Including fencing, compressors, lighting towers and welfare equipment.'],
];

const comparisonPoints: Faq[] = [
  ['Weekly Hire Options', 'Many contractors hire equipment for several days or weeks. Comparing weekly hire options helps identify suppliers suited to project duration.'],
  ['Availability', 'Availability remains one of the most important factors when selecting a supplier.'],
  ['Delivery and Collection', 'Review service areas, delivery arrangements and collection procedures.'],
  ['Equipment Specifications', 'Not all machines within a category are identical. Confirm suitability before booking.'],
  ['Support and Replacement Procedures', 'Understand supplier support arrangements in case equipment becomes unavailable or develops a fault.'],
];

const commonMistakes: Faq[] = [
  ['Only Contacting One Supplier', 'Comparing suppliers provides better visibility of available options.'],
  ['Leaving Equipment Hire Too Late', 'Popular equipment categories can become difficult to source during busy periods.'],
  ['Ignoring Local Alternatives', 'Regional suppliers may provide excellent availability and support.'],
  ['Focusing on One Factor', 'Availability, service and support all matter.'],
  ['Assuming Equipment Is Identical', 'Always verify machine specifications before booking.'],
];

const comparisonFaqs: Faq[] = [
  ['What equipment can be compared?', 'Categories include excavators, mini diggers, dumpers, telehandlers, generators, access equipment, compactors, rollers and site equipment.'],
  ['Can I book through Tooli UK?', 'Users compare suppliers and then visit the supplier website directly to complete the booking.'],
  ['Who uses Tooli UK?', 'Builders, contractors, landscapers, groundworkers, utilities contractors and civil engineering teams.'],
  ['Why compare suppliers?', 'Comparison provides better visibility into supplier availability, service coverage and equipment options.'],
];

function ToolHireComparisonBody() {
  return (
    <>
      <section className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
        <p>
          Finding the right equipment for a construction project is often more difficult than it should be. Contractors regularly spend valuable time contacting multiple suppliers, checking availability, reviewing delivery arrangements and trying to determine which supplier is best suited to a particular project.
        </p>
        <p>
          The construction industry moves quickly. Delays in sourcing equipment can impact labour schedules, subcontractors, project timelines and client expectations. Whether you are managing a residential development, commercial construction project, civil engineering contract or landscaping job, access to suitable equipment is critical.
        </p>
        <p>
          Tooli UK was created to simplify this process. Rather than contacting suppliers individually, users can compare suppliers in one place and then visit the supplier’s website directly to complete their booking.
        </p>
      </section>

      <section>
        <H2>Why Tool Hire Comparison Matters</H2>
        <Prose>
          <p>
            Many contractors have preferred suppliers they use regularly. While those relationships remain valuable, relying exclusively on a single supplier can sometimes reduce visibility into other available options.
          </p>
          <p>
            Equipment availability changes constantly. Demand fluctuates throughout the year and availability can vary significantly between locations. A supplier with limited availability in Manchester may have excellent availability in Birmingham. A supplier unable to support a project in London may have strong coverage in Leeds or Glasgow.
          </p>
          <p>Comparison helps contractors make decisions based on current availability, project requirements and supplier coverage.</p>
        </Prose>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <H2>Why Contractors Use Tooli UK</H2>
        <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          The biggest advantage is efficiency. Instead of spending hours researching suppliers, contractors can review supplier options more quickly and focus on managing projects.
        </p>
        <CheckList items={['Builders', 'Groundworkers', 'Landscapers', 'Civil engineering contractors', 'Utilities contractors', 'Facilities management companies', 'Site managers']} />
      </section>

      <section>
        <H2>Construction Equipment Categories</H2>
        <div className="grid gap-4">
          {equipmentCategories.map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-gray-100 p-5">
              <H3>{title}</H3>
              <p className="font-medium leading-relaxed text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>What To Compare</H2>
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
        <H2>National Suppliers vs Independent Depots</H2>
        <Prose>
          <p>National suppliers often provide wider coverage and larger fleets.</p>
          <p>Independent depots frequently provide strong local knowledge and flexible service.</p>
          <p>Both options can be valuable depending on project requirements.</p>
        </Prose>
      </section>

      <section>
        <H2>Location-Based Comparison</H2>
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
        <H2>Safety And Compliance</H2>
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
        <H2>Common Mistakes</H2>
        <div className="grid gap-4">
          {commonMistakes.map(([title, description]) => (
            <div key={title} className="rounded-2xl bg-[#F8F9FC] p-5">
              <h3 className="mb-2 text-lg font-extrabold text-gray-900">{title}</h3>
              <p className="font-medium leading-relaxed text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqSection faqs={comparisonFaqs} />

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
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 2 — Mini Digger Hire Cost UK                                */
/* ------------------------------------------------------------------ */

const priceVariationFactors = [
  'Location',
  'Fleet availability',
  'Delivery distance',
  'Insurance arrangements',
  'Weekend demand',
  'Attachments included',
  'Seasonal demand',
  'Minimum hire periods',
];

const overpayMistakes: Faq[] = [
  ['1. Hiring the Wrong Size Machine', 'Many first-time hirers focus on the lowest advertised rate rather than the most suitable machine. The result is often slower progress and a longer hire period.'],
  ['2. Booking at the Last Minute', 'Limited availability can reduce your options and increase costs.'],
  ['3. Ignoring Delivery Charges', 'Always compare total project costs rather than the headline rate.'],
  ['4. Forgetting About Access', 'A machine that can’t reach the work area creates delays and additional expense.'],
  ['5. Extending the Hire Repeatedly', 'Booking realistic hire periods from the beginning often provides better value.'],
];

const miniDiggerFaqs: Faq[] = [
  ['What size mini digger do I need?', 'The answer depends on access, digging depth and project size. Most domestic projects are completed using either a micro digger or a 1.5-tonne mini digger.'],
  ['Is weekly hire cheaper than daily hire?', 'In many cases, yes. Longer hire periods often provide better value than multiple short-term bookings.'],
  ['Does mini digger hire include delivery?', 'Delivery arrangements vary by supplier. Always confirm what is included before booking.'],
  ['Can I hire a mini digger with an operator?', 'Many suppliers offer operated hire services for customers who require a qualified operator.'],
  ['Can a mini digger fit through a garden gate?', 'Many micro diggers are designed specifically for narrow access work and can fit through standard garden gates.'],
];

function MiniDiggerBody() {
  return (
    <>
      <section className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
        <p>If you’ve searched for mini digger hire online, you’ve probably noticed something frustrating.</p>
        <p>
          One supplier advertises a machine for one price, another quotes something completely different, and by the time delivery, fuel, insurance and extras are added, the final cost can look nothing like the original advert.
        </p>
        <p>That’s because there is no single UK-wide price for mini digger hire.</p>
        <p>
          The cost depends on the machine size, your location, supplier availability, hire duration, delivery distance, attachments and several other factors. The good news is that understanding how pricing works makes it much easier to avoid overpaying.
        </p>
        <p>
          In this guide, we’ll explain what influences mini digger hire costs, how to choose the right machine for your project, common mistakes to avoid, and why comparing suppliers before booking can save both time and money.
        </p>
      </section>

      <section>
        <H2>Why Mini Digger Prices Vary Between Suppliers</H2>
        <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Many people assume mini diggers are like retail products where every supplier charges roughly the same amount. Plant hire doesn’t work that way. Two suppliers may offer similar machines, but the final price can differ because of:
        </p>
        <CheckList items={priceVariationFactors} />
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          This is why comparing multiple suppliers is often more important than focusing on a single advertised rate.
        </p>
      </section>

      <section>
        <H2>Choosing the Right Mini Digger</H2>
        <Prose>
          <p>The most expensive mistake isn’t paying slightly more for a machine. It’s hiring the wrong machine altogether.</p>
          <p>A machine that’s too small can turn a one-day job into a three-day project. A machine that’s too large may not fit through your access point at all.</p>
        </Prose>
        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-gray-100 p-5">
            <H3>Micro Diggers</H3>
            <p className="mb-3 font-medium leading-relaxed text-gray-500">
              Micro diggers are designed for restricted access projects. Typical uses include garden landscaping, pond excavation, fence installation and small drainage projects. Many models can fit through standard garden gates, making them ideal for residential work.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 p-5">
            <H3>Mini Diggers</H3>
            <p className="mb-3 font-medium leading-relaxed text-gray-500">
              Mini diggers are the most commonly hired excavators in the UK. They’re suitable for driveways, foundations, landscaping, drainage and general groundwork. For many homeowners and builders, this size offers the best balance between power and manoeuvrability.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 p-5">
            <H3>Midi Excavators</H3>
            <p className="mb-3 font-medium leading-relaxed text-gray-500">
              Midi excavators are often chosen for larger trenching projects, utility installation, commercial groundwork and heavy excavation. Where access allows, they can significantly increase productivity.
            </p>
          </div>
        </div>
      </section>

      <section>
        <H2>What Actually Affects Hire Costs?</H2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-brand-primary" />
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Location</h3>
              <p className="font-medium leading-relaxed text-gray-500">
                Location is one of the biggest influences on plant hire pricing. Machines hired in major cities often cost more because suppliers face higher operating costs and stronger demand. Transport costs can also vary significantly depending on where the machine is being delivered.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-brand-primary" />
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Hire Duration</h3>
              <p className="font-medium leading-relaxed text-gray-500">
                Longer hire periods frequently offer better value. Many suppliers provide discounted rates for multi-day bookings, weekly hires and long-term projects. If your project might take longer than expected, comparing longer hire periods can often reduce the overall cost.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-brand-primary" />
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Delivery and Collection</h3>
              <p className="font-medium leading-relaxed text-gray-500">
                One of the most commonly overlooked costs is transport. Ask whether delivery and collection are included, whether there is a mileage charge, and whether timed deliveries cost extra. The cheapest advertised machine isn’t always the cheapest overall option.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-brand-primary" />
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Attachments</h3>
              <p className="font-medium leading-relaxed text-gray-500">
                The right attachment can dramatically improve productivity. Common options include hydraulic breakers, augers, trenching buckets and grading buckets. Choosing the correct attachment can reduce labour time and help complete the project faster.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <H2>Five Ways People Accidentally Overpay</H2>
        <div className="grid gap-4">
          {overpayMistakes.map(([title, description]) => (
            <div key={title} className="rounded-2xl bg-[#F8F9FC] p-5">
              <h3 className="mb-2 text-lg font-extrabold text-gray-900">{title}</h3>
              <p className="font-medium leading-relaxed text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>Do You Need a Licence to Hire a Mini Digger?</H2>
        <Prose>
          <p>For private projects on your own property, there is generally no specific licence required to hire or operate a mini digger. However, safe operation remains your responsibility.</p>
          <p>If you’re working on a commercial construction site, operator qualifications may be required depending on site rules and contractor requirements. Always verify site-specific requirements before operating machinery.</p>
        </Prose>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <H2>Mini Digger vs Micro Digger: Which Should You Choose?</H2>
        <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          This is one of the most common questions among first-time hirers.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5">
            <H3>Choose a micro digger if</H3>
            <ul className="space-y-2 text-sm font-medium text-gray-500">
              <li>Access is restricted</li>
              <li>You need to pass through a garden gate</li>
              <li>The project is relatively small</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <H3>Choose a mini digger if</H3>
            <ul className="space-y-2 text-sm font-medium text-gray-500">
              <li>Access isn’t a problem</li>
              <li>You need more digging power</li>
              <li>Productivity matters</li>
              <li>You’re working on foundations or drainage</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          For many domestic projects, a mini digger offers the best overall balance.
        </p>
      </section>

      <section>
        <H2>Why Comparing Suppliers Matters</H2>
        <Prose>
          <p>Many customers spend hours contacting suppliers individually. The problem is that availability, specifications and pricing can vary considerably.</p>
        </Prose>
        <div className="mt-6">
          <CheckList items={['Review multiple options quickly', 'Compare machine sizes', 'Check availability', 'Compare supplier terms', 'Make more informed decisions']} />
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          This is often the fastest way to identify suitable equipment without spending hours gathering quotes manually.
        </p>
      </section>

      <FaqSection faqs={miniDiggerFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Final Thoughts</h2>
        <p className="mb-5 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          The cheapest advertised rate isn’t always the best value. The right machine, suitable hire period, realistic transport costs and the ability to compare suppliers all play a role in the final cost of your project.
        </p>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Before booking, compare multiple suppliers, check what’s included, and make sure the machine matches your requirements. Taking a few extra minutes to compare options can save money, avoid delays and help your project run more smoothly.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Mini Digger Hire Prices
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 3 — Tool Hire Liverpool                                     */
/* ------------------------------------------------------------------ */

const liverpoolPrices: Faq[] = [
  ['Mini Digger (0.8–1.5t)', '£150–£220'],
  ['Mini Digger (3t)', '£220–£310'],
  ['Scaffold Tower', '£55–£90'],
  ['Electric Breaker', '£45–£65'],
  ['Wacker Plate', '£45–£70'],
  ['Concrete Mixer', '£45–£65'],
  ['Pressure Washer', '£50–£75'],
  ['Cherry Picker (12m)', '£190–£280'],
  ['Telehandler', '£270–£380'],
  ['Generator', '£65–£95'],
];

const liverpoolPriceFactors = [
  'Supplier location',
  'Equipment availability',
  'Delivery requirements',
  'Length of hire',
  'Seasonal demand',
  'Fleet utilisation levels',
];

const liverpoolAreas = [
  'Liverpool City Centre',
  'Bootle',
  'Kirkby',
  'Huyton',
  'Speke',
  'Wavertree',
  'Allerton',
  'Garston',
  'Woolton',
  'Norris Green',
  'West Derby',
  'Birkenhead',
  'Wallasey',
  'St Helens',
  'Widnes',
  'Southport',
  'Knowsley',
];

const liverpoolEquipment: Faq[] = [
  ['Mini Digger Hire', 'Mini excavators remain one of the most requested items throughout Liverpool. They are commonly used for foundations, drainage work, landscaping projects, driveway installations and garden renovations.'],
  ['Scaffold Tower Hire', 'Popular with builders, decorators, roofers and homeowners. Aluminium towers provide a cost-effective solution for working safely at height.'],
  ['Breaker Hire', 'Both electric and petrol breakers are regularly hired for concrete removal, driveway replacement, internal renovation work and demolition projects.'],
  ['Cherry Picker Hire', 'MEWPs and cherry pickers are widely used for building maintenance, roofing work, sign installation and commercial property projects.'],
  ['Generator Hire', 'Generators remain essential for construction sites, temporary power, outdoor events and emergency backup power.'],
];

const liverpoolTrades: [title: string, items: string[]][] = [
  ['Builders and Contractors', ['Excavators', 'Dumpers', 'Telehandlers', 'Generators', 'Site equipment']],
  ['Landscapers', ['Mini diggers', 'Turf cutters', 'Rotavators', 'Wacker plates', 'Trench rammers']],
  ['Roofers', ['Scaffold towers', 'Cherry pickers', 'Access platforms', 'Safety equipment']],
  ['Homeowners', ['Pressure washers', 'Breakers', 'Floor sanders', 'Concrete mixers', 'Wallpaper strippers']],
];

const liverpoolFaqs: Faq[] = [
  ['How much does mini digger hire cost in Liverpool?', 'Typical rates range from approximately £150–£310 per day depending on machine size, supplier and availability.'],
  ['Can I hire tools without a trade account?', 'Yes. Most suppliers accept bookings from both businesses and private individuals.'],
  ['Do Liverpool suppliers offer weekend hire?', 'Yes. Many suppliers provide Friday-to-Monday weekend hire rates which can offer better value than separate daily hires.'],
  ['Is delivery available across Merseyside?', 'Most suppliers offer delivery throughout Liverpool, Bootle, Kirkby, Huyton, Speke, Birkenhead and surrounding areas.'],
  ['Do I need a licence to hire a mini digger?', 'A licence is not normally required for private land, but operators must be competent and commercial sites may require recognised plant certification.'],
  ['Can I get same-day tool hire in Liverpool?', 'Same-day hire is often available for smaller equipment, subject to stock and supplier location.'],
];

function LiverpoolBody() {
  return (
    <>
      <section className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
        <p>
          Looking for tool hire in Liverpool? Tooli.uk helps you compare prices from local independent hire companies and national suppliers across Liverpool, Bootle, Kirkby, Huyton, Speke, Wavertree, Birkenhead and the wider Merseyside area.
        </p>
        <p>
          Instead of calling multiple depots for quotes, compare hire prices in one place and find the best deal for your project. Whether you need a mini digger, scaffold tower, breaker, generator or cherry picker, Tooli.uk helps you see what’s available and what local suppliers are charging before you book.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <H2>Compare Liverpool Tool Hire Prices in Under 60 Seconds</H2>
        <CheckList
          items={[
            'Compare local and national suppliers',
            'View equipment options for your postcode',
            'Check delivery availability',
            'Compare daily and weekly hire rates',
            'Save time calling around Liverpool depots',
          ]}
        />
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Start your comparison today and see how much you could save.
        </p>
      </section>

      <section>
        <H2>Average Tool Hire Prices in Liverpool</H2>
        <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Hire rates vary depending on supplier, equipment availability, delivery distance and seasonality. The figures below provide a useful guide to typical Liverpool market rates.
        </p>
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8F9FC] text-gray-900">
              <tr>
                <th className="px-5 py-3 font-extrabold">Equipment</th>
                <th className="px-5 py-3 font-extrabold">Typical Daily Rate</th>
              </tr>
            </thead>
            <tbody>
              {liverpoolPrices.map(([equipment, rate]) => (
                <tr key={equipment} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-bold text-gray-900">{equipment}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium leading-relaxed text-gray-500">
          Actual prices vary by supplier and postcode. Compare live quotes through Tooli.uk for the latest rates.
        </p>
      </section>

      <section>
        <H2>Why Tool Hire Prices Differ Across Liverpool</H2>
        <Prose>
          <p>Many customers are surprised by how much prices can vary for identical equipment.</p>
          <p>A mini digger available from one supplier may cost significantly more than the same machine from another depot just a few miles away. Price differences are usually influenced by:</p>
        </Prose>
        <div className="mt-6">
          <CheckList items={liverpoolPriceFactors} />
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Independent Merseyside suppliers can often offer more competitive rates than larger national chains, particularly for longer hires and plant equipment. This is why comparing quotes before booking can lead to substantial savings.
        </p>
      </section>

      <section>
        <H2>Most Popular Equipment Hired in Liverpool</H2>
        <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Liverpool has a strong mix of construction, renovation, commercial and residential projects, creating demand across a wide range of equipment.
        </p>
        <div className="grid gap-4">
          {liverpoolEquipment.map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-gray-100 p-5">
              <H3>{title}</H3>
              <p className="font-medium leading-relaxed text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>Areas Covered Across Liverpool and Merseyside</H2>
        <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Tooli.uk compares suppliers serving:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {liverpoolAreas.map((area) => (
            <div key={area} className="flex items-center gap-2 rounded-xl bg-[#F8F9FC] px-4 py-3 text-sm font-bold text-gray-900">
              <MapPin className="h-4 w-4 text-brand-primary" />
              {area}
            </div>
          ))}
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Many suppliers also cover surrounding Merseyside and Cheshire postcodes.
        </p>
      </section>

      <section>
        <H2>Tool Hire for Trades and Homeowners</H2>
        <div className="grid gap-4 sm:grid-cols-2">
          {liverpoolTrades.map(([title, items]) => (
            <div key={title} className="rounded-2xl border border-gray-100 p-5">
              <H3>{title}</H3>
              <ul className="space-y-2 text-sm font-medium text-gray-500">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 text-brand-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>Delivery and Collection Options</H2>
        <Prose>
          <p>Most Liverpool suppliers offer both collection and delivery.</p>
        </Prose>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 p-5">
            <H3>Depot Collection</H3>
            <p className="font-medium leading-relaxed text-gray-500">
              Collecting equipment directly from a depot is often the cheapest option and can avoid delivery charges.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 p-5">
            <H3>Site Delivery</H3>
            <p className="font-medium leading-relaxed text-gray-500">
              Many suppliers offer next-day delivery across Liverpool and Merseyside. Availability depends on equipment type, supplier location, current demand and site access requirements.
            </p>
          </div>
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Always check delivery costs when comparing quotes, as these can vary significantly between suppliers.
        </p>
      </section>

      <section>
        <H2>Why Compare Tool Hire Prices?</H2>
        <Prose>
          <p>Many businesses automatically use the same supplier every time. While this is convenient, it doesn’t always provide the best value.</p>
        </Prose>
        <div className="mt-6">
          <CheckList items={['Reduce hire costs', 'Check availability faster', 'Compare delivery charges', 'Find specialist equipment', 'Access local independent suppliers']} />
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          For larger plant hires, even a small percentage difference in price can save hundreds of pounds over the duration of a project.
        </p>
      </section>

      <section>
        <H2>Safety and Compliance</H2>
        <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Before hiring equipment, ensure operators are appropriately trained and competent. Depending on the equipment and site requirements, regulations may apply including:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {['PUWER', 'LOLER', 'Working at Height Regulations', 'CDM Regulations'].map((item) => (
            <div key={item} className="rounded-xl border border-gray-100 p-4 text-sm font-bold text-gray-900">{item}</div>
          ))}
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          Always request relevant certification and inspection records where required.
        </p>
      </section>

      <FaqSection faqs={liverpoolFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Liverpool Tool Hire Prices Today</h2>
        <p className="mb-5 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Tooli.uk makes it easy to compare equipment hire prices from suppliers across Liverpool and Merseyside. Whether you’re a contractor managing multiple projects or a homeowner tackling a weekend renovation, comparing quotes can help you find the right equipment at the right price.
        </p>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode, select your equipment and compare Liverpool tool hire prices in minutes.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Liverpool Tool Hire
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 4 — Tool Hire Comparison: How to Actually Save Money        */
/* ------------------------------------------------------------------ */

const priceVariationTable: [string, string][] = [
  ['Location (city centre vs out of town)', 'High — depot overheads vary significantly'],
  ['Demand on hire dates (weekends, school holidays)', 'High — prices spike when stock is tight'],
  ['Trade account vs casual hire', 'Medium — trade accounts often unlock 10–20% lower rates'],
  ['Delivery distance', 'Medium — flat fees common, but distance-tiered pricing exists too'],
  ['Damage waiver / insurance add-on', 'Medium — optional at some depots, bundled at others'],
  ['Fuel and consumables (blades, fuel, oil)', 'Low to medium — easy to overlook when comparing headline rates'],
];

const nationalVsIndependentRows: [string, string, string][] = [
  ['Price', 'Higher on average', 'Often 10–20% cheaper'],
  ['Consistency', 'High — standardised kit and process', 'Variable — depends on depot'],
  ['Availability', 'Strong stock levels', 'Can run out of popular kit fast'],
  ['Account set-up', 'Often requires trade account + credit check', 'Frequently more flexible'],
  ['Booking', 'Online, app-based', 'Phone-first in many cases, improving online'],
  ['Best for', 'Time-poor traders, repeat business accounts', 'One-off jobs, weekend hirers, price-sensitive jobs'],
];

const puwerChecklist = [
  'Ask whether the equipment has a current inspection record, not just a "service sticker"',
  'Check if PAT testing is current on any electrical tools',
  'Confirm whether operator training or a licence (CPCS, IPAF, PASMA) is needed for the specific machine',
  'Get the depot\'s contact details in writing in case of a fault on site',
  'Check what happens if equipment fails mid-job — same-day swap, or are you stuck waiting?',
];

const comparisonSteps: [string, string][] = [
  ['Define the exact spec', '"Mini digger" isn\'t specific enough. You need tonnage, tracked or wheeled, and bucket size — price varies a lot within one category.'],
  ['Check three to five suppliers for the same dates', 'Fewer than three and you don\'t have a real comparison. More than five and you\'re wasting time for marginal gains.'],
  ['Get the all-in price', 'Day rate plus delivery plus damage waiver plus fuel — not just the headline figure.'],
  ['Check the weekly rate even for short jobs', 'If your one-day job might run into a second day, the weekly rate sometimes beats two day rates combined.'],
  ['Confirm availability for your actual postcode', 'Not just "in your area." Stock varies depot to depot, especially on popular kit during peak season.'],
  ['Book the total package, not just the lowest number', 'A £5/day saving isn\'t worth it if the cheaper supplier can\'t deliver until Thursday and your job starts Tuesday.'],
];

const saveMoneyFaqs: Faq[] = [
  [
    'Is tool hire comparison actually worth the time?',
    'Yes, on anything over roughly £50 in hire value. Below that, the time spent comparing often costs more than the saving. On bigger kit like diggers, towers, or generators, the price gap between suppliers is usually large enough to make a few minutes of comparison worthwhile.',
  ],
  [
    'Do tool hire prices include VAT?',
    'Not always shown that way by default. Some suppliers quote VAT-inclusive prices, others quote net and add VAT at checkout. Always check before comparing, because a 20% difference can completely flip which quote is actually cheaper.',
  ],
  [
    'Can I hire tools without a trade account?',
    'Often, yes. A growing number of suppliers and booking platforms now let anyone browse, pick dates, and pay online without an account application, phone call, or credit check — though some specialist or high-value equipment may still need an identity check at checkout.',
  ],
  [
    'Are national chains always more expensive than independents?',
    'Generally yes on day rate, but not always on total cost once you factor in delivery, account discounts, and availability. A national chain with a same-day delivery slot can work out cheaper overall than an independent that needs a £30 round-trip delivery fee.',
  ],
  [
    'Who\'s responsible if hired equipment is faulty or breaks on site?',
    'The supplier has a duty to provide safe, maintained equipment, but you as the hirer also have responsibilities under PUWER while you\'re using it. HSE guidance on PUWER covers inspection, maintenance, training, and competence requirements for work equipment, including kit you don\'t own.',
  ],
  [
    'Do weekend rates differ from weekday rates?',
    'Often yes, especially on popular DIY kit like wacker plates, turf cutters, and pressure washers. Demand spikes Friday to Sunday, and some suppliers price weekend hire as a fixed block rather than two separate day rates.',
  ],
  [
    'Is it cheaper to hire one item from each of three suppliers, or all items from one supplier?',
    'Usually one supplier wins if they bundle delivery, since you only pay one delivery fee instead of three. But if one supplier is notably cheaper on the big-ticket item (a digger, say) and mediocre on the small stuff, splitting can still come out ahead. This is exactly the kind of multi-item comparison worth running properly rather than guessing.',
  ],
];

function ToolHireComparisonSaveMoneyBody() {
  return (
    <>
      <section className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
        <p>
          Tool hire comparison means checking prices, terms, and availability across multiple suppliers before you book, instead of ringing your usual depot and accepting whatever they quote. Day rates for the same kit can swing by £15–£30 between suppliers in the same town, depending on demand, depot overheads, and whether you've got a trade account.
        </p>
        <p>
          This guide covers what actually moves the price, what to ignore, and how to compare properly without wasting half your morning on the phone.
        </p>
      </section>

      <section>
        <H2>Why Tool Hire Prices Vary So Much Between Suppliers</H2>
        <Prose>
          <p>
            There's no national price book for tool hire. Every depot sets its own rates based on local competition, overheads, and how busy they are that week.
          </p>
          <p>
            A 14-inch wacker plate hired in central London will almost always cost more than the same machine 20 miles out, simply because depot rent and van costs are higher. Most hire companies want you to open a trade account before you can book anything, which adds friction and can push casual hirers toward whichever depot they already have a relationship with — even if it's not the cheapest.
          </p>
          <p>
            That's the gap a comparison approach closes. You're not loyal to one depot. You're checking who's actually competitive this week, for this job, in your postcode.
          </p>
        </Prose>

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-extrabold text-gray-900">What actually drives the price difference</h3>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                  <th className="px-5 py-3 text-left font-extrabold text-gray-900">Factor</th>
                  <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical impact on price</th>
                </tr>
              </thead>
              <tbody>
                {priceVariationTable.map(([factor, impact], i) => (
                  <tr key={factor} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                    <td className="px-5 py-3 font-bold text-gray-700">{factor}</td>
                    <td className="px-5 py-3 font-medium text-gray-500">{impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <H2>What to Actually Compare (Not Just the Day Rate)</H2>
        <Prose>
          <p>
            Comparing tool hire on day rate alone is how people end up paying more overall. The headline price is the easiest number to find and the least useful one on its own.
          </p>
        </Prose>

        <div className="mt-6 space-y-4">
          {[
            {
              num: '1',
              title: 'Total cost for your actual hire period',
              body: 'Ask for the day rate, weekend rate, and weekly rate every time. Weekly rates are almost never seven times the daily rate. A wacker plate at £45/day might be £130 for the week — which works out at under £19/day if you keep it the full seven days.',
            },
            {
              num: '2',
              title: 'Delivery and collection fees',
              body: 'Some suppliers bundle delivery into a flat £15–£25 fee. Others scale it by distance or postcode zone. If you\'re hiring more than one item, ask whether delivery is charged once per order or once per item.',
            },
            {
              num: '3',
              title: 'Damage waiver and deposit terms',
              body: 'This is where comparison really pays off. Some depots include basic accidental damage cover in the price. Others charge it separately, and a few don\'t offer it at all — leaving you exposed to the full repair or replacement cost if something goes wrong on site.',
            },
            {
              num: '4',
              title: 'Fuel, consumables, and "return clean" charges',
              body: 'Petrol diggers and wacker plates are usually hired with an empty tank or a fuel surcharge. Some suppliers also charge a cleaning fee if kit comes back muddy — which on a groundworks job is basically guaranteed.',
            },
            {
              num: '5',
              title: 'Trade account requirements',
              body: 'A handful of suppliers and some newer comparison-style platforms now let you book without setting up a trade account at all. Anyone can browse, pick dates, and pay online without an account application, a phone call, or a multi-day wait for confirmation — which matters if you need kit on site tomorrow, not next week.',
            },
          ].map((item) => (
            <div key={item.num} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-black text-white">{item.num}</span>
              <div>
                <p className="mb-1 font-extrabold text-gray-900">{item.title}</p>
                <p className="text-sm font-medium leading-relaxed text-gray-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-extrabold text-gray-900">National chains vs independents: the real trade-off</h3>
          <p className="mb-4 text-sm font-medium text-gray-500">
            Neither side is automatically right. A site manager running a six-week groundworks job with five different tools on hire at once probably wants the consistency of a national account. A homeowner laying a patio for one weekend wants the cheapest 1.5-tonne digger available within a 10-mile radius, and doesn't care which badge is on the side of it.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                  <th className="px-5 py-3 text-left font-extrabold text-gray-900"> </th>
                  <th className="px-5 py-3 text-left font-extrabold text-brand-primary">National chains</th>
                  <th className="px-5 py-3 text-left font-extrabold text-gray-900">Independent depots</th>
                </tr>
              </thead>
              <tbody>
                {nationalVsIndependentRows.map(([factor, national, independent], i) => (
                  <tr key={factor} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                    <td className="px-5 py-3 font-bold text-gray-700">{factor}</td>
                    <td className="px-5 py-3 font-medium text-gray-500">{national}</td>
                    <td className="px-5 py-3 font-medium text-gray-500">{independent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 space-y-8">
          <div>
            <H3>How PUWER Affects Your Comparison, Not Just Your Wallet</H3>
            <Prose>
              <p>
                Price isn't the only variable that matters when you compare tool hire suppliers, because the law doesn't stop applying just because you didn't buy the equipment outright.
              </p>
              <p>
                Under the Provision and Use of Work Equipment Regulations 1998, PUWER applies to all workplaces in Great Britain and covers all equipment used at work, regardless of sector or size — and even hired or loaned equipment must comply with PUWER while it's being used. In plain terms: if you hire a wacker plate or a mini digger for a job, you're responsible for making sure it's safe to use, not just the depot that supplied it.
              </p>
              <p>
                That means a genuinely good comparison isn't just "which depot is cheapest" — it's "which depot gives me equipment that's properly maintained, tested, and accompanied by the right paperwork." PUWER produces a written inspection record rather than a certificate, and any supplier claiming to offer a "PUWER certificate" is using a marketing term, not a legal one. Worth knowing before you take someone's word for it.
              </p>
            </Prose>
            <div className="mt-6 rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
              <p className="mb-4 font-extrabold text-gray-900">Quick compliance checklist when comparing suppliers</p>
              <div className="space-y-2">
                {puwerChecklist.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                    <span className="text-sm font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <H3>How to Compare Tool Hire Prices Properly, Step by Step</H3>
            <div className="space-y-3">
              {comparisonSteps.map(([title, body], i) => (
                <div key={title} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-black text-white">{i + 1}</span>
                  <div>
                    <p className="font-extrabold text-gray-900">{title}</p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FaqSection faqs={saveMoneyFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Start Comparing and Stop Overpaying</h2>
        <p className="mb-5 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          The difference between the cheapest and the most expensive quote for the same kit, on the same dates, in the same town, is often larger than most people expect. A few minutes of proper comparison — total cost, not just day rate — is almost always worth the effort on anything above a basic hand tool hire.
        </p>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Use Tooli UK to compare suppliers side by side, check availability for your postcode, and book with confidence — without spending half your morning on hold.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Tool Hire Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 5 — Tool Hire in London: Compare Prices From Local Suppliers*/
/* ------------------------------------------------------------------ */

const londonPriceFactors: [string, string][] = [
  ['Zone 1–2 vs outer London', 'High — central depots carry higher overheads'],
  ['ULEZ/congestion charge passed to delivery fee', 'Low to medium — varies by supplier, often unbundled'],
  ['Weekend demand (DIY-heavy boroughs)', 'Medium — spikes in spring/summer'],
  ['Trade account vs casual hire', 'Medium — same as the rest of the UK'],
  ['Site access (parking, loading restrictions)', 'Indirect — can extend delivery windows in dense areas'],
];

const londonEquipmentTable: [string, string, string][] = [
  ['Wacker plate', 'Patio prep, driveway sub-base, garden paths', '£35–£55'],
  ['Mini digger (0.8t–1.5t)', 'Loft conversions, extensions, narrow side-passage access jobs', '£85–£180'],
  ['Access tower', 'Render repair, guttering, period property maintenance', '£45–£90'],
  ['Cement mixer', 'Garden walls, small extensions, repointing', '£25–£40'],
  ['Floor sander', 'Period flat and terrace house floor restoration', '£40–£65'],
  ['Dehumidifier', 'Damp basements and ground-floor flats, common in older London housing stock', '£20–£35'],
  ['Breaker/kango', 'Concrete removal in tight courtyards and basements', '£30–£55'],
];

const londonTrades = [
  { role: 'Builders and groundworkers', desc: 'Extensions, loft conversions, and basement digs in space-constrained boroughs' },
  { role: 'Plasterers and decorators', desc: 'Access towers and floor sanders for period property refurbishment' },
  { role: 'Electricians and plumbers', desc: 'Short-hire access equipment for first and second fix work' },
  { role: 'Landscapers', desc: "Turf cutters, wacker plates, and mini diggers for London's smaller garden footprints" },
  { role: 'Scaffolding contractors', desc: 'Tower hire and PASMA-certified equipment for terrace and townhouse work' },
];

const londonFaqs: Faq[] = [
  [
    'Is tool hire more expensive in central London than outer London?',
    'Generally yes. Zone 1–2 depots typically run 15–25% higher day rates than outer boroughs, mainly due to commercial rent and depot overheads rather than the equipment itself.',
  ],
  [
    'Does tool hire delivery in London include the ULEZ charge?',
    "Most established suppliers run ULEZ-compliant delivery fleets, so this usually doesn't appear as a separate line item. Non-compliant vehicles face a £12.50 daily charge to enter the zone, so it's worth confirming with smaller or out-of-London suppliers delivering into central boroughs.",
  ],
  [
    'Can I hire tools on a Sunday in London?',
    'Sunday availability varies by depot and supplier rather than being standard across the city. Some independent depots and national chains offer Sunday hours, particularly in higher-demand DIY boroughs, but it\'s not universal, so check before assuming.',
  ],
  [
    'Is HSS still a separate company from Speedy Hire in London?',
    "It's more layered than it used to be. HSS ProService's digital platform now has a commercial supply agreement with Speedy Hire, while the old HSS physical branch network operates separately as The Hire Service Company under new ownership. Speedy continues to run its own branded depots independently as well.",
  ],
  [
    "What's the most commonly hired tool in London?",
    'Wacker plates, mini diggers, and access towers top demand in most boroughs, reflecting London\'s mix of garden landscaping jobs and period property maintenance where compact equipment is essential for narrow access.',
  ],
  [
    'Do I need a trade account to hire tools in London?',
    'Not always. Several suppliers now offer online booking without a trade account for casual or one-off hires, though larger plant or repeat commercial use still typically benefits from a trade account for better rates.',
  ],
  [
    'How far in advance should I book mini digger hire in London?',
    'For weekday hire, a few days\' notice is usually enough outside peak season. For weekend hire between March and September, book at least a week ahead, since popular sizes get booked out fast in space-constrained boroughs with strong DIY demand.',
  ],
  [
    'Which London boroughs have the most plant hire depots?',
    'Outer boroughs with industrial estate access, including Croydon, Hillingdon, and Havering, tend to have a higher concentration of independent plant hire depots alongside the national chains, partly explaining their generally lower day rates.',
  ],
];

function LondonToolHireBody() {
  return (
    <>
      <section className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
        <p>
          Tool hire in London means comparing prices across a fragmented network of national depots,
          builders' merchant hire points, and independent suppliers spread across all 33 boroughs,
          since no single company covers the whole city at one flat rate. Day rates for the same
          tool can vary by £10–£25 between Zone 1 and outer London, driven by depot overheads,
          demand, and delivery distance. This page covers what's typically available, what it costs,
          and what London-specific costs (ULEZ, congestion charge, parking) actually add to your hire.
        </p>
      </section>

      <section>
        <H2>Why London Tool Hire Prices Vary So Much by Borough</H2>
        <Prose>
          <p>
            London isn't one market, it's roughly 33 of them stitched together. A wacker plate
            hired in Hackney can cost noticeably more than the same machine hired from a depot in
            Croydon or Bexley, purely down to where the depot sits and what it costs them to
            operate there.
          </p>
          <p>
            Zone 1 and 2 boroughs (Westminster, Camden, Islington, Hackney, Tower Hamlets)
            generally carry the highest day rates, driven by commercial rent and limited depot
            space. Outer London boroughs (Bexley, Havering, Hillingdon, Croydon, Bromley) tend
            to be cheaper, partly because depots there serve a wider catchment and partly because
            there's more competition from independent plant hire firms operating out of industrial
            estates.
          </p>
        </Prose>

        <div className="mt-8">
          <H3>What Actually Moves the Price Across London</H3>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                  <th className="px-5 py-3 text-left font-extrabold text-gray-900">Factor</th>
                  <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical impact</th>
                </tr>
              </thead>
              <tbody>
                {londonPriceFactors.map(([factor, impact], i) => (
                  <tr
                    key={factor}
                    className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}
                  >
                    <td className="px-5 py-3 font-bold text-gray-700">{factor}</td>
                    <td className="px-5 py-3 font-medium text-gray-500">{impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10">
          <H3>What's Changed in the London Hire Market Recently</H3>
          <Prose>
            <p>
              Worth knowing before you assume a familiar name means a familiar service. The UK tool
              hire sector went through a significant restructuring in late 2025 and early 2026. HSS
              ProService formed a new commercial agreement with Speedy Hire, while the old HSS
              physical branch network welcomes new private equity investment from Endless as it
              starts life as a standalone hire company, now trading as The Hire Service Company
              (THSC). THSC has confirmed that while a number of branches have closed, it still
              operates five large distribution depots and over 60 branches through builders'
              merchant partnerships, offering a strong local service across southern, eastern, and
              central areas — covering a good chunk of Greater London.
            </p>
            <p>
              Meanwhile, Speedy Hire continues to run its own branded depots across London
              independently, including sites at Kings Cross and West London, and now also supplies
              equipment behind the scenes to HSS ProService's online platform.
            </p>
            <p>
              What this means practically: if you're comparing "HSS" against "Speedy" as two
              separate options, that comparison looks a bit different than it did a year ago. Worth
              confirming exactly who's fulfilling your order before you book, which is precisely
              the kind of thing a proper comparison catches and a single-supplier booking might not.
            </p>
          </Prose>
        </div>

        <div className="mt-10">
          <H3>Most-Hired Equipment in London</H3>
          <Prose>
            <p>
              Demand patterns in London skew toward smaller domestic and light commercial jobs,
              reflecting the city's housing stock and tight site access.
            </p>
          </Prose>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                  <th className="px-5 py-3 text-left font-extrabold text-gray-900">Equipment</th>
                  <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical use in London</th>
                  <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical day rate</th>
                </tr>
              </thead>
              <tbody>
                {londonEquipmentTable.map(([equip, use, rate], i) => (
                  <tr
                    key={equip}
                    className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}
                  >
                    <td className="px-5 py-3 font-bold text-gray-700">{equip}</td>
                    <td className="px-5 py-3 font-medium text-gray-500">{use}</td>
                    <td className="px-5 py-3 font-bold text-gray-700">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Period properties and narrow Victorian terrace access make micro diggers and compact
            access towers especially popular in inner boroughs like Hackney, Lambeth, and
            Wandsworth, where a standard 1.5-tonne digger simply won't fit through a typical side
            gate.
          </p>
        </div>
      </section>

      <section>
        <H2>Delivery, ULEZ, and the Congestion Charge</H2>
        <Prose>
          <p>
            This is the part most hire guides skip entirely, and it genuinely changes the total
            cost of a London job.
          </p>
          <p>
            Most of Greater London sits inside the Ultra Low Emission Zone. If a delivery vehicle
            doesn't meet ULEZ emission standards and isn't exempt, it needs to pay a £12.50 daily
            charge to drive within the zone, which operates 24 hours a day, seven days a week. On
            top of that, the standard congestion charge for entering central London is rising from
            £15 to £18 a day from 2 January 2026, with the discount structure changing
            significantly and electric vans no longer fully exempt.
          </p>
          <p>
            Most established hire suppliers run ULEZ-compliant delivery fleets, so this rarely
            lands on your invoice directly. But if you're booking from a smaller independent depot
            outside London and asking for delivery into Zone 1 or 2, it's worth asking outright
            whether their delivery charge already accounts for this — particularly for one-off
            large item deliveries like diggers or generators where a dedicated van trip is involved.
          </p>
        </Prose>

        <div className="mt-6 rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
          <p className="mb-4 font-extrabold text-gray-900">Typical delivery windows by area</p>
          <div className="space-y-4">
            {[
              {
                area: 'Inner London (Zones 1–2)',
                detail:
                  'Same-day delivery available from most suppliers if booked before late morning, subject to ULEZ-compliant fleet availability',
              },
              {
                area: 'Outer London (Zones 3–6)',
                detail: 'Next-day delivery standard, same-day often possible with advance notice',
              },
              {
                area: 'Weekend delivery',
                detail:
                  'Available from most national chains and a growing number of independents, though slots fill fastest March to September',
              },
            ].map(({ area, detail }) => (
              <div key={area} className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                <div>
                  <span className="font-extrabold text-gray-900">{area}: </span>
                  <span className="text-sm font-medium text-gray-500">{detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <H2>Trades We Serve in London</H2>
        <Prose>
          <p>
            London's hire demand splits roughly between domestic renovation work and small
            commercial fit-out, reflecting the density of period housing stock alongside ongoing
            office and retail refurbishment across the city.
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {londonTrades.map(({ role, desc }) => (
            <div key={role} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
              <div>
                <p className="font-extrabold text-gray-900">{role}</p>
                <p className="mt-0.5 text-sm font-medium text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>Why Hire Locally in London Rather Than Going to One National Chain</H2>
        <Prose>
          <p>
            A genuine comparison across London's hire market usually beats sticking with whichever
            depot you used last time, mostly because the city has more comparison points than
            people assume. Beyond the well-known national names, most boroughs have at least one
            builders' merchant hire counter and a handful of independent plant hire firms, often
            based on industrial estates in outer boroughs where overheads are lower.
          </p>
          <p>
            That spread means price and availability genuinely differ street to street, not just
            chain to chain. A wacker plate that's booked out at a Zone 2 depot on a Friday
            afternoon might be sitting idle 20 minutes away in the next borough over.
          </p>
        </Prose>
      </section>

      <FaqSection faqs={londonFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare London Tool Hire Now</h2>
        <p className="mb-5 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Search by postcode, check availability across all 33 London boroughs, and compare total
          costs — not just day rates — in one place.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Tool Hire in London
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Blog post registry                                                  */
/* ------------------------------------------------------------------ */

type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  intro: string;
  image: string;
  imageAlt: string;
  datePublished: string;
  metaTitle: string;
  metaDescription: string;
  primaryCta: string;
  faqs: Faq[];
  Body: () => ReactNode;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'tool-hire-comparison-uk',
    category: 'Tool Hire Comparison',
    title: 'Tool Hire Comparison UK: Compare Construction Equipment & Plant Hire Suppliers',
    excerpt:
      'How comparing tool hire and plant hire suppliers across the UK helps contractors review availability, weekly hire options and supplier coverage faster.',
    intro:
      'Tooli UK helps contractors compare construction equipment and plant hire suppliers across major UK cities, making it faster to review availability, weekly hire options and supplier coverage.',
    image: '/images/blog/tool-hire-comparison-uk.png',
    imageAlt: 'Tooli UK construction equipment hire comparison platform',
    datePublished: '2026-06-23',
    metaTitle: 'Tool Hire Comparison UK: Compare Construction Equipment & Plant Hire Suppliers | Tooli UK',
    metaDescription:
      'Compare construction equipment and plant hire suppliers across major UK cities. Compare suppliers, review weekly hire options, and find the right equipment faster with Tooli UK.',
    primaryCta: 'Compare Suppliers',
    faqs: comparisonFaqs,
    Body: ToolHireComparisonBody,
  },
  {
    slug: 'mini-digger-hire-cost-uk',
    category: 'Plant Hire Guide',
    title: 'Mini Digger Hire Cost UK: How to Compare Prices and Avoid Overpaying in 2026',
    excerpt:
      'What affects mini digger hire costs in the UK, how to choose the right machine, avoid hidden charges, and compare suppliers to find the best value for your project.',
    intro:
      'There is no single UK-wide price for mini digger hire. Learn what really drives the cost, how to choose the right machine, and how comparing suppliers helps you avoid overpaying.',
    image: '/minidigger.png',
    imageAlt: 'Mini digger hire cost comparison UK',
    datePublished: '2026-06-23',
    metaTitle: 'Mini Digger Hire Cost UK: Compare Prices & Avoid Overpaying in 2026 | Tooli UK',
    metaDescription:
      'Learn what affects mini digger hire costs in the UK, how to choose the right machine, avoid hidden charges, and compare suppliers to find the best value for your project.',
    primaryCta: 'Compare Mini Digger Hire',
    faqs: miniDiggerFaqs,
    Body: MiniDiggerBody,
  },
  {
    slug: 'tool-hire-liverpool',
    category: 'Local Tool Hire',
    title: 'Tool Hire Liverpool: Compare Prices From Local Suppliers',
    excerpt:
      'Compare tool hire prices from local independent and national suppliers across Liverpool, Bootle, Kirkby, Huyton, Speke, Birkenhead and the wider Merseyside area.',
    intro:
      'Looking for tool hire in Liverpool? Compare prices from local independent hire companies and national suppliers across Liverpool and the wider Merseyside area in one place.',
    image: '/images/blog/tool-hire-liverpool.png',
    imageAlt: 'Tool hire price comparison across Liverpool and Merseyside',
    datePublished: '2026-06-23',
    metaTitle: 'Tool Hire Liverpool: Compare Prices From Local Suppliers | Tooli UK',
    metaDescription:
      'Compare tool hire prices from local and national suppliers across Liverpool and Merseyside. Compare daily and weekly rates for diggers, breakers, towers and more.',
    primaryCta: 'Compare Liverpool Tool Hire',
    faqs: liverpoolFaqs,
    Body: LiverpoolBody,
  },
  {
    slug: 'tool-hire-comparison-save-money',
    category: 'Pricing Guide',
    title: 'How Tool Hire Comparison Actually Saves Your Money (And How to Do It Properly)',
    excerpt:
      'Day rates for the same kit can swing by £15–£30 between suppliers in the same town. Here\'s how to compare tool hire prices properly — total cost, not just the headline number.',
    intro:
      'Tool hire comparison means checking prices, terms, and availability across multiple suppliers before you book, instead of ringing your usual depot and accepting whatever they quote.',
    image: '/images/blog/tool-hire-comparison-uk.png',
    imageAlt: 'Tool hire price comparison guide for UK hirers',
    datePublished: '2026-07-02',
    metaTitle: 'Tool Hire Comparison: How to Actually Save Money | Tooli.uk',
    metaDescription:
      'A straight-talking guide to tool hire comparison in the UK. Compare prices, spot hidden fees, and book the right kit without overpaying.',
    primaryCta: 'Start Comparing Tool Hire',
    faqs: saveMoneyFaqs,
    Body: ToolHireComparisonSaveMoneyBody,
  },
  {
    slug: 'tool-hire-london',
    category: 'Local Tool Hire',
    title: 'Tool Hire in London: Compare Prices From Local Suppliers',
    excerpt:
      'Day rates for the same kit can vary by £10–£25 between Zone 1 and outer London. Here\'s what drives the difference, what ULEZ costs actually mean for your hire, and how to compare properly across all 33 boroughs.',
    intro:
      'Tool hire in London means comparing prices across a fragmented network of national depots, builders\' merchant hire points, and independent suppliers spread across all 33 boroughs, since no single company covers the whole city at one flat rate.',
    image: '/images/blog/tool-hire-london.webp',
    imageAlt: 'Tool hire price comparison across London boroughs',
    datePublished: '2026-07-02',
    metaTitle: 'Tool Hire in London | Compare Prices From Local Suppliers',
    metaDescription:
      'Compare tool hire prices across London depots, from Brent to Bexley. See typical rates, delivery times, and ULEZ-friendly suppliers near you.',
    primaryCta: 'Compare London Tool Hire',
    faqs: londonFaqs,
    Body: LondonToolHireBody,
  },
];

/* ------------------------------------------------------------------ */
/* Blog index page (/blog)                                             */
/* ------------------------------------------------------------------ */

const indexSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION_NODE,
    WEBSITE_NODE,
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://tooli.uk/blog#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tooli.uk/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://tooli.uk/blog' },
      ],
    },
    {
      '@type': 'Blog',
      '@id': 'https://tooli.uk/blog#blog',
      name: 'Tooli UK Blog',
      url: 'https://tooli.uk/blog',
      publisher: { '@id': 'https://tooli.uk/#organization' },
      blogPost: blogPosts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription,
        url: `https://tooli.uk/blog/${post.slug}`,
        datePublished: post.datePublished,
      })),
    },
  ],
};

export function BlogPage() {
  return (
    <div className="w-full bg-white">
      <PageMeta
        title="Tooli UK Blog: Tool Hire & Plant Hire Guides | Tooli UK"
        description="Guides, pricing breakdowns and local hire comparisons from Tooli UK. Compare construction equipment and plant hire suppliers across the UK."
        canonicalUrl="https://tooli.uk/blog"
        image="https://tooli.uk/images/blog/tool-hire-comparison-uk.png"
        type="blog"
        jsonLd={indexSchema}
      />

      <section className="bg-[#F8F9FC] py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500">
            <Link to="/" className="hover:text-brand-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Blog</span>
          </div>

          <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.15em] text-brand-primary">Tooli UK Blog</p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-[#030213] sm:text-5xl lg:text-6xl">
            Tool Hire & Plant Hire Guides
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-gray-500">
            Pricing breakdowns, comparison advice and local hire guides to help you find the right equipment faster across the UK.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="aspect-[16/10] w-full bg-[#F8F9FC] object-contain"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.15em] text-brand-primary">{post.category}</p>
                  <h2 className="mb-3 text-xl font-extrabold leading-snug text-[#030213] group-hover:text-brand-primary">
                    {post.title}
                  </h2>
                  <p className="mb-6 flex-1 text-sm font-medium leading-relaxed text-gray-500">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary">
                    Read article
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Individual blog post page (/blog/:slug)                             */
/* ------------------------------------------------------------------ */

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-extrabold text-[#030213]">Article not found</h1>
        <p className="mb-8 text-gray-500">The article you’re looking for doesn’t exist or has been moved.</p>
        <Link
          to="/blog"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug);

  return (
    <div className="w-full bg-white">
      <PageMeta
        title={post.metaTitle}
        description={post.metaDescription}
        canonicalUrl={`https://tooli.uk/blog/${post.slug}`}
        image={`https://tooli.uk${post.image}`}
        type="article"
        publishedTime={post.datePublished}
        jsonLd={buildPostSchema(post)}
      />

      <section className="bg-[#F8F9FC] py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-gray-500">
            <Link to="/" className="hover:text-brand-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/blog" className="hover:text-brand-primary">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{post.category}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.15em] text-brand-primary">{post.category}</p>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-[#030213] sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-gray-500">{post.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/search"
                  className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition-colors hover:bg-brand-primary-hover"
                >
                  {post.primaryCta}
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
              src={post.image}
              alt={post.imageAlt}
              className="aspect-square w-full rounded-2xl border border-gray-100 bg-white object-contain shadow-sm"
            />
          </div>
        </div>
      </section>

      <article className="py-16 md:py-24">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[minmax(0,760px)_minmax(260px,1fr)]">
          <div className="space-y-12">
            <post.Body />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Compare Faster With Tooli</h2>
                <p className="mb-6 text-sm font-medium leading-relaxed text-gray-500">
                  Search by equipment type and location to review supplier options for your next project.
                </p>
                <Link
                  to="/search"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
                >
                  Compare Equipment
                </Link>
              </div>

              {relatedPosts.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-extrabold text-[#030213]">More From The Blog</h2>
                  <div className="space-y-4">
                    {relatedPosts.map((item) => (
                      <Link key={item.slug} to={`/blog/${item.slug}`} className="group block">
                        <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.15em] text-brand-primary">{item.category}</p>
                        <p className="text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-primary">{item.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
