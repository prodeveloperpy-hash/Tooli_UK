import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, ChevronRight, MapPin, ShieldCheck, Wrench } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { equipmentPages } from '../data/equipment';
import { locationPages } from '../data/locations';

/* ------------------------------------------------------------------ */
/* Shared schema nodes                                                 */
/* ------------------------------------------------------------------ */

const ORGANIZATION_NODE = {
  '@type': 'Organization',
  '@id': 'https://www.tooli.uk/#organization',
  name: 'Tooli',
  alternateName: 'Tooli.uk',
  url: 'https://www.tooli.uk',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.tooli.uk/images/logo.webp',
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
  const url = `https://www.tooli.uk/blog/${post.slug}`;
  const graph: Record<string, unknown>[] = [
    ORGANIZATION_NODE,
    WEBSITE_NODE,
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tooli.uk/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tooli.uk/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.metaDescription,
      image: `https://www.tooli.uk${post.image}`,
      datePublished: post.datePublished,
      dateModified: post.datePublished,
      author: {
        '@type': 'Organization',
        name: 'Tooli UK Editorial Team',
        url: 'https://www.tooli.uk',
      },
      publisher: { '@id': 'https://www.tooli.uk/#organization' },
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
/* Article 6 — Tool Hire in Birmingham                                 */
/* ------------------------------------------------------------------ */

const birminghamEquipmentTable: [string, string, string][] = [
  ['Mini digger hire (0.8–3 t)', 'Footings, drainage, garden landscaping in Kings Heath and Moseley terraces', 'Groundworkers, landscapers, builders'],
  ['Concrete breaker hire', 'Driveway and slab removal, common on Victorian stock across Erdington and Selly Oak', 'Builders, groundworkers, DIYers'],
  ['Wacker plate (plate compactor) hire', 'Sub-base compaction for patios, paths and block paving', 'Landscapers, paving contractors'],
  ['Access tower (PASMA) hire', 'Render, fascia and gutter work on two- and three-storey semis', 'Roofers, decorators, maintenance firms'],
  ['Dehumidifier and heater hire', 'Drying plaster and screed through the wet West Midlands winter', 'Plasterers, builders, homeowners'],
  ['Cherry picker / scissor lift (IPAF) hire', 'Commercial work around the city core and business parks', 'Electricians, signage, facilities teams'],
];

const birminghamAtAGlance = [
  'Compare tool and plant hire quotes from multiple Birmingham suppliers in one search on Tooli.uk',
  'Coverage across all B postcodes, including B1 city centre, B5 Digbeth, B6 Aston, B23 Erdington and B72–B75 Sutton Coldfield',
  'Most-hired kit in Birmingham: mini diggers, breakers, wacker plates, access towers and dehumidifiers',
  'National names (HSS, Speedy, Brandon Hire Station, Jewson) sit alongside independent West Midlands depots',
  "Suppliers set their own rates, so comparing is the only reliable way to find the best local deal",
];

const birminghamBestDealTips: [string, string][] = [
  ['Compare at least three suppliers', 'Rates are set independently, and the spread between the cheapest and dearest quote for identical kit can be significant.'],
  ['Hire for the right duration', 'Weekly rates almost always beat five separate day rates. If the job might overrun, ask about the weekly band upfront.'],
  ['Bundle related kit', 'A digger, breaker attachment and dumper from one depot usually beats three separate hires with three delivery charges.'],
  ['Check what\'s included', 'Fuel, insurance/damage waiver, delivery and collection all vary by supplier. Compare the total, not the headline rate.'],
];

const birminghamFaqs: Faq[] = [
  [
    'How do I compare tool hire prices in Birmingham?',
    'Enter your B postcode on Tooli.uk, choose the equipment and dates, and compare quotes from local and national suppliers side by side. Each supplier sets its own rates, so comparing is the fastest way to find the best deal.',
  ],
  [
    'Can I get same-day tool hire in Birmingham?',
    'Often, yes, for smaller tools collected directly from a depot. Delivered plant like diggers and towers is usually next-day to central B postcodes if booked by early afternoon.',
  ],
  [
    'Do Birmingham hire suppliers deliver to all B postcodes?',
    'Most suppliers on the Tooli.uk network cover the full B postcode area, including Sutton Coldfield, Erdington, Selly Oak and Northfield. Outer postcodes may have wider delivery windows, so book ahead.',
  ],
  [
    'Do I need a licence to hire a mini digger in Birmingham?',
    'No licence is legally required to hire a mini digger for use on private land. On commercial sites, most contractors expect a CPCS or NPORS card, and employers must meet PUWER duties.',
  ],
  [
    'Is weekend tool hire available in Birmingham?',
    'Yes. Most suppliers offer Friday-to-Monday hire, often at favourable weekend bands. Availability tightens in spring and summer, so book by midweek.',
  ],
  [
    'Does the Birmingham Clean Air Zone affect tool hire delivery?',
    'It can. Deliveries inside the A4540 ring road may incur CAZ charges for non-compliant vehicles, which some suppliers pass on. Confirm delivery terms when you compare quotes.',
  ],
  [
    'Should I hire from a national chain or a local Birmingham depot?',
    "Both have strengths. Nationals offer breadth and backup depots; local independents often win on service, availability and flexibility. Tooli.uk compares both so you don't have to choose blind.",
  ],
  [
    "What's the most-hired equipment in Birmingham?",
    'Mini diggers, concrete breakers, wacker plates, access towers and drying equipment top demand across the Tooli.uk network in Birmingham, driven by groundworks, paving and renovation work.',
  ],
];

function BirminghamToolHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={birminghamAtAGlance} />
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/tool-hire-birmingham.webp"
        alt="Tool and plant hire comparison in Birmingham — compare prices from local suppliers on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Why Compare Tool Hire in Birmingham?</H2>
        <Prose>
          <p>
            Birmingham is one of the busiest hire markets in the UK. Major schemes like HS2's
            Curzon Street station, the Smithfield regeneration and constant infill work across the
            suburbs keep local depots in high demand. When demand spikes, availability and rates
            vary sharply between suppliers, sometimes for the exact same machine.
          </p>
          <p>
            That's the case for comparing rather than defaulting to the nearest depot. Every
            supplier on the Tooli.uk network sets its own pricing, so two depots a mile apart can
            quote very differently for a 1.5 tonne digger over a weekend. Comparing quotes side
            by side takes minutes and protects your margin on every job.
          </p>
        </Prose>
      </section>

      <section>
        <H2>What Birmingham Trades Hire Most</H2>
        <Prose>
          <p>
            Based on demand patterns across the Tooli.uk network, these are the categories
            Birmingham tradespeople search for most:
          </p>
        </Prose>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Equipment</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical Birmingham use case</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Who hires it</th>
              </tr>
            </thead>
            <tbody>
              {birminghamEquipmentTable.map(([equip, use, who], i) => (
                <tr key={equip} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{equip}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{use}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Tight-access kit deserves a mention. A lot of Birmingham housing means narrow side
          passages and shared entries, so micro diggers and pedestrian dumpers that fit through
          a standard gate are consistently popular hires here.
        </p>

        {/* Internal link card */}
        <Link
          to="/blog/tool-hire-comparison-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
          </span>
        </Link>
      </section>

      {/* Equipment grid image */}
      <img
        src="/images/blog/birmingham-equipment-grid.webp"
        alt="Wide range of construction equipment and plant hire available across Birmingham"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Local Delivery: What to Expect Across B Postcodes</H2>
        <Prose>
          <p>
            Most suppliers serving Birmingham offer next-day delivery to central postcodes
            (B1–B12) when you book by early afternoon, with same-day sometimes possible for
            smaller tools collected from the depot. Outer areas like Sutton Coldfield (B72–B75),
            Northfield (B31) and the Solihull border can add a delivery window, so book earlier
            for those.
          </p>
          <p>
            Two practical tips for city jobs. First, check access and parking restrictions before
            a lorry-delivered machine arrives, especially inside the{' '}
            <a
              href="https://www.gov.uk/clean-air-zones"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Clean Air Zone
            </a>{' '}
            around the A4540 ring road, as some older delivery vehicles incur charges that
            suppliers may pass on. Second, weekend availability tightens fast in spring, so lock
            in Friday-to-Monday hires by midweek.
          </p>
        </Prose>

        <Link
          to="/blog/tool-hire-london"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire in London: Compare Prices From Local Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>How to Get the Best Tool Hire Deal in Birmingham</H2>
        <Prose>
          <p>Four things move the needle on any hire quote in this city:</p>
        </Prose>
        <div className="mt-5 space-y-3">
          {birminghamBestDealTips.map(([title, body], i) => (
            <div key={title} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-black text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-extrabold text-gray-900">{title}</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>Trades We Serve in Birmingham</H2>
        <Prose>
          <p>
            Tooli.uk compares hire quotes for every trade working across the city: builders,
            groundworkers, landscapers, plasterers, electricians, roofers, scaffolders and
            decorators, plus serious DIYers running extensions and garden overhauls in the
            suburbs. If you're running regular jobs across the West Midlands, trade-focused
            comparison saves hours of phone calls a month.
          </p>
        </Prose>

        <Link
          to="/blog/mini-digger-hire-cost-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
          </span>
        </Link>
      </section>

      <section>
        <H2>Licences and Compliance for Hired Kit</H2>
        <Prose>
          <p>
            You don't need a licence to hire most tools as a private individual, but employers
            must comply with{' '}
            <a
              href="https://www.hse.gov.uk/work-at-height/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              PUWER
            </a>{' '}
            when providing hired equipment to workers. Powered access (cherry pickers, scissor
            lifts) typically requires an{' '}
            <a
              href="https://www.ipaf.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              IPAF licence
            </a>{' '}
            on commercial sites, and mobile access towers should be assembled by someone PASMA
            trained. Suppliers on our network will confirm requirements per machine before you
            book.
          </p>
        </Prose>
        <div className="mt-5 rounded-2xl border border-gray-100 bg-[#F8F9FC] p-5">
          <p className="mb-3 text-sm font-extrabold text-gray-900">Key compliance checkpoints</p>
          <CheckList items={[
            'PUWER — all hired work equipment must be safe, maintained and fit for purpose',
            'IPAF licence required for cherry pickers and scissor lifts on commercial sites',
            'PASMA training required for mobile access tower assembly',
            'CPCS or NPORS card expected on commercial sites for plant operators',
            'Confirm all requirements with your supplier before booking',
          ]} />
        </div>
      </section>

      <section>
        <H2>Why Hire Locally in Birmingham?</H2>
        <Prose>
          <p>
            Local depots know local conditions. A West Midlands supplier understands Clean Air
            Zone logistics, tight terrace access in Balsall Heath and the clay ground that chews
            through undersized diggers on garden digs. Shorter delivery runs also mean better
            availability at short notice and quicker swap-outs if a machine goes down mid-job.
            Tooli.uk puts those local independents next to the national chains so you can judge
            on service and price together.
          </p>
        </Prose>

        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
          </span>
        </Link>
      </section>

      <FaqSection faqs={birminghamFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Ready to Hire in Birmingham?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your Birmingham postcode on Tooli.uk and compare quotes from local suppliers in
          minutes. No account. No phone calls. Just the best deal for your job.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 7 — Tool Hire SW19: London Postcode Area Guide              */
/* ------------------------------------------------------------------ */

const sw19EquipmentTable: [string, string][] = [
  ['Micro digger (0.8 t)', 'Rear garden digs through narrow terrace side returns'],
  ['Concrete breaker', 'Old patio and driveway removal ahead of relandscaping'],
  ['Wacker plate', 'Sub-base compaction for new patios and paths'],
  ['Floor sander', 'Restoring original boards in period terraces'],
  ['Access tower', 'Fascia, gutter and render work on two- and three-storey homes'],
  ['Carpet cleaner and dehumidifier', 'End-of-tenancy turnarounds and post-plaster drying'],
];

const sw19AtAGlance = [
  'Compare tool hire quotes from all suppliers delivering to SW19 in one Tooli.uk search',
  'Covers Wimbledon, Wimbledon Park, South Wimbledon, Merton Park and Colliers Wood',
  'Most-hired kit locally: micro diggers, breakers, wacker plates, sanders and access towers',
  "Suppliers set their own rates, and SW19 sits in several depots' delivery zones, so quotes genuinely compete",
  'Next-day delivery is typical; book ahead in early summer when local demand peaks',
];

const sw19FaqData: Faq[] = [
  [
    'Which suppliers deliver tool hire to SW19?',
    'SW19 sits in the delivery zones of multiple depots across Merton, Wandsworth, Kingston and Sutton, including national chains and South London independents. Tooli.uk compares quotes from all suppliers covering the postcode in one search.',
  ],
  [
    'How quickly can I get tools delivered in SW19?',
    'Next-day delivery is typical when booked by early afternoon. Smaller tools can sometimes be collected same-day from a nearby depot. Deliveries near Wimbledon Park slow down during the Championships fortnight.',
  ],
  [
    'What tools do people hire most in SW19?',
    'Micro diggers, concrete breakers, wacker plates, floor sanders and access towers lead demand across the Tooli.uk network locally, driven by extensions, garden landscaping and period-property renovation.',
  ],
  [
    'Will a digger fit through my SW19 terrace?',
    'A 0.8 tonne micro digger fits through openings of roughly 750 mm, which suits most local side returns. Measure your narrowest access point and confirm the tracked width with the supplier before booking.',
  ],
  [
    'Can I hire tools in SW19 at the weekend?',
    'Yes, most suppliers offer Friday-to-Monday hires. Book by midweek in spring and summer, when landscaping demand fills weekend slots first.',
  ],
  [
    'Do I need a trade account to hire tools in SW19?',
    "No. Homeowners and DIYers can hire directly. Suppliers typically ask for ID, a deposit or a damage waiver, with exact terms varying by company, so check when comparing quotes.",
  ],
  [
    'What are the noise restrictions for hired tools in Merton?',
    'Noisy works should stay within standard hours, generally weekday daytimes and Saturday mornings. Plan breaker and cutting work accordingly, particularly on terraced streets.',
  ],
  [
    'Does tool hire cost more in SW19 than elsewhere in London?',
    'Rates are set by each supplier and vary with depot distance, kit and season rather than postcode prestige. Because several depots compete for SW19, comparing quotes often finds a sharper total than a single local call would.',
  ],
];

function SW19ToolHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={sw19AtAGlance} />
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/tool-hire-sw19.webp"
        alt="Tool hire SW19 — Wimbledon and South Wimbledon postcode area guide with local supplier comparison on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>How Tool Hire Works in SW19</H2>
        <Prose>
          <p>
            SW19 doesn't rely on one high-street hire shop. The postcode sits inside the delivery
            radius of multiple depots across Merton, Wandsworth, Kingston and Sutton, including
            national chains and South London independents. That overlap is good news: several
            suppliers competing for the same postcode means comparison actually pays here.
          </p>
          <p>
            Each supplier on the Tooli.uk network sets its own rates and delivery charges, and
            the distance from depot to your door affects both. A depot three miles away in Kingston
            may beat one across the borough once delivery is included. Enter SW19 plus your house
            number on Tooli.uk and compare the full totals, not just headline rates.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-comparison-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>What SW19 Residents and Trades Hire Most</H2>
        <Prose>
          <p>
            The housing stock drives the demand. SW19 is dominated by Victorian and Edwardian
            terraces around South Wimbledon and Colliers Wood, larger semis and detached homes
            towards Wimbledon Village and the Park, and a steady churn of extensions, loft
            conversions and garden landscaping across all of it.
          </p>
        </Prose>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Equipment</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical SW19 job</th>
              </tr>
            </thead>
            <tbody>
              {sw19EquipmentTable.map(([equip, job], i) => (
                <tr key={equip} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{equip}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Access is the recurring theme. Many SW19 terraces have no side gate wider than a
          doorway, so tracked micro diggers and pedestrian dumpers that fit through roughly
          750 mm openings are the local workhorses. Measure your narrowest point before booking
          and give the supplier the figure.
        </p>
        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
          </span>
        </Link>
      </section>

      {/* Equipment grid image */}
      <img
        src="/images/blog/sw19-equipment-grid.webp"
        alt="Full range of plant hire and construction equipment available for hire in the SW19 area"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Delivery to SW19: What to Expect</H2>
        <Prose>
          <p>
            Next-day delivery is standard from most suppliers when you book by early afternoon,
            with smaller tools sometimes available same-day for depot collection. Two local
            factors are worth planning around.
          </p>
          <p>
            First, parking. Much of SW19 sits inside{' '}
            <a
              href="https://www.merton.gov.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Merton's controlled parking zones
            </a>
            , and delivery lorries need somewhere legal to stop. For plant deliveries on tight
            streets around South Wimbledon and Colliers Wood, check whether a suspension is
            needed and flag the street layout to the supplier when booking.
          </p>
          <p>
            Second, the Championships. For roughly two weeks each summer, roads around Wimbledon
            Park and the village get event traffic management, and deliveries in the immediate
            area take longer. If your job lands in late June or early July near the SW19 5 sector,
            book earlier and expect adjusted delivery windows.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-london"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire in London: Compare Prices From Local Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>Noise, Neighbours and Working Hours</H2>
        <Prose>
          <p>
            Merton, like most London boroughs, expects noisy works to stay within standard hours,
            typically weekday daytimes and Saturday mornings. Plan breaker and disc-cutter work
            inside those windows, especially on terraced streets where party walls carry sound.
            It keeps the neighbours onside and avoids a visit from environmental health mid-slab.
          </p>
          <p>
            For anything at height, mobile towers should be assembled by someone{' '}
            <a
              href="https://www.pasma.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              PASMA trained
            </a>
            , and powered access needs an{' '}
            <a
              href="https://www.ipaf.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              IPAF licence
            </a>{' '}
            on commercial jobs.{' '}
            <a
              href="https://www.hse.gov.uk/work-at-height/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE working-at-height guidance
            </a>{' '}
            applies to domestic projects too, even if nobody's checking cards.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Trades We Serve in SW19</H2>
        <Prose>
          <p>
            Tooli.uk compares hire for every trade working the postcode: builders on side-return
            extensions, landscapers rebuilding gardens off Kingston Road, decorators and roofers
            on period stock, and homeowners tackling serious DIY. If you're a local trader
            running jobs across SW19 and the neighbouring postcodes, one comparison account
            covers every hire without the phone-round.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Neighbouring Postcode Areas</H2>
        <Prose>
          <p>
            Working beyond SW19? The same comparison covers the surrounding areas: SW20
            (Raynes Park), SW17 (Tooting), SW18 (Wandsworth), CR4 (Mitcham) and KT3 (New
            Malden). Suppliers serving SW19 typically cover all of them, and quotes shift with
            depot distance, so run the comparison per job rather than assuming last month's
            cheapest supplier still wins.
          </p>
        </Prose>
        <Link
          to="/blog/mini-digger-hire-cost-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
          </span>
        </Link>
      </section>

      <FaqSection faqs={sw19FaqData} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Tool Hire in SW19 Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your SW19 postcode on Tooli.uk, pick your kit and get local quotes in minutes.
          No account needed. No phone calls. Just the best deal for your job.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 8 — Mini Digger Hire London: Prices & Local Availability    */
/* ------------------------------------------------------------------ */

const miniDiggerLondonSizeTable: [string, string, string][] = [
  ['0.8–1 t micro digger', 'Fits through ~750 mm doorway or side return', 'Rear garden landscaping in Victorian terraces, small drainage runs'],
  ['1.5 t mini digger', 'Standard garden gate or driveway access', 'Extension footings, patios, pond digs, most domestic groundworks'],
  ['2.5–3 t digger', 'Driveway or open site access', 'Larger footings, muck shifts, site strips, basement enabling work'],
];

const miniDiggerLondonAtAGlance = [
  'Compare mini digger hire quotes from multiple London suppliers in one search on Tooli.uk',
  'Sizes from 0.8 t micro diggers (fit through a 750 mm gap) up to 3 t machines',
  'Suppliers set their own rates, which vary by borough, season and duration, so compare before you book',
  'No licence needed on private land; CPCS or NPORS cards usually expected on commercial sites',
  'Next-day delivery is standard across Greater London; book earlier for central zones with access restrictions',
];

const miniDiggerLondonFaqs: Faq[] = [
  [
    'How much does mini digger hire cost in London?',
    'Rates vary by supplier, machine size, duration and season, and every depot on the Tooli.uk network sets its own prices. Weekly hires typically cost less per day than day rates. Comparing quotes for your postcode is the fastest way to find the current best price.',
  ],
  [
    'Can I hire a mini digger without a licence in London?',
    'Yes, for use on private land. No licence is legally required for domestic projects. On commercial sites, contractors normally expect a CPCS or NPORS card and employers must comply with PUWER.',
  ],
  [
    'Will a mini digger fit through my garden gate?',
    "A 0.8–1 t micro digger fits through gaps as narrow as roughly 750 mm, which suits most London terrace side returns. Measure your narrowest access point and confirm the machine's tracked width with the supplier.",
  ],
  [
    'Do London suppliers deliver mini diggers the same day?',
    'Next-day delivery is standard when booked by early afternoon. Same-day is sometimes possible from local depots for smaller machines, but central London deliveries need parking and access checked first.',
  ],
  [
    'Do I need my own insurance to hire a digger?',
    "Most suppliers offer a damage waiver at the point of hire; some accept your own plant insurance instead. Check what's included when you compare quotes, as terms differ between depots.",
  ],
  [
    'What attachments can I hire with a mini digger?',
    'Breakers, augers, grading buckets and grabs are the common ones. Bundling attachments with the machine from one supplier usually beats hiring them separately.',
  ],
  [
    'Can I use a mini digger on a London street or pavement?',
    'Not without permits. Works on the public highway need council licences and often a s.171 permit. Keep the machine on private land unless the job is properly permitted.',
  ],
  [
    'When is mini digger demand highest in London?',
    'Spring through early autumn. Groundworks and landscaping season tightens availability from March, so book weekend hires several days ahead.',
  ],
];

function MiniDiggerLondonBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={miniDiggerLondonAtAGlance} />
      </section>

      <Link
        to="/blog/tool-hire-sw19-london-postcode-area-guide"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          Tool Hire SW19: London Postcode Area Guide →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/mini-digger-hire-london.webp"
        alt="Tooli.uk mini digger and tool hire price comparison for London, showing suppliers, rates and best-price highlight"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Mini Digger Prices in London: Why They Vary</H2>
        <Prose>
          <p>
            There's no single London price for a mini digger. Rates are set independently by each
            depot and move with machine size, hire duration, attachments, delivery distance and
            demand. A weekly hire almost always works out cheaper per day than stringing day
            rates together, and spring groundworks season tightens both availability and pricing
            across the network.
          </p>
          <p>
            That's exactly why comparison matters here more than anywhere else in the UK. London
            has a dense mix of national chains and independent depots, and based on our experience
            comparing quotes across the Tooli.uk network, the spread between the cheapest and
            dearest offer for identical kit can be significant. Enter your postcode, pick your
            dates and let the suppliers compete.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Mini Digger Sizes: Which One for a London Job?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Size class</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Access needed</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical London job</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerLondonSizeTable.map(([size, access, job], i) => (
                <tr key={size} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{size}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{access}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          The micro digger is London's signature hire. Millions of terraced homes have no side
          access wider than a doorway, so a machine that tracks through the house or a narrow
          side return is often the only option short of hand digging. If access is tight, measure
          the narrowest point before you book and give the supplier the figure.
        </p>
        <Link
          to="/blog/tool-hire-birmingham"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire in Birmingham: Compare Prices From Local Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>What Can You Do With a Mini Digger in London?</H2>
        <Prose>
          <p>
            The usual suspects: garden clearance and landscaping, footings for rear and
            side-return extensions, drainage and soakaways, tree stump removal, driveway
            excavation and pool or pond digs. Add a breaker attachment and the same machine
            handles concrete slabs and old patios, which saves hiring a separate tool.
          </p>
          <p>
            Pair it with a micro dumper or skip loader for muck-away on tight sites. One
            delivery, one supplier, one collection usually beats piecemeal hiring on both cost
            and hassle.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-london"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire in London: Compare Prices From Local Suppliers →
          </span>
        </Link>
      </section>

      {/* Compare-prices image */}
      <img
        src="/images/blog/mini-digger-hire-london-compare.webp"
        alt="Tool hire in London comparison graphic showing daily rates from multiple suppliers and local equipment"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Availability and Delivery Across London</H2>
        <Prose>
          <p>
            Most suppliers on the Tooli.uk network offer next-day delivery across Greater London
            when booked by early afternoon. Central boroughs need more planning. Check for
            parking suspensions,{' '}
            <a
              href="https://tfl.gov.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              red routes and roadworks permits
            </a>{' '}
            before a delivery lorry arrives, and note that ULEZ compliance is standard for modern
            delivery fleets but worth confirming on older wagons.
          </p>
          <p>
            Noise matters too. Many boroughs restrict noisy works to roughly 8 a.m. to 6 p.m.
            weekdays and Saturday mornings, so plan breaker work inside those windows. For
            weekend hires, book by Wednesday; Friday collection slots go first, especially March
            through September.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Do You Need a Licence for a Mini Digger?</H2>
        <Prose>
          <p>
            Not on private land. Any competent adult can hire and operate a mini digger for a
            domestic project, though suppliers will run through controls on handover and{' '}
            <a
              href="https://www.hse.gov.uk/construction/safetytopics/excavations.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE guidance on safe excavation
            </a>{' '}
            is worth reading first. On commercial London sites, principal contractors will
            normally expect a{' '}
            <a
              href="https://www.nocnjobcards.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              CPCS or NPORS
            </a>{' '}
            ticket, and employers must meet PUWER duties when providing hired plant to workers.
            Always get utility drawings or a CAT scan before breaking ground; London subsoil is
            crowded with services.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-comparison-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>How to Choose the Right Machine</H2>
        <Prose>
          <p>
            Four decision factors settle it for most jobs. Access width first, since the
            narrowest gate or doorway dictates your maximum machine size. Then dig depth and
            reach: a 1.5 t machine digs comfortably to around 2 m, which covers most domestic
            footings. Third, ground conditions, because London clay in summer is hard going for
            the smallest machines. Finally spoil handling, as every bucket of muck needs
            somewhere to go, so price the grab lorry or skip alongside the digger.
          </p>
          <p>
            If you're between sizes, go bigger where access allows. An undersized digger costs
            more in extra hire days than the step up in rate.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Hire a Mini Digger Near You</H2>
        <Prose>
          <p>
            Tooli.uk compares mini digger hire across every London postcode area and borough,
            including popular searches for tool hire SW19, plant hire in East London and digger
            hire in Croydon, Bromley, Barnet, Ealing and Enfield. Wherever the job is, one
            comparison search covers the local depots.
          </p>
          <p>
            Compare mini digger hire prices in London now on Tooli.uk. Enter your postcode, pick
            your dates, and get quotes in minutes.
          </p>
        </Prose>
        <Link
          to="/blog/mini-digger-hire-cost-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
          </span>
        </Link>
      </section>

      <FaqSection faqs={miniDiggerLondonFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Mini Digger Hire in London Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk, pick your dates and get local mini digger quotes in
          minutes. No account needed. No phone calls. Just the best deal for your job.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 9 — Plant Hire London: Compare Local Plant Hire Companies   */
/* ------------------------------------------------------------------ */

const plantHireLondonTable: [string, string, string][] = [
  ['Excavators', 'Micro, mini (1.5–3 t), midi (5–8 t)', 'Footings, basements, drainage, site strips'],
  ['Dumpers', '1 t high-tip, tracked micro dumpers', 'Muck-away on tight residential sites'],
  ['Compaction', 'Wacker plates, trench rammers, 120 rollers', 'Sub-base, reinstatement, driveways'],
  ['Telehandlers', 'Compact to 17 m reach', 'Loading out scaffolds, moving pallets on housing sites'],
  ['Powered access', 'Cherry pickers, scissor lifts (IPAF)', 'Facade, M&E and signage work across the city'],
  ['Site support', 'Generators, lighting towers, welfare units', 'Infrastructure jobs and anything off-grid'],
];

const plantHireLondonAtAGlance = [
  'Compare quotes from local and national plant hire companies across all London boroughs on Tooli.uk',
  'Full plant range: diggers, dumpers, rollers, telehandlers, excavator attachments and powered access',
  "Each company sets its own rates and delivery terms, so comparing beats ringing round",
  'London-specific logistics covered: ULEZ, FORS fleets, red routes, restricted delivery windows',
  'Operated and self-drive options available depending on machine and supplier',
];

const plantHireLondonFaqs: Faq[] = [
  [
    'How do I compare plant hire companies in London?',
    'Enter your postcode on Tooli.uk, select the machine and dates, and compare quotes from local and national companies side by side. Each company sets its own rates and delivery terms, so comparing totals is the reliable way to find the best deal.',
  ],
  [
    'Are local plant hire companies cheaper than national chains in London?',
    "Sometimes, but not by rule. Pricing is set independently and varies by machine, borough and season. Independents often quote sharper on longer hires; nationals offer fleet backup. Compare both every time.",
  ],
  [
    'Do London plant hire companies deliver inside the ULEZ?',
    "Yes. ULEZ covers all of Greater London and modern hire fleets are compliant, but confirm this and any FORS requirements with the supplier, especially for central sites with contractor logistics rules.",
  ],
  [
    'Do I need a licence to hire plant in London?',
    'Not for self-drive plant on private land. Commercial sites normally require CPCS or NPORS operator cards, and larger machines are often supplied with an operator included.',
  ],
  [
    "What's the difference between operated and self-drive plant hire?",
    "Self-drive means you operate the machine yourself. Operated hire includes a qualified driver, costs more per day, and is standard for larger excavators and specialist plant on London sites.",
  ],
  [
    'Can I hire plant for a weekend in London?',
    'Yes, most companies offer weekend hire on smaller plant. Book by midweek, as Friday delivery slots fill first during the March-to-September groundworks season.',
  ],
  [
    'What plant do London builders hire most?',
    'Mini diggers, micro dumpers, wacker plates, telehandlers and powered access top demand across the Tooli.uk network in London, driven by extensions, basements and refurbishment work.',
  ],
  [
    'Is delivery included in London plant hire quotes?',
    'Usually charged separately and varying with distance. Always compare the full total including delivery, collection, fuel policy and damage waiver rather than the daily rate alone.',
  ],
];

function PlantHireLondonBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={plantHireLondonAtAGlance} />
      </section>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/plant-hire-london.webp"
        alt="Plant hire London — compare local plant hire companies across all boroughs on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Local Companies vs National Chains: What's the Difference?</H2>
        <Prose>
          <p>
            Both hire the same kit; they differ in how they serve it. The nationals bring depth of
            fleet and backup: if a machine goes down, a replacement usually arrives from another
            depot quickly. Independent London yards tend to win on flexibility, local knowledge and
            service, and they'll often quote sharper on longer hires to keep a machine working.
          </p>
          <p>
            The honest answer is that neither side is cheapest by default. Every company on the
            Tooli.uk network prices independently, and in our experience comparing London quotes,
            an independent in Barking can undercut a national for one machine while the reverse
            holds a borough away. Compare both on every hire and let the totals decide.
          </p>
        </Prose>
        <Link
          to="/blog/mini-digger-hire-cost-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
          </span>
        </Link>
      </section>

      <section>
        <H2>What Plant Can You Hire in London?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Category</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Common machines</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical London use</th>
              </tr>
            </thead>
            <tbody>
              {plantHireLondonTable.map(([cat, machines, use], i) => (
                <tr key={cat} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{cat}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{machines}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Attachments multiply what one machine can do. Breakers, augers and grading buckets
          hired alongside an excavator save separate hires, and most companies will bundle them
          on one delivery.
        </p>
      </section>

      {/* Equipment grid */}
      <img
        src="/images/blog/plant-hire-london-grid.webp"
        alt="Full range of plant hire equipment available across London, including excavators, dumpers, telehandlers and access platforms"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Hiring Plant Into a London Site: The Logistics</H2>
        <Prose>
          <p>
            London punishes poor planning more than any other UK hire market. Before your delivery
            date, check three things. First, vehicle compliance:{' '}
            <a
              href="https://tfl.gov.uk/modes/driving/ultra-low-emission-zone"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              ULEZ covers all of Greater London
            </a>{' '}
            and many principal contractors require FORS-accredited delivery fleets, so confirm
            the company's wagons qualify for your site. Second, access: red routes, CPZ bays and
            narrow streets may need parking suspensions arranged with the borough days in advance.
            Third, timing: many sites and boroughs restrict deliveries and noisy works to standard
            weekday hours.
          </p>
          <p>
            On{' '}
            <a
              href="https://www.hse.gov.uk/construction/cdm/2015/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              CDM 2015
            </a>{' '}
            projects, hired plant falls under the principal contractor's site rules, so share the
            machine spec and delivery plan early. Companies used to central London work will handle
            much of this for you, which is one reason local experience is worth weighing alongside
            price when you compare.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-london"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire in London: Compare Prices From Local Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>Operated or Self-Drive?</H2>
        <Prose>
          <p>
            Smaller plant (mini diggers, dumpers, compaction kit) is normally self-drive: you hire
            the machine and operate it yourself, with CPCS or NPORS cards expected on commercial
            sites and PUWER duties applying to employers. Larger excavators and specialist machines
            are often supplied operated, meaning a qualified driver comes with the machine.
          </p>
          <p>
            Operated hire costs more per day but removes the ticketing question and usually gets
            more done per hour. For one-off domestic groundworks, self-drive on a 1.5 t machine
            is the standard route; for anything over 8 tonnes in London, expect operated to be
            the norm.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-comparison-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>How to Compare Plant Hire Companies Properly</H2>
        <Prose>
          <p>
            Compare the whole quote, not the headline rate. Delivery and collection charges vary
            widely across London distances. Damage waiver or insurance terms differ by company.
            Fuel policy (returned full vs charged per litre) changes the true cost. And
            cross-hire is common, so ask whether your machine comes from the company's own fleet,
            which affects swap-out speed if something fails.
          </p>
          <p>
            Duration is the other lever. Weekly and monthly bands beat day rates, and companies
            quote keenest on plant that stays out longer. If a job might overrun, say so upfront
            and get the longer band priced from the start.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-birmingham"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire in Birmingham: Compare Prices From Local Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>Plant Hire Across the Boroughs</H2>
        <Prose>
          <p>
            Tooli.uk compares plant hire quotes across all 32 London boroughs and every postcode
            area, from central zones to Croydon, Bromley, Romford, Enfield, Ealing and Kingston.
            Demand runs year-round in London, but groundworks season from March tightens
            availability on diggers and dumpers, so book ahead for spring starts.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-sw19-london-postcode-area-guide"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire SW19: London Postcode Area Guide →
          </span>
        </Link>
      </section>

      <FaqSection faqs={plantHireLondonFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare London Plant Hire Companies Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          One search, multiple quotes, no phone-round. Enter your postcode on Tooli.uk and
          compare plant hire companies across London in minutes.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 10 — Mini Digger Hire Birmingham                            */
/* ------------------------------------------------------------------ */

const miniDiggerBirminghamSizeTable: [string, string, string][] = [
  ['0.8–1 t micro digger', 'Fits through ~750 mm entry or gateway', 'Rear garden digs in terraces across Selly Oak, Kings Heath and Erdington'],
  ['1.5 t mini digger', 'Standard garden gate or drive', 'Extension footings, patios, drainage on semis in Hall Green and Northfield'],
  ['2.5–3 t digger', 'Driveway or open site access', 'Larger footings, muck shifts, plot strips in Sutton Coldfield and beyond'],
];

const miniDiggerBirminghamAtAGlance = [
  'Compare mini digger hire quotes from multiple Birmingham and Black Country suppliers in one Tooli.uk search',
  'Sizes from 0.8 t micro diggers (through gaps of roughly 750 mm) up to 3 t machines',
  'Suppliers set their own rates; duration, season and delivery distance move the price, so compare totals',
  'No licence needed on private land; CPCS or NPORS cards usually expected on commercial sites',
  'Next-day delivery is standard across B postcodes; plan ahead for the Clean Air Zone and spring demand',
];

const miniDiggerBirminghamFaqs: Faq[] = [
  [
    'How much does mini digger hire cost in Birmingham?',
    'Rates are set by each supplier and vary with machine size, duration, season and delivery distance. Weekly hires usually cost less per day than day rates. Comparing quotes for your B postcode on Tooli.uk is the quickest way to find the current best price.',
  ],
  [
    'Do I need a licence to hire a mini digger in Birmingham?',
    'No, not for use on private land. Domestic hirers just need to be competent and take the supplier\'s handover. Commercial sites typically require CPCS or NPORS cards, and PUWER applies to employers.',
  ],
  [
    'Will a mini digger fit through a Birmingham terrace entry?',
    'A 0.8–1 tonne micro digger fits through gaps of roughly 750 mm, which covers most shared entries and side passages on the city\'s older housing stock. Measure first and confirm the tracked width with the supplier.',
  ],
  [
    'How quickly can a digger be delivered in Birmingham?',
    'Next-day delivery is standard when booked by early afternoon. Central deliveries inside the Clean Air Zone may need extra planning, and spring demand can stretch lead times on popular sizes.',
  ],
  [
    'Does the Birmingham Clean Air Zone affect digger delivery?',
    'It can. Non-compliant delivery vehicles entering the zone inside the A4540 ring road incur charges that some suppliers pass on. Confirm delivery terms when you compare quotes for central postcodes.',
  ],
  [
    'What attachments can I hire with a mini digger?',
    'Breakers, augers, grading buckets and grabs are widely available. Hiring attachments with the machine from one depot usually beats separate hires on cost and delivery.',
  ],
  [
    'Is Birmingham clay a problem for small diggers?',
    'It can be in dry summers, when baked clay slows the smallest machines. If access allows, choose a 1.5 t machine over a micro for anything beyond light garden work.',
  ],
  [
    'When is mini digger demand highest in Birmingham?',
    'March through early autumn, driven by landscaping and extension season. Book weekend hires by midweek and allow extra lead time around bank holidays.',
  ],
];

function MiniDiggerBirminghamBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={miniDiggerBirminghamAtAGlance} />
      </section>

      <Link
        to="/blog/tool-hire-birmingham"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          Tool Hire in Birmingham: Compare Prices From Local Suppliers →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/tool-hire-birmingham.webp"
        alt="Mini digger and tool hire comparison in Birmingham — compare prices from local suppliers on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Mini Digger Prices in Birmingham: Why They Vary</H2>
        <Prose>
          <p>
            There's no fixed Birmingham rate for a mini digger. Each depot on the Tooli.uk network
            prices independently, and quotes move with machine size, hire length, attachments,
            delivery distance and demand. Weekly hires nearly always beat a string of day rates,
            and spring groundworks season tightens both availability and pricing across the region.
          </p>
          <p>
            Birmingham has an unusually deep supplier pool, with city depots competing against
            Black Country yards in Dudley, Walsall and West Bromwich that all deliver into the B
            postcodes. In our experience comparing quotes across the network, that competition
            creates a real spread between the cheapest and dearest offer for identical kit. Run
            the comparison per job rather than defaulting to the nearest name.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
          </span>
        </Link>
      </section>

      <section>
        <H2>Mini Digger Sizes: Which One for a Birmingham Job?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Size class</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Access needed</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical Birmingham job</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerBirminghamSizeTable.map(([size, access, job], i) => (
                <tr key={size} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{size}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{access}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          The micro digger earns its keep in Birmingham. Huge swathes of the city's Victorian and
          Edwardian stock have shared entries or side passages no wider than a doorway, so a machine
          that tracks through a 750 mm gap is often the difference between a machine dig and a week
          on the shovel. Measure the narrowest point and give the supplier the figure when you book.
        </p>
        <Link
          to="/blog/mini-digger-hire-cost-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
          </span>
        </Link>
      </section>

      {/* Equipment grid */}
      <img
        src="/images/blog/birmingham-equipment-grid.webp"
        alt="Wide range of mini diggers and plant hire equipment available for hire across Birmingham and the West Midlands"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>What Can You Do With a Mini Digger in Birmingham?</H2>
        <Prose>
          <p>
            The staples: garden landscaping and clearance, footings for rear extensions, drainage
            runs and soakaways, stump removal, driveway excavation and levelling for garden rooms.
            Add a hired breaker attachment and the same machine takes out old concrete drives and
            patios, saving a separate breaker hire.
          </p>
          <p>
            One local note on ground conditions. Much of Birmingham sits on heavy clay that bakes
            hard in summer and holds water through winter. Undersized machines struggle in baked
            clay, so if access allows, step up a size rather than fighting the ground with a micro.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Availability and Delivery Across the B Postcodes</H2>
        <Prose>
          <p>
            Most suppliers offer next-day delivery across Birmingham when booked by early afternoon,
            with same-day depot collection sometimes possible for the smallest machines. Central
            deliveries need one extra check: the{' '}
            <a
              href="https://www.gov.uk/clean-air-zones"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Clean Air Zone inside the A4540 ring road
            </a>{' '}
            can add charges for non-compliant delivery vehicles, and some suppliers pass those on,
            so confirm terms when comparing quotes.
          </p>
          <p>
            Demand peaks locally in spring. Landscapers, groundworkers and extension jobs all
            compete for the same 1.5 t fleet from March onwards, and weekend slots go first. Book
            Friday-to-Monday hires by midweek, and earlier still around bank holidays.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Do You Need a Licence for a Mini Digger?</H2>
        <Prose>
          <p>
            Not on private land. Any competent adult can hire and operate a mini digger for a
            domestic project, and suppliers will walk through the controls on handover. Read{' '}
            <a
              href="https://www.hse.gov.uk/construction/safetytopics/excavations.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE guidance on safe excavation
            </a>{' '}
            before you start, and get utility plans or a CAT scan before breaking ground; services
            run shallow across older Birmingham streets.
          </p>
          <p>
            On commercial sites, principal contractors will normally expect a{' '}
            <a
              href="https://www.nocnjobcards.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              CPCS or NPORS ticket
            </a>
            , and employers providing hired plant to workers must meet PUWER duties. Confirm site
            requirements before booking so the right operator turns up with the right card.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-comparison-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>How to Choose the Right Machine</H2>
        <Prose>
          <p>
            Access width decides most Birmingham hires: the narrowest entry, gate or passage sets
            your maximum machine size. Then dig depth, since a 1.5 t machine reaches roughly 2 m,
            enough for standard domestic footings. Factor in ground conditions (that clay again),
            and finally spoil: every bucket needs a skip or grab lorry, so price muck-away
            alongside the digger.
          </p>
          <p>
            Bundle where you can. A digger, breaker attachment and micro dumper from one supplier
            means one delivery charge and one collection, which usually beats three separate hires.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Hire a Mini Digger Near You</H2>
        <Prose>
          <p>
            Tooli.uk compares mini digger hire across every Birmingham postcode and the surrounding
            towns, including Solihull, Sutton Coldfield, West Bromwich, Dudley and Walsall. One
            search covers the city depots and the Black Country yards competing for your job.
          </p>
        </Prose>
      </section>

      <FaqSection faqs={miniDiggerBirminghamFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Mini Digger Hire in Birmingham Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your B postcode on Tooli.uk, pick your dates, and get local quotes in minutes from
          Birmingham and Black Country suppliers.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 11 — Plant Hire Birmingham                                  */
/* ------------------------------------------------------------------ */

const plantHireBirminghamCategories: [string, string, string][] = [
  ['Excavators', 'Micro, mini (1.5–3 t), midi (5–8 t)', 'Footings, drainage, site strips, demolition enabling'],
  ['Dumpers', '1 t high-tip, tracked micro dumpers', 'Muck-away on tight terrace and infill plots'],
  ['Compaction', 'Wacker plates, trench rammers, 1.2 t rollers', 'Sub-base, driveways, reinstatement'],
  ['Telehandlers', 'Compact to 17 m reach', 'Loading out scaffolds on housing sites across the suburbs'],
  ['Powered access', 'Cherry pickers, scissor lifts (IPAF)', 'Commercial fit-out and maintenance around the city core'],
  ['Site support', 'Generators, lighting towers, welfare units', 'Infrastructure work and off-grid sites'],
];

const plantHireBirminghamAtAGlance = [
  'Compare quotes from local and national plant hire companies across Birmingham and the Black Country on Tooli.uk',
  'Full plant range: excavators, dumpers, rollers, telehandlers, powered access and site support kit',
  'Every company sets its own rates and delivery terms, so comparing totals beats ringing round',
  'Local logistics covered: Clean Air Zone deliveries, site restrictions, operated vs self-drive',
  'Demand is strong year-round, driven by city-centre schemes and constant suburban building work',
];

const plantHireBirminghamFaqs: Faq[] = [
  [
    'How do I compare plant hire companies in Birmingham?',
    'Enter your postcode on Tooli.uk, select the machine and dates, and compare quotes from local and national companies side by side. Each company sets its own rates and delivery terms, so comparing full totals is the reliable way to find the best deal.',
  ],
  [
    'Are local Birmingham plant hire companies cheaper than national chains?',
    'Sometimes. Pricing is set independently and varies by machine, duration and depot distance. Black Country independents often quote sharper on longer hires, while nationals offer fleet backup. Compare both every time.',
  ],
  [
    'Does the Clean Air Zone affect plant hire delivery in Birmingham?',
    'It can. Deliveries inside the A4540 ring road may incur charges for non-compliant vehicles, which some companies pass on. Confirm delivery terms when comparing quotes for central sites.',
  ],
  [
    'Do I need a licence to hire plant in Birmingham?',
    'Not for self-drive plant on private land. Commercial sites normally require CPCS or NPORS cards, and larger machines are often supplied with an operator included.',
  ],
  [
    "What's the difference between operated and self-drive plant hire?",
    'Self-drive means you operate the machine yourself. Operated hire includes a qualified driver, costs more per day, and is standard for larger excavators on commercial sites.',
  ],
  [
    'Can I hire plant for a weekend in Birmingham?',
    'Yes, most companies offer weekend bands on smaller plant. Book by midweek from March onwards, when landscaping and groundworks demand fills Friday slots first.',
  ],
  [
    'What plant do Birmingham builders hire most?',
    'Mini diggers, micro dumpers, wacker plates, telehandlers and powered access lead demand across the Tooli.uk network locally, driven by extensions, infill plots and commercial fit-out.',
  ],
  [
    'Is delivery included in Birmingham plant hire quotes?',
    'Usually charged separately, varying with depot distance. Compare the full total including delivery, collection, fuel policy and damage waiver rather than the daily rate alone.',
  ],
];

function PlantHireBirminghamBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={plantHireBirminghamAtAGlance} />
      </section>

      <Link
        to="/blog/tool-hire-birmingham"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          Tool Hire in Birmingham: Compare Prices From Local Suppliers →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/tool-hire-birmingham.webp"
        alt="Plant hire comparison in Birmingham — compare local and national suppliers on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Local Companies vs National Chains in Birmingham</H2>
        <Prose>
          <p>
            Both sides hire the same machines; the difference is how they serve them. National chains
            bring fleet depth and backup, so a breakdown usually means a fast swap from another depot.
            The West Midlands independents — many of them long-established family yards across
            Birmingham, Dudley, Walsall and West Bromwich — tend to compete on flexibility, service
            and keener quotes for longer hires.
          </p>
          <p>
            Neither is cheapest by default. Every company on the Tooli.uk network prices independently,
            and in our experience comparing West Midlands quotes, a Black Country yard can undercut a
            national on one machine while the national wins the next hire a mile away. Compare both on
            every job and let the totals settle it.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-comparison-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>What Plant Can You Hire in Birmingham?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Category</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Common machines</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical Birmingham use</th>
              </tr>
            </thead>
            <tbody>
              {plantHireBirminghamCategories.map(([cat, machines, use], i) => (
                <tr key={cat} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{cat}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{machines}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Attachments stretch every hire further. Breakers, augers and grading buckets bundled with an
          excavator arrive on the same lorry and save separate hire and delivery charges.
        </p>
      </section>

      {/* Plant equipment grid image */}
      <img
        src="/images/blog/plant-hire-london.webp"
        alt="Midi excavator, mini digger and high-tip dumper on a Birmingham plant hire site — compare suppliers on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Why Birmingham Plant Demand Runs Hot</H2>
        <Prose>
          <p>
            The city has an unusually steady pipeline. Major schemes like HS2's Curzon Street station
            and the Smithfield regeneration anchor demand in the centre, while the suburbs generate
            constant extension, landscaping and infill work. When big projects draw down local fleets,
            availability on popular machines like 1.5 t diggers and micro dumpers tightens for
            everyone else.
          </p>
          <p>
            That's a practical argument for comparing rather than relying on one depot. When your
            usual yard is out of stock in April, a competing supplier two postcodes away often isn't,
            and Tooli.uk surfaces them all in one search.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Delivery Logistics on Birmingham Sites</H2>
        <Prose>
          <p>
            Three checks before your delivery date. First, the{' '}
            <a
              href="https://www.gov.uk/clean-air-zones"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Clean Air Zone
            </a>
            : deliveries inside the A4540 ring road can incur charges for non-compliant vehicles, and
            some companies pass those on, so confirm terms for central sites. Second, access: tight
            terrace streets and shared entries across much of the city need the street layout flagged
            to the supplier so the right lorry turns up. Third, hours: noisy works and deliveries are
            generally expected within standard weekday daytimes and Saturday mornings.
          </p>
          <p>
            On{' '}
            <a
              href="https://www.hse.gov.uk/construction/cdm/2015/index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              CDM 2015
            </a>{' '}
            projects, hired plant comes under the principal contractor's site rules, so share machine
            specs and delivery plans early. Companies used to city-centre work will handle much of
            this routinely, which is worth weighing alongside price.
          </p>
        </Prose>
        <Link
          to="/blog/mini-digger-hire-cost-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
          </span>
        </Link>
      </section>

      <section>
        <H2>Operated or Self-Drive?</H2>
        <Prose>
          <p>
            Smaller plant (mini diggers, dumpers, compaction kit) is normally self-drive, with{' '}
            <a
              href="https://www.cpa.uk.net"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              CPCS or NPORS cards
            </a>{' '}
            expected on commercial sites and PUWER duties applying to employers who provide hired
            plant. Larger excavators and specialist machines are commonly supplied operated, with a
            qualified driver included.
          </p>
          <p>
            Operated costs more per day but removes the ticketing question and typically shifts more
            muck per hour. For domestic groundworks, self-drive on a 1.5 t machine is the standard
            route; for bigger machines on commercial Birmingham sites, expect operated as the norm.
          </p>
        </Prose>
      </section>

      <section>
        <H2>How to Compare Plant Hire Companies Properly</H2>
        <Prose>
          <p>
            Compare the whole quote, never the headline rate. Delivery and collection charges vary with
            depot distance, which matters in a market where Black Country yards and city depots both
            serve the same postcodes. Damage waiver terms, fuel policy and whether the machine comes
            from the company's own fleet (cross-hire affects swap-out speed) all change the true cost.
          </p>
          <p>
            Duration is the other lever. Weekly and monthly bands beat day rates, and companies quote
            keenest on plant that stays out. If the job might overrun, get the longer band priced
            upfront.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
          </span>
        </Link>
      </section>

      <section>
        <H2>Plant Hire Across Birmingham and Beyond</H2>
        <Prose>
          <p>
            Tooli.uk compares plant hire quotes across every B postcode and the surrounding towns:
            Solihull, Sutton Coldfield, West Bromwich, Dudley, Walsall and Wolverhampton. One search
            covers the whole West Midlands supplier pool competing for your job.
          </p>
          <p>Compare Birmingham plant hire companies on Tooli.uk — one search, multiple quotes, no phone-round.</p>
        </Prose>
        <Link
          to="/blog/plant-hire-london-compare-local-plant-hire-companies"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Plant Hire London: Compare Local Plant Hire Companies →
          </span>
        </Link>
      </section>

      <FaqSection faqs={plantHireBirminghamFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Birmingham Plant Hire Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your B postcode on Tooli.uk, choose your machine and dates, and get quotes from local
          and national plant hire companies side by side.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 12 — Tool Hire B1: Birmingham Postcode Area Guide           */
/* ------------------------------------------------------------------ */

const toolHireB1EquipmentTable: [string, string][] = [
  ['Scissor lift (IPAF)', 'Ceiling grids, M&E and lighting in office fit-outs'],
  ['Cherry picker', 'Facade, signage and gutter work on commercial frontages'],
  ['Concrete breaker', 'Slab and screed removal during strip-outs'],
  ['Dust extraction and air scrubbers', 'Containing dust on occupied-building refurbs'],
  ['Dehumidifier and heater', 'Drying screed and plaster on apartment programmes'],
  ['Carpet cleaner and floor sander', 'End-of-tenancy and communal-area refresh work'],
];

const toolHireB1AtAGlance = [
  'Compare tool hire quotes from all suppliers delivering to B1 in one Tooli.uk search',
  'Covers Broad Street, Brindleyplace, Centenary Square and canalside B1 developments',
  'Most-hired kit locally: scissor lifts, cherry pickers, breakers, dust extraction and drying equipment',
  'B1 sits fully inside the Clean Air Zone, so delivery terms vary by supplier and are worth comparing',
  'Fit-out, refurbishment and apartment work drive local demand more than garden projects',
];

const toolHireB1Faqs: Faq[] = [
  [
    'Which suppliers deliver tool hire to B1?',
    'B1 sits in the delivery zones of depots across Birmingham and the Black Country, including national chains and local independents. Tooli.uk compares quotes from all suppliers covering the postcode in one search.',
  ],
  [
    'Does the Clean Air Zone affect tool hire delivery to B1?',
    'Yes, potentially. All of B1 sits inside the A4540 ring road, so non-compliant delivery vehicles incur CAZ charges that some suppliers pass on. Compare delivery terms alongside hire rates.',
  ],
  [
    'What tools do people hire most in B1?',
    'Scissor lifts, cherry pickers, breakers, dust extraction and drying equipment lead demand across the Tooli.uk network locally, driven by fit-out, refurbishment and apartment work rather than garden projects.',
  ],
  [
    'Do I need an IPAF licence to hire a scissor lift in B1?',
    'On commercial sites, yes — operators are expected to hold a valid IPAF licence, and principal contractors will check it. Suppliers can confirm requirements per machine when you book.',
  ],
  [
    'How quickly can tools be delivered to Birmingham city centre?',
    "Next-day delivery is standard when booked by early afternoon. Allow extra planning for loading restrictions, tram-route stopping rules on Broad Street and event-night congestion near the arena.",
  ],
  [
    'Can I hire tools in B1 without a trade account?',
    'Yes. Homeowners, apartment owners and small traders can hire directly. Suppliers typically ask for ID and a deposit or damage waiver, with terms varying by company.',
  ],
  [
    'Are there noise restrictions for hired tools in B1?',
    "Usually, via building management rather than just the council. Occupied offices and apartment blocks commonly restrict breakers and coring to set hours, so confirm the building's rules before booking.",
  ],
  [
    'Does tool hire cost more in central Birmingham?',
    'Rates are set by each supplier and move with depot distance, kit and delivery terms rather than the postcode itself. Because many depots compete for B1 work, comparing quotes regularly finds a sharper total than a single call.',
  ],
];

function ToolHireB1Body() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={toolHireB1AtAGlance} />
      </section>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/tool-hire-birmingham.webp"
        alt="Plant hire equipment on a Birmingham city centre construction site near B1"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>How Tool Hire Works in B1</H2>
        <Prose>
          <p>
            B1 has no hire depot on its doorstep, and it doesn't need one. The postcode sits within
            the delivery radius of depots across Birmingham and the Black Country, from national chains
            to independent yards in Aston, Digbeth-side and further out towards West Bromwich. All of
            them compete for city-centre work, which makes comparison genuinely worthwhile here.
          </p>
          <p>
            Each supplier on the Tooli.uk network sets its own rates and delivery charges, and B1 adds
            a variable most postcodes don't have: the{' '}
            <a
              href="https://www.gov.uk/clean-air-zones"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Clean Air Zone
            </a>
            . The whole postcode sits inside the A4540 ring road, so non-compliant delivery vehicles
            incur charges that some suppliers absorb and others pass on. Compare full totals for your
            address, not headline rates.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-birmingham"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire in Birmingham: Compare Prices From Local Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>What Gets Hired Most in B1</H2>
        <Prose>
          <p>
            B1's building stock shapes its hire demand. This is commercial and high-density residential
            territory: offices around Brindleyplace, hotels and venues on Broad Street, and waves of
            canalside apartments. The work is fit-out, refurbishment, maintenance and end-of-tenancy
            turnaround rather than garden landscaping.
          </p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Equipment</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical B1 job</th>
              </tr>
            </thead>
            <tbody>
              {toolHireB1EquipmentTable.map(([equip, use], i) => (
                <tr key={equip} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{equip}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Powered access dominates. With so much of the local work happening at height indoors and on
          frontages, scissor lifts and push-around verticals are the B1 workhorses, and{' '}
          <a
            href="https://www.ipaf.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-primary hover:underline"
          >
            IPAF licences
          </a>{' '}
          are expected on virtually every commercial job here.
        </p>
        <Link
          to="/blog/tool-hire-comparison-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
          </span>
        </Link>
      </section>

      {/* Equipment grid image */}
      <img
        src="/images/blog/birmingham-equipment-grid.webp"
        alt="Full range of construction and tool hire equipment available for hire across Birmingham B1 — excavators, scissor lifts, breakers, generators and more"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Delivery to B1: What to Expect</H2>
        <Prose>
          <p>
            Next-day delivery is standard from most suppliers when booked by early afternoon. The
            complications are all at street level. Loading in B1 often means bays, time-restricted
            kerbside slots or building service yards rather than free kerb space, so tell the supplier
            exactly where the lorry can stop and when the building accepts deliveries.
          </p>
          <p>
            Broad Street brings its own wrinkle: the tram runs along it, and stopping restrictions
            around the route are tightly enforced. For deliveries to venues and frontages on the street
            itself, agree the drop point with the supplier in advance. Event nights around the arena
            and Centenary Square can also slow access, so avoid Friday-evening deliveries where you
            can.
          </p>
        </Prose>
        <Link
          to="/blog/mini-digger-hire-cost-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
          </span>
        </Link>
      </section>

      <section>
        <H2>Working in Occupied Buildings</H2>
        <Prose>
          <p>
            Most B1 jobs happen in buildings that stay open around the work. That changes the kit list:
            dust extraction, floor protection and quieter electric tools earn their hire fee in occupied
            offices and apartment blocks. Building managers commonly restrict noisy works to set hours,
            and some require out-of-hours slots for breakers and coring, so confirm the building's
            rules before the tools arrive.
          </p>
          <p>
            Compliance is standard commercial fare. IPAF for powered access, PASMA for any mobile
            towers, and PUWER duties for employers providing hired kit.{' '}
            <a
              href="https://www.hse.gov.uk/work-at-height/index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE working-at-height guidance
            </a>{' '}
            applies throughout, and principal contractors on fit-out schemes will check cards at the
            door.
          </p>
        </Prose>
        <Link
          to="/blog/plant-hire-birmingham-compared-local-plant-hire-companies"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Plant Hire Birmingham: Compare Local Plant Hire Companies →
          </span>
        </Link>
      </section>

      <section>
        <H2>Trades We Serve in B1</H2>
        <Prose>
          <p>
            Tooli.uk compares hire for the trades doing the bulk of B1's work: electricians and M&amp;E
            contractors, shopfitters, decorators, flooring contractors, maintenance teams and facilities
            firms, plus builders on apartment refurbishments. If you run repeat jobs across the city
            core, one comparison search per hire replaces the phone-round and keeps a record of every
            quote.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Neighbouring Postcode Areas</H2>
        <Prose>
          <p>
            Working beyond B1? The same comparison covers the surrounding city-centre and inner
            postcodes: B2 and B3 (core and Colmore Row side), B4 (Aston University quarter), B5
            (Digbeth and the markets), B15 (Edgbaston) and B16 (Ladywood). Suppliers serving B1 cover
            all of them, and totals shift with depot distance, so run the comparison per job rather
            than assuming one supplier always wins.
          </p>
        </Prose>
      </section>

      <FaqSection faqs={toolHireB1Faqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Tool Hire in B1 Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your B1 postcode on Tooli.uk, pick your kit and get quotes from suppliers covering
          Birmingham city centre in minutes.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 13 — Mini Digger Hire UK: Prices & Sizes Compared          */
/* ------------------------------------------------------------------ */

const miniDiggerUKPrices: [string, string, string, string, string, string][] = [
  ['0.8 tonne', 'Micro / Mini Digger', '£100–£175', '£170–£280', '£380–£550', '£1,000–£1,400'],
  ['1.5 tonne', 'Mini Digger', '£160–£230', '£250–£380', '£500–£700', '£1,300–£1,800'],
  ['3.0 tonne', 'Mini Digger', '£220–£320', '£340–£500', '£680–£950', '£1,700–£2,400'],
  ['5.0 tonne', 'Mini Digger', '£300–£500', '£480–£750', '£900–£1,400', '£2,200–£3,400'],
  ['8.0 tonne', 'Mini Digger', '£400–£650', '£600–£950', '£1,200–£1,800', '£2,900–£4,200'],
];

const miniDiggerUKDelivery: [string, string][] = [
  ['Under 10 miles', '£60–£100'],
  ['10–25 miles', '£100–£160'],
  ['25–50 miles', '£150–£250'],
  ['50+ miles', '£200–£350+'],
];

const miniDiggerUKSpecs: [string, string, string, string, string, string][] = [
  ['0.8t', '800–1,000 kg', '1.8–2.2 m', '2.8–3.5 m', '300–450 mm', '750–850 mm'],
  ['1.5t', '1,400–1,700 kg', '2.2–2.6 m', '3.8–4.5 m', '400–600 mm', '990–1,200 mm'],
  ['3.0t', '2,800–3,200 kg', '3.0–3.8 m', '5.0–6.0 m', '450–600 mm', '1,300–1,550 mm'],
  ['5.0t', '4,800–5,400 kg', '4.0–5.0 m', '6.5–7.5 m', '500–900 mm', '1,800–2,000 mm'],
  ['8.0t', '7,800–8,800 kg', '4.8–5.5 m', '7.5–8.5 m', '600–1,000 mm', '2,200–2,500 mm'],
];

const miniDiggerUKJobs: [string, string, string][] = [
  ['Fence post removal / replacement', '0.8t or 1.5t', '0.8t for tight gardens with no gate access'],
  ['Garden clearance and topsoil removal', '1.5t', 'Most efficient all-rounder for residential gardens'],
  ['Patio preparation and base digging', '1.5t or 3t', '3t if digging more than 300 mm deep'],
  ['Trench digging (drainage, pipes, cables)', '1.5t or 3t', 'Depth and length of trench determines size'],
  ['Foundation excavation for extension', '3t', 'Match dig depth to machine reach spec above'],
  ['Pond excavation', '1.5t or 3t', '0.8t for very small ponds in tight spaces'],
  ['Driveway excavation', '3t', 'Speed and depth matters — go bigger'],
  ['Demolition breakout (with breaker)', '3t or 5t', 'Breaker attachment adds significant strain on smaller machines'],
  ['Tree root removal', '1.5t or 3t', 'Pair with root-grubbing bucket attachment'],
  ['Land drainage / French drain', '3t', 'Volume of spoil removal suits a larger machine'],
];

const miniDiggerUKAtAGlance = [
  'Micro digger (0.8t): typically £100–£175/day — tight-access gardens and shallow trenches',
  '1.5t digger: typically £160–£230/day — the UK\'s most hired excavator size',
  '3t digger: typically £220–£320/day — foundations, drainage, serious landscaping',
  '5t+ digger: typically £300–£500/day — groundworks, road excavation, commercial sites',
  'Delivery is charged separately — typically £80–£200 return depending on distance',
];

const miniDiggerUKFaqs: Faq[] = [
  [
    'How much does it cost to hire a mini digger for a day?',
    'Mini digger hire in the UK typically runs from £100 to £320 per day depending on the size. A 0.8-tonne micro digger costs around £100–£175/day. A 1.5-tonne — the UK\'s most popular size — runs £160–£230/day. A 3-tonne machine costs £220–£320/day. All prices are VAT-inclusive guidance; confirm current rates on Tooli.uk.',
  ],
  [
    'Can I drive a mini digger on the road?',
    'No. Mini diggers are not road-legal and must be transported on a low-loader or trailer. Your hire depot will arrange delivery if you need it, or some customers with the correct trailer and a vehicle rated to tow the weight can self-collect.',
  ],
  [
    'Do I need a licence to hire a mini digger?',
    'No formal licence is required to hire a mini digger on private land for domestic projects. On commercial sites you will need a CPCS card. PUWER regulations require you to be competent to operate any work equipment, so if you\'ve never used one before, ask the depot for a brief induction.',
  ],
  [
    'What is the difference between a mini digger and a micro digger?',
    'Micro digger typically refers to a machine under 1 tonne — designed specifically for tight-access residential work. Mini digger is the broader category covering machines from around 0.8 to 6 tonnes. The terms are used interchangeably in the hire trade but micro usually means the smallest class.',
  ],
  [
    'Can I hire a mini digger without a trade account?',
    'Yes. Most UK hire depots will hire to private individuals without a trade account. You\'ll typically need a form of photo ID (driving licence or passport) and a credit or debit card for the deposit. Some depots require proof of address for one-off hires.',
  ],
  [
    'How far in advance do I need to book a mini digger?',
    'For rural areas or during busy spring and summer months, book at least 3–5 working days in advance. In most UK towns you can often get a machine within 24–48 hours. Same-day availability is rare — have a fallback date in mind.',
  ],
  [
    'What happens if I return the digger late?',
    "Hire companies charge for additional days at the standard daily rate. Some have a grace period of a few hours; most do not. If you need extra time, call the depot before your return date — they may be able to extend the hire if the machine isn't already reserved.",
  ],
  [
    'What fuel does a mini digger use?',
    'The vast majority of hire-fleet mini diggers run on diesel. You are usually expected to return the machine with the same fuel level it had when collected. Check the fuel gauge on collection and photograph it — it avoids disputes on return.',
  ],
];

function MiniDiggerUKBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={miniDiggerUKAtAGlance} />
      </section>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/mini-digger-hire-uk.webp"
        alt="Mini digger hire UK — prices and sizes compared: micro, mini and large mini diggers with UK hire rates"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Price table */}
      <section>
        <H2>Mini Digger Hire Prices UK 2026</H2>
        <Prose>
          <p>
            Prices below are based on average UK market rates. Your actual quote may vary by location,
            supplier, and whether you need delivery. All prices are VAT-inclusive guides. Confirm
            current rates on Tooli.uk.
          </p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Size class</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Machine type</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Day rate</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Weekend (2 days)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Week rate</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">4-week rate</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerUKPrices.map(([size, type, day, weekend, week, monthly], i) => (
                <tr key={size} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{size}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{type}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{day}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{weekend}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{week}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{monthly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-medium text-gray-400">
          *All prices VAT-inclusive guidance only. Compare live quotes on Tooli.uk.
        </p>
      </section>

      {/* Delivery table */}
      <section>
        <H2>Delivery &amp; Collection Costs</H2>
        <Prose>
          <p>
            Most hire companies charge separately for delivery and collection. Budget for this before
            you compare day rates — a cheap day rate with a £200 delivery charge can work out pricier
            than a slightly higher rate with local collection.
          </p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Distance from depot</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical delivery charge (return)</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerUKDelivery.map(([dist, charge], i) => (
                <tr key={dist} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{dist}</td>
                  <td className="px-5 py-3 font-bold text-brand-primary">{charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Specs table */}
      <section>
        <H2>Mini Digger Sizes &amp; Specs Compared</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Size</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Op. weight</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Max dig depth</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Max reach</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Bucket width</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Transport width</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerUKSpecs.map(([size, weight, depth, reach, bucket, width], i) => (
                <tr key={size} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{size}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{weight}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{depth}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{reach}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{bucket}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{width}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          to="/blog/mini-digger-hire-cost-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
          </span>
        </Link>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/mini-digger-hire-uk-action.webp"
        alt="JCB mini digger excavating on a UK residential site — hire from local suppliers compared on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Jobs table */}
      <section>
        <H2>What Can You Do With a Mini Digger?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Job</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Recommended size</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerUKJobs.map(([job, size, notes], i) => (
                <tr key={job} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{job}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{size}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <H2>How to Choose the Right Mini Digger</H2>
        <div className="space-y-6">
          {[
            {
              n: '1',
              title: 'Access Width',
              body: 'Measure your narrowest gate or access point before booking. A standard 1.5-tonne digger needs around 1,000–1,200 mm of clear width. A micro digger (0.8t) can squeeze through 750–850 mm. Many garden jobs need a micro digger not because of dig depth, but because nothing wider fits through the side gate.',
            },
            {
              n: '2',
              title: 'Dig Depth Required',
              body: 'Foundation trenches for a single-storey extension typically need 800–1,000 mm depth. A 1.5-tonne machine handles that comfortably. Deep drainage or groundworks going below 1.5 metres needs a 3-tonne machine minimum.',
            },
            {
              n: '3',
              title: 'Amount of Material to Move',
              body: 'Bigger machine, bigger bucket, faster work. A 0.8t digger shifts material slowly. If you\'re moving 20+ tonnes of spoil, hire the 3t — the day-rate difference is smaller than the extra day or two of hire time.',
            },
            {
              n: '4',
              title: 'Site Conditions',
              body: 'Rubber-tracked machines protect soft lawns and paving. Steel tracks are more durable on rough ground but will cut up any surface they cross. Most hire companies offer rubber tracks on smaller machines — confirm before booking.',
            },
            {
              n: '5',
              title: 'Operator Experience',
              body: 'You do not need a CPCS card to hire or operate a mini digger under 5 tonnes on private land. But competence is required under PUWER regulations. If you\'ve never operated one, request an induction from the hire depot or hire an experienced operator separately.',
            },
            {
              n: '6',
              title: 'Attachments Needed',
              body: 'Standard machines come with a general-purpose bucket. Confirm whether breaker attachments, augers, grabs, or ditching buckets are available and what the additional daily rate is before you commit to a supplier.',
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-extrabold text-white">
                {n}
              </div>
              <div>
                <H3>{title}</H3>
                <p className="mt-1 text-base font-medium leading-relaxed text-gray-500">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>Do You Need a Licence or Qualification?</H2>
        <Prose>
          <p>
            For private land under a domestic project, there is no legal requirement to hold a CPCS
            card, CSCS card, or any formal licence to operate a mini digger. However:
          </p>
          <ul>
            <li>
              <a
                href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-primary hover:underline"
              >
                PUWER 1998
              </a>{' '}
              (Provision and Use of Work Equipment Regulations) requires that anyone using work
              equipment is competent to do so — which means training if you've not operated before.
            </li>
            <li>
              On commercial construction sites, a valid{' '}
              <a
                href="https://www.cpcs.uk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-primary hover:underline"
              >
                CPCS
              </a>{' '}
              (Construction Plant Competence Scheme) card will be required by most principal
              contractors.
            </li>
            <li>
              Machines over 5 tonnes on public roads require a valid driving licence and appropriate
              transport.
            </li>
          </ul>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/mini-digger-hire-london-prices-local-availability"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire London: Prices &amp; Local Availability →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/plant-hire-london-compare-local-plant-hire-companies"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Plant Hire London: Compare Local Hire Companies →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-birmingham-prices-and-local-availability"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Birmingham: Prices &amp; Local Availability →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={miniDiggerUKFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Mini Digger Hire Prices Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk, pick your machine size and dates, and get quotes from
          local UK suppliers side by side — delivery included.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 14 — Mini Digger Hire Cost UK: 2026 Price Guide            */
/* ------------------------------------------------------------------ */

const miniDiggerCostDuration: [string, string, string, string, string][] = [
  ['Half day (4hrs)', '£65–£110', '£95–£140', '£130–£200', '£180–£280'],
  ['1 day', '£100–£175', '£160–£230', '£220–£320', '£300–£500'],
  ['Weekend (Fri–Mon)', '£170–£280', '£250–£380', '£340–£500', '£480–£750'],
  ['5-day week', '£380–£550', '£500–£700', '£680–£950', '£900–£1,400'],
  ['4-week month', '£1,000–£1,400', '£1,300–£1,800', '£1,700–£2,400', '£2,200–£3,400'],
];

const miniDiggerCostDelivery: [string, string][] = [
  ['Self-collect', '£0 (you arrange transport)'],
  ['Under 10 miles', '£60–£100'],
  ['10–25 miles', '£100–£160'],
  ['25–50 miles', '£150–£250'],
  ['50+ miles', 'POA — expect £200+'],
];

const miniDiggerCostScenarios: [string, string, string, string, string, string, string][] = [
  ['Garden fence line trenching', '0.8t', '1 day', '£130', '£80', '£15', '~£225'],
  ['Patio prep (30 m²)', '1.5t', '1 day', '£190', '£90', '£20', '~£300'],
  ['Extension foundation (semi-det)', '3t', '2 days', '£540', '£120', '£50', '~£710'],
  ['Drainage run (40 metres)', '1.5t', '2 days', '£400', '£90', '£40', '~£530'],
  ['Full garden clearance + pond', '1.5t', '3 days', '£570', '£90', '£55', '~£715'],
  ['Driveway excavation (3 cars)', '3t', '1 day', '£270', '£120', '£30', '~£420'],
];

const miniDiggerCostAtAGlance = [
  '0.8t micro digger: £100–£175/day | £380–£550/week',
  '1.5t mini digger: £160–£230/day | £500–£700/week',
  '3t mini digger: £220–£320/day | £680–£950/week',
  '5t midi digger: £300–£500/day | £900–£1,400/week',
  'Delivery: add £60–£200 return typically',
  'Deposit: typically £250–£600 held on card',
];

const miniDiggerCostFaqs: Faq[] = [
  [
    'What is the cheapest way to hire a mini digger?',
    'Self-collect, book a full week if your job runs 4+ days, and compare at least 3 local suppliers on Tooli.uk before committing. A 0.8-tonne micro digger with self-collection starts from around £100/day. Avoid peak spring/summer booking periods where possible.',
  ],
  [
    'Is mini digger hire cheaper in the North of England than London?',
    'Generally yes. London and South East rates run 10–20% higher than the national average. Day rates for a 1.5-tonne machine in Manchester, Leeds, or Sheffield typically start lower than equivalent machines in Central London. Compare current local rates on Tooli.uk.',
  ],
  [
    'Do hire companies charge VAT on top of quoted rates?',
    'If a hire company is VAT-registered (turnover over £90,000 — most commercial hire depots are), they must add 20% VAT to the hire charge. All prices in this guide are VAT-inclusive. Always confirm whether a quote is ex-VAT or inclusive before comparing.',
  ],
  [
    'Can I get a half-day hire rate for a mini digger?',
    'Some depots offer half-day (4-hour) rates, typically 60–70% of the full-day rate. It is worth asking — but many depots book by the day regardless. If your job is truly 4 hours or less, self-collection and same-day return is the most cost-effective route.',
  ],
  [
    'Is operator hire available, and what does it cost?',
    'Yes — many hire companies can supply a trained operator alongside the machine. Operator costs vary widely but budget £200–£400 per day for a competent plant operator on top of the machine hire rate.',
  ],
  [
    'How much deposit do I need for mini digger hire?',
    'Typically £250–£600, held on a credit or debit card at collection. It is released on return of the undamaged, fuelled machine. The deposit is separate from the hire charge and is not charged — just held as a security.',
  ],
];

const miniDiggerCostTips = [
  'Book the right size first time. An under-powered machine takes longer and costs more in extra hire days.',
  'Self-collect if you have the equipment — saves £80–£200 per hire.',
  'Book for a full week if the job runs 4+ days — the weekly rate is almost always cheaper than paying 4 or 5 individual day rates.',
  'Compare at least 3 quotes before booking. Depot prices for the same machine vary by 15–20% in most UK towns.',
  'Avoid hiring over bank holidays — some depots charge a premium for collection on public holidays.',
  'Plan your work so the machine is productive every hour of the day — most depots charge a full day rate regardless of how long you actually use it.',
];

function MiniDiggerCostUKBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Cost Quick Reference</h2>
        <CheckList items={miniDiggerCostAtAGlance} />
      </section>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/mini-digger-hire-cost-uk-infographic.webp"
        alt="Mini digger hire cost UK 2026 — price guide covering day, week and month rates by machine size"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>What Affects the Cost of Mini Digger Hire?</H2>
        <div className="space-y-6">
          <div>
            <H3>Machine Size</H3>
            <p className="mt-1 text-base font-medium leading-relaxed text-gray-500">
              Size is the single biggest pricing variable. Every step up in size (0.8t → 1.5t → 3t)
              adds roughly £60–£90 to the daily rate. Hire the smallest machine that genuinely suits
              the job — not the cheapest one that almost suits it.
            </p>
          </div>
          <div>
            <H3>Hire Duration</H3>
            <p className="mt-1 text-base font-medium leading-relaxed text-gray-500">
              Day rates are priced at a premium. Most hire companies offer a 5-day weekly rate
              equivalent to around 3 to 4 day rates. A 4-week rate is typically 8–10 day rates total.
              If your job runs 4+ days, weekly hire almost always saves money.
            </p>
          </div>
        </div>
      </section>

      {/* Duration price table */}
      <section>
        <H2>Mini Digger Hire Rates by Duration</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Duration</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">0.8t</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">1.5t</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">3.0t</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">5.0t</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerCostDuration.map(([dur, a, b, c, d], i) => (
                <tr key={dur} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{dur}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{a}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{b}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{c}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-medium text-gray-400">
          *All prices VAT-inclusive guidance only. Compare live quotes on Tooli.uk.
        </p>
        <Link
          to="/blog/mini-digger-hire-uk-prices-and-sizes-compared"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire UK: Prices &amp; Sizes Compared →
          </span>
        </Link>
      </section>

      {/* Delivery table */}
      <section>
        <H2>Delivery &amp; Collection Costs</H2>
        <Prose>
          <p>
            Most hire companies do not include delivery in the quoted rate. Expect to add the
            following on top — and remember delivery is usually charged return, not one-way.
          </p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Distance from depot</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Typical delivery charge (return trip)</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerCostDelivery.map(([dist, charge], i) => (
                <tr key={dist} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{dist}</td>
                  <td className="px-5 py-3 font-bold text-brand-primary">{charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm font-medium text-gray-500">
          If you have access to a suitable trailer and a vehicle rated to tow the weight,
          self-collection can save £100–£200 on a short hire.
        </p>
      </section>

      {/* Fuel / waiver / deposit */}
      <section>
        <H2>Fuel, Insurance &amp; Deposit</H2>
        <div className="space-y-6">
          <div>
            <H3>Fuel</H3>
            <p className="mt-1 text-base font-medium leading-relaxed text-gray-500">
              Mini diggers run on diesel. Most hire companies provide the machine with a full tank and
              expect it returned full. Budget roughly £15–£40 in fuel per day depending on machine
              size and work intensity. Check the tank level on collection and photograph it.
            </p>
          </div>
          <div>
            <H3>Damage Waiver / Insurance</H3>
            <p className="mt-1 text-base font-medium leading-relaxed text-gray-500">
              Most depots offer a damage waiver for £15–£35/day that caps your liability for
              accidental damage (excluding misuse and consumables like tracks and teeth). If you have
              plant equipment cover under a trade insurance policy, you may be able to decline the
              waiver — check your policy before you go.
            </p>
          </div>
          <div>
            <H3>Deposit</H3>
            <p className="mt-1 text-base font-medium leading-relaxed text-gray-500">
              UK hire companies typically hold a deposit of £250–£600 on a credit or debit card at
              the start of hire. This is released in full when the machine is returned undamaged,
              clean, and fuelled. The deposit does not count as payment — it sits separately from the
              hire charge.
            </p>
          </div>
        </div>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/mini-digger-hire-cost-uk.webp"
        alt="Mini digger at work on a UK residential site — compare hire costs from local suppliers on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Scenarios table */}
      <section>
        <H2>Total Cost Examples: Real Job Scenarios</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Job</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Machine</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Duration</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Hire cost</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Delivery</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Fuel est.</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900 text-brand-primary">Approx total</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerCostScenarios.map(([job, machine, dur, hire, del, fuel, total], i) => (
                <tr key={job} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{job}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{machine}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{dur}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{hire}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{del}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{fuel}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-medium text-gray-400">
          Figures above are illustrative using mid-range market rates. Actual costs vary by location
          and supplier. Compare live quotes on Tooli.uk.
        </p>
      </section>

      <section>
        <H2>How to Keep Mini Digger Hire Costs Down</H2>
        <CheckList items={miniDiggerCostTips} />
        <Link
          to="/blog/tool-hire-comparison-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
          </span>
        </Link>
      </section>

      <section>
        <H2>Regional Price Variation</H2>
        <Prose>
          <p>
            Mini digger hire costs vary across the UK. London and the South East command the highest
            day rates, typically 10–20% above the national average. Rates in the North of England,
            Scotland, and Wales tend to run at or slightly below national averages, though delivery
            distances can add significantly to total cost in rural areas.
          </p>
        </Prose>
        <Link
          to="/blog/mini-digger-hire-london-prices-local-availability"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire London: Prices &amp; Local Availability →
          </span>
        </Link>
      </section>

      <FaqSection faqs={miniDiggerCostFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Mini Digger Hire Costs Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk, pick your machine size and dates, and get quotes from
          local UK suppliers — delivery included in every comparison.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 15 — Do I Need a Licence to Operate a Mini Digger?         */
/* ------------------------------------------------------------------ */

const miniDiggerLicenceCpcsTable: [string, string, string][] = [
  ['A59', '360° Excavator (up to 5t)', 'Standard mini digger'],
  ['A57', '360° Excavator (over 5t)', 'Larger midi and full-size excavators'],
  ['A60', 'Wheeled 360° Excavator', 'Wheeled variant where relevant'],
];

const miniDiggerLicenceCardTable: [string, string, string][] = [
  ['CSCS', 'Site access — proves general health & safety knowledge (CITB test)', 'No — site access only, not operator competence'],
  ['CPCS', 'Plant operator competence — task-tested for specific machine category', 'Yes — on commercial sites where enforced'],
];

const miniDiggerLicenceSummaryTable: [string, string, string][] = [
  ['DIY homeowner, mini digger on private garden', 'No', 'Yes — depot handover at minimum'],
  ["Self-employed tradesperson on a client's domestic property", 'No formal card — but PUWER applies', 'Yes — document your competence'],
  ['Worker on a managed commercial construction site', 'CPCS card (A59 or A57)', 'Full CPCS training and test'],
  ['Operating a machine on or near a public highway', 'CPCS card likely required by site manager', 'Yes — and check traffic management requirements'],
  ['Towing a digger on public roads', 'Valid driving licence + vehicle rated for the trailer weight', 'Specific trailer/towing training advisable'],
];

const miniDiggerLicenceAtAGlance = [
  'Private domestic land: No licence required — but competence is still a legal duty under PUWER',
  'Commercial construction sites: CPCS card required in most cases',
  'Machines under 5 tonnes: Lower requirement threshold — most mini diggers fall here',
  'Machines over 5 tonnes: Formal competence card becomes more consistently enforced',
  'Road haulage: A road-legal driving licence is needed to tow a digger on a low-loader trailer',
];

const miniDiggerLicenceFaqs: Faq[] = [
  [
    'Can I hire a mini digger without a CPCS card?',
    'Yes. Hire depots do not require a CPCS card for private hirers. On private domestic land, you can legally operate a mini digger without any formal card. On commercial sites, your site manager will specify what is required.',
  ],
  [
    'Do I need a licence if the mini digger is under 1 tonne?',
    'No. The same rules apply regardless of machine size: no formal licence is required for private land use. PUWER still requires competence at any size. CPCS A59 covers machines up to 5 tonnes.',
  ],
  [
    'What is the PUWER regulation and does it affect me?',
    'PUWER 1998 (Provision and Use of Work Equipment Regulations) requires that anyone using work equipment is trained and competent to do so safely. It applies on private land as well as commercial sites. Non-compliance can create liability if an accident occurs.',
  ],
  [
    'Can a hire company refuse to let me take a digger without a CPCS card?',
    'Yes — and some do. While not a legal requirement for private hirers, individual hire depots can set their own conditions. Some depots ask for evidence of operator experience for larger machines. This varies by company and machine size.',
  ],
  [
    'Is a CPCS card the same as a CSCS card?',
    'No. A CSCS card proves site health and safety knowledge — it gets you through the gate. A CPCS card proves machine-specific operator competence. They are different schemes. You may need both on a managed commercial site.',
  ],
  [
    'How long does it take to get a CPCS card?',
    'From starting training to holding a card, typically 3–8 weeks. Training takes 2–5 days. The test must be booked separately. If you already have relevant experience, the experienced worker route (red card) may have a shorter path.',
  ],
  [
    'Do I need insurance to hire and operate a mini digger?',
    "Standard public liability insurance should cover domestic DIY use for most hirers, but check your policy. If you're operating commercially, you need specific plant machinery cover. The hire depot's damage waiver covers the machine itself — not third-party liability.",
  ],
];

function MiniDiggerLicenceBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Licence Rules at a Glance</h2>
        <CheckList items={miniDiggerLicenceAtAGlance} />
      </section>

      <Link
        to="/blog/mini-digger-hire-uk-prices-and-sizes-compared"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          Mini Digger Hire UK: Prices &amp; Sizes Compared →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/mini-digger-licence.webp"
        alt="Do you need a licence to operate a mini digger in the UK — CPCS and PUWER explained"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>The Legal Position: PUWER 1998</H2>
        <Prose>
          <p>
            The{' '}
            <a
              href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Provision and Use of Work Equipment Regulations 1998 (PUWER)
            </a>{' '}
            govern how work equipment must be used safely in the UK. Under PUWER Regulation 9,
            operators must have received adequate training in use of the equipment, including training
            in any risks which the use may entail and precautions to take.
          </p>
          <p>
            This applies on private domestic land as well as commercial sites. You don't need a formal
            card — but you do need to be competent. In practice, for a DIY homeowner using a mini
            digger once, asking the hire depot for a brief operational handover is both sensible and
            legally appropriate.
          </p>
        </Prose>
      </section>

      <section>
        <H2>When a CPCS Card Is Required</H2>
        <Prose>
          <p>
            The{' '}
            <a
              href="https://www.cpcs.uk.com/categories"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              CPCS (Construction Plant Competence Scheme)
            </a>{' '}
            card is the industry-standard competence card for plant operators in the UK construction
            sector. You will need it in these situations:
          </p>
          <ul>
            <li>Working on a commercial construction site where the principal contractor enforces CPCS as a site requirement</li>
            <li>Working for a construction company where the employer requires it</li>
            <li>
              Operating plant machinery hired for work covered under{' '}
              <a
                href="https://www.hse.gov.uk/construction/cdm/2015/index.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-primary hover:underline"
              >
                CDM 2015
              </a>
              , where competency records may be audited
            </li>
            <li>Any site where HSE inspectors may review plant operator competence</li>
          </ul>
          <p>
            CPCS has two levels: the blue trained operator card (entry level, task tested) and the
            red experienced worker card (for those with documented experience). Renewal is every 5 years.
          </p>
        </Prose>
      </section>

      <section>
        <H2>What Is the CPCS Card for a Mini Digger?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">CPCS Category</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Machine type</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Applicable to</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerLicenceCpcsTable.map(([cat, type, applies], i) => (
                <tr key={cat} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-brand-primary">{cat}</td>
                  <td className="px-5 py-3 font-bold text-gray-700">{type}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{applies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <H2>What About CSCS Cards?</H2>
        <Prose>
          <p>CSCS and CPCS are frequently confused. They are different things:</p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Card</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Purpose</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Required for mini digger operation?</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerLicenceCardTable.map(([card, purpose, req], i) => (
                <tr key={card} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-brand-primary">{card}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{purpose}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{req}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm font-medium text-gray-500">
          A CSCS card gets you through the site gate. A CPCS card proves you can operate the machine.
          You may need both on a managed commercial site.
        </p>
        <Link
          to="/blog/tool-hire-comparison-uk"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Tool Hire Comparison UK: Compare Construction Equipment and Plant Hire Suppliers →
          </span>
        </Link>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/mini-digger-hire-cost-uk.webp"
        alt="Mini digger operator on a UK construction site — CPCS card requirements and PUWER duties explained"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Summary: What Applies to You?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Your situation</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Licence / card required?</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Training recommended?</th>
              </tr>
            </thead>
            <tbody>
              {miniDiggerLicenceSummaryTable.map(([situation, card, training], i) => (
                <tr key={situation} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{situation}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{card}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{training}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <H2>How to Get a CPCS Card</H2>
        <Prose>
          <p>To get a CPCS trained operator card for a 360° excavator (mini digger):</p>
          <ul>
            <li>Complete an accredited CPCS training course covering the specific machine category (A59 for under 5t, A57 for over 5t)</li>
            <li>Pass the CPCS technical test (machine operation, safety checks, controlled exercises)</li>
            <li>Pass the CITB Health, Safety &amp; Environment test if you don't already hold a valid CSCS card</li>
            <li>Apply for your CPCS card through an approved CPCS test centre</li>
          </ul>
          <p>
            Courses typically take 2–5 days depending on prior experience. Costs vary but budget
            £800–£1,500 for training and testing combined. Find approved training providers through{' '}
            <a
              href="https://www.cpcs.uk.com/categories"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              CPCS at cpcs.uk.com
            </a>
            .
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/mini-digger-hire-cost-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-cost-uk-2026-price-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Cost UK: What You'll Pay in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-save-money"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-birmingham-prices-and-local-availability"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Birmingham: Prices &amp; Local Availability →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={miniDiggerLicenceFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Ready to Hire a Mini Digger?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Compare mini digger hire quotes from local UK suppliers on Tooli.uk. Enter your postcode,
          pick your size and dates, and see every price — delivery included.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 16 — Mini Digger: Buy or Hire? Full UK Cost Comparison     */
/* ------------------------------------------------------------------ */

const buyOrHirePurchaseTable: [string, string, string, string][] = [
  ['0.8t Micro Digger', '£15,000–£30,000', '£5,000–£12,000', 'Kubota, JCB 8008, Takeuchi TB108'],
  ['1.5t Mini Digger', '£25,000–£45,000', '£12,000–£25,000', 'JCB 15C, Kubota KX016, Bobcat E17'],
  ['3.0t Mini Digger', '£40,000–£70,000', '£18,000–£35,000', 'JCB 30, Kubota KX030, Takeuchi TB230'],
  ['5.0t Midi Digger', '£60,000–£100,000', '£25,000–£55,000', 'JCB 50Z, Doosan DX55, Volvo EC55'],
];

const buyOrHireOwnershipCosts: [string, string, string][] = [
  ['Insurance (plant all-risks)', '£800–£2,000/yr', 'Varies by use, claims history, value'],
  ['Annual service', '£400–£800/yr', 'Dealer or independent engineer'],
  ['Parts & repairs (average)', '£300–£600/yr', 'Track replacement alone is £1,200–£2,500'],
  ['Storage (if rented space)', '£600–£1,800/yr', 'Or security cost on own land'],
  ['Trailer for transport', '£3,000–£8,000 (one-off)', 'Plus tow vehicle rated to the load'],
  ['Depreciation', '£1,500–£4,000/yr', 'Roughly 10–15% on used machinery'],
  ['TOTAL annual ownership cost', '~£3,600–£9,200/yr', 'Excluding purchase price repayments'],
];

const buyOrHireBreakEven: [string, string, string, string][] = [
  ['1–5 days', '£200–£1,000', '~£6,000', 'Hire — no contest'],
  ['6–15 days', '£1,200–£3,000', '~£6,000', 'Hire — still clearly cheaper'],
  ['16–30 days', '£3,200–£6,000', '~£6,000', 'Hire — roughly equal once extras counted'],
  ['30–60 days', '£6,000–£12,000', '~£6,000 + capital cost', 'Marginal — depends on capital position'],
  ['60+ days', '£12,000+', '~£6,000 + capital cost', 'Buying may make sense — model your numbers'],
];

const buyOrHireProsConsRows: [string, string, string][] = [
  ['Upfront cost', 'Low — day rate only', 'High — £12k–£60k+'],
  ['Flexibility', 'Hire any size for any job', 'Locked into one machine'],
  ['Maintenance', 'Not your problem', 'Your responsibility, your cost'],
  ['Storage', 'Not required', 'Secure storage needed'],
  ['Insurance', 'Usually covered by depot', 'Your own policy needed'],
  ['Breakdown', 'Depot replaces machine', "You're off work until fixed"],
  ['Resale value', 'N/A', 'Depreciates 10–15%/year'],
  ['Best for', 'Occasional and varied use', 'Heavy, consistent, single-size use'],
];

const buyOrHireFaqs: Faq[] = [
  [
    'Is it worth buying a second-hand mini digger?',
    'Potentially, if you use a digger more than 40–60 days per year and have the infrastructure for storage and servicing. A well-maintained used 1.5-tonne machine from a reputable dealer costs £12,000–£25,000. Get a full service history and pre-purchase inspection from an independent engineer before committing.',
  ],
  [
    'What are the ongoing costs of owning a mini digger?',
    'Budget for annual insurance (£800–£2,000), annual service (£400–£800), repairs (£300–£600 average but unpredictable), and storage. Depreciation runs at roughly 10–15% per year on used machinery. Total annual ownership cost for a 1.5-tonne machine is typically £3,600–£9,200 before purchase costs.',
  ],
  [
    'Can I hire my own mini digger out to recover costs?',
    "Yes — but this turns you into a plant hire company with associated insurance, liability, and legal obligations. You'll need specialist hire-fleet insurance (not standard plant all-risks), potentially VAT registration, and terms of hire. Consult a specialist trade insurer before going down this route.",
  ],
  [
    'What finance options are available for buying a mini digger?',
    'Hire purchase, finance lease, and operating lease are all widely available through plant finance specialists. Most require a deposit of 10–20% and spread payments over 3–5 years. Interest rates vary considerably — compare at least 3 plant finance providers before committing.',
  ],
  [
    'Does buying a mini digger make sense for a sole trader landscaper?',
    "Rarely below 40–50 digger days per year. At lower usage, the flexibility to hire different sizes for different jobs is worth more than the cost saving. Many landscapers find hiring better suits their varied site access requirements (tight gardens vs open groundworks).",
  ],
];

function MiniDiggerBuyOrHireBody() {
  return (
    <>
      {/* Quick Verdict box */}
      <section className="rounded-2xl border-2 border-brand-primary/30 bg-brand-primary/5 p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Quick Verdict</h2>
        <div className="space-y-3 text-sm font-medium leading-relaxed text-gray-700">
          <p>
            <span className="font-extrabold text-brand-primary">Hire if:</span> You need a mini
            digger fewer than 8–12 times per year. Almost every homeowner and most tradespeople fall
            into this category.
          </p>
          <p>
            <span className="font-extrabold text-[#030213]">Buy if:</span> You use a mini digger
            more than 12 days per year, have secure storage, can handle servicing and insurance, and
            won't need a range of sizes for different jobs.
          </p>
          <p className="rounded-xl bg-white px-4 py-3 text-xs text-gray-500">
            <span className="font-extrabold text-gray-700">The maths:</span> A second-hand 1.5-tonne
            mini digger costs £12,000–£25,000. At £200/day hire equivalent, that's 60–125 hire-days
            to break even before you factor in insurance, maintenance, storage and depreciation.
          </p>
        </div>
      </section>

      <Link
        to="/blog/mini-digger-hire-uk-prices-and-sizes-compared"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          Mini Digger Hire UK: Prices &amp; Sizes Compared →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/mini-digger-cost-comparison.webp"
        alt="Mini digger buy vs hire cost comparison UK — breakeven analysis for homeowners and tradespeople"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Purchase price table */}
      <section>
        <H2>The Cost to Buy a Mini Digger in the UK</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Machine size</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">New price (approx.)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Used price (5–10 yr old)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Key brands</th>
              </tr>
            </thead>
            <tbody>
              {buyOrHirePurchaseTable.map(([size, newPrice, usedPrice, brands], i) => (
                <tr key={size} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{size}</td>
                  <td className="px-4 py-3 font-bold text-gray-700">{newPrice}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{usedPrice}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{brands}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Hidden costs table */}
      <section>
        <H2>The Hidden Costs of Owning a Mini Digger</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Cost</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Annual estimate (1.5t machine)</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {buyOrHireOwnershipCosts.map(([cost, est, notes], i) => {
                const isTotal = cost.startsWith('TOTAL');
                return (
                  <tr key={cost} className={`border-b border-gray-50 ${isTotal ? 'bg-[#F8F9FC] font-extrabold' : i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                    <td className={`px-5 py-3 ${isTotal ? 'font-extrabold text-gray-900' : 'font-bold text-gray-700'}`}>{cost}</td>
                    <td className={`px-5 py-3 ${isTotal ? 'font-extrabold text-brand-primary' : 'font-bold text-brand-primary'}`}>{est}</td>
                    <td className="px-5 py-3 font-medium text-gray-500">{notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Link
          to="/blog/mini-digger-hire-cost-uk-2026-price-guide"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: What You'll Pay in 2026 →
          </span>
        </Link>
      </section>

      {/* Break-even table */}
      <section>
        <H2>Break-Even Comparison: Buy vs Hire</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Hire days/year</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Annual hire cost (1.5t @£200/day)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Annual ownership cost (mid est.)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {buyOrHireBreakEven.map(([days, hireCost, ownCost, verdict], i) => (
                <tr key={days} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{days}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{hireCost}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{ownCost}</td>
                  <td className={`px-4 py-3 font-bold ${verdict.startsWith('Hire') ? 'text-brand-primary' : 'text-gray-700'}`}>{verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-medium text-gray-400">
          Ownership cost above excludes the purchase price itself and any finance costs. Add loan
          repayments or the opportunity cost of capital tied up in the machine to your annual tally.
        </p>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/mini-digger-hire-cost-uk.webp"
        alt="Mini digger on a UK residential site — hire vs buy cost analysis on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Scenarios */}
      <section>
        <H2>Scenarios: Who Should Buy, Who Should Hire?</H2>
        <div className="space-y-6">
          {[
            {
              title: 'Weekend DIY Homeowner',
              body: "You need a digger 1–3 times a year for garden projects, a pond, or landscaping. Hire every time. Owning makes no financial sense at this usage level, and storage and transport add complications you don't need.",
              verdict: 'hire',
            },
            {
              title: 'Small Landscaping Business (solo trader)',
              body: "You're on site 120–150 days a year but not always using a digger — maybe 20–40 digger days annually. Hire is still very likely the right answer. The flexibility to hire different sizes for different jobs (0.8t for tight access, 3t for groundworks) is worth more than the savings from owning a single machine.",
              verdict: 'hire',
            },
            {
              title: 'Groundworks Contractor (2–4 person operation)',
              body: "If your team uses a 3-tonne digger 60+ days a year, the financial case for ownership starts to stack up — but only if you have secure storage, a low-loader trailer already in your fleet, and the capacity to manage servicing. Many groundworkers still choose long-term hire or contract hire at this scale for flexibility.",
              verdict: 'marginal',
            },
            {
              title: 'Small Building Firm (4–10 staff)',
              body: "At this scale, plant ownership for frequently-used machines can make sense. However, most firms at this level use a mix: own their most-used size, hire everything else. The admin and insurance overhead of a full owned fleet is significant.",
              verdict: 'mixed',
            },
          ].map(({ title, body, verdict }) => (
            <div key={title} className="rounded-xl border border-gray-100 bg-[#F8F9FC]/60 p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${verdict === 'hire' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-gray-200 text-gray-600'}`}>
                  {verdict === 'hire' ? 'Hire' : verdict === 'marginal' ? 'Marginal' : 'Mixed'}
                </span>
                <H3>{title}</H3>
              </div>
              <p className="text-sm font-medium leading-relaxed text-gray-500">{body}</p>
            </div>
          ))}
        </div>
        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money — And How To Do It Properly →
          </span>
        </Link>
      </section>

      {/* Pros/cons table */}
      <section>
        <H2>Hire vs Buy: Pros &amp; Cons Summary</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900"> </th>
                <th className="px-5 py-3 text-left font-extrabold text-brand-primary">Hire</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Buy</th>
              </tr>
            </thead>
            <tbody>
              {buyOrHireProsConsRows.map(([label, hire, buy], i) => (
                <tr key={label} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{label}</td>
                  <td className="px-5 py-3 font-medium text-gray-600">{hire}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{buy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          to="/blog/do-i-need-licence-to-operate-mini-digger"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Do I Need a Licence to Operate a Mini Digger? The Honest Answer →
          </span>
        </Link>
      </section>

      <FaqSection faqs={buyOrHireFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Not Ready to Buy? Compare Hire Prices Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk, pick your machine size and dates, and compare quotes from
          local UK suppliers — no commitment, no phone-round.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 17 — Mini Digger Attachments Explained                     */
/* ------------------------------------------------------------------ */

const attachmentsAtAGlance = [
  'General-purpose bucket: standard for most soil digging and loading',
  'Hydraulic breaker: breaking up concrete, block paving, or hard ground',
  'Ditching bucket: wide, shallow — perfect for drainage trenches and French drains',
  'Auger: boring circular holes for fence posts, tree planting, foundations',
  'Grubbing bucket: ripping out tree stumps and roots',
  'Grab/clamshell: picking up loose material without digging',
  'Tiltrotator/tilting hitch: rotates and tilts the attachment for precision work',
];

const gpBucketUses: [string, string][] = [
  ['General soil excavation', 'Yes — primary use'],
  ['Loading spoil into a skip or dumper', 'Yes'],
  ['Digging narrow trenches', 'Possible — a narrower bucket is better'],
  ['Grading and levelling', 'Possible — a grading bucket is better'],
  ['Breaking concrete or rock', 'No — use a hydraulic breaker'],
];

const breakerUses: [string, string][] = [
  ['Breaking up concrete slabs or paths', 'Yes — primary use'],
  ['Breaking tarmac / asphalt', 'Yes'],
  ['Breaking up hard clay or shale', 'Yes'],
  ['Rock breaking (light to medium)', 'Yes — check with depot for rock class'],
  ['Demolishing masonry', 'Yes — with care and appropriate machine weight'],
];

const ditchingBucketUses: [string, string][] = [
  ['French drain / land drainage trenching', 'Yes — purpose-built for this'],
  ['Ditch cleaning and maintenance', 'Yes'],
  ['Slope grading and profiling', 'Yes'],
  ['Clearing topsoil over a wide area', 'Yes — faster than GP bucket'],
  ['Narrow trench digging', 'No — too wide'],
];

const augerUses: [string, string][] = [
  ['Fence post holes (timber and metal)', 'Yes — primary use'],
  ['Tree and shrub planting', 'Yes'],
  ['Ground anchor installation', 'Yes'],
  ['Pile holes (shallow foundations)', 'Yes — subject to ground conditions'],
  ['Rocky or rubble ground', 'No — consult hire depot'],
];

const attachmentQuestions = [
  'Is the attachment already fitted, or does it need to be pinned on and set up?',
  'Does the machine have a quick hitch, or does swapping attachments require manual pins?',
  "Is the breaker size matched to this specific machine's hydraulic flow rate?",
  'Does the auger motor need separate setup, and is it included in the hire rate?',
  'What is your liability if an attachment is damaged during hire?',
];

const attachmentsFaqs: Faq[] = [
  [
    'Do mini digger attachments come included in the hire rate?',
    'No. Attachments are almost always charged separately as additional daily hire costs on top of the machine rate. The only exception is the standard general-purpose bucket, which comes fitted as standard on hire machines.',
  ],
  [
    'Can I use any brand of attachment on a hire digger?',
    "You cannot bring your own attachment and simply fit it — attachments must be matched to the machine's pin specification, hydraulic flow rate (for powered attachments), and operating weight. Using a mismatched attachment can damage the machine and creates liability. Use the depot's matched attachments.",
  ],
  [
    'How loud is a hydraulic breaker on a mini digger?',
    'Hydraulic breakers on mini diggers typically generate 95–110 dB at the operator. Under the Control of Noise at Work Regulations 2005, the upper action level is 87 dB LEP,d. Hearing protection is mandatory for prolonged use. Neighbours should be given notice before extended breaking work.',
  ],
  [
    'What size auger do I need for fence posts?',
    'For standard 100 mm square timber fence posts, a 150–200 mm diameter auger is typical. For larger posts (125–150 mm), a 200–250 mm auger gives adequate clearance for post setting. Confirm the post dimensions you\'re using before specifying an auger diameter.',
  ],
  [
    'Can you use a hydraulic breaker on a 0.8-tonne micro digger?',
    'Only with a breaker specifically sized for a micro machine. A standard breaker designed for a 1.5t+ machine would exceed the hydraulic output and structural capacity of a 0.8t digger. Always confirm with the depot which breaker models are approved for the specific machine you\'re hiring.',
  ],
];

function AttachmentUseTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-[#F8F9FC]">
            <th className="px-5 py-2.5 text-left font-extrabold text-gray-900">Use</th>
            <th className="px-5 py-2.5 text-left font-extrabold text-gray-900">Suitable?</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([use, suitable], i) => (
            <tr key={use} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
              <td className="px-5 py-2.5 font-medium text-gray-700">{use}</td>
              <td className={`px-5 py-2.5 font-bold ${suitable.startsWith('Yes') ? 'text-brand-primary' : suitable.startsWith('No') ? 'text-red-500' : 'text-gray-500'}`}>
                {suitable}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniDiggerAttachmentsBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={attachmentsAtAGlance} />
      </section>

      <Link
        to="/blog/mini-digger-hire-uk-prices-and-sizes-compared"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          Mini Digger Hire UK: Prices &amp; Sizes Compared →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/mini-digger-attachments-explained.webp"
        alt="Mini digger attachments explained — buckets, breakers, augers and grabs for UK hirers"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Attachment reference sections */}
      <section>
        <H2>1. General-Purpose Bucket (GP Bucket)</H2>
        <Prose>
          <p>
            The standard bucket on virtually every hire machine. Curved, medium-width — good for
            digging and loading loose material. Width ranges from 300 mm to 600 mm depending on
            machine size.
          </p>
        </Prose>
        <AttachmentUseTable rows={gpBucketUses} />
      </section>

      <section>
        <H2>2. Hydraulic Breaker (Demolition Breaker)</H2>
        <Prose>
          <p>
            Replaces the bucket to deliver rapid hammer blows for breaking concrete, block paving,
            tarmac, hard clay, or rock. Runs off the machine's hydraulic circuit. The most commonly
            hired attachment after the standard bucket.
          </p>
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <strong>Important:</strong> Check the digger's hydraulic flow spec before hiring a breaker
            attachment. An underpowered machine with a too-large breaker will damage the hydraulic
            system. The hire depot should match the breaker size to the machine for you.
          </p>
        </Prose>
        <AttachmentUseTable rows={breakerUses} />
        <p className="mt-3 text-sm font-medium text-gray-500">
          <strong>Noise note:</strong> Breaker attachments are among the loudest site activities.{' '}
          <a
            href="https://www.hse.gov.uk/noise/regulations.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-primary hover:underline"
          >
            HSE Control of Noise at Work Regulations 2005
          </a>{' '}
          set daily exposure limits (80 dB action level / 87 dB limit). Hearing protection is
          mandatory for extended use.
        </p>
        <Link
          to="/blog/mini-digger-hire-cost-uk-2026-price-guide"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: What You'll Pay in 2026 →
          </span>
        </Link>
      </section>

      <section>
        <H2>3. Ditching Bucket (Grading / Cleanup Bucket)</H2>
        <Prose>
          <p>
            Wider and shallower than a GP bucket, with a flat base. Designed for cutting drainage
            channels, cleaning out ditches, grading slopes, and levelling ground. Widths typically
            run 600 mm to 1,800 mm on mini digger spec.
          </p>
        </Prose>
        <AttachmentUseTable rows={ditchingBucketUses} />
      </section>

      <section>
        <H2>4. Auger</H2>
        <Prose>
          <p>
            A spiral boring tool that drills clean round holes into the ground. Driven by the
            machine's hydraulic motor. Common diameters range from 150 mm to 600 mm. Ideal for fence
            posts, tree planting, piling, and ground anchor installation.
          </p>
          <p>
            <strong>Ground conditions:</strong> Augers work well in loose to medium soil. Rocky,
            clay-heavy, or rubble-filled ground will slow or stop an auger. Always check ground
            conditions before specifying an auger over a bucket for excavation.
          </p>
        </Prose>
        <AttachmentUseTable rows={augerUses} />
      </section>

      <section>
        <H2>5. Grubbing / Tree Root Bucket</H2>
        <Prose>
          <p>
            A specialist bucket with open tines or side cutters designed to rip through root systems
            and break up compacted ground. Used for tree stump removal, root clearing, and breaking
            into hard, compacted soil where a standard bucket would bounce off the surface.
          </p>
        </Prose>
      </section>

      <section>
        <H2>6. Grab / Clamshell Attachment</H2>
        <Prose>
          <p>
            A clamping jaw attachment that grabs loose material without digging — useful for clearing
            demolition rubble, picking up loose stone, or handling material in areas where digging
            isn't needed. Works well alongside a standard bucket workflow.
          </p>
        </Prose>
      </section>

      <section>
        <H2>7. Ripper Tooth / Single Tine</H2>
        <Prose>
          <p>
            A single heavy tine for piercing and breaking up compacted ground, tarmac edges, or
            shallow rock before excavation. Faster than a breaker for light breaking work, quieter,
            and lower maintenance.
          </p>
        </Prose>
      </section>

      <section>
        <H2>8. Quick Hitch</H2>
        <Prose>
          <p>
            Not a working attachment itself — a quick-hitch coupler allows attachments to be swapped
            over in seconds without manual pinning. If you plan to use more than one attachment on a
            job, ask the depot whether the machine has a quick hitch fitted. It will save you
            significant time on site.
          </p>
        </Prose>
        <Link
          to="/blog/do-i-need-licence-to-operate-mini-digger"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Do I Need a Licence to Operate a Mini Digger? The Honest Answer →
          </span>
        </Link>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/mini-digger-hire-cost-uk.webp"
        alt="Mini digger with hydraulic breaker attachment on a UK construction site"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Attachment Hire Costs</H2>
        <Prose>
          <p>
            Attachment day rates are set independently by each hire depot and vary by machine size,
            attachment type, and location. The table below shows common attachment categories —
            compare current rates from suppliers delivering to your postcode on Tooli.uk.
          </p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Attachment</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Hydraulic Breaker', 'Size matched to machine — confirm with depot'],
                ['Ditching Bucket', 'Width options available — specify job requirement'],
                ['Auger + motor', 'Various diameters — specify hole size needed'],
                ['Grubbing Bucket', 'May not be available at all depots'],
                ['Grab / Clamshell', 'Less commonly stocked — book ahead'],
              ].map(([att, notes], i) => (
                <tr key={att} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{att}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm font-medium text-gray-500">
          Rates vary by supplier. Compare attachment hire costs from local depots on Tooli.uk when
          you search for your machine.
        </p>
      </section>

      <section>
        <H2>Questions to Ask Your Hire Depot About Attachments</H2>
        <ul className="space-y-3">
          {attachmentQuestions.map((q) => (
            <li key={q} className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
              <span className="text-base font-medium leading-relaxed text-gray-600">{q}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/mini-digger-buy-or-hire-full-uk-cost-comparison"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger: Buy or Hire? Full UK Cost Comparison →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-cost-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-london-prices-local-availability"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire London: Prices &amp; Local Availability →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-save-money"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              How Tool Hire Comparison Actually Saves Your Money →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={attachmentsFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Mini Digger Hire With Attachments</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk, choose your machine size and dates, and compare quotes
          from local suppliers — attachments, delivery and all.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 18 — 1.5 Tonne vs 3 Tonne Digger                          */
/* ------------------------------------------------------------------ */

const vs15v3SpecTable: [string, string, string][] = [
  ['Operating weight', '1,400–1,700 kg', '2,800–3,200 kg'],
  ['Max dig depth', '2.2–2.6 m', '3.0–3.8 m'],
  ['Max reach (arm extended)', '3.8–4.5 m', '5.0–6.0 m'],
  ['Standard bucket capacity', '0.03–0.05 m³', '0.07–0.12 m³'],
  ['Bucket width (standard GP)', '400–600 mm', '450–700 mm'],
  ['Transport width', '990–1,200 mm', '1,300–1,550 mm'],
  ['Typical gate clearance needed', '~1,000–1,200 mm', '~1,350–1,600 mm'],
  ['Typical hire rate / day', '£160–£230', '£220–£320'],
  ['Typical hire rate / week', '£500–£700', '£680–£950'],
  ['Delivery on low-loader', 'Standard trailer', 'Standard or flatbed trailer'],
];

const vs15v3JobTable: [string, string, string, string][] = [
  ['Garden clearance, topsoil removal', '✓', 'Both work', '1.5t is sufficient unless large volume'],
  ['Patio/driveway base preparation', '✓', 'Better for depth >250 mm', '3t if going deeper than a standard sub-base'],
  ['Pond digging (up to 1.5 m deep)', '✓', 'Overkill', '1.5t is the right tool'],
  ['Trench for drainage pipes (<30 m run)', '✓', 'Either works', '1.5t is efficient for standard depth trenches'],
  ['Trench for drainage pipes (>30 m run)', 'Works', '✓', '3t moves spoil faster over longer distances'],
  ['Foundation digging (single-storey extension)', 'Borderline', '✓', 'Foundation depth usually needs 3t reach'],
  ['Foundation digging (two-storey or basement)', 'No', '✓ or larger', 'May need 5t+ — consult structural engineer'],
  ['Tree stump removal', '✓', 'Either works', '1.5t fine for most residential stumps'],
  ['Large tree stump / root ball', 'Struggles', '✓', 'Weight and torque matter for big root balls'],
  ['Site levelling / cut-and-fill', 'Small areas', '✓', '3t bucket capacity reduces cycles significantly'],
  ['Demolition work with breaker', 'Light duty', '✓', '3t handles breaker attachments more efficiently'],
  ['Tight access (narrow gate or passageway)', '✓', 'May not fit', 'Measure gate width before booking 3t'],
];

const vs15v3ProductivityTable: [string, string, string, string][] = [
  ['10 m³ (small trench or patio prep)', '1 day', '0.5 day', '3t may be cheaper total'],
  ['25 m³ (medium garden job)', '2–3 days', '1–1.5 days', '3t likely cheaper total'],
  ['50 m³ (large landscaping project)', '4–5 days', '2–3 days', '3t significantly cheaper total'],
  ['100 m³+ (groundworks/foundation)', 'Not suitable', '4–6 days', '3t or larger required'],
];

const vs15v3Faqs: Faq[] = [
  [
    'Is the 1.5-tonne digger powerful enough to break up concrete?',
    'Not without a hydraulic breaker attachment. With a matched breaker fitted, a 1.5-tonne machine can break up concrete slabs, light block paving, and brick. For heavy reinforced concrete or significant volumes, the 3-tonne with a larger breaker is faster and better suited.',
  ],
  [
    'What is the maximum trench depth a 1.5-tonne digger can reach?',
    'The maximum dig depth on a 1.5-tonne mini digger is typically 2.2–2.6 metres, varying by model. This is sufficient for most residential drainage (which rarely exceeds 1.5 metres) and single-storey extension strip foundations (typically 700–1,000 mm).',
  ],
  [
    'Can a 1.5-tonne digger fit through a standard side gate?',
    'Usually yes — but measure first. Most 1.5-tonne mini diggers have a transport width of 990–1,200 mm. A standard timber garden gate opening is typically 900–1,000 mm, which may be too narrow. If the gate is under 1,000 mm, consider a micro digger (0.8t, ~750–850 mm wide).',
  ],
  [
    'Is it worth paying the extra £80/day for the 3-tonne machine?',
    "Often yes — particularly on jobs involving more than 20 cubic metres of material, foundation work, or deep trenching. The 3t's larger bucket capacity and deeper reach frequently offset the extra daily rate by completing the job in fewer days.",
  ],
  [
    "What is the 3-tonne digger's main advantage over the 1.5-tonne?",
    'Three things: deeper dig depth (3.0–3.8 m vs 2.2–2.6 m), larger bucket capacity (roughly double), and greater stability and power for breaker work. These matter for foundation digging, drainage at depth, and large-volume material movement.',
  ],
];

function Digger15v3Body() {
  return (
    <>
      {/* Quick Verdict */}
      <section className="rounded-2xl border-2 border-brand-primary/30 bg-brand-primary/5 p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Quick Verdict</h2>
        <div className="space-y-3 text-sm font-medium leading-relaxed text-gray-700">
          <p>
            <span className="font-extrabold text-brand-primary">1.5t:</span> Best for most
            residential garden and landscaping jobs. Standard choice for patio prep, light trenching,
            pond digging, and garden clearance. Fits through a standard side gate.
          </p>
          <p>
            <span className="font-extrabold text-[#030213]">3t:</span> Step up when dig depth
            exceeds 2.3 metres, you're doing foundation work, drainage runs exceed 30 metres, or
            you're shifting large volumes of material quickly.
          </p>
          <p className="rounded-xl bg-white px-4 py-3 text-xs text-gray-500">
            <span className="font-extrabold text-gray-700">Rule of thumb:</span> If you're unsure
            and the site has reasonable access, hire the 3t. The additional cost per day (roughly
            £60–£90 more) is usually less than an extra hire day caused by underpowering the job.
          </p>
        </div>
      </section>

      <Link
        to="/blog/mini-digger-hire-uk-prices-and-sizes-compared"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">
          Mini Digger Hire UK: Prices &amp; Sizes Compared →
        </span>
      </Link>

      {/* Hero image */}
      <img
        src="/images/blog/1-5-tonne-vs-3-tonne-digger.webp"
        alt="1.5 tonne vs 3 tonne digger comparison — which mini digger should you hire for your UK job?"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Spec comparison table */}
      <section>
        <H2>Side-by-Side Comparison</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Spec</th>
                <th className="px-5 py-3 text-left font-extrabold text-brand-primary">1.5 Tonne Digger</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">3 Tonne Digger</th>
              </tr>
            </thead>
            <tbody>
              {vs15v3SpecTable.map(([spec, t15, t3], i) => (
                <tr key={spec} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{spec}</td>
                  <td className="px-5 py-3 font-medium text-brand-primary">{t15}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{t3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Job-by-job table */}
      <section>
        <H2>Job-by-Job Decision Guide</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Job type</th>
                <th className="px-4 py-3 text-center font-extrabold text-brand-primary">1.5t</th>
                <th className="px-4 py-3 text-center font-extrabold text-gray-900">3t</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {vs15v3JobTable.map(([job, t15, t3, notes], i) => (
                <tr key={job} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{job}</td>
                  <td className={`px-4 py-3 text-center font-bold ${t15 === '✓' ? 'text-brand-primary' : t15 === 'No' ? 'text-red-500' : 'text-gray-400'}`}>{t15}</td>
                  <td className={`px-4 py-3 text-center font-bold ${t3.startsWith('✓') ? 'text-gray-900' : t3 === 'Overkill' || t3 === 'Either works' ? 'text-gray-400' : 'text-gray-500'}`}>{t3}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          to="/blog/mini-digger-attachments-explained-which-one-do-you-need"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Attachments Explained: Which One Do You Need? →
          </span>
        </Link>
      </section>

      <section>
        <H2>Access: The Factor That Often Decides It</H2>
        <Prose>
          <p>
            If the work site has a gate narrower than 1,350 mm clear width, the 3-tonne machine
            won't fit. A 1.5-tonne machine typically needs 1,000–1,200 mm. A micro digger (0.8t)
            needs 750–850 mm.
          </p>
          <p>
            Measure your access before booking. Not the gate opening — the narrowest point along the
            route, including any overhanging structures, bins, or fencing that reduces effective
            width.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Dig Depth: When the 3-Tonne Becomes Necessary</H2>
        <Prose>
          <p>
            Most residential patios, paths, and garden clearance jobs require excavation to
            200–400 mm depth. A 1.5-tonne machine handles all of that comfortably.
          </p>
          <p>
            When you need to go below 600 mm consistently — drainage, foundation trenches, or land
            drainage at depth — the 1.5t's maximum dig depth of 2.2–2.6 metres starts to feel
            limiting. At 3 metres and beyond, the 3-tonne machine's 3.0–3.8 m dig depth becomes
            important.
          </p>
        </Prose>
        <Link
          to="/blog/mini-digger-hire-cost-uk-2026-price-guide"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Mini Digger Hire Cost UK: What You'll Pay in 2026 →
          </span>
        </Link>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/mini-digger-hire-cost-uk.webp"
        alt="Mini digger on a UK residential site — compare 1.5t and 3t hire prices on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Productivity table */}
      <section>
        <H2>Speed and Productivity</H2>
        <Prose>
          <p>
            The 3-tonne machine's larger bucket (roughly 2× the capacity of a 1.5t) means fewer
            cycles per cubic metre of material moved. On a large job, this translates directly to
            time saved.
          </p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Volume of material</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">1.5t (days est.)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">3t (days est.)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Cost difference @mid-rate</th>
              </tr>
            </thead>
            <tbody>
              {vs15v3ProductivityTable.map(([vol, t15, t3, diff], i) => (
                <tr key={vol} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{vol}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{t15}</td>
                  <td className="px-4 py-3 font-medium text-gray-500">{t3}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/do-i-need-licence-to-operate-mini-digger"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Do I Need a Licence to Operate a Mini Digger? →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-buy-or-hire-full-uk-cost-comparison"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger: Buy or Hire? Full UK Cost Comparison →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-cost-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Cost UK: How To Compare Prices And Avoid Overpaying in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-london-prices-local-availability"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire London: Prices &amp; Local Availability →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={vs15v3Faqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare 1.5t and 3t Digger Hire Prices Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk, select your machine size and dates, and compare quotes
          from local UK suppliers — delivery included in every result.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 19 — How to Hire a Mini Digger Without a CPCS Card         */
/* ------------------------------------------------------------------ */

const cpcsCollectionTable: [string, string, string][] = [
  ['Photo ID (driving licence or passport)', 'Identity verification', 'Accepted at all depots'],
  ['Proof of address', 'Secondary ID check', 'Not always required — call ahead to confirm'],
  ['Payment card (credit or debit)', 'Deposit + hire charge', 'Deposit typically £250–£600 held separately'],
  ['Vehicle and trailer if self-collecting', 'Machine transport', 'Depot will supervise loading'],
];

const cpcsRequirementTable: [string, string][] = [
  ['Private domestic project on your own land', 'No'],
  ['Residential project for a client (self-employed tradesperson)', 'Not legally required, but check your liability insurance'],
  ['Commercial site with a principal contractor', 'Yes — most will require it'],
  ['Site operating under CDM 2015 with a principal designer', 'Yes — competence records may be checked'],
  ['Operator hired alongside machine from depot', 'Yes — depot-supplied operators will hold CPCS'],
];

const cpcsFaqs: Faq[] = [
  [
    'Do I need a CPCS card to hire a mini digger in the UK?',
    'No — not for private domestic use. Hire depots do not legally require a CPCS card from private hirers on residential projects. You will need photo ID, a deposit, and to demonstrate basic operational competence. On commercial sites, your site manager will specify CPCS requirements.',
  ],
  [
    'What ID do I need to hire a mini digger?',
    'At minimum, a valid photo ID (driving licence or passport). Some depots also ask for proof of address (utility bill or bank statement within 3 months). Call the depot ahead of collection to confirm their specific requirements so you don\'t arrive unprepared.',
  ],
  [
    'Can a hire depot refuse to let me take a digger without a CPCS card?',
    'Yes. Hire companies can set their own conditions of hire. Some depots decline private hirers for larger machines, particularly if they have doubts about the hirer\'s competence. This is a commercial decision — if declined, compare alternative suppliers on Tooli.uk.',
  ],
  [
    'What happens if I damage the digger during hire?',
    'You are liable for damage caused by misuse, negligence, or operator error. If you took out the depot\'s damage waiver, your liability may be capped (subject to terms). The deposit held on your card may be retained in part or full to cover damage. Always photograph the machine on collection and return.',
  ],
  [
    'Is PUWER relevant when I\'m just digging my own garden?',
    'Yes. PUWER 1998 (Provision and Use of Work Equipment Regulations) applies wherever work equipment is in use, including private domestic projects. It requires that anyone using work equipment is competent to do so safely. Non-compliance creates personal liability if an accident occurs.',
  ],
  [
    'Can I hire a digger and pay someone else to operate it?',
    'Yes — you can hire the machine and arrange your own operator. However, any operator you use during your hire period becomes your responsibility for PUWER compliance purposes. Ensure they are competent and, for commercial sites, CPCS-carded.',
  ],
  [
    'What is Line Search Before U Dig, and do I need to use it?',
    'Line Search Before U Dig (LSBUD) is the UK\'s free service for checking the location of buried utility services before excavation. It is not a legal requirement for private land, but it is strongly advised — hitting a buried gas pipe or electrical cable is a life-safety risk. Register at lsbud.co.uk and run a search before any digging.',
  ],
];

function CpcsHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">
          What You Need to Hire Without a CPCS Card
        </h2>
        <CheckList
          items={[
            'Valid photo ID: driving licence or passport',
            'Proof of address: utility bill or bank statement dated within the last 3 months (not all depots require this)',
            'A credit or debit card for the deposit (typically £250–£600)',
            'Transport arranged if self-collecting (trailer, tow vehicle rated to the weight)',
            'Ability to demonstrate basic competence — most depots will walk you through the controls',
          ]}
        />
        <p className="mt-4 text-sm font-semibold text-red-600">
          ✗ CPCS card: not required for private/domestic hire (but required on most commercial sites)
        </p>
      </section>

      {/* Why no CPCS needed */}
      <section>
        <H2>Why You Don't Need a CPCS Card for Private Hire</H2>
        <Prose>
          <p>
            The CPCS (Construction Plant Competence Scheme) card is an industry competence scheme,
            not a government-mandated licence. It proves you are trained and tested to operate
            specific plant machinery — but it is enforced at site level by principal contractors
            on commercial construction sites, not by law for private land use.
          </p>
          <p>
            For a homeowner hiring a mini digger to dig a garden pond, clear ground for a patio,
            or excavate a trench for drainage pipes on their own property, no CPCS card is
            required. The hire depot has no legal obligation to demand one.
          </p>
          <p>
            What is required, however, is competence under PUWER 1998. You must be capable of
            operating the machine safely. In practice, this means understanding the controls,
            knowing how to perform a pre-start check, and being able to operate without causing a
            hazard to yourself, others, or the machine.
          </p>
        </Prose>
        <Link
          to="/blog/do-i-need-licence-to-operate-mini-digger"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Do I Need a Licence to Operate a Mini Digger? →
          </span>
        </Link>
      </section>

      {/* Step-by-step */}
      <section>
        <H2>Step-by-Step: How to Hire a Mini Digger Without a CPCS Card</H2>

        <H3>Step 1: Find a Suitable Supplier</H3>
        <Prose>
          <p>
            Use Tooli.uk to compare mini digger hire prices from local depots. Not all depots
            hire to private individuals for domestic projects — some trade-only depots require a
            business account. Filter by location and confirm the depot hires to private customers
            before making a booking.
          </p>
        </Prose>

        <H3>Step 2: Book in Advance</H3>
        <Prose>
          <p>
            During spring and summer, 1.5-tonne diggers book up fast — especially at weekends.
            Call or book online at least 3–5 working days ahead. Tell the depot what you need the
            machine for; they can confirm the right size and available attachments.
          </p>
        </Prose>

        <H3>Step 3: Sort Your Transport (if Self-Collecting)</H3>
        <Prose>
          <p>
            Mini diggers are not road-legal. They must be transported on a trailer or low-loader.
            To self-collect a 1.5-tonne machine, you need:
          </p>
        </Prose>
        <CheckList
          items={[
            'A trailer with a Gross Vehicle Weight (GVW) rated at least 2,000 kg with ramps or a full-length deck',
            'A towing vehicle with a towing capacity that exceeds the loaded trailer weight',
            'Appropriate trailer braking if the trailer exceeds 750 kg',
            'Ratchet straps rated to secure the machine during transport',
          ]}
        />
        <Prose>
          <p>
            If you don't have trailer access, book delivery and collection from the depot. This
            adds cost (typically £80–£200 return) but is the simplest option.
          </p>
        </Prose>

        <H3>Step 4: What to Bring on Collection Day</H3>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Item</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Why It's Needed</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {cpcsCollectionTable.map(([item, why, notes], i) => (
                <tr key={item} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{item}</td>
                  <td className="px-4 py-3 text-gray-600">{why}</td>
                  <td className="px-4 py-3 text-gray-500">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>Step 5: The Handover</H3>
        <Prose>
          <p>
            Before you leave the depot, the hire desk should walk you through the machine
            controls. Take this seriously — even if you've used a digger before, different
            machines have different control layouts and safety interlocks. Ask about:
          </p>
        </Prose>
        <CheckList
          items={[
            'How to perform the pre-start inspection (fluid levels, track tension, greasing points)',
            'Emergency stop location and procedure',
            'How to engage the slew lock for transport',
            'What the machine\'s warning lights indicate',
            'Fuel type and expected consumption rate',
          ]}
        />

        <H3>Step 6: Operate Safely</H3>
        <Prose>
          <p>
            Even on private domestic land, PUWER 1998 requires you to operate work equipment
            safely. Practically, that means:
          </p>
        </Prose>
        <CheckList
          items={[
            'Check the working area for buried services (gas, water, electricity, telecoms) before digging. Call 0800 96 93 35 (LSBUD) or use their free online check at lsbud.co.uk.',
            'Keep bystanders — particularly children — well clear of the machine\'s swing radius.',
            'Do not operate a diesel machine in an enclosed space without adequate ventilation.',
            'Wear appropriate PPE: hard hat, steel-toe boots, hi-vis vest where relevant.',
          ]}
        />
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/mini-digger-hire-cost-uk.webp"
        alt="Mini digger on a UK site — compare hire prices without needing a CPCS card on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* When CPCS required */}
      <section>
        <H2>When You Will Need a CPCS Card</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Situation</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">CPCS Card Required?</th>
              </tr>
            </thead>
            <tbody>
              {cpcsRequirementTable.map(([situation, required], i) => (
                <tr key={situation} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-medium text-gray-700">{situation}</td>
                  <td className={`px-4 py-3 font-bold ${required === 'No' ? 'text-brand-primary' : required.startsWith('Yes') ? 'text-red-600' : 'text-amber-700'}`}>{required}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Can depot refuse */}
      <section>
        <H2>Can Any Hire Depot Refuse Without a CPCS Card?</H2>
        <Prose>
          <p>
            Yes. This is within a hire depot's rights. Some depots have policies that require
            demonstrated operator experience for machines over a certain size — this is a
            commercial decision, not a legal requirement. If one depot declines, use Tooli.uk to
            find an alternative local supplier who hires to private individuals.
          </p>
        </Prose>
      </section>

      {/* Never used a digger before */}
      <section>
        <H2>What If I've Never Used a Digger Before?</H2>
        <Prose>
          <p>
            Ask the depot for a thorough handover. Most are happy to spend 15–20 minutes at the
            yard demonstrating the controls before you load the machine. For complete beginners,
            some depots offer short paid induction sessions — worth asking about, particularly
            before tackling a complex or high-risk job.
          </p>
          <p>
            Alternatively, consider hiring an operator alongside the machine for your first job. A
            competent plant operator typically costs £200–£400 per day on top of the machine hire
            — but on a job you're unsure about, having a professional on site protects you, your
            property, and your hire deposit.
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/1-5-tonne-vs-3-tonne-digger-which-one-do-you-actually-need"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              1.5 Tonne vs 3 Tonne Digger: Which One Do You Need? →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-attachments-explained-which-one-do-you-need"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Attachments Explained: Which One Do You Need? →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-buy-or-hire-full-uk-cost-comparison"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger: Buy or Hire? Full UK Cost Comparison →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-cost-uk-2026-price-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Cost UK: What You'll Pay in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-uk-prices-and-sizes-compared"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire UK: Prices &amp; Sizes Compared →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-london-prices-local-availability"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire London: Prices &amp; Local Availability →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={cpcsFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Find a Depot That Hires to Private Customers</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk, select mini digger hire, and compare quotes from local
          suppliers — no CPCS card required for private residential jobs.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article — Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules     */
/* ------------------------------------------------------------------ */

const scaffoldTowerSizeTable: [string, string, string][] = [
  ['2.2 m', '0.2 m', 'Indoor ceiling work, low exterior painting'],
  ['3.2 m', '1.2 m', 'Single-storey walls, window fitting'],
  ['4.2 m', '2.2 m', 'First-floor exterior, gutters and eaves'],
  ['5.2 m', '3.2 m', 'Two-storey rendering, fascia runs'],
  ['7.2 m', '5.2 m', 'Chimney repointing, gable work'],
  ['10.2 m+', '8.2 m+', 'Commercial facades, larger structures'],
];

const scaffoldTowerAtAGlance = [
  'Scaffold towers range from 2.2 m to 12 m+ working height — choose by task, not by guesswork',
  'PASMA training is required on most UK commercial sites and strongly recommended for all users',
  'Indoor towers (narrower, lighter) and outdoor towers (wider, heavier) are different hire items',
  'Rates vary by height, width, duration and region — compare suppliers before you book',
  'Weekly hire almost always works out cheaper per day than booking daily from day three onwards',
];

const scaffoldTowerBeforeHireItems = [
  'Working height — calculate properly, don\'t underestimate',
  'Indoor or outdoor use — different widths and base plate configurations',
  'Ground conditions — slopes and soft ground need adjustable legs or outriggers',
  'Duration — day, weekend, or week hire changes the total cost significantly',
  'Delivery vs self-collect — delivery charges are real costs, always get the full delivered price',
  'PASMA requirement — check with the site manager and the hire depot before booking',
];

const scaffoldTowerFaqs: Faq[] = [
  [
    'Do I need a PASMA card to hire a scaffold tower?',
    'For commercial sites, yes — most principal contractors require it. For residential DIY, no legal card is needed, but safe use under the Work at Height Regulations 2005 is still your responsibility.',
  ],
  [
    'What is the Safe Working Load of a hired scaffold tower?',
    'Most standard hired towers are rated at 275 kg per platform bay. Always check the manufacturer\'s data sheet and never overload — tools, materials, and the operative all count toward that total.',
  ],
  [
    'Can I hire a scaffold tower without a van?',
    'Yes — most UK hire depots offer delivery to site. Smaller towers pack down small enough to fit in an estate car, but confirm the longest section length before self-collecting.',
  ],
  [
    'Are scaffold tower hire rates quoted including VAT?',
    'Most depot rates are quoted ex-VAT. Add 20% for the true cost. VAT-registered businesses can reclaim it. On Tooli.uk we clearly show whether rates are inc or ex-VAT so you\'re comparing like for like.',
  ],
];

function ScaffoldTowerHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={scaffoldTowerAtAGlance} />
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/scaffold-tower-hire-uk.webp"
        alt="Scaffold tower hire UK — prices, sizes and PASMA compliance compared on Tooli.uk"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>What Is a Scaffold Tower?</H2>
        <Prose>
          <p>
            A mobile access tower (the term used in PASMA documentation) is a self-supporting
            aluminium frame that you assemble on site, add platform decks to, and move around on
            lockable castors. Unlike traditional tube-and-fitting scaffolds, it doesn't tie to the
            building. Most hired towers fit in a van or trailer and assemble without tools in
            under 40 minutes with two people.
          </p>
          <p>
            They're used every day by decorators, roofers, window fitters, groundworkers, and
            builders across the UK, plus DIYers running extensions or large renovation projects.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Sizes: Choosing by Working Height</H2>
        <Prose>
          <p>
            Working height is the key measurement — it's where you stand, not the top of the
            frame. A common mistake is confusing platform height with working height. Always
            check both figures when comparing products.
          </p>
        </Prose>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Working Height</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Platform Height</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Common UK Use</th>
              </tr>
            </thead>
            <tbody>
              {scaffoldTowerSizeTable.map(([working, platform, use], i) => (
                <tr key={working} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-bold text-gray-700">{working}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{platform}</td>
                  <td className="px-5 py-3 font-medium text-gray-500">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Indoor towers are typically 0.85 m wide. Outdoor towers run to 1.45 m. The wider base
          gives more stability at height outdoors, but it won't fit through a standard door —
          check access routes before you book.
        </p>
      </section>

      {/* Product image */}
      <img
        src="/images/blog/scaffold-tower-hire-uk-and-pasma.webp"
        alt="Aluminium scaffold tower with platform, guard rails and locking castors ready for hire"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>Getting the Height Right</H2>
        <Prose>
          <p>
            Add at least 1 m to the highest point you need to touch to get your required working
            height. You want the work at roughly chest level — not stretched above your head or
            crouched at your feet. Both positions are tiring and increase the chance of a fall.
          </p>
          <p>
            Check ceiling heights and door widths before hiring for indoor jobs. A 5 m tower needs
            clearance to stand upright and frame sections long enough to cause access problems in
            narrow hallways.
          </p>
        </Prose>
      </section>

      <section>
        <H2>PASMA: What It Is and When You Need It</H2>
        <Prose>
          <p>
            <a
              href="https://www.pasma.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              PASMA
            </a>{' '}
            (Prefabricated Access Suppliers' and Manufacturers' Association) runs the UK's
            recognised training scheme for mobile access towers. A PASMA card — earned on a
            one-day accredited course — proves you can safely assemble, use, inspect, and
            dismantle a tower.
          </p>
          <p>
            On commercial sites, most principal contractors require a valid PASMA card before any
            operative sets foot on a hired tower. It's not a legal licence in the way CPCS or IPAF
            cards are, but it's become the de facto site standard.
          </p>
          <p>
            For homeowners doing DIY work on their own property, there's no legal obligation to
            hold a PASMA card. But the{' '}
            <a
              href="https://www.hse.gov.uk/work-at-height/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Work at Height Regulations 2005
            </a>{' '}
            still apply — you must take reasonable precautions to prevent falls. Read the erection
            guide your hire depot supplies. Every depot is required to provide one.
          </p>
        </Prose>
      </section>

      <section>
        <H2>What to Sort Before You Hire</H2>
        <CheckList items={scaffoldTowerBeforeHireItems} />
      </section>

      <section>
        <H2>Scaffold Tower vs Cherry Picker</H2>
        <Prose>
          <p>
            For a fixed task in one spot over multiple days — painting, repointing, fascia work —
            a scaffold tower is almost always the more cost-effective choice. Cherry pickers cover
            ground faster when you're repositioning constantly, but the hire rates and licence
            requirements add up quickly.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Keep Reading</H2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/mini-digger-hire-cost-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Cost UK: Avoid Overpaying in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire Comparison UK: Compare Construction Equipment & Plant Hire Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-uk-prices-and-sizes-compared"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire UK: Prices &amp; Sizes Compared →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-cost-uk-2026-price-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Cost UK: What You'll Pay in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-buy-or-hire-full-uk-cost-comparison"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger: Buy or Hire? Full UK Cost Comparison →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={scaffoldTowerFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Scaffold Tower Hire Prices Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk, choose your size, and compare quotes from UK hire
          depots in minutes. No account needed. No phone calls.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article — Do You Need PASMA to Hire a Scaffold Tower in the UK?     */
/* ------------------------------------------------------------------ */

const pasmaRequirementTable: [string, string][] = [
  ['Commercial construction site', 'Yes — required by most principal contractors'],
  ['Local authority or social housing site', 'Yes — standard requirement'],
  ['Private residential work (trade)', 'Recommended — not always enforced, but expected'],
  ['DIY homeowner on own property', 'No legal requirement — safe use rules still apply'],
  ['School, hospital or public building', 'Yes — typically written into CDM documentation'],
];

const pasmaAtAGlance = [
  'Hire depots do not legally require PASMA training before hiring you a tower',
  'Most commercial sites require a valid PASMA card for anyone assembling or using a tower',
  'PASMA training is one day and covers assembly, inspection, use and dismantling',
  'DIY homeowners have no legal card requirement but must still follow safe working at height rules',
  'The Work at Height Regulations 2005 apply to all tower use in the UK — trade or DIY',
];

const pasmaCourseCoverage = [
  'UK legislation, including the Work at Height Regulations 2005 and PUWER',
  'Tower types, components, load ratings and manufacturer markings',
  'Pre-use inspection checklist — what to look for and when to reject a component',
  'Assembly using the stairway-through method (the industry standard safe assembly approach)',
  'Working safely on uneven ground, near overhead hazards, and in wind',
  'Dismantling and safe storage',
];

const pasmaFaqs: Faq[] = [
  [
    'How much does PASMA training cost?',
    'Expect to pay roughly £180–£250 for a one-day PASMA Towers for Users course at an accredited centre. Some employers cover the cost for their operatives. Cards are valid for five years.',
  ],
  [
    'Is PASMA the same as IPAF?',
    'No. PASMA covers mobile access towers — the aluminium frame towers you assemble by hand. IPAF covers powered access equipment like cherry pickers, scissor lifts and boom lifts. They\'re separate qualifications for different types of equipment.',
  ],
  [
    'Does my PASMA card cover all tower types?',
    'PASMA Towers for Users covers prefabricated mobile access towers — the standard aluminium hire towers. It does not cover traditional tube-and-fitting scaffold (that requires CISRS training) or powered access platforms (IPAF).',
  ],
  [
    'Do I need to renew my PASMA card?',
    'PASMA cards are valid for five years. Renewal requires a refresher course. Letting a card lapse won\'t get you arrested, but it may mean a site manager won\'t let you work until you\'ve renewed.',
  ],
];

function PasmaRequirementBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">At a Glance</h2>
        <CheckList items={pasmaAtAGlance} />
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/do-you-need-pasma-to-hire-scaffold-tower.webp"
        alt="Do you need PASMA to hire a scaffold tower in the UK — rules for tradespeople and DIY homeowners"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section className="space-y-5 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
        <p>
          Short answer: not to hire one, but almost certainly to use one on a commercial site.
          PASMA (Prefabricated Access Suppliers' and Manufacturers' Association) training is the
          UK's recognised standard for mobile access tower use. Most principal contractors make it
          a site requirement. If you're a DIY homeowner working on your own property, no card is
          legally required — but the Work at Height Regulations 2005 still bind you to working
          safely at height. Here's exactly what applies in each situation.
        </p>
      </section>

      <section>
        <H2>What Is PASMA?</H2>
        <Prose>
          <p>
            <a
              href="https://www.pasma.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              PASMA
            </a>{' '}
            is the UK trade body for mobile access tower manufacturers and suppliers. Their Towers
            for Users training course is a one-day, accredited programme covering the AUID method
            — Assembly, Use, Inspection, and Dismantling. Pass the written and practical
            assessments, and you get a PASMA card valid for five years.
          </p>
          <p>
            It's not a statutory licence in the way an IPAF PAL Card or CPCS card is — there's no
            specific law that names PASMA by name. But it has become the construction industry's
            accepted proof of competence for mobile tower work, and most principal contractors
            treat it as mandatory.
          </p>
        </Prose>
      </section>

      <section>
        <H2>When Is PASMA Required?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">Situation</th>
                <th className="px-5 py-3 text-left font-extrabold text-gray-900">PASMA Required?</th>
              </tr>
            </thead>
            <tbody>
              {pasmaRequirementTable.map(([situation, required], i) => (
                <tr key={situation} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-5 py-3 font-medium text-gray-700">{situation}</td>
                  <td className={`px-5 py-3 font-bold ${required.startsWith('No') ? 'text-brand-primary' : required.startsWith('Yes') ? 'text-red-600' : 'text-amber-700'}`}>{required}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained →
          </span>
        </Link>
      </section>

      {/* Product image */}
      <img
        src="/images/blog/scaffold-tower-hire-uk-and-pasma.webp"
        alt="Aluminium scaffold tower with platform, guard rails and locking castors ready for hire"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      <section>
        <H2>What Does a PASMA Course Cover?</H2>
        <Prose>
          <p>
            A PASMA Towers for Users course runs for one day at an accredited training centre.
            You'll cover:
          </p>
        </Prose>
        <CheckList items={pasmaCourseCoverage} />
        <p className="mt-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
          After the written test, you receive a PASMA card. Most centres issue it on the day or
          within a few days by post.
        </p>
      </section>

      <section>
        <H2>Do Hire Depots Check Your PASMA Card?</H2>
        <Prose>
          <p>
            For standard height towers — roughly up to 5 m working height — most UK hire depots
            don't ask for a PASMA card when you collect. They'll hand you the safety documentation
            and erection guide, and that's it.
          </p>
          <p>
            For larger towers (6 m working height and above), or where delivery is to a named
            commercial site, a growing number of depots do ask for proof of PASMA training. It's
            their risk management, not a statutory rule. Always check at point of booking if
            you're unsure.
          </p>
        </Prose>
      </section>

      <section>
        <H2>What Does the HSE Say?</H2>
        <Prose>
          <p>
            The Health and Safety Executive doesn't name PASMA in legislation. But the{' '}
            <a
              href="https://www.hse.gov.uk/work-at-height/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Work at Height Regulations 2005
            </a>{' '}
            (SI 2005/735) require that anyone working at height is competent to do so. Competence
            means the right skills, knowledge, and experience for the task — and PASMA training is
            the widely accepted way to demonstrate that in the mobile tower context.
          </p>
          <p>
            For employers, there's a separate duty under PUWER (Provision and Use of Work
            Equipment Regulations 1998) to ensure operatives are trained and competent to use the
            equipment they're issued. Sending someone up a scaffold tower without training isn't a
            grey area under PUWER.
          </p>
        </Prose>
      </section>

      <section>
        <H2>What Happens If You Don't Have PASMA?</H2>
        <Prose>
          <p>
            On a commercial site, no PASMA card usually means no access to the tower. The site
            manager can and will refuse to let you work. If there's an incident involving a tower
            and an untrained operative, the legal exposure for both the operative and the employer
            increases significantly.
          </p>
          <p>
            For DIY jobs on your own property, the risk is personal. You won't be turned away by a
            depot. But if something goes wrong, insurers may ask questions about competence —
            particularly if the incident results in a third-party claim.
          </p>
        </Prose>
      </section>

      <section>
        <H2>Keep Reading</H2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/mini-digger-hire-cost-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Cost UK: Avoid Overpaying in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire Comparison UK: Compare Construction Equipment & Plant Hire Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-uk-prices-and-sizes-compared"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire UK: Prices &amp; Sizes Compared →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-hire-cost-uk-2026-price-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger Hire Cost UK: What You'll Pay in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/mini-digger-buy-or-hire-full-uk-cost-comparison"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Mini Digger: Buy or Hire? Full UK Cost Comparison →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={pasmaFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Scaffold Tower Hire Prices Now</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk, choose your size, and compare quotes from UK hire
          depots in minutes. No account needed. No phone calls.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 20 — Cherry Picker vs Scaffold Tower                       */
/* ------------------------------------------------------------------ */

const cpVsStComparisonTable: [string, string, string][] = [
  ['Cost (weekly)', '£55–£200/week', '£350–£900/week (self-drive)'],
  ['Setup time', '30–60 min (assembly)', '5–15 min (drive to position and raise)'],
  ['Repositioning', 'Requires dismantling and moving', 'Fully mobile — reposition in minutes'],
  ['Max working height', 'Up to 10–12 m (hire towers)', 'Up to 12–20 m (common hire range)'],
  ['Platform stability', 'Excellent — fixed structure', 'Good (stabilisers deployed) — some movement at height'],
  ['Access requirement', 'Pedestrian access path', 'Vehicle-width access + firm, level ground'],
  ['Qualification (commercial sites)', 'PASMA card', 'IPAF PAL card (3a or 3b)'],
  ['Indoor use', 'Yes — compact models available', 'Limited — requires ceiling clearance'],
  ['Materials & tools on platform', 'Yes — rated platform load', 'Limited — small platform, weight sensitive'],
  ['Delivery method', 'Sections in van or hire delivery', 'Self-drive or transport on low-loader'],
];

const cpVsStCostTable: [string, string, string, string][] = [
  ['Two-storey exterior painting (5 days)', '£90 hire', '£600–£800 hire', 'Scaffold tower'],
  ['Fascia & guttering (3 days, one elevation)', '£70 hire', '£450–£600 hire', 'Scaffold tower'],
  ['Tree pruning (6–8 hours, multiple positions)', 'Not suitable', '£200–£320 day hire', 'Cherry picker'],
  ['Roof inspection (large commercial building)', 'Not suitable', '£350–£500 day hire', 'Cherry picker'],
  ['Exterior rendering (2 weeks)', '£200–£260 total', '£1,400–£1,800 total', 'Scaffold tower'],
  ['Emergency repair at 15 m height', 'Not available at this height', 'Day hire only practical option', 'Cherry picker'],
];

const cpVsStQualTable: [string, string, string][] = [
  ['Scaffold tower', 'PASMA card (Tower for Users)', 'No card required — but Work at Height Regs apply'],
  ['Cherry picker / MEWP (boom)', 'IPAF PAL card (Category 3b)', 'No card required — but Work at Height Regs apply'],
  ['Scissor lift (MEWP)', 'IPAF PAL card (Category 3a)', 'No card required — but Work at Height Regs apply'],
];

const cherryPickerFaqs: Faq[] = [
  [
    'Is a cherry picker cheaper to hire than a scaffold tower?',
    'No — cherry pickers are significantly more expensive. A scaffold tower hire runs £55–£200 per week. A self-drive cherry picker typically costs £350–£900 per week. For jobs lasting more than one or two days, scaffold towers are almost always the more cost-effective choice.',
  ],
  [
    'Can I hire a cherry picker without an IPAF card?',
    'For private domestic use on your own land, yes — hire depots are not legally required to demand an IPAF card. On commercial sites, an IPAF PAL card (3a or 3b depending on machine type) will be required. Some depots decline to hire MEWPs to uncarded operators even for domestic use — call ahead to confirm.',
  ],
  [
    'What is the height limit of a hire scaffold tower?',
    'Standard single-width hire towers reach up to 10–12 metres working height. Double-width towers can go higher but physical limits apply based on base-to-height ratio. For working heights above 10 metres, a cherry picker or other MEWP is often more practical.',
  ],
  [
    'Do I need a driving licence to operate a cherry picker?',
    'Self-drive towable cherry pickers require a vehicle to tow them (valid driving licence). Self-propelled cherry pickers do not require a road driving licence to operate on private land, but competence and, on commercial sites, an IPAF card is required. Road-legal towable models need a valid towing-rated licence.',
  ],
  [
    'Which is safer — a scaffold tower or cherry picker?',
    'Both are safe when used correctly. Scaffold towers have no mechanical failure risk but carry assembly-error risks if not built correctly. Cherry pickers eliminate assembly risk but require awareness of tip-over risk, overhead cables, and ground stability. PASMA and IPAF training respectively address the specific risks of each type.',
  ],
];

function CherryPickerVsScaffoldBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Quick Comparison</h2>
        <CheckList
          items={[
            'Scaffold tower: lower cost, stable platform, better for prolonged fixed-position work',
            'Cherry picker: faster setup, repositionable, better for intermittent tasks at height',
            'Cherry picker costs 3–6x more per day than an equivalent scaffold tower',
            'Cherry picker requires IPAF PAL card on commercial sites; scaffold tower requires PASMA',
            'Cherry pickers need level, firm ground and overhead clearance — towers are more flexible',
          ]}
        />
      </section>

      {/* Main comparison table */}
      <section>
        <H2>Side-by-Side Comparison</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Factor</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Scaffold Tower</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Cherry Picker / MEWP</th>
              </tr>
            </thead>
            <tbody>
              {cpVsStComparisonTable.map(([factor, tower, picker], i) => (
                <tr key={factor} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{factor}</td>
                  <td className="px-4 py-3 text-gray-600">{tower}</td>
                  <td className="px-4 py-3 text-gray-600">{picker}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/cherry-picker-vs-scaffold-tower-which-to-hire.webp"
        alt="Side-by-side comparison of a scaffold tower and a cherry picker boom lift on a UK construction site"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* When to choose scaffold tower */}
      <section>
        <H2>When to Choose a Scaffold Tower</H2>

        <H3>Fixed-Position Work Over Multiple Days</H3>
        <Prose>
          <p>
            If you're painting a two-storey exterior, replacing fascias and soffits, or pointing a
            chimney over several days, a scaffold tower gives you the most cost-effective and stable
            platform. Once assembled and stabilised, it stays in position and you can focus on the job
            rather than repositioning equipment.
          </p>
        </Prose>

        <H3>Indoor Access Work</H3>
        <Prose>
          <p>
            Scaffold towers are the standard choice for interior work at height — ceiling repairs,
            coving, commercial fit-out. Low-level towers slip through standard doorways. Cherry pickers
            require significant headroom clearance and are rarely practical indoors.
          </p>
        </Prose>

        <H3>Budget-Conscious Longer Jobs</H3>
        <Prose>
          <p>
            On a 2-week exterior painting contract, a scaffold tower at £150 total hire versus a cherry
            picker at £1,400+ over the same period is a straightforward financial decision in most cases.
            The tower wins unless frequent repositioning is genuinely required.
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Scaffold Tower Hire UK: Prices, Sizes &amp; PASMA Rules →
            </span>
          </Link>
          <Link
            to="/blog/do-you-need-pasma-to-hire-scaffold-tower-in-the-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Do You Need PASMA to Hire a Scaffold Tower? →
            </span>
          </Link>
        </div>
      </section>

      {/* When to choose cherry picker */}
      <section>
        <H2>When to Choose a Cherry Picker</H2>

        <H3>Intermittent Tasks Requiring Frequent Repositioning</H3>
        <Prose>
          <p>
            Tree surgery, streetlight maintenance, roof inspection across a large building, or any job
            where you need to access a dozen different points at height — a cherry picker saves significant
            time versus repeatedly dismantling and repositioning a tower. Time is often the deciding factor.
          </p>
        </Prose>

        <H3>Restricted Access Around Obstacles</H3>
        <Prose>
          <p>
            A cherry picker boom can reach over walls, fences, and parked vehicles to access areas a
            tower simply cannot reach from the ground. On sites with irregular obstacles, the cherry
            picker's articulated or telescopic boom is often the only practical solution.
          </p>
        </Prose>

        <H3>Very High Working Heights</H3>
        <Prose>
          <p>
            Standard hire scaffold towers top out at 10–12 metres working height. If your job requires
            14 metres, 18 metres, or more, a cherry picker or MEWP (Mobile Elevated Work Platform) is
            the only hire-fleet option.
          </p>
        </Prose>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/cherry-picker-vs-scaffold-tower.webp"
        alt="Self-drive cherry picker MEWP on a residential street for guttering maintenance UK"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Cost comparison table */}
      <section>
        <H2>Cost Comparison: Same Job, Two Approaches</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Job Scenario</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Scaffold Tower (est.)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Cherry Picker (est.)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Better Choice</th>
              </tr>
            </thead>
            <tbody>
              {cpVsStCostTable.map(([scenario, tower, picker, winner], i) => (
                <tr key={scenario} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{scenario}</td>
                  <td className="px-4 py-3 text-gray-600">{tower}</td>
                  <td className="px-4 py-3 text-gray-600">{picker}</td>
                  <td className={`px-4 py-3 font-bold ${winner === 'Scaffold tower' ? 'text-brand-primary' : winner === 'Cherry picker' ? 'text-amber-700' : 'text-gray-500'}`}>{winner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money →
          </span>
        </Link>
      </section>

      {/* Qualifications table */}
      <section>
        <H2>Qualifications: What Each Access Option Requires</H2>
        <Prose>
          <p>
            On commercial sites, both types of access equipment require specific competence
            qualifications:
          </p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Access Type</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Qualification Required (Commercial Sites)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Domestic Use</th>
              </tr>
            </thead>
            <tbody>
              {cpVsStQualTable.map(([type, commercial, domestic], i) => (
                <tr key={type} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{type}</td>
                  <td className="px-4 py-3 text-gray-600">{commercial}</td>
                  <td className="px-4 py-3 text-gray-500">{domestic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose>
          <p className="mt-4">
            For domestic homeowners, no card is legally required — but the{' '}
            <a
              href="https://www.hse.gov.uk/work-equipment-machinery/falls.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Work at Height Regulations 2005
            </a>{' '}
            still apply. You must take all reasonable steps to prevent falls regardless of whether you
            hold a card. Find IPAF training at{' '}
            <a
              href="https://www.ipaf.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              ipaf.org
            </a>{' '}
            and PASMA training at{' '}
            <a
              href="https://www.pasma.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              pasma.co.uk
            </a>
            .
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/tool-hire-london"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire in London: Compare Prices From Local Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/plant-hire-london-compare-local-plant-hire-companies"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Plant Hire London: Compare Local Plant Hire Companies →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-sw19-london-postcode-area-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire SW19: London Postcode Area Guide →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire Comparison UK: Compare Plant Hire Suppliers →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={cherryPickerFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Cherry Picker and Scaffold Tower Hire Prices</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk and compare quotes for scaffold towers, cherry pickers, and
          access equipment from local UK suppliers — delivery and all-in pricing included.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 21 — IPAF Licence for Cherry Picker Hire                   */
/* ------------------------------------------------------------------ */

const ipafCategoryTable: [string, string, string, string][] = [
  ['1a', 'Static vertical — vehicle-mounted', 'Static vehicle-mounted platforms', 'Less common in general hire'],
  ['1b', 'Static boom — vehicle-mounted', 'Vehicle-mounted articulated booms', 'Specialist — road maintenance etc.'],
  ['3a', 'Mobile vertical — scissor/vertical lifts', 'Scissor lifts, vertical mast platforms', 'Ground-level movement only'],
  ['3b', 'Mobile boom — cherry pickers', 'Articulated booms, telescopic booms, knuckle booms', 'Most common hire category'],
  ['3a + 3b', 'Combined', 'Scissor and boom', 'Standard combined course offering'],
];

const ipafCourseTable: [string, string, string, string][] = [
  ['IPAF 3b only', '1 day', 'Boom lifts, cherry pickers', '£180–£280'],
  ['IPAF 3a only', '1 day', 'Scissor lifts', '£180–£280'],
  ['IPAF 3a + 3b Combined', '1–1.5 days', 'Scissor lifts + boom lifts', '£220–£340'],
  ['IPAF Refresher (5-yr renewal)', 'Half day', 'Renewal of existing category', '£120–£180'],
  ['IPAF MEWPs for Managers', '1 day', 'Managerial / supervisory level', '£200–£300'],
];

const ipafSituationTable: [string, string][] = [
  ['Private homeowner hiring a cherry picker for a domestic garden project', 'Not legally required — Work at Height Regs still apply'],
  ['Self-employed tradesperson on a client\'s domestic property', 'Not legally required — but strongly advised for PUWER compliance'],
  ['Any operator on a commercial construction site', 'Yes — enforced by principal contractor in virtually all cases'],
  ['CDM 2015 notifiable project', 'Yes — competence likely to be audited'],
  ['Operating on or adjacent to a public highway', 'Yes — and additional traffic management requirements apply'],
  ['Operator supplied by a hire company', 'Yes — depot-supplied operators hold current IPAF cards as a condition of employment'],
];

const ipafFaqs: Faq[] = [
  [
    'Do I need an IPAF card to hire a cherry picker in the UK?',
    'Not for private domestic use — hire depots are not legally required to demand an IPAF card. For any commercial site work, an IPAF PAL card (Category 3b for boom lifts and cherry pickers) is effectively mandatory. Work at Height Regulations 2005 require competence at height regardless of land type.',
  ],
  [
    'What is the difference between IPAF 3a and 3b?',
    'Category 3a covers mobile vertical platforms — scissor lifts and vertical mast platforms, which only move vertically and travel on the ground in the lowered position. Category 3b covers mobile boom-type machines — cherry pickers, articulated booms, and telescopic booms, which can reach over obstacles. Most hirers of cherry pickers need 3b.',
  ],
  [
    'How long does IPAF training take?',
    'One day for a single category (3a or 3b). Combined 3a+3b takes 1–1.5 days. The IPAF PAL card is issued upon successful completion and is valid for 5 years, after which a half-day refresher is required for renewal.',
  ],
  [
    'Is IPAF training available near me?',
    'IPAF has an extensive network of approved UK training centres. Find your nearest provider using the training centre locator at ipaf.org. Courses are available across England, Scotland, Wales, and Northern Ireland.',
  ],
  [
    'Do I need to wear a harness in a cherry picker?',
    'Yes — always, in a boom-type MEWP (cherry picker or articulated boom). A full-body harness must be attached to the platform anchor point at all times when elevated. IPAF training includes correct harness use as a core element.',
  ],
  [
    'Is IPAF recognised on all UK construction sites?',
    'Yes — IPAF PAL cards are recognised across the UK construction industry and by HSE. The PAL card database allows site managers to verify operator status instantly at ipaf.org. Most principal contractors accept IPAF as the only recognised standard for MEWP operation.',
  ],
  [
    'Can I use a cherry picker if I\'ve only done PASMA training?',
    'No. PASMA covers unpowered mobile scaffold towers only. Operating a powered access platform (cherry picker, scissor lift) without the appropriate IPAF training would leave you non-compliant with Work at Height Regulations and uninsured in most cases. The two qualifications are entirely separate.',
  ],
];

function IpafLicenceBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">IPAF at a Glance</h2>
        <CheckList
          items={[
            'Private domestic use: no IPAF card legally required — Work at Height Regs still apply',
            'Commercial sites: IPAF PAL card effectively mandatory in most cases',
            'Category 3b: boom lifts, cherry pickers, knuckle booms — most common hire machine type',
            'Category 3a: scissor lifts, vertical lifts (non-boom MEWPs)',
            'IPAF PAL card valid 5 years; renewal via half-day refresher course',
            'IPAF is NOT the same as PASMA — IPAF covers powered platforms, PASMA covers scaffold towers',
          ]}
        />
      </section>

      {/* What is IPAF */}
      <section>
        <H2>What Is IPAF?</H2>
        <Prose>
          <p>
            IPAF (International Powered Access Federation) is the trade association and certification
            body for the powered access industry worldwide. In the UK, its PAL (Powered Access Licence)
            card system is the industry-standard competence qualification for operators of MEWPs (Mobile
            Elevated Work Platforms) — which includes cherry pickers, scissor lifts, boom lifts, and
            spider lifts.
          </p>
          <p>
            IPAF training is recognised by the HSE, the Construction Industry Training Board (CITB),
            and most principal contractors across the UK. The PAL card database allows employers and
            site managers to verify operator qualifications online at{' '}
            <a
              href="https://www.ipaf.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              ipaf.org
            </a>
            .
          </p>
        </Prose>
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/ipaf-licence-what-you-need.webp"
        alt="Operator in full-body harness operating a cherry picker boom lift on a UK commercial construction site — IPAF PAL card required"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* PAL Card Categories */}
      <section>
        <H2>IPAF PAL Card Categories</H2>
        <Prose>
          <p>
            The PAL card system uses a category grid. The categories relevant to cherry picker and
            MEWP hire are:
          </p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Category</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Machine Type</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Common Examples</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {ipafCategoryTable.map(([cat, type, examples, notes], i) => (
                <tr key={cat} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className={`px-4 py-3 font-extrabold ${cat === '3b' || cat === '3a + 3b' ? 'text-brand-primary' : 'text-gray-700'}`}>{cat}</td>
                  <td className="px-4 py-3 text-gray-700">{type}</td>
                  <td className="px-4 py-3 text-gray-600">{examples}</td>
                  <td className="px-4 py-3 text-gray-500">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose>
          <p className="mt-4">
            For most UK hirers looking to use a cherry picker or boom lift, Category 3b is the
            relevant qualification. If you also plan to use scissor lifts, a combined 3a+3b course is
            the most efficient route.
          </p>
        </Prose>
        <Link
          to="/blog/cherry-picker-vs-scaffold-tower-which-access-option-do-you-actually-need"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Cherry Picker vs Scaffold Tower: Which Access Option Do You Need? →
          </span>
        </Link>
      </section>

      {/* IPAF Training */}
      <section>
        <H2>IPAF Training: What's Involved?</H2>

        <H3>Theory Component</H3>
        <Prose>
          <p>
            Covers: MEWP types and selection, pre-use inspection, safe use principles, fall protection
            (harness use is mandatory on boom lifts), emergency procedures, rescuing an incapacitated
            operator, hazard recognition (overhead cables, slopes, ground conditions, wind speed).
          </p>
        </Prose>

        <H3>Practical Component</H3>
        <Prose>
          <p>
            Hands-on assessment on the specific machine type (3a or 3b) at the training centre.
            Operators must demonstrate: pre-start checks, safe operation, working within rated
            capacities, emergency descent.
          </p>
        </Prose>

        <H3>Assessment</H3>
        <Prose>
          <p>
            Written theory test and practical assessment. Pass rates are high for operators who engage
            with the training — the day moves fast and the practical element is the most important
            component.
          </p>
        </Prose>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Course</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Duration</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Categories Covered</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Typical Cost</th>
              </tr>
            </thead>
            <tbody>
              {ipafCourseTable.map(([course, duration, cats, cost], i) => (
                <tr key={course} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{course}</td>
                  <td className="px-4 py-3 text-gray-600">{duration}</td>
                  <td className="px-4 py-3 text-gray-600">{cats}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/what-you-need-to-hire-a-cherry-picker.webp"
        alt="Articulated boom lift at full extension on an exterior building maintenance job UK"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Situation guide */}
      <section>
        <H2>When You Need an IPAF Card: Situation Guide</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Situation</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">IPAF Card Required?</th>
              </tr>
            </thead>
            <tbody>
              {ipafSituationTable.map(([situation, required], i) => (
                <tr key={situation} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-medium text-gray-700">{situation}</td>
                  <td className={`px-4 py-3 font-bold ${required.startsWith('Not') ? 'text-amber-700' : required.startsWith('Yes') ? 'text-red-600' : 'text-gray-500'}`}>{required}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Harness requirements */}
      <section>
        <H2>Harness Requirements on Cherry Pickers</H2>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <p className="text-sm font-semibold">
            Under the Work at Height Regulations 2005 and IPAF guidance, a full-body harness attached
            to the manufacturer's anchor point must be worn by every person in the platform of a
            boom-type MEWP (Category 3b) at all times when the platform is elevated. This is not
            optional — even if the platform has railings.
          </p>
        </div>
        <Prose>
          <p className="mt-4">
            Scissor lifts (Category 3a) do not require a harness as standard, but site rules may
            specify one. Confirm requirements with the depot and the site manager before use.
          </p>
          <p>
            For full HSE MEWP guidance, see{' '}
            <a
              href="https://www.hse.gov.uk/work-equipment-machinery/mobile-elevating-work-platforms.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              hse.gov.uk — MEWP safety guidance
            </a>
            . Primary legislation:{' '}
            <a
              href="https://www.legislation.gov.uk/uksi/2005/735"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Work at Height Regulations 2005
            </a>
            .
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/do-you-need-pasma-to-hire-scaffold-tower-in-the-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Do You Need PASMA to Hire a Scaffold Tower? →
            </span>
          </Link>
          <Link
            to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Scaffold Tower Hire UK: Prices, Sizes &amp; PASMA Rules →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-london"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire in London: Compare Prices From Local Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-save-money"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              How Tool Hire Comparison Actually Saves Your Money →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={ipafFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Find Cherry Picker Hire Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk and compare cherry picker and powered access hire from local
          UK suppliers — delivery, operating weight, and all-in pricing in one place.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 22 — Scaffold Tower Hire Cost UK 2026                      */
/* ------------------------------------------------------------------ */

const scaffoldCostRatesTable: [string, string, string, string, string][] = [
  ['Low-level tower', 'Up to 2.5 m', '£18–£28', '£40–£65', '£110–£160'],
  ['Standard single-width', 'Up to 4.2 m', '£22–£35', '£55–£85', '£140–£200'],
  ['Single-width mid-height', 'Up to 6.0 m', '£28–£42', '£70–£110', '£180–£260'],
  ['Single-width high', 'Up to 8.2 m', '£38–£55', '£90–£140', '£230–£340'],
  ['Single-width XL', 'Up to 10.0 m', '£48–£70', '£120–£175', '£290–£420'],
  ['Double-width standard', 'Up to 6.0 m', '£45–£65', '£110–£160', '£270–£380'],
  ['Double-width high', 'Up to 8.0 m', '£55–£80', '£130–£200', '£320–£460'],
  ['Stairway tower', 'Up to 8.0 m', '£55–£80', '£130–£200', '£320–£460'],
];

const scaffoldDeliveryTable: [string, string][] = [
  ['Self-collect', '£0'],
  ['Under 10 miles', '£40–£65'],
  ['10–25 miles', '£60–£90'],
  ['25–50 miles', '£80–£120'],
  ['50+ miles', 'POA — typically £100+'],
];

const scaffoldDurationTable: [string, string, string][] = [
  ['1 day', '£22–£35 (day rate)', 'Baseline'],
  ['3 days', '£66–£105 (3× day rate) vs £55–£85 (weekly)', 'Book weekly from day 3 onwards'],
  ['1 week', '£55–£85', 'Save ~25% vs 5 day rates'],
  ['2 weeks', '£95–£150 (most depots offer a discount)', 'Better than 2× weekly'],
  ['4 weeks', '£140–£200', 'Roughly 2.5× the weekly rate'],
];

const scaffoldJobCostTable: [string, string, string, string, string, string][] = [
  ['Exterior house painting (2-storey)', 'Standard single-width', '1 week', '£70', 'Self-collect', '~£70'],
  ['Fascia, soffit, guttering (3 elevations)', 'Standard single-width', '2 weeks', '£130', '£80 return', '~£210'],
  ['Chimney pointing (semi-det)', 'Single-width high (8 m)', '1 week', '£110', '£80 return', '~£190'],
  ['Interior ceiling repair (commercial unit)', 'Low-level double-width', '2 weeks', '£260', '£80 return', '~£340'],
  ['Exterior rendering (3-storey commercial)', 'Double-width high', '4 weeks', '£400', '£120 return', '~£520'],
];

const scaffoldCostFaqs: Faq[] = [
  [
    'How much does it cost to hire a scaffold tower for a week?',
    'A standard single-width scaffold tower for a 4-metre working height costs around £55–£85 per week in the UK. Taller and double-width towers run £90–£200 per week. All prices are VAT-inclusive guidance — confirm current local rates on Tooli.uk.',
  ],
  [
    'Is a scaffold tower cheaper than a cherry picker?',
    'Yes — significantly. A scaffold tower costs £55–£200 per week. A self-drive cherry picker runs £350–£900 per week. For fixed-position work lasting more than one day, scaffold towers are almost always the more cost-effective choice.',
  ],
  [
    'Can I get a scaffold tower for less than a week?',
    'Day rates are available from most depots, typically £18–£70 per day depending on tower size. However, if your job runs 3 or more days, the weekly rate is cheaper. Many depots also offer flexible pricing for 3-day weekend hires.',
  ],
  [
    'Do hire companies charge VAT on scaffold tower hire?',
    'VAT-registered hire companies (most commercial depots) add 20% VAT to hire charges. Always confirm whether a quote is ex-VAT before comparing across suppliers.',
  ],
  [
    'What deposit do I need for scaffold tower hire?',
    'Typically £100–£300 held on a credit or debit card at collection. Released in full on undamaged return. The deposit is held separately from the hire charge — it is not an additional payment, just a security hold.',
  ],
];

function ScaffoldCostBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Cost Quick Reference</h2>
        <CheckList
          items={[
            'Low-level tower: £40–£65/week',
            'Standard single-width (4 m working height): £55–£85/week',
            'Mid-height single-width (6 m): £70–£110/week',
            'High single-width (8–10 m): £90–£175/week',
            'Double-width / stairway: £110–£200/week',
            'Delivery: typically £40–£120 return (or self-collect free if you have a van)',
          ]}
        />
      </section>

      {/* Full rates table */}
      <section>
        <H2>Scaffold Tower Hire Rates 2026: Full Breakdown</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Tower Type</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Working Height</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Day Rate</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Week Rate</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">4-Week Rate</th>
              </tr>
            </thead>
            <tbody>
              {scaffoldCostRatesTable.map(([type, height, day, week, month], i) => (
                <tr key={type} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{type}</td>
                  <td className="px-4 py-3 text-gray-600">{height}</td>
                  <td className="px-4 py-3 text-gray-600">{day}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{week}</td>
                  <td className="px-4 py-3 text-gray-600">{month}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">VAT-inclusive guidance. Compare live quotes on Tooli.uk.</p>
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/scaffold-tower-hire-cost.webp"
        alt="Standard single-width scaffold tower assembled against a two-storey UK terraced house for gutter cleaning"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Additional costs */}
      <section>
        <H2>Additional Costs to Budget For</H2>

        <H3>Delivery and Collection</H3>
        <Prose>
          <p>
            Self-collection in a van or estate car with roof bars cuts delivery cost to zero for most
            hire towers. If you need delivery:
          </p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Distance from Depot</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Typical Delivery Charge (return)</th>
              </tr>
            </thead>
            <tbody>
              {scaffoldDeliveryTable.map(([distance, charge], i) => (
                <tr key={distance} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-medium text-gray-700">{distance}</td>
                  <td className={`px-4 py-3 font-bold ${distance === 'Self-collect' ? 'text-brand-primary' : 'text-gray-600'}`}>{charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>Damage Waiver</H3>
        <Prose>
          <p>
            Scaffold tower sections are lightweight aluminium — they dent and bend. Most depots offer
            a damage waiver at £5–£15 per week capping accidental damage liability. Worth taking,
            especially for taller towers where the cost of replacing bent or twisted sections adds up
            quickly.
          </p>
        </Prose>

        <H3>Deposit</H3>
        <Prose>
          <p>
            Deposits on scaffold tower hire are typically £100–£300 held on card. Released in full on
            undamaged return. Photograph every section on collection — dents and scratches from
            previous hirers should be logged with the depot before you take the equipment away.
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Scaffold Tower Hire UK: Prices, Sizes &amp; PASMA Rules →
            </span>
          </Link>
          <Link
            to="/blog/do-you-need-pasma-to-hire-scaffold-tower-in-the-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Do You Need PASMA to Hire a Scaffold Tower? →
            </span>
          </Link>
        </div>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/scaffold-tower-hire-cost-uk.webp"
        alt="Double-width scaffold tower with aluminium stairway access on a large commercial building UK"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Duration savings */}
      <section>
        <H2>Duration Savings: When Weekly Beats Daily</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Duration</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Standard Single-Width Cost</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {scaffoldDurationTable.map(([duration, cost, verdict], i) => (
                <tr key={duration} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{duration}</td>
                  <td className="px-4 py-3 text-gray-600">{cost}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose>
          <p className="mt-4">
            The pattern is clear: if your job runs 3 or more working days, book by the week. If it
            runs more than 8 days, check whether a discounted second-week or monthly rate is available.
          </p>
        </Prose>
      </section>

      {/* Real job scenarios */}
      <section>
        <H2>Total Cost Examples: Real Job Scenarios</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Job</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Tower Type</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Duration</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Hire Cost</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Delivery</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Approx Total</th>
              </tr>
            </thead>
            <tbody>
              {scaffoldJobCostTable.map(([job, tower, duration, hire, delivery, total], i) => (
                <tr key={job} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{job}</td>
                  <td className="px-4 py-3 text-gray-600">{tower}</td>
                  <td className="px-4 py-3 text-gray-600">{duration}</td>
                  <td className="px-4 py-3 text-gray-600">{hire}</td>
                  <td className="px-4 py-3 text-gray-600">{delivery}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">Figures use mid-range market rates as guidance. Confirm current quotes on Tooli.uk.</p>
      </section>

      {/* How to keep costs down */}
      <section>
        <H2>How to Keep Scaffold Tower Hire Costs Down</H2>
        <CheckList
          items={[
            'Self-collect if you have a van or large estate car — saves £40–£120 per hire.',
            'Book weekly from day 3 — daily rates are always more expensive per day than the weekly equivalent.',
            'Hire the minimum height that safely suits the job — each height step adds cost and assembly complexity.',
            'Compare at least 3 local suppliers before booking — rates for identical towers vary by 15–25% between depots.',
            'Return the tower in clean condition — dirty or damaged sections attract charges that wipe out any savings from shopping around.',
          ]}
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/cherry-picker-vs-scaffold-tower-which-access-option-do-you-actually-need"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Cherry Picker vs Scaffold Tower: Which Do You Need? →
            </span>
          </Link>
          <Link
            to="/blog/ipaf-licence-hire-cherry-picker-hire-what-you-actually-need"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              IPAF Licence for Cherry Picker Hire: What You Need →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-save-money"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              How Tool Hire Comparison Actually Saves Your Money →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-london"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire in London: Compare Prices From Local Suppliers →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={scaffoldCostFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Scaffold Tower Hire Prices Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk and compare scaffold tower hire quotes from local UK
          suppliers — all-in pricing, delivery included, available by day or week.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 23 — Wacker Plate Hire UK: Prices & Plate Sizes Compared   */
/* ------------------------------------------------------------------ */

const wackerPriceTable: [string, string, string, string, string, string][] = [
  ['Small forward', '50–75 kg', '400–450 mm', '£45–£65', '£75–£100', '£140–£190'],
  ['Medium forward', '75–150 kg', '450–550 mm', '£60–£90', '£95–£140', '£190–£270'],
  ['Large forward', '150–250 kg', '550–650 mm', '£80–£120', '£125–£180', '£250–£360'],
  ['Reversible plate', '200–350 kg', '550–700 mm', '£90–£130', '£140–£200', '£280–£390'],
  ['Heavy reversible', '350–550 kg', '650–800 mm', '£110–£160', '£170–£240', '£340–£480'],
];

const wackerJobTable: [string, string, string][] = [
  ['Patio slab base preparation (MOT Type 1, 75–100 mm)', 'Small forward (50–75 kg)', 'Light compaction duty, easy to manoeuvre between existing features'],
  ['Block paving driveway (Type 1 sub-base, 100–150 mm)', 'Medium forward (75–150 kg)', 'Deeper base layer needs more compaction force; wider plate covers area faster'],
  ['Concrete driveway sub-base (150–200 mm deep)', 'Large forward or reversible (150–250 kg)', 'Thick layers require heavy compaction to reach target density'],
  ['Tarmac re-lay (surface course)', 'Medium forward (rubber pad fitted)', 'Rubber pad protects the surface — confirm the depot supplies one'],
  ['Trench backfill compaction', 'Medium to large forward', 'Confined spaces may limit reversible plate access'],
  ['Road base / hardcore (200 mm+ deep)', 'Heavy reversible (300–550 kg)', 'Deep granular layers require high compaction energy; reversible avoids hand-turning at trench ends'],
  ['Landscaping / topsoil consolidation', 'Small forward (50–75 kg)', 'Only light consolidation needed — heavy plate will over-compact and damage soil structure'],
  ['Slate / decorative aggregate', 'Small forward or hand rammer', 'Large plates can fracture decorative stone — use with care or substitute a hand rammer'],
];

const wackerComparisonTable: [string, string, string][] = [
  ['Direction of travel', 'Forward only', 'Forward and reverse'],
  ['Manoeuvring at trench ends', 'Manual lift and turn', 'Self-reversing — no manual lifting'],
  ['Operating weight', '50–250 kg', '200–550 kg'],
  ['Compaction force', 'Lower–medium', 'Medium–high'],
  ['Best for', 'Patios, paths, block paving, open areas', 'Trenches, road base, deep compaction layers, confined runs'],
  ['Hire cost premium', 'Baseline', 'Typically 15–25% more than equivalent forward plate'],
];

const wackerFaqs: Faq[] = [
  [
    'How much does it cost to hire a wacker plate for a day?',
    'A small forward wacker plate (50–75 kg) costs around £45–£65 per day in the UK. A medium plate (75–150 kg) for driveway work runs £60–£90/day. A large reversible plate for road-base compaction is typically £90–£130/day. All prices are VAT-inclusive guidance — confirm current rates on Tooli.uk.',
  ],
  [
    'Do I need a licence to use a wacker plate?',
    'No — there is no formal licence requirement to operate a wacker plate. Under PUWER 1998, you must be competent to use work equipment safely. Most hire depots will give you a brief handover on collection. Hearing protection is mandatory under the Control of Noise at Work Regulations 2005.',
  ],
  [
    'What is the difference between a wacker plate and a roller?',
    'A wacker plate (vibrating plate compactor) uses vibration to compact granular materials like MOT Type 1, gravel, and hardcore. A roller uses static weight and often vibration to compact larger areas — more commonly used on road surfaces and large groundworks. For domestic patio and driveway prep, a wacker plate is the standard choice.',
  ],
  [
    'Can I use a wacker plate on block paving?',
    'Yes — but only with a rubber or polyurethane pad fitted beneath the plate. Running a bare steel wacker plate on block paving will scratch and chip the surface. Most depots supply a rubber pad for block paving use — confirm this is included or hire it separately.',
  ],
  [
    'What fuel does a wacker plate use?',
    'Most hire-fleet wacker plates run on petrol. Return the machine with the same fuel level as collected. Larger reversible plates may be diesel — confirm at the point of hire.',
  ],
];

function WackerPlateBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Wacker Plate Hire at a Glance</h2>
        <CheckList
          items={[
            'Small forward plate (50–75 kg): typically £45–£65/day — patios, paths, light sub-base',
            'Medium forward plate (75–150 kg): typically £60–£90/day — driveways, block paving, heavier sub-base',
            'Large forward plate (150–250 kg): typically £80–£120/day — commercial paving, thick compaction',
            'Reversible plate (200–500 kg): typically £90–£130/day — road base, deep granular layers',
            'Petrol: most common in hire fleets; diesel available on larger plates',
            'No licence required to operate a wacker plate — competence required under PUWER',
          ]}
        />
      </section>

      {/* Price table */}
      <section>
        <H2>Wacker Plate Hire Prices UK 2026</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Plate Class</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Weight</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Plate Width</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Day Rate</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Weekend</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Week Rate</th>
              </tr>
            </thead>
            <tbody>
              {wackerPriceTable.map(([cls, weight, width, day, weekend, week], i) => (
                <tr key={cls} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{cls}</td>
                  <td className="px-4 py-3 text-gray-600">{weight}</td>
                  <td className="px-4 py-3 text-gray-600">{width}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{day}</td>
                  <td className="px-4 py-3 text-gray-600">{weekend}</td>
                  <td className="px-4 py-3 text-gray-600">{week}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">VAT-inclusive guidance. Compare live quotes on Tooli.uk.</p>
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/wacker-plate-hire-uk.webp"
        alt="Medium forward wacker plate compacting MOT Type 1 sub-base for a block paving driveway UK"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Plate to job */}
      <section>
        <H2>Plate Size to Job: Quick Reference</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Job</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Recommended Plate</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Reason</th>
              </tr>
            </thead>
            <tbody>
              {wackerJobTable.map(([job, plate, reason], i) => (
                <tr key={job} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{job}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{plate}</td>
                  <td className="px-4 py-3 text-gray-600">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Forward vs Reversible */}
      <section>
        <H2>Forward Plate vs Reversible Plate: Which Do You Need?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Feature</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Forward Plate</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Reversible Plate</th>
              </tr>
            </thead>
            <tbody>
              {wackerComparisonTable.map(([feature, forward, reversible], i) => (
                <tr key={feature} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{feature}</td>
                  <td className="px-4 py-3 text-gray-600">{forward}</td>
                  <td className="px-4 py-3 text-gray-600">{reversible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/tool-hire-comparison-save-money"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              How Tool Hire Comparison Actually Saves Your Money →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire Comparison UK: Compare Plant Hire Suppliers →
            </span>
          </Link>
        </div>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/wacker-plate-hire-uk-prices-sizes-compared.webp"
        alt="Reversible vibrating plate compactor in a trench during drainage groundwork on a UK building site"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Petrol vs Diesel */}
      <section>
        <H2>Petrol vs Diesel Wacker Plate</H2>
        <Prose>
          <p>
            Most wacker plates in UK hire fleets are petrol-powered. Diesel plates are available on
            larger reversible models — they are more economical on extended jobs but typically add
            10–15% to the hire rate. Never operate a petrol or diesel plate in an enclosed or poorly
            ventilated space — CO poisoning risk is serious and rapid.
          </p>
        </Prose>
      </section>

      {/* Safe operation */}
      <section>
        <H2>Operating a Wacker Plate Safely</H2>
        <CheckList
          items={[
            'Wear hearing protection — wacker plates generate 95–105 dB. HSE Control of Noise at Work Regulations 2005 set mandatory hearing protection above 85 dB.',
            'Wear steel-toe boots and high-visibility clothing on any site with vehicle movement.',
            'Check for buried services before compacting — use LSBUD (lsbud.co.uk) before any groundwork.',
            'Keep bystanders well clear — the plate can eject surface stones at force.',
            'Do not operate on slopes steeper than the manufacturer\'s rated gradient — most plates are rated to a maximum 20–25% slope.',
            'Fit the rubber pad when compacting block paving or tarmac — running a bare steel plate on finished paving will damage the surface.',
          ]}
        />
        <Prose>
          <p className="mt-4">
            For legal requirements, see{' '}
            <a
              href="https://www.hse.gov.uk/noise/regulations.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE Control of Noise at Work Regulations 2005
            </a>
            ,{' '}
            <a
              href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE PUWER guidance
            </a>
            , and{' '}
            <a
              href="https://www.lsbud.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              LSBUD
            </a>{' '}
            for buried service checks.
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/tool-hire-london"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire in London: Compare Prices From Local Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/plant-hire-london-compare-local-plant-hire-companies"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Plant Hire London: Compare Local Plant Hire Companies →
            </span>
          </Link>
          <Link
            to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Scaffold Tower Hire Cost UK: What You'll Pay in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-sw19-london-postcode-area-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire SW19: London Postcode Area Guide →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={wackerFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Wacker Plate Hire Prices Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk and compare wacker plate hire from local UK suppliers —
          all plate sizes, petrol and diesel, by day or week.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 24 — What Size Wacker Plate for a Patio?                   */
/* ------------------------------------------------------------------ */

const wackerPatioSizeTable: [string, string, string, string][] = [
  ['Flag paving (concrete or natural stone)', '75–100 mm Type 1', 'Small forward plate', '50–75 kg'],
  ['Block paving (domestic)', '100–150 mm Type 1', 'Small to medium forward (with rubber pad)', '50–120 kg'],
  ['Block paving (driveway)', '150–200 mm Type 1', 'Medium forward (with rubber pad)', '100–150 kg'],
  ['Gravel or hoggin patio', '50–75 mm compacted', 'Small forward plate', '50–75 kg'],
  ['Porcelain tiles (on mortar bed)', '75–100 mm Type 1 + screed', 'Small forward — or hand tamper on delicate tiles', '50–75 kg'],
  ['Resin-bound surface', '100–150 mm Type 1', 'Medium forward', '100–150 kg'],
];

const wackerPassesTable: [string, string, string, string][] = [
  ['400 mm (small plate)', '~50 passes', '~100 passes', '2–3 hours for 20 m²'],
  ['500 mm (medium plate)', '~40 passes', '~80 passes', '1.5–2.5 hours for 20 m²'],
  ['600 mm (large plate)', '~34 passes', '~67 passes', '1–2 hours for 20 m²'],
];

const wackerPatioFaqs: Faq[] = [
  [
    'What size wacker plate do I need for a 30 m² patio?',
    'A small forward plate (50–75 kg, 400–450 mm wide) is the right size for most domestic 30 m² patios. It is manoeuvrable in a garden setting, correctly matched to 75–150 mm Type 1 sub-base depths, and available from most local hire depots at around £45–£65 per day.',
  ],
  [
    'Do I need a rubber pad to compact block paving?',
    'Yes — always. Running a bare steel wacker plate on block paving will scratch and chip the surface. A rubber or polyurethane pad must be fitted beneath the plate for any work on finished or semi-finished paving. Confirm the depot supplies one before booking — some charge separately for the pad.',
  ],
  [
    'Can a wacker plate compact wet sub-base?',
    'It is best to compact when sub-base material is slightly damp but not waterlogged. Dry Type 1 compacts less well. Saturated ground does not compact at all — the vibration moves water through the material without achieving density. Wait until ground conditions are correct before compacting.',
  ],
  [
    'How many passes does a wacker plate need?',
    'For a domestic patio sub-base, 4–6 passes over each section is typically sufficient. Check with a spirit level as you go. Multiple thin layers (100 mm max each) compacted separately always outperform a single thick layer with multiple passes.',
  ],
  [
    'Is a wacker plate the same as a tamper?',
    'No. A hand tamper (or punner) is a manual tool for small area compaction, particularly in trenches and tight corners. A wacker plate is a petrol or diesel powered vibrating plate compactor. Both compact, but a wacker plate covers larger areas far more efficiently and is the correct tool for sub-base preparation on a patio.',
  ],
];

function WackerPatioSizeBody() {
  return (
    <>
      {/* Plate by patio type table */}
      <section>
        <H2>Wacker Plate Size by Patio Type</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Patio Type</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Sub-Base Depth</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Recommended Plate Size</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Plate Weight</th>
              </tr>
            </thead>
            <tbody>
              {wackerPatioSizeTable.map(([type, depth, plate, weight], i) => (
                <tr key={type} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{type}</td>
                  <td className="px-4 py-3 text-gray-600">{depth}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{plate}</td>
                  <td className="px-4 py-3 text-gray-600">{weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared →
          </span>
        </Link>
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/what-size-wacker-plate.webp"
        alt="Small 60 kg forward wacker plate compacting MOT Type 1 sub-base for a residential patio UK"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Passes table */}
      <section>
        <H2>Patio Size and Number of Passes</H2>
        <Prose>
          <p>Wacker plate width determines how many passes are needed to cover your patio area:</p>
        </Prose>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Plate Width</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Passes for 20 m²</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Passes for 40 m²</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Time Estimate</th>
              </tr>
            </thead>
            <tbody>
              {wackerPassesTable.map(([width, p20, p40, time], i) => (
                <tr key={width} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{width}</td>
                  <td className="px-4 py-3 text-gray-600">{p20}</td>
                  <td className="px-4 py-3 text-gray-600">{p40}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose>
          <p className="mt-4">
            For a standard 20–30 m² domestic patio, a small plate (400–450 mm) is perfectly adequate
            — the extra coverage per pass from a larger plate rarely justifies the additional hire cost
            or the extra weight to manoeuvre in a domestic garden.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-4 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money →
          </span>
        </Link>
      </section>

      {/* Key rules */}
      <section>
        <H2>Key Rules for Wacker Plate Use on a Patio</H2>

        <H3>Always Fit the Rubber Pad</H3>
        <Prose>
          <p>
            If you are compacting block paving or any finished surface, fit the rubber or polyurethane
            pad beneath the plate. Without it, the steel base plate will scratch, chip, and disfigure
            the paving. Most depots include a rubber pad with block paving hire — confirm before you
            collect.
          </p>
        </Prose>

        <H3>Compact Before Laying, Not After</H3>
        <Prose>
          <p>
            The sub-base (MOT Type 1 or sharp sand bedding layer) should be compacted before you lay
            the slabs or blocks. Do not run a wacker plate over fully laid slabs to 'bed them in' —
            use a rubber-headed mallet or a plate with a pad if final compaction of block paving is
            needed.
          </p>
        </Prose>

        <H3>Compact in Layers</H3>
        <Prose>
          <p>
            Type 1 sub-base should be compacted in layers of no more than 100 mm at a time. Tipping a
            200 mm depth and running one pass over it does not give you a properly compacted base —
            split it into two 100 mm lifts, compacting between layers.
          </p>
        </Prose>

        <H3>Watch Plate Direction on Slopes</H3>
        <Prose>
          <p>
            Compact across a slope rather than up and down it where possible. If the ground is uneven,
            work from the outside edges toward the centre. Keep the plate moving at all times —
            holding it stationary concentrates compaction force and can create a surface depression.
          </p>
        </Prose>

        <H3>How Many Passes?</H3>
        <Prose>
          <p>
            Typically 4–6 passes over each section gives adequate compaction on a domestic sub-base.
            Use a spirit level or straight edge to check for high/low spots as you go — it is much
            easier to correct during compaction than after slabs are laid.
          </p>
        </Prose>
        <Prose>
          <p>
            Always check for buried utility services before any groundwork using{' '}
            <a
              href="https://www.lsbud.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              LSBUD (lsbud.co.uk)
            </a>
            . Wearing hearing protection is mandatory under the{' '}
            <a
              href="https://www.hse.gov.uk/noise"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE Control of Noise at Work Regulations 2005
            </a>
            .
          </p>
        </Prose>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/what-size-wacker-plate-do.webp"
        alt="Rubber pad fitted beneath wacker plate being used to compact domestic block paving without surface damage"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Can I use any plate? */}
      <section>
        <H2>Can I Use Any Wacker Plate for a Patio?</H2>
        <Prose>
          <p>
            In theory yes — but in practice, a plate that is too heavy risks over-compacting a shallow
            sub-base, pushing fine material to the surface and creating an unstable layer. A plate that
            is too light will not achieve adequate compaction density, especially on a 150 mm+
            sub-base. Match the plate to the sub-base depth using the table above.
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/tool-hire-london"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire in London: Compare Prices From Local Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/plant-hire-london-compare-local-plant-hire-companies"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Plant Hire London: Compare Local Plant Hire Companies →
            </span>
          </Link>
          <Link
            to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Scaffold Tower Hire Cost UK: What You'll Pay in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-sw19-london-postcode-area-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire SW19: London Postcode Area Guide →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={wackerPatioFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Find a Wacker Plate for Your Patio Project</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk and compare wacker plate hire from local UK suppliers — small
          forward plates to large reversible compactors, available by day or week.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 25 — Wacker Plate Hire Cost UK 2026                        */
/* ------------------------------------------------------------------ */

const wackerCostRatesTable: [string, string, string, string, string][] = [
  ['Small forward', '50–75 kg', '£45–£65', '£75–£100', '£140–£190'],
  ['Medium forward', '75–150 kg', '£60–£90', '£95–£140', '£190–£270'],
  ['Large forward', '150–250 kg', '£80–£120', '£125–£180', '£250–£360'],
  ['Reversible plate', '200–350 kg', '£90–£130', '£140–£200', '£280–£390'],
  ['Heavy reversible', '350–550 kg', '£110–£160', '£170–£240', '£340–£480'],
];

const wackerTotalCostTable: [string, string, string, string, string, string, string][] = [
  ['20 m² patio sub-base', 'Small forward', '1 day', '£55', '£10', '£8', '~£73'],
  ['Block paving driveway (40 m²)', 'Medium forward', '1 day', '£75', '£10', '£10', '~£95'],
  ['Resin driveway sub-base prep', 'Medium forward', '1 day', '£75', '£0', '£10', '~£85'],
  ['Trench backfill (drainage, 30 m)', 'Reversible plate', '1 day', '£110', '£0', '£15', '~£125'],
  ['Road base (large commercial area)', 'Heavy reversible', '2 days', '£290', '£0', '£35', '~£325'],
];

const wackerCostFaqs: Faq[] = [
  [
    'How much does it cost to hire a wacker plate for a day?',
    'A small forward wacker plate costs around £45–£65 per day in the UK. A medium plate for driveway work runs £60–£90/day. A large reversible plate for deep compaction is £90–£160/day. All prices are VAT-inclusive guidance — confirm current local rates on Tooli.uk.',
  ],
  [
    'Are weekend wacker plate rates cheaper than two day rates?',
    'Usually yes. A weekend (Friday to Monday) rate is typically 1.5–1.8× the daily rate, versus 2× if you paid two separate day rates. If your job spans Saturday and Sunday, always book the weekend rate.',
  ],
  [
    'Does wacker plate hire include a rubber pad for block paving?',
    'Not always — it depends on the depot. Some include the rubber pad in the hire price; others charge £5–£15 extra per day. Always confirm before booking if you\'re working on block paving or tarmac.',
  ],
  [
    'Can I hire a wacker plate for less than a day?',
    'Half-day rates are available from some depots, typically 60–70% of the full-day rate. However, most jobs requiring a wacker plate take a full day when you account for travel, setup, compaction, and return. Check with your local depot — Tooli.uk lists suppliers offering flexible rate structures.',
  ],
  [
    'What is the deposit on wacker plate hire?',
    'Typically £100–£250 held on a credit or debit card. Released in full on return of the machine in good working order and with the original fuel level. Photograph the plate on collection to protect against pre-existing damage disputes.',
  ],
];

function WackerCostBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Cost Quick Reference</h2>
        <CheckList
          items={[
            'Small forward plate (50–75 kg): £45–£65/day | £75–£100/weekend',
            'Medium forward plate (75–150 kg): £60–£90/day | £95–£140/weekend',
            'Large forward plate (150–250 kg): £80–£120/day | £125–£180/weekend',
            'Reversible plate (200–350 kg): £90–£130/day | £140–£200/weekend',
            'Heavy reversible (350–550 kg): £110–£160/day | £170–£240/weekend',
            'Rubber pad for block paving: £5–£15/day extra (some depots include it)',
          ]}
        />
      </section>

      {/* Rates table */}
      <section>
        <H2>Wacker Plate Hire Rates 2026</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Plate Class</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Weight</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Day Rate</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Weekend (Fri–Mon)</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Week Rate</th>
              </tr>
            </thead>
            <tbody>
              {wackerCostRatesTable.map(([cls, weight, day, weekend, week], i) => (
                <tr key={cls} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{cls}</td>
                  <td className="px-4 py-3 text-gray-600">{weight}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{day}</td>
                  <td className="px-4 py-3 text-gray-600">{weekend}</td>
                  <td className="px-4 py-3 text-gray-600">{week}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">VAT-inclusive guidance. Compare live rates on Tooli.uk.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared →
            </span>
          </Link>
          <Link
            to="/blog/what-size-wacker-plate-do-i-need-for-a-patio-the-direct-answer"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              What Size Wacker Plate Do I Need for a Patio? →
            </span>
          </Link>
        </div>
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/wacker-plate-hire-cost-uk.webp"
        alt="Medium forward wacker plate on hire at a residential driveway block paving project UK"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Additional costs */}
      <section>
        <H2>Additional Costs</H2>

        <H3>Rubber Pad</H3>
        <Prose>
          <p>
            If you're compacting block paving or tarmac, you need a rubber or polyurethane pad fitted
            beneath the plate to avoid surface damage. Some depots include this; others charge £5–£15
            per day. Always confirm before booking — arriving on site without a pad when you're laying
            block paving means a wasted trip back to the depot.
          </p>
        </Prose>

        <H3>Fuel</H3>
        <Prose>
          <p>
            Most wacker plates run on petrol. Budget approximately £5–£15 per day of use depending on
            plate size and running time. Return the machine with the same fuel level as collected.
          </p>
        </Prose>

        <H3>Delivery</H3>
        <Prose>
          <p>
            Wacker plates are compact enough to fit in the boot of most estate cars and SUVs.
            Self-collection is easy and saves the delivery charge (typically £30–£70 return for a
            wacker plate). For a heavier reversible plate, a van is more practical.
          </p>
        </Prose>

        <H3>Deposit</H3>
        <Prose>
          <p>
            Deposits on wacker plate hire are typically £100–£250 held on card, released on undamaged
            return.
          </p>
        </Prose>
        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-4 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money →
          </span>
        </Link>
      </section>

      {/* Total cost examples */}
      <section>
        <H2>Total Cost Examples</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Job</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Plate Size</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Duration</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Hire Cost</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Rubber Pad</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Fuel Est.</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Total</th>
              </tr>
            </thead>
            <tbody>
              {wackerTotalCostTable.map(([job, plate, duration, hire, pad, fuel, total], i) => (
                <tr key={job} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{job}</td>
                  <td className="px-4 py-3 text-gray-600">{plate}</td>
                  <td className="px-4 py-3 text-gray-600">{duration}</td>
                  <td className="px-4 py-3 text-gray-600">{hire}</td>
                  <td className="px-4 py-3 text-gray-600">{pad}</td>
                  <td className="px-4 py-3 text-gray-600">{fuel}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/what-size-wacker-plate-do.webp"
        alt="Rubber pad fitted beneath forward plate compactor on block paving — essential to prevent surface damage"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Weekend vs day rate */}
      <section>
        <H2>Weekend vs Day Rate: Is It Worth Booking a Weekend?</H2>
        <Prose>
          <p>
            Most hire depots offer a Friday-to-Monday weekend rate equivalent to 1.5–1.8 times the
            single day rate. If your job runs into Saturday and Sunday, a weekend rate is almost always
            cheaper than paying two individual day rates. Check whether your depot charges the weekend
            rate from Friday collection or Saturday — this varies.
          </p>
          <p>
            For full operator competence requirements when using hired work equipment, see{' '}
            <a
              href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE PUWER guidance
            </a>
            . Hearing protection is mandatory under the{' '}
            <a
              href="https://www.hse.gov.uk/noise"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE Control of Noise at Work Regulations 2005
            </a>
            .
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/tool-hire-london"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire in London: Compare Prices From Local Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/plant-hire-london-compare-local-plant-hire-companies"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Plant Hire London: Compare Local Plant Hire Companies →
            </span>
          </Link>
          <Link
            to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Scaffold Tower Hire Cost UK: What You'll Pay in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-sw19-london-postcode-area-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire SW19: London Postcode Area Guide →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={wackerCostFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Wacker Plate Hire Prices Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk and compare day and weekend rates from local UK suppliers —
          forward plates and reversible compactors, with or without rubber pad.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 26 — Dehumidifier Hire UK: Prices & Which Size to Choose   */
/* ------------------------------------------------------------------ */

const dehumidifierPriceTable: [string, string, string, string, string, string][] = [
  ['Small', '20–30 L/day', 'Single room, minor damp, small new-build', '£35–£55', '£130–£200', '£320–£480'],
  ['Medium', '40–60 L/day', '2–4 rooms, screed drying, post-plastering', '£55–£80', '£200–£290', '£490–£700'],
  ['Large', '70–100 L/day', 'Whole house, large commercial units, flood recovery', '£75–£110', '£270–£400', '£650–£950'],
  ['Industrial', '100–180 L/day', 'Serious flood recovery, large sites, industrial drying', '£100–£150', '£360–£540', '£850–£1,300'],
];

const dehumidifierMoistureTable: [string, string, string][] = [
  ['One damp bedroom — background moisture', 'Low', '20–30 L/day'],
  ['Post-plastering single room drying', 'Medium', '30–50 L/day'],
  ['Concrete screed drying (per 50 m²)', 'High', '50–70 L/day'],
  ['Post-flood drying (2–3 rooms)', 'Very high', '70–100 L/day'],
  ['Full house new-build drying-out programme', 'High — extended duration', '70–100 L/day (multiple units or extended hire)'],
  ['Serious flood recovery (whole property)', 'Very high', '100–180 L/day'],
  ['Large commercial unit post-construction', 'High — large volume', '100–180 L/day or multiple units'],
];

const dehumidifierDryingTable: [string, string, string][] = [
  ['Single wet room (minor flood/leak)', 'Medium (50 L/day)', '3–7 days'],
  ['Screed drying (100 m²)', 'Large (80 L/day)', '3–6 weeks'],
  ['Post-plaster new-build (3-bed house)', 'Large (80 L/day)', '4–8 weeks'],
  ['Post-flood ground floor (2 rooms)', 'Industrial (120 L/day)', '1–3 weeks'],
  ['Full new-build drying programme (detached house)', 'Large (80 L/day) or 2× medium', '6–12 weeks'],
];

const dehumidifierFaqs: Faq[] = [
  [
    'How much does it cost to hire an industrial dehumidifier?',
    'A large industrial dehumidifier (100–180 L/day extraction) costs around £100–£150 per day or £360–£540 per week in the UK. For whole-house drying after a flood or during a new-build drying programme, a large machine or multiple medium units are typically more cost-effective than a single small machine running for longer.',
  ],
  [
    'How long does it take to dry out a flooded room?',
    'A minor flood in a single room with a medium dehumidifier (50 L/day) typically takes 3–7 days. Serious flood recovery involving structural materials (plasterboard, joists, screed) takes longer — often 2–4 weeks with professional-grade equipment. Drying time depends on material type, machine size, temperature, and ventilation.',
  ],
  [
    'What is the difference between a refrigerant and desiccant dehumidifier?',
    'Refrigerant dehumidifiers use a compressor and cooling coils to condense moisture — efficient above 15°C. Desiccant dehumidifiers use a chemical rotor (silica gel) to absorb moisture — effective at temperatures as low as 1°C. For winter drying on unheated UK sites, a desiccant machine is the right choice.',
  ],
  [
    'Can I hire a dehumidifier for a new-build drying-out programme?',
    'Yes — building drying hire is a core use case for industrial dehumidifier hire. New-build drying programmes typically run 4–12 weeks. Hire companies with building drying experience can help specify the right size and hire duration.',
  ],
  [
    'Do I need more than one dehumidifier for a large house?',
    'Possibly. For a full detached house new-build drying programme, one large unit (80–100 L/day) may be sufficient if the building is well sealed and the machine is moved between floors. For faster drying, or a property with complex layouts, running two medium units simultaneously is often more effective.',
  ],
  [
    'What power supply does a hired dehumidifier need?',
    'Small and medium hire dehumidifiers (up to 60 L/day) typically run on a standard 13A socket. Large and industrial units (70 L/day+) may require a 16A or 32A supply. Confirm power requirements with the hire depot — particularly if the site is unfinished and relies on a temporary power supply.',
  ],
];

function DehumidifierHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 md:p-8">
        <h2 className="mb-4 text-xl font-extrabold text-[#030213]">Dehumidifier Hire at a Glance</h2>
        <CheckList
          items={[
            'Small (20–30 L/day): £35–£55/day — single room, minor moisture, small new-build rooms',
            'Medium (40–60 L/day): £55–£80/day — 2–4 rooms, post-flood drying, concrete screeds',
            'Large (70–100 L/day): £75–£110/day — whole-house drying, large commercial units',
            'Industrial (100–180 L/day): £100–£150/day — serious flood recovery, large sites',
            'Desiccant types available for very low-temperature drying — typically 20% more to hire',
            'Most machines require a standard 13A socket; larger units may need 16A or 32A',
          ]}
        />
      </section>

      {/* Price table */}
      <section>
        <H2>Dehumidifier Hire Prices UK 2026</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Capacity</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Extraction</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Best For</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Day Rate</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Week Rate</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">4-Week Rate</th>
              </tr>
            </thead>
            <tbody>
              {dehumidifierPriceTable.map(([cap, extract, bestFor, day, week, month], i) => (
                <tr key={cap} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{cap}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{extract}</td>
                  <td className="px-4 py-3 text-gray-600">{bestFor}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{day}</td>
                  <td className="px-4 py-3 text-gray-600">{week}</td>
                  <td className="px-4 py-3 text-gray-600">{month}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">VAT-inclusive guidance. Compare live quotes on Tooli.uk.</p>
        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money →
          </span>
        </Link>
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/dehumidifier-hire-uk.webp"
        alt="Industrial dehumidifier operating in a newly plastered UK new-build house during the drying-out programme"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* How to choose size */}
      <section>
        <H2>How to Choose the Right Size Dehumidifier</H2>

        <H3>1. Understand Extraction Rate (L/day)</H3>
        <Prose>
          <p>
            The key spec is litres of moisture extracted per day at a defined temperature and humidity.
            Manufacturers rate machines at 30°C and 80% relative humidity — in a real UK building
            drying situation (often 10–15°C), the actual extraction rate will be 30–50% lower than the
            rated figure. Factor this in when sizing up.
          </p>
        </Prose>

        <H3>2. Match to Room Volume and Moisture Load</H3>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Situation</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Moisture Load</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Recommended Capacity</th>
              </tr>
            </thead>
            <tbody>
              {dehumidifierMoistureTable.map(([situation, load, capacity], i) => (
                <tr key={situation} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{situation}</td>
                  <td className="px-4 py-3 text-gray-600">{load}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>3. Refrigerant vs Desiccant</H3>
        <Prose>
          <p>
            Most hire-fleet dehumidifiers are refrigerant (compressor-based) machines. They work best
            above 15°C. Below 15°C, extraction rate drops significantly and the coils may ice up. For
            winter drying on unheated sites, a desiccant dehumidifier is the correct choice — it
            maintains effective extraction at temperatures as low as 1–5°C. Desiccant machines
            typically cost 15–20% more to hire and consume more electricity.
          </p>
        </Prose>

        <H3>4. Power Requirements</H3>
        <Prose>
          <p>
            Small and medium machines run on a standard 13A household socket. Large and industrial
            units may require a 16A or 32A supply — confirm with the hire depot before booking if your
            site has limited power infrastructure.
          </p>
        </Prose>

        <H3>5. Continuous Drainage</H3>
        <Prose>
          <p>
            Industrial dehumidifiers extract large volumes of water rapidly. Most can be connected to a
            drain hose (supplied with the hire) to discharge directly to a drain rather than into a
            collection tank — essential for continuous operation over multiple days without manual
            emptying. Confirm the drainage setup before the machine is delivered.
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/tool-hire-london"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire in London: Compare Prices From Local Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/plant-hire-london-compare-local-plant-hire-companies"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Plant Hire London: Compare Local Plant Hire Companies →
            </span>
          </Link>
        </div>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/dehumidifier-hire-uk-prices-which-size.webp"
        alt="Large commercial dehumidifier with drain hose connected during flood recovery in a UK property"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Drying times */}
      <section>
        <H2>How Long Will It Take to Dry Out a Building?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Scenario</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Machine Size</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Estimated Drying Time</th>
              </tr>
            </thead>
            <tbody>
              {dehumidifierDryingTable.map(([scenario, size, time], i) => (
                <tr key={scenario} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{scenario}</td>
                  <td className="px-4 py-3 text-gray-600">{size}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose>
          <p className="mt-4">
            Drying times vary significantly with temperature, ventilation, material type (screed dries
            slower than plasterboard), and season. Hire depots with building drying experience can
            advise on specific site situations.
          </p>
        </Prose>
      </section>

      {/* Effective use */}
      <section>
        <H2>Using a Dehumidifier Effectively</H2>
        <CheckList
          items={[
            'Keep windows and doors closed while the machine is running — bringing in humid outdoor air undermines the drying process.',
            'Pair with a site heater in winter — warm air holds more moisture and improves extraction rate significantly.',
            'Empty the collection tank regularly if not using drain hose drainage — a full tank stops the machine.',
            'Position the machine centrally in the space being dried, not in a corner.',
            'Use a relative humidity meter (hygrometer) to track progress. Target below 60% RH for occupied spaces, below 75% RH for structural drying.',
          ]}
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Scaffold Tower Hire Cost UK: What You'll Pay in 2026 →
            </span>
          </Link>
          <Link
            to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-sw19-london-postcode-area-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire SW19: London Postcode Area Guide →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-comparison-uk"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire Comparison UK: Compare Plant Hire Suppliers →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={dehumidifierFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Dehumidifier Hire Prices Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk and compare industrial dehumidifier hire from local UK
          suppliers — all capacities, refrigerant and desiccant, by day or week.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Article 27 — Site Heater Hire UK                                   */
/* ------------------------------------------------------------------ */

const siteHeaterPriceTable: [string, string, string, string, string][] = [
  ['Diesel indirect (small)', '30 kW', 'Medium rooms, small shells', '£35–£55', '£130–£200'],
  ['Diesel indirect (medium)', '50–70 kW', 'Large shells, warehouses', '£55–£85', '£200–£310'],
  ['Diesel indirect (large)', '100 kW+', 'Very large or open structures', '£90–£130', '£330–£470'],
  ['Propane cabinet (small)', '15–20 kW', 'Open/ventilated areas — spot heat', '£25–£40', '£95–£150'],
  ['Propane cabinet (large)', '40–60 kW', 'Large open-air or ventilated sites', '£45–£70', '£165–£255'],
  ['Electric fan heater', '3–9 kW', 'Site offices, welfare, small rooms', '£20–£35', '£75–£130'],
];

const siteHeaterDecisionTable: [string, string][] = [
  ['Unfinished building shell (enclosed) — large area', 'Diesel indirect heater (50–100 kW)'],
  ['Well-ventilated or open site — spot heating', 'Propane cabinet heater'],
  ['Site office or welfare facility', 'Electric fan heater (3–9 kW)'],
  ['Frost protection for concrete or screed', 'Diesel indirect or propane — indirect preferred'],
  ['Drying programme alongside dehumidifier', 'Diesel indirect or electric — keep room sealed'],
  ['Small finished room (decorated, post-fit out)', 'Electric fan heater only — no combustion risk'],
];

const siteHeaterFaqs: Faq[] = [
  [
    'How much does it cost to hire a site heater in the UK?',
    'Site heater hire costs between £30 and £130 per day in the UK depending on type and output. A diesel indirect heater (50 kW) runs £55–£85/day. A propane cabinet heater (large) costs £45–£70/day. Electric fan heaters start from £20–£35/day. Fuel costs are additional.',
  ],
  [
    'Can I use a propane heater inside a building?',
    'Only with permanent adequate ventilation. Flueless LPG heaters exhaust combustion gases directly into the space they heat. In a sealed or poorly ventilated building, carbon monoxide levels can reach dangerous concentrations rapidly. Use a diesel indirect heater (which has a flue) for any enclosed or semi-enclosed internal space.',
  ],
  [
    'What size site heater do I need for a large building shell?',
    'A 50–70 kW diesel indirect heater is the standard specification for a medium to large unfinished building shell. For very large open structures or exposed sites, 100 kW+ units are available. As a rough guide, 1 kW per 10–15 m³ of heated volume is a starting point — your hire depot can advise on specific site conditions.',
  ],
  [
    'Do I need a CO alarm with a site heater?',
    'Strongly advised with any combustion heater, even diesel indirect units with a correctly installed flue. CO alarms are inexpensive and available from most hire depots. On a site with workers present, a CO alarm is the right decision — CO is odourless, colourless, and can incapacitate rapidly.',
  ],
  [
    'Can a site heater and dehumidifier be used together?',
    'Yes — and it is the most effective combination for winter drying programmes. The heater warms the air (warm air holds more moisture), and the dehumidifier extracts the moisture-laden air. Keep windows and doors closed to prevent humid outside air undermining the process.',
  ],
];

function SiteHeaterHireBody() {
  return (
    <>
      {/* Three types */}
      <section>
        <H2>The Three Types of Site Heater Available to Hire</H2>

        <H3>1. Diesel Space Heater (Indirect Fired)</H3>
        <Prose>
          <p>
            The most commonly hired site heater for large enclosed spaces. Burns diesel fuel and
            exhausts combustion gases via a flue — making them safe to use in occupied or enclosed
            buildings. Heat output typically ranges from 30 kW to 100 kW. A 50 kW diesel indirect
            heater can warm a large open shell effectively and runs for 8–12 hours on a standard
            200-litre drum.
          </p>
          <p>
            <strong>Best for:</strong> large building shells, warehouses, unfinished interiors, frost
            protection on groundworks.
          </p>
        </Prose>

        <H3>2. Propane Cabinet Heater (Flueless)</H3>
        <Prose>
          <p>
            Runs on LPG (propane) cylinders and does not require a flue connection. Compact, portable,
            and cheap to hire — but crucially, they exhaust combustion gases directly into the space.
            Flueless propane heaters must never be used in enclosed spaces without adequate
            ventilation.{' '}
            <a
              href="https://www.hse.gov.uk/gas/lpg-use-workplace.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              HSE requires permanent, adequate natural ventilation
            </a>{' '}
            when using LPG heaters on site. Carbon monoxide poisoning is a real and rapid risk.
          </p>
          <p>
            <strong>Best for:</strong> well-ventilated open spaces, temporary outdoor work areas,
            spot heating on open sites.
          </p>
        </Prose>

        <H3>3. Electric Fan Heater</H3>
        <Prose>
          <p>
            The safest option for enclosed spaces — no combustion, no flue, no gas. Limited to lower
            outputs (typically 3–9 kW) making them suitable for small rooms, site offices, and welfare
            facilities rather than large unfinished shells. Running costs on site electricity can be
            significant at higher outputs.
          </p>
          <p>
            <strong>Best for:</strong> site offices, welfare units, finished rooms with permanent
            power, drying out in conjunction with a dehumidifier.
          </p>
        </Prose>
        <Link
          to="/blog/dehumidifier-hire-uk-prices-which-size-to-choose"
          className="mt-4 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            Dehumidifier Hire UK: Prices &amp; Which Size to Choose →
          </span>
        </Link>
      </section>

      {/* Hero image */}
      <img
        src="/images/blog/site-heater-hire-uk.webp"
        alt="Large diesel indirect site heater operating inside an unfinished UK building shell during winter construction"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Price table */}
      <section>
        <H2>Site Heater Hire Prices UK 2026</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Heater Type</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Output</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Best For</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Day Rate</th>
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Week Rate</th>
              </tr>
            </thead>
            <tbody>
              {siteHeaterPriceTable.map(([type, output, bestFor, day, week], i) => (
                <tr key={type} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-bold text-gray-700">{type}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{output}</td>
                  <td className="px-4 py-3 text-gray-600">{bestFor}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{day}</td>
                  <td className="px-4 py-3 text-gray-600">{week}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">VAT-inclusive guidance. Diesel and propane fuel costs are additional. Compare live quotes on Tooli.uk.</p>
        <Link
          to="/blog/tool-hire-comparison-save-money"
          className="mt-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
        >
          <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">
            How Tool Hire Comparison Actually Saves Your Money →
          </span>
        </Link>
      </section>

      {/* Running costs */}
      <section>
        <H2>Running Costs: The Number That Really Matters</H2>
        <Prose>
          <p>
            Hire rate is only half the picture. Fuel costs on site heaters can exceed the hire cost
            on extended winter jobs. A 50 kW diesel heater running 12 hours per day consumes roughly
            30–40 litres of diesel — at current UK pump prices, that is £45–£60 per day in fuel alone
            on top of the hire charge.
          </p>
          <p>
            Electric heaters avoid fuel cost entirely but draw heavily on site power. A 9 kW electric
            fan heater running 10 hours per day costs approximately £12–£18 per day in electricity at
            commercial site rates — much lower than diesel, but only useful at lower outputs.
          </p>
          <p>
            For multi-week winter site jobs, a diesel indirect heater is almost always the most
            cost-effective option for large spaces. Pair it with a dehumidifier running simultaneously
            to manage the moisture load and keep the drying programme on track.
          </p>
        </Prose>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/dehumidifier-hire-uk-prices-which-size-to-choose"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Dehumidifier Hire UK: Prices &amp; Which Size to Choose →
            </span>
          </Link>
          <Link
            to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Scaffold Tower Hire Cost UK: What You'll Pay in 2026 →
            </span>
          </Link>
        </div>
      </section>

      {/* Secondary image */}
      <img
        src="/images/blog/site-heater-hire-uk-types.webp"
        alt="Propane cabinet heater on an outdoor construction site with adequate ventilation — site heater hire UK"
        className="w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
      />

      {/* Safety */}
      <section>
        <H2>Safety: What You Must Know Before Hiring a Site Heater</H2>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <p className="text-sm font-semibold">
            Flueless propane heaters must NEVER be used in an enclosed, unventilated space. CO
            poisoning can be fatal within minutes.{' '}
            <a
              href="https://www.hse.gov.uk/gas/co-in-the-workplace.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-amber-900"
            >
              See HSE guidance on CO in the workplace.
            </a>
          </p>
        </div>
        <CheckList
          items={[
            'Diesel indirect heaters: Safe in enclosed spaces as combustion gases exit via a flue. Check the flue outlet is unobstructed and exits to open air.',
            'Electric heaters: Safe in all conditions — but confirm the site\'s power supply is rated for the load before running multiple units.',
            'Fire risk: Keep all heaters clear of flammable materials by the manufacturer\'s minimum clearance distance — typically 1–2 metres.',
            'Carbon monoxide detection: A CO alarm is strongly advised on any site using combustion heaters, even with a flue. CO is odourless and colourless.',
          ]}
        />
      </section>

      {/* Decision table */}
      <section>
        <H2>Which Site Heater Should You Hire?</H2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                <th className="px-4 py-3 text-left font-extrabold text-gray-900">Situation</th>
                <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Best Heater Type</th>
              </tr>
            </thead>
            <tbody>
              {siteHeaterDecisionTable.map(([situation, heater], i) => (
                <tr key={situation} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                  <td className="px-4 py-3 font-medium text-gray-700">{situation}</td>
                  <td className="px-4 py-3 font-bold text-brand-primary">{heater}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Hire tips */}
      <section>
        <H2>Hire Tips Before You Book</H2>
        <CheckList
          items={[
            'Confirm whether diesel fuel is included in the hire rate — it almost never is. Budget separately.',
            'Ask about delivery of fuel drums if you\'re on a remote or scaffold-access-only site.',
            'For frost protection, set the heater to maintain a minimum of 5°C — the threshold below which fresh concrete and mortar are at risk.',
            'Hire a CO alarm alongside any combustion heater — most depots supply them.',
          ]}
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/blog/tool-hire-london"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire in London: Compare Prices From Local Suppliers →
            </span>
          </Link>
          <Link
            to="/blog/plant-hire-london-compare-local-plant-hire-companies"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Plant Hire London: Compare Local Plant Hire Companies →
            </span>
          </Link>
          <Link
            to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared →
            </span>
          </Link>
          <Link
            to="/blog/tool-hire-sw19-london-postcode-area-guide"
            className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <span className="text-sm font-bold text-brand-primary">
              Tool Hire SW19: London Postcode Area Guide →
            </span>
          </Link>
        </div>
      </section>

      <FaqSection faqs={siteHeaterFaqs} />

      <section className="rounded-2xl bg-[#030213] p-6 text-white md:p-8">
        <h2 className="mb-4 text-3xl font-extrabold">Compare Site Heater Hire Prices Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk and compare diesel, propane, and electric site heater hire
          from local UK suppliers — by day or week, with fuel and delivery options included.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 28 — Winter Site Kit: Heaters & Dehumidifiers for UK Builders */

const winterKitDehumidifierTable: [string, string, string, string][] = [
  ['Minor condensation / single room', 'Refrigerant 20 L', '20 litres/day', '£35–£45'],
  ['New-build drying programme', 'Refrigerant 50 L', '50 litres/day', '£55–£75'],
  ['Post-flood / severe damp', 'Desiccant 90 L', '90 litres/day', '£95–£120'],
  ['Large site / warehouse', 'Commercial desiccant', '150+ litres/day', '£120–£150'],
];

const winterKitSizingTable: [string, string, string][] = [
  ['Single room (up to 50 m²)', '20 L refrigerant', '3–5 days'],
  ['Mid-terraced house', '50 L refrigerant', '5–10 days'],
  ['New-build detached (plaster drying)', '50–90 L', '7–14 days'],
  ['Post-screed drying — single floor', '50 L + ventilation', '10–21 days'],
  ['Full new-build site', '90 L+ desiccant', '14–28 days'],
];

const winterKitCostTable: [string, string, string, string][] = [
  ['Diesel indirect heater', '£45–£80', '£180–£320', 'Concrete protection, unfinished shell'],
  ['Propane cabinet heater', '£30–£55', '£120–£220', 'Smaller rooms, plastering'],
  ['Electric heater', '£20–£35', '£80–£140', 'Finished areas, enclosed spaces'],
  ['Refrigerant dehumidifier 50 L', '£55–£75', '£220–£300', 'General building drying'],
  ['Desiccant dehumidifier 90 L', '£95–£120', '£380–£480', 'Winter drying (works in cold)'],
  ['Full winter kit (heater + dehu)', '£120–£185', '£480–£740', 'Complete site protection'],
];

const winterKitFaqs: Faq[] = [
  [
    'Do I need both a heater and a dehumidifier for winter construction?',
    'Not always — but the combination works better than either alone in most winter scenarios. A heater prevents frost damage to fresh concrete and plaster but raises ambient humidity as it warms the air. A dehumidifier removes that moisture, speeding the drying programme and reducing condensation risk on cold surfaces.',
  ],
  [
    'Can a refrigerant dehumidifier work in cold weather?',
    'Refrigerant machines lose efficiency below 10–12°C and stop working effectively below 5°C. For UK winter sites where temperatures approach freezing, hire a desiccant dehumidifier — it works effectively down to −20°C and is the correct choice for unheated or partially heated structures.',
  ],
  [
    'How long does screed take to dry in winter?',
    'A rule of thumb is 1 day per mm of screed thickness at 20°C with good ventilation. In winter, unheated conditions can extend this to 2–3 days per mm. Running a heater above 10°C and a dehumidifier continuously can bring drying times close to summer rates.',
  ],
  [
    'What size dehumidifier do I need for a new-build house drying programme?',
    'A 50 L/day refrigerant unit covers a typical 3-bed new-build through its initial plaster drying phase. For faster drying or larger properties, step up to a 90 L desiccant unit — especially important in winter when ambient temperatures are low.',
  ],
  [
    'Is CO a risk from site heaters indoors?',
    'Yes — it is a serious risk. Direct-fired heaters produce carbon monoxide as a combustion byproduct. Use only indirect diesel heaters or flued propane heaters in enclosed or occupied spaces, always provide adequate ventilation, and fit a CO alarm. Never leave a combustion heater running in a sealed building.',
  ],
];

function WinterSiteKitBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">At a Glance</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>A heater alone raises humidity — pair it with a dehumidifier for safe drying</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Refrigerant dehumidifiers stop working below 5°C — use desiccant in winter</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Indirect diesel heaters are the safest combustion option for enclosed UK sites</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Full winter kit hire (heater + dehu) costs £120–£185/day or £480–£740/week</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Screed needs 1 day per mm to dry — heater + dehu keeps this on programme</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Always fit a CO detector when running any combustion heater indoors</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          A UK winter brings three threats to construction programmes: frost that ruins fresh concrete and plaster,
          high ambient humidity that prevents drying, and condensation on cold surfaces that triggers mould and
          adhesion failures. The answer to all three is a <strong>winter site kit</strong> — a matched pair of
          site heater and dehumidifier working together to maintain temperature and control moisture at the same time.
        </p>
        <p>
          This guide walks through which machines to hire, how to size them correctly, and what each scenario —
          concrete pour, screed drying, plasterwork — actually demands from your winter kit.
        </p>
      </Prose>

      <H2>Why You Need Both a Heater and a Dehumidifier</H2>
      <Prose>
        <p>
          Site managers often hire a heater and assume the job is done. It isn't. Warming cold air raises its
          relative humidity. Air at 5°C holding 5 g/m³ of moisture becomes air at 20°C with the same absolute
          moisture — but now at 30% relative humidity rather than 80%. That sounds better, but in a new-build with
          cold concrete floors and walls, that warm moist air immediately condensates on cold surfaces and the
          relative humidity at the surface boundary layer climbs back above 80%.
        </p>
        <p>
          A dehumidifier removes water from the air mass directly, reducing the total moisture load rather than
          just redistributing it. The combination — heater raising temperature, dehumidifier lowering moisture
          content — is the only reliable way to drive drying programmes forward in winter.
        </p>
      </Prose>

      {/* Internal link — dehumidifier article */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Dehumidifier Hire UK: Prices &amp; Which Size to Choose</p>
          <Link to="/blog/dehumidifier-hire-uk-prices-which-size-to-choose" className="text-sm text-brand-primary hover:underline">
            Full sizing guide and hire prices →
          </Link>
        </div>
      </div>

      <H2>Choosing the Right Dehumidifier for Your Site</H2>
      <Prose>
        <p>
          The most important choice is between <strong>refrigerant</strong> and <strong>desiccant</strong> machines.
          Refrigerant units are efficient and cheaper to hire but lose performance below 10°C and stop extracting
          moisture below 5°C. If your site is unheated or ambient temperatures regularly fall near zero, a desiccant
          machine is the correct hire — it works effectively to −20°C and is the standard choice for UK winter
          drying programmes.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Condition</th>
              <th className="px-3 py-2 text-left font-semibold">Machine Type</th>
              <th className="px-3 py-2 text-left font-semibold">Extraction Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Hire Cost/Day</th>
            </tr>
          </thead>
          <tbody>
            {winterKitDehumidifierTable.map(([condition, machine, rate, cost], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{condition}</td>
                <td className="border-b border-gray-100 px-3 py-2">{machine}</td>
                <td className="border-b border-gray-100 px-3 py-2">{rate}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Sizing Guide: Space to Machine</H2>
      <Prose>
        <p>
          Matching machine capacity to the space being dried is critical. An undersized dehumidifier runs
          continuously without achieving the target relative humidity — typically 75% RH or below for screed
          drying, 60% RH or below for plasterwork. Use the table below as a starting point, then increase
          capacity if the space is poorly ventilated or ambient temperatures are very low.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Space</th>
              <th className="px-3 py-2 text-left font-semibold">Recommended Unit</th>
              <th className="px-3 py-2 text-left font-semibold">Expected Drying Time</th>
            </tr>
          </thead>
          <tbody>
            {winterKitSizingTable.map(([space, unit, time], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{space}</td>
                <td className="border-b border-gray-100 px-3 py-2">{unit}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <img
        src="/images/blog/site-heater-hire-uk-types.webp"
        alt="Diesel indirect site heater and industrial dehumidifier paired together inside a UK construction site shell in winter"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      <H2>Winter Site Kit Hire Costs</H2>
      <Prose>
        <p>
          Hiring the full winter kit — a site heater plus a dehumidifier — typically costs between
          £120 and £185 per day or £480 to £740 per week from a UK hire company. Week rates offer
          a significant saving over individual day hires, and most drying programmes run for at least
          5–7 days, making the weekly rate the standard option.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Equipment</th>
              <th className="px-3 py-2 text-left font-semibold">Day Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Week Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Best For</th>
            </tr>
          </thead>
          <tbody>
            {winterKitCostTable.map(([equip, day, week, bestFor], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{equip}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{day}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{week}</td>
                <td className="border-b border-gray-100 px-3 py-2">{bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — site heater article */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Site Heater Hire UK: Which Type Do You Need?</p>
          <Link to="/blog/site-heater-hire-uk-which-type-do-you-need-and-what-does-it-cost" className="text-sm text-brand-primary hover:underline">
            Diesel, propane and electric options compared →
          </Link>
        </div>
      </div>

      <H2>Scenario 1: Protecting a Concrete Pour</H2>
      <Prose>
        <p>
          Concrete poured below 5°C risks incomplete hydration. Ice crystal formation in fresh concrete
          permanently weakens the matrix — a problem no amount of curing time will fix. The target is to
          keep the pour above 5°C (ideally above 10°C) for at least 72 hours after placement.
        </p>
        <p>
          Use a <strong>diesel indirect heater</strong> positioned to circulate warm air across the pour.
          Cover the concrete with polythene sheeting to trap heat and moisture. Run the heater continuously
          for the first three days. A dehumidifier is less critical at this stage — the concrete needs
          moisture for curing — but add one if condensation is forming on formwork or reinforcement.
        </p>
      </Prose>

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Compare Tool Hire Prices Across the UK</p>
          <Link to="/blog/tool-hire-comparison-uk" className="text-sm text-brand-primary hover:underline">
            Find the best rates from local suppliers →
          </Link>
        </div>
      </div>

      <H2>Scenario 2: Screed Drying</H2>
      <Prose>
        <p>
          Screed must reach below 75% relative humidity (or 0.5% moisture content for bonded screed)
          before floor coverings can be laid. The standard drying rate is 1 day per mm of thickness at
          20°C with adequate ventilation. A 75 mm screed takes 75 days at ambient summer conditions —
          or three months in a cold, unventilated new-build in January.
        </p>
        <p>
          The combination of a heater maintaining 15–20°C and a <strong>50 L+ desiccant dehumidifier</strong>
          running continuously can cut drying time to 30–40 days for the same 75 mm screed. Open doors
          and windows periodically to purge moisture-laden air. Test with a hygrometer rather than relying
          on time estimates alone.
        </p>
      </Prose>

      <H2>Scenario 3: Plasterwork</H2>
      <Prose>
        <p>
          Fresh plaster needs to dry out slowly and evenly. Rapid drying from direct heat causes cracking;
          too-slow drying in cold, damp conditions prevents the plaster setting properly. The ideal approach
          is a <strong>propane cabinet heater</strong> positioned away from the plastered surface — not
          blowing directly onto the walls — with a dehumidifier removing moisture from the air mass.
        </p>
        <p>
          Maintain 10–15°C in the room. Avoid running the heater at full output against a single wall;
          slow, even heat is far better for plasterwork than intense localised drying. A 20–50 L
          dehumidifier is usually sufficient for a single room.
        </p>
      </Prose>

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Day, weekend and week rates compared →
          </Link>
        </div>
      </div>

      <H2>Winter Site Safety Checklist</H2>
      <Prose>
        <p>
          Running combustion heaters and electrical dehumidifiers together in a construction environment
          introduces specific hazards. Work through this checklist before commissioning your winter kit:
        </p>
      </Prose>

      <CheckList
        items={[
          'Never run a direct-fired gas or diesel heater in an enclosed space without adequate ventilation',
          'Fit a CO detector when using any combustion heater indoors — check it is working before each shift',
          'Keep dehumidifier drain hoses away from electrical cables and floor traffic routes',
          'Switch to a desiccant dehumidifier when ambient temperature drops below 10°C',
          'Check heater fuel lines and connections for leaks before each day of use',
          'Never leave a combustion heater running unattended overnight in a building with fresh plaster or exposed timber',
        ]}
      />

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Choose the right plate for your groundworks →
          </Link>
        </div>
      </div>

      <H2>Compare Winter Site Kit Hire Near You</H2>
      <Prose>
        <p>
          Hire costs for site heaters and dehumidifiers vary between suppliers — especially for longer
          hire periods. Use Tooli.uk to{' '}
          <Link
            to="/search"
            className="font-medium text-brand-primary hover:underline"
          >
            compare now
          </Link>{' '}
          and find the best rate from local UK suppliers on both heaters and dehumidifiers in a single search.
        </p>
      </Prose>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: 2026 Price Guide</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Full breakdown of day and week rates →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Hire Your Winter Site Kit Today</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to compare site heater and dehumidifier hire from local UK
          suppliers — by day, weekend, or week.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 29 — Skip Hire Sizes & Prices UK: Full Comparison 2026 */

const skipPriceTable: [string, string, string, string, string][] = [
  ['Mini skip', '2–3 yards', '25–35 bin bags', '£90–£160', 'Garden waste, small bathroom, single-room clear'],
  ['Midi skip', '4 yards', '40–50 bin bags', '£130–£200', 'Kitchen strip-out, small home renovation'],
  ['Builders skip (small)', '6 yards', '60–70 bin bags', '£180–£260', 'General construction, multi-room light clearance'],
  ['Builders skip (large)', '8 yards', '80–90 bin bags', '£220–£320', 'Most-hired size — renovation, roofing, groundworks'],
  ['Maxi skip', '10 yards', '100–110 bin bags', '£260–£360', 'Large renovation, loft conversion, full house clear'],
  ['Large maxi', '12 yards', '120–130 bin bags', '£300–£420', 'Serious demolition waste, commercial fit-outs'],
  ['Roll-on/roll-off (small)', '16–20 yards', '~200 bin bags', '£350–£500', 'Commercial sites, large-scale clearances'],
  ['Roll-on/roll-off (large)', '35–40 yards', '~400 bin bags', '£480–£650', 'Major demolition, housebuilder site clearance'],
];

const skipWasteTable: [string, string, string][] = [
  ['General household waste (non-hazardous)', 'Yes', 'Standard mix — no restrictions'],
  ['Soil and turf', 'Yes (check with depot)', 'Heavy — may incur additional weight charge'],
  ['Bricks, rubble, concrete', 'Yes (check with depot)', 'Inert waste — weight surcharge common on larger volumes'],
  ['Timber and wood', 'Yes', 'Untreated preferred — treated timber may attract surcharge'],
  ['Plasterboard', 'Check first', 'Many depots charge a surcharge — landfill restrictions'],
  ['Asbestos', 'No — never', 'Requires licensed asbestos waste contractor'],
  ['Hazardous chemicals / paint', 'No', 'Hazardous waste rules apply — separate licensed disposal'],
  ['Electrical items (fridges, TV, appliances)', 'No (most depots)', 'WEEE regulations — arrange separate collection'],
  ['Gas cylinders', 'No', 'Hazardous — return to supplier or specialist disposal'],
  ['Tyres', 'No (most depots)', 'Specialist tyre disposal required — separate charge'],
  ['Food waste', 'No', 'Biological waste — separate disposal only'],
];

const skipRegionTable: [string, string, string][] = [
  ['London (Central)', '£280–£380', 'Highest rates — congestion, disposal costs'],
  ['London (Outer)', '£240–£330', 'Still above national average'],
  ['South East (Surrey, Kent, Sussex)', '£230–£320', '10–15% above national average'],
  ['South West (Bristol, Devon)', '£200–£290', 'Near national average'],
  ['Midlands (Birmingham, Coventry)', '£190–£280', 'Near national average'],
  ['North West (Manchester, Liverpool)', '£185–£270', 'Slightly below national average'],
  ['Yorkshire (Leeds, Sheffield)', '£180–£265', 'Slightly below national average'],
  ['Scotland (Glasgow, Edinburgh)', '£195–£280', 'VAT-inclusive — similar to Midlands'],
  ['Wales (Cardiff)', '£185–£265', 'Near national average'],
];

const skipFaqs: Faq[] = [
  [
    'How much does an 8-yard skip cost to hire in the UK?',
    'An 8-yard builders skip — the most commonly hired size for renovation and construction work — costs approximately £220–£320 in most parts of the UK. London and the South East run higher at £280–£380. All prices are VAT-inclusive guidance — confirm current local rates on Tooli.uk.',
  ],
  [
    'What is the most popular skip size for house renovation?',
    'The 8-yard builders skip is the most hired skip size for general house renovation, roofing, and construction clearance in the UK. It holds approximately 80–90 bin bags of waste and is large enough for most single-property projects without overspending on a larger size.',
  ],
  [
    'Can I put soil in a skip?',
    'Yes — most skips accept soil, turf, and spoil from garden and groundwork projects. However, soil is very heavy and some depots apply a weight surcharge when volumes are significant. Call ahead to confirm your depot\'s policy before filling a skip entirely with heavy inert material.',
  ],
  [
    'Can I overfill a skip?',
    'No. Skip lorry drivers are legally required to refuse collection of a skip filled above the load line. Material above the fill line creates an unacceptably hazardous load for road transport. If you overfill, you\'ll pay a wasted journey charge and still need to remove the excess before collection.',
  ],
  [
    'Do I need a permit for a skip on the road?',
    'Yes — if the skip is placed on a public highway (road or pavement), you need a skip licence from the local council. Skip permits typically cost £25–£75 depending on the council and are usually valid for 1–4 weeks. Skips on private driveways or land do not require a permit.',
  ],
  [
    'How long does skip hire last?',
    'Standard skip hire periods are 7–14 days with most UK hire companies. Extensions are usually available — call your depot before the hire period ends if you need more time. Same-day or next-day collection is rarely possible during busy periods, so plan your loading schedule accordingly.',
  ],
];

function SkipHireSizesBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">Skip Hire at a Glance</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Mini skip (2–3 yards): £90–£160 — garden waste, small bathroom clearance</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Midi skip (4 yards): £130–£200 — kitchen strip-out, small renovation clearance</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Builders skip (6–8 yards): £180–£320 — most popular, general construction waste</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Maxi skip (10–12 yards): £260–£420 — large renovations, multi-room clearances</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Roll-on/roll-off (16–40 yards): £350–£650 — commercial sites, large demolitions</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Road permit required if skip is placed on public highway — typically £25–£75 from the council</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          Skip hire in the UK costs between <strong>£90 and £650</strong> depending on the skip size and
          how long you need it. A 2-yard mini skip for a small garden clearance runs around £90–£140.
          An 8-yard builders skip — the most commonly hired size — costs around £200–£320. A 40-yard
          roll-on/roll-off skip for large commercial clearances starts from £450.
        </p>
        <p>
          The biggest mistake hirers make is ordering too small, then paying for a second collection.
          This guide covers every skip size, current UK prices, waste types accepted, and permit rules
          so you get the right skip first time.
        </p>
      </Prose>

      <H2>Skip Hire Prices UK 2026: Full Size Breakdown</H2>
      <Prose>
        <p>
          All prices are VAT-inclusive guidance based on average UK market rates. Regional variation
          applies — London and the South East run 10–20% higher than the national average.
          Use Tooli.uk to{' '}
          <Link to="/search" className="font-medium text-brand-primary hover:underline">compare now</Link>{' '}
          and confirm current quotes from local suppliers.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Skip Size</th>
              <th className="px-3 py-2 text-left font-semibold">Capacity</th>
              <th className="px-3 py-2 text-left font-semibold">Approx Equivalent</th>
              <th className="px-3 py-2 text-left font-semibold">Typical Price Range</th>
              <th className="px-3 py-2 text-left font-semibold">Best For</th>
            </tr>
          </thead>
          <tbody>
            {skipPriceTable.map(([size, capacity, equiv, price, bestFor], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{size}</td>
                <td className="border-b border-gray-100 px-3 py-2">{capacity}</td>
                <td className="border-b border-gray-100 px-3 py-2">{equiv}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{price}</td>
                <td className="border-b border-gray-100 px-3 py-2">{bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">*All prices VAT-inclusive guidance. Confirm live rates on Tooli.uk.</p>
      </div>

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>What Can and Cannot Go in a Skip?</H2>
      <Prose>
        <p>
          Not all waste is accepted in a standard skip. Mixing hazardous waste with general waste is
          illegal under the{' '}
          <a href="https://www.legislation.gov.uk/ukpga/1990/43" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            Environmental Protection Act 1990
          </a>{' '}
          and the{' '}
          <a href="https://www.legislation.gov.uk/uksi/2005/894" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            Hazardous Waste Regulations 2005
          </a>{' '}
          and can result in significant fines. When in doubt, ask your hire depot before loading.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Waste Type</th>
              <th className="px-3 py-2 text-left font-semibold">Accepted in Standard Skip?</th>
              <th className="px-3 py-2 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {skipWasteTable.map(([waste, accepted, notes], i) => {
              const isNo = accepted.toLowerCase().startsWith('no');
              return (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border-b border-gray-100 px-3 py-2 font-medium">{waste}</td>
                  <td className={`border-b border-gray-100 px-3 py-2 font-semibold ${isNo ? 'text-red-600' : 'text-green-700'}`}>{accepted}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <p className="text-sm font-semibold">Important: Asbestos &amp; Hazardous Waste</p>
        <p className="mt-1 text-sm">
          Asbestos must never go in a standard skip. It requires a licensed asbestos waste contractor.
          The{' '}
          <a href="https://www.gov.uk/government/publications/waste-duty-of-care-code-of-practice" target="_blank" rel="noopener noreferrer" className="font-medium underline">
            EA Waste Duty of Care Code of Practice
          </a>{' '}
          sets out legal obligations for all waste producers — including domestic skip hirers.
        </p>
      </div>

      <img
        src="/images/blog/skip-hire-sizes-uk.webp"
        alt="Mini 2-yard garden skip filled with green waste and turf from a residential garden clearance"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Choose the right plate for your groundworks →
          </Link>
        </div>
      </div>

      <H2>How Long Can You Keep a Skip?</H2>
      <Prose>
        <p>
          Standard skip hire periods are typically <strong>7–14 days</strong>. Most depots allow
          extension by arrangement. Key rules to know:
        </p>
      </Prose>

      <CheckList
        items={[
          'Standard hire period: 7–14 days depending on the supplier',
          'Extensions: usually available at a daily or weekly surcharge — always ask before the hire period expires',
          'Collection: most depots collect within 1–2 working days of your call — book ahead during busy periods',
          'Overfilling: a skip loaded above the fill line cannot legally be transported — the driver will refuse collection and you may be charged a wasted journey fee',
          'Road permits: if your skip is on a public highway, arrange the permit before the skip is placed',
        ]}
      />

      {/* Internal link — wacker plate cost */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/wacker-plate-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Day, weekend and week rates compared →
          </Link>
        </div>
      </div>

      <H2>Skip Hire by Region: Price Variation</H2>
      <Prose>
        <p>
          Skip hire prices vary significantly by region. London and the South East carry the highest
          rates due to land costs, disposal charges, and operating costs. The table below shows
          approximate 8-yard builders skip prices by region for 2026.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Region</th>
              <th className="px-3 py-2 text-left font-semibold">8-Yard Builders Skip (approx)</th>
              <th className="px-3 py-2 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {skipRegionTable.map(([region, price, notes], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{region}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{price}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      <H2>Tips for Getting the Best Skip Hire Price</H2>
      <Prose>
        <p>
          Skip hire prices are negotiable — especially for longer hire periods and multiple skips.
          A few practical points to save money:
        </p>
        <ul>
          <li>
            <strong>Order the right size first time.</strong> A second collection and swap to a larger
            skip almost always costs more than upgrading in the first booking.
          </li>
          <li>
            <strong>Choose a midweek delivery.</strong> Friday and Monday collections are busiest —
            some depots offer better rates for Tuesday–Thursday slots.
          </li>
          <li>
            <strong>Keep heavy waste separate.</strong> Mixing concrete and rubble with lighter waste
            can push a skip into the weight-surcharge bracket. If you have significant inert waste,
            ask about a dedicated inert skip or grab lorry alternative.
          </li>
          <li>
            <strong>Compare local suppliers.</strong> National skip hire brands rarely offer the lowest
            rate — local independents often beat them on price for the same service.
          </li>
        </ul>
      </Prose>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: How to Compare Prices in 2026</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Full breakdown of day and week rates →
          </Link>
        </div>
      </div>

      {/* Internal link — dehumidifier */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Dehumidifier Hire UK: Prices &amp; Which Size to Choose</p>
          <Link to="/blog/dehumidifier-hire-uk-prices-which-size-to-choose" className="text-sm text-brand-primary hover:underline">
            Full sizing guide and hire prices →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect concrete and plasterwork through winter →
          </Link>
        </div>
      </div>

      {/* Internal link — site heater */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Site Heater Hire UK: Which Type Do You Need?</p>
          <Link to="/blog/site-heater-hire-uk-which-type-do-you-need-and-what-does-it-cost" className="text-sm text-brand-primary hover:underline">
            Diesel, propane and electric options compared →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Skip Hire Prices Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — skip hire prices from local UK suppliers by size, duration, and waste type.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 30 — What Size Skip Do I Need? The Practical UK Guide */

const skipProjectTable: [string, string, string][] = [
  ['Single-room garden tidy / small clear-out', '2–3 yard mini skip', 'Fits under most permits; sufficient for light volume'],
  ['Garden waste — full clearance (medium garden)', '4–6 yard midi/small builders', 'Green waste is bulky but light — volume over weight'],
  ['Single bathroom strip-out', '4–6 yard midi/small builders', 'Ceramics, timber, pipework — medium density waste'],
  ['Full kitchen strip-out', '6–8 yard builders skip', 'Units, worktops, tiles, appliances — high volume'],
  ['Loft conversion clearance (insulation, boarding)', '6–8 yard builders skip', 'Lightweight but high volume'],
  ['Single-storey extension demolition', '8–10 yard builders/maxi', 'Mixed rubble, masonry, timber — dense and bulky'],
  ['Full house renovation (multi-room)', '10–12 yard maxi or multiple 8-yard', 'Volume is the limiting factor — don\'t underestimate'],
  ['Driveway excavation (3-car width)', '8–10 yard — or arrange muck away', 'Soil and tarmac are very heavy — weight may exceed volume limits'],
  ['Garage demolition', '8–10 yard', 'Masonry, roof tiles, timber — high mixed density'],
  ['Full house clearance / estate clear', '10–12 yard maxi', 'General household goods — often surprisingly bulky'],
  ['Commercial fit-out strip or office clear', '16–20 yard RoRo', 'Volume and duration usually demand a larger container'],
];

const skipVolumeTable: [string, string, string, string][] = [
  ['Mini', '2 yards', '1.5 m³', '25–35 bags'],
  ['Midi', '4 yards', '3.0 m³', '40–50 bags'],
  ['Small builders', '6 yards', '4.6 m³', '60–70 bags'],
  ['Standard builders', '8 yards', '6.1 m³', '80–90 bags'],
  ['Maxi', '10 yards', '7.6 m³', '100–110 bags'],
  ['Large maxi', '12 yards', '9.2 m³', '120–130 bags'],
  ['Small RoRo', '16–20 yards', '12–15 m³', '160–200 bags'],
  ['Large RoRo', '35–40 yards', '27–31 m³', '350–400 bags'],
];

const skipComparisonTable: [string, string, string, string][] = [
  ['Typical price', '£90–£160', '£130–£200', '£180–£320'],
  ['Fits on driveway', 'Easily', 'Yes', 'Usually — check width'],
  ['Road permit needed', 'Often not (private drive)', 'If on road: yes', 'If on road: yes'],
  ['Best for', 'Small garden / 1 room', 'Kitchen or bathroom', 'Full renovation / groundworks'],
  ['Weight limit (typical)', '~1 tonne', '~1.5 tonnes', '2–3 tonnes'],
];

const skipSizeFaqs: Faq[] = [
  [
    'What size skip do I need for a bathroom?',
    'A 4-yard midi skip is sufficient for a small bathroom strip-out. For a larger bathroom with a full set of fixtures, tiles, and subfloor, a 6-yard small builders skip gives more comfortable capacity. If you\'re also doing pipework and plaster replacement, go straight to an 8-yard builders skip to avoid a second delivery.',
  ],
  [
    'What is the most popular skip size in the UK?',
    'The 8-yard builders skip is the most commonly hired skip size in the UK. It handles most residential renovation and construction waste volumes comfortably, fits on most driveways, and sits at a price point that makes it the default choice for builders, landscapers, and DIY homeowners tackling significant projects.',
  ],
  [
    'Can I mix waste types in the same skip?',
    'Yes — general mixed waste (timber, masonry, ceramics, packaging) can go in together. The important restrictions are on hazardous waste (asbestos, chemicals, electrical appliances, tyres, gas cylinders) which must never go in a standard skip. Plasterboard in large quantities may attract a surcharge due to landfill restrictions — check with your depot.',
  ],
  [
    'Do mini skips need a road permit?',
    'If a mini skip is placed on your private driveway or off-road space, no permit is needed. If it\'s placed on a public road or pavement, a skip licence from the local council is required regardless of size. Skip permits typically cost £25–£75 depending on the council.',
  ],
  [
    'How many bin bags fit in an 8-yard skip?',
    'Approximately 80–90 standard bin bags fit in an 8-yard builders skip. In practice, construction waste is not bagged and is loaded loose — a more useful guide is that an 8-yard skip fits roughly 6.1 cubic metres of material, which equates to a full kitchen strip-out with room for bathroom fixtures as well.',
  ],
];

function WhatSizeSkipBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">The Golden Rule</h2>
        <p className="text-sm text-gray-700">
          The cost difference between a 6-yard and 8-yard skip is typically <strong>£40–£60</strong>.
          The cost of a second skip delivery and collection when the first one fills up is typically
          <strong> £150–£250</strong>. Sizing up is almost always cheaper than ordering a second skip.
          If you're on the borderline between two sizes, always go for the larger.
        </p>
      </div>

      <Prose>
        <p>
          The most common skip hire mistake in the UK is ordering too small. A 4-yard midi skip for
          a full bathroom strip-out fills up before you've touched the floor tiles. An 8-yard builders
          skip handles a full bathroom and kitchen combined with room to spare. This guide matches the
          right skip size to the right project using real volume estimates — so you hire once, not twice.
        </p>
      </Prose>

      <H2>Skip Size to Project: Quick Reference</H2>
      <Prose>
        <p>
          Use this table to match your project to the right skip size. When two sizes are listed,
          the smaller suits a typical version of that project; the larger covers a bigger or messier
          execution. When in doubt, size up — see the golden rule above.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Project</th>
              <th className="px-3 py-2 text-left font-semibold">Recommended Skip Size</th>
              <th className="px-3 py-2 text-left font-semibold">Why</th>
            </tr>
          </thead>
          <tbody>
            {skipProjectTable.map(([project, size, why], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{project}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{size}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — skip hire prices */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</p>
          <Link to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026" className="text-sm text-brand-primary hover:underline">
            Full price guide for every skip size →
          </Link>
        </div>
      </div>

      <H2>How Skip Sizes Work: The Volume Basics</H2>
      <Prose>
        <p>
          Skip size is measured in <strong>cubic yards</strong> — an old imperial unit still standard
          across the UK hire industry. One cubic yard is roughly 0.76 cubic metres, or about 10–12
          standard household bin bags loosely packed. The table below converts between units and gives
          a practical bin-bag equivalent for each size.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Skip Size</th>
              <th className="px-3 py-2 text-left font-semibold">Cubic Yards</th>
              <th className="px-3 py-2 text-left font-semibold">Cubic Metres (approx)</th>
              <th className="px-3 py-2 text-left font-semibold">Rough Equivalent in Bin Bags</th>
            </tr>
          </thead>
          <tbody>
            {skipVolumeTable.map(([size, yards, metres, bags], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{size}</td>
                <td className="border-b border-gray-100 px-3 py-2">{yards}</td>
                <td className="border-b border-gray-100 px-3 py-2">{metres}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold">{bags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <img
        src="/images/blog/skip-hire-sizes-uk.webp"
        alt="4-yard midi skip outside a UK semi-detached house during a bathroom renovation — skip hire residential"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Choose the right plate for your groundworks →
          </Link>
        </div>
      </div>

      <H2>Weight Limits: The Factor Most Hirers Overlook</H2>
      <Prose>
        <p>
          Skip size refers to <strong>volume, not weight</strong>. Every skip has a maximum permitted
          load weight — typically 1–3 tonnes for smaller skips, up to 6–8 tonnes for larger builders
          skips. Dense waste materials — soil, concrete, bricks, tarmac — fill the weight limit long
          before they fill the volume.
        </p>
        <p>
          If your project involves significant quantities of soil, rubble, or hardcore, follow these
          practical rules:
        </p>
      </Prose>

      <CheckList
        items={[
          'Mix heavy inert material with lighter waste to spread the weight through the available volume',
          'Consider a muck-away lorry for large volumes of soil or spoil — more efficient than multiple skip swaps',
          'Tell your hire depot what materials you\'re putting in — they can advise on weight limits and surcharges',
          'Never fill a skip above the load line — the driver is legally required to refuse an overloaded skip',
          'Plasterboard in large quantities may attract a surcharge — check with your depot before loading',
        ]}
      />

      <Prose>
        <p>
          The{' '}
          <a href="https://www.gov.uk/government/publications/waste-duty-of-care-code-of-practice" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            EA Waste Duty of Care Code of Practice
          </a>{' '}
          sets out legal obligations for all waste producers — including domestic skip hirers. In
          Scotland, waste licensing is governed by{' '}
          <a href="https://www.sepa.org.uk/regulations/waste" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            SEPA
          </a>
          ; in Wales by{' '}
          <a href="https://www.naturalresourceswales.gov.uk" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            Natural Resources Wales
          </a>.
        </p>
      </Prose>

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>Mini Skip vs Midi Skip vs Builders Skip: Key Differences</H2>
      <Prose>
        <p>
          The three most commonly hired skip sizes for residential work cover the range from a single
          room clear-out to a full renovation. Here's how they compare on price, access, and suitability:
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Feature</th>
              <th className="px-3 py-2 text-left font-semibold">Mini (2–3 yd)</th>
              <th className="px-3 py-2 text-left font-semibold">Midi (4 yd)</th>
              <th className="px-3 py-2 text-left font-semibold">Builders (6–8 yd)</th>
            </tr>
          </thead>
          <tbody>
            {skipComparisonTable.map(([feature, mini, midi, builders], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{feature}</td>
                <td className="border-b border-gray-100 px-3 py-2">{mini}</td>
                <td className="border-b border-gray-100 px-3 py-2">{midi}</td>
                <td className="border-b border-gray-100 px-3 py-2">{builders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      <H2>Road Permits: When Do You Need One?</H2>
      <Prose>
        <p>
          A skip placed on a <strong>public road or pavement</strong> requires a skip licence from
          the local council — regardless of size. Permits typically cost £25–£75 and are usually valid
          for 1–4 weeks. Your skip hire company can often arrange the permit on your behalf for a small
          admin fee; always confirm this before the skip is delivered.
        </p>
        <p>
          A skip placed on a <strong>private driveway or private land</strong> does not require a
          permit. If access to your property is tight, a mini or midi skip may be the practical choice
          even if a builders skip would be preferable on capacity grounds.
        </p>
      </Prose>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: How to Compare Prices in 2026</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Full breakdown of day and week rates →
          </Link>
        </div>
      </div>

      {/* Internal link — wacker plate cost */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/wacker-plate-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Day, weekend and week rates compared →
          </Link>
        </div>
      </div>

      {/* Internal link — dehumidifier */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Dehumidifier Hire UK: Prices &amp; Which Size to Choose</p>
          <Link to="/blog/dehumidifier-hire-uk-prices-which-size-to-choose" className="text-sm text-brand-primary hover:underline">
            Full sizing guide and hire prices →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect concrete and plasterwork through winter →
          </Link>
        </div>
      </div>

      {/* Internal link — site heater */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Site Heater Hire UK: Which Type Do You Need?</p>
          <Link to="/blog/site-heater-hire-uk-which-type-do-you-need-and-what-does-it-cost" className="text-sm text-brand-primary hover:underline">
            Diesel, propane and electric options compared →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Find the Right Skip at the Right Price</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — skip hire prices from local UK suppliers for every size, from mini skips to RoRo containers.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 31 — Do I Need a Permit for a Skip on the Road? The Direct Answer */

const skipPermitPlacementTable: [string, string, string][] = [
  ['Private driveway or forecourt', 'No', 'Not a public highway — no permit needed'],
  ['Private car park', 'No', 'Private land — no highway permit needed'],
  ['Public road (any part of the carriageway)', 'Yes', 'Always — no exceptions for size'],
  ['Public pavement / footway', 'Yes', 'Part of the public highway'],
  ['Shared access road (unadopted)', 'Check with council', 'Status may vary — call the local highways department'],
  ['Yellow line or restricted zone', 'Consult council', 'Some local authorities refuse permits in restricted zones'],
];

const skipPermitCostTable: [string, string, string][] = [
  ['London Borough Councils', '£55–£100', '2 weeks'],
  ['Metropolitan Borough Councils (Manchester, Birmingham etc.)', '£35–£75', '2–4 weeks'],
  ['County/District Councils (commuter belt, rural)', '£25–£60', '2–4 weeks'],
  ['Scottish Local Authorities', '£30–£70', '2–4 weeks'],
  ['Welsh Local Authorities', '£25–£60', '2–4 weeks'],
];

const skipPermitFaqs: Faq[] = [
  [
    'Who is responsible for getting the skip permit?',
    'In most cases, the skip hire company obtains the permit from the local council on your behalf. Your responsibility is to tell them at the point of booking that the skip will be placed on a public road. If you fail to declare this and the skip ends up on the highway without a permit, you may share liability for the breach.',
  ],
  [
    'How much does a skip road permit cost?',
    'Typically £25–£100 depending on the local authority. London borough permits are at the higher end (£55–£100). Most councils outside London charge £25–£75. The cost is usually passed through to you as a line item on the hire invoice.',
  ],
  [
    'Can a skip go on double yellow lines?',
    'Some councils permit this; others refuse. It depends entirely on the local authority. Always consult the hire company — they will know the local rules. Even where a permit is granted, it may come with specific conditions such as time restrictions.',
  ],
  [
    'How long is a skip permit valid for?',
    'Typically 2–4 weeks, depending on the local authority. If your hire extends beyond the permit period, the company must renew it. Let them know if you\'re running over time — don\'t let the permit lapse with the skip still in place on the road.',
  ],
  [
    'Do I need a permit if the skip is half on my drive and half on the road?',
    'Yes. Any part of a skip that occupies the public highway — including the footway — technically requires a permit. If in doubt, get the permit. The fine for non-compliance is significantly more expensive than the permit itself.',
  ],
  [
    'What markings does a skip on a road need?',
    'Reflective amber markers at each end and illuminated lights from dusk to dawn. These requirements are set out in the Builders\' Skips (Markings) Regulations 1984. The hire company is responsible for fitting the markings — check they are in place when the skip is delivered.',
  ],
];

function SkipPermitBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">Skip Permit Rules at a Glance</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /><span>Skip on private drive or land: <strong>no permit required</strong></span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Skip on public road or pavement: <strong>council permit required — always</strong></span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Permit typically obtained by the hire company on your behalf — tell them when booking</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Permit cost: typically £25–£75 depending on local authority (£55–£100 in London)</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Permit validity: typically 2–4 weeks — check with the hire company</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /><span>Operating without a permit: fine from the council, potential removal at your cost</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          <strong>Yes</strong> — if a skip is placed on a public highway in the UK, a skip licence
          from the local council is legally required. This applies regardless of skip size. The permit
          is obtained by the hire company on your behalf in most cases — but you need to tell them the
          skip is going on the road when you book.
        </p>
        <p>
          Skip permits typically cost £25–£75 depending on the local authority and are usually valid
          for 2–4 weeks. Here is exactly what the rules are, who is responsible, and what happens
          without one.
        </p>
      </Prose>

      <H2>The Legal Position</H2>
      <Prose>
        <p>
          Placing a skip on a public highway without authorisation constitutes an obstruction under the{' '}
          <a href="https://www.legislation.gov.uk/ukpga/1980/66" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            Highways Act 1980
          </a>.
          Both the skip hire company and the hirer can be held liable. In practice, enforcement
          typically falls on the hire company — which is why reputable hire firms require you to
          declare the placement location when booking.
        </p>
        <p>
          The marking requirements for road-placed skips are set by the{' '}
          <a href="https://www.legislation.gov.uk/uksi/1984/1933" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            Builders' Skips (Markings) Regulations 1984
          </a>
          {' '}— reflective amber markers and lights at each end, visible from dusk to dawn.
        </p>
      </Prose>

      <H3>Who Is Responsible?</H3>
      <Prose>
        <p>
          The skip hire company holds the skip permit in most cases — they apply to the local highway
          authority (the council) on your behalf. Your responsibility is to tell the hire company that
          the skip will be on a public road at the time of booking. If you tell them it's going on your
          drive and then place it on the road, you may bear liability for the resultant breach of the
          permit condition.
        </p>
      </Prose>

      {/* Internal link — skip hire prices */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</p>
          <Link to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026" className="text-sm text-brand-primary hover:underline">
            Full price guide for every skip size →
          </Link>
        </div>
      </div>

      <H2>When Do You Need a Permit?</H2>
      <Prose>
        <p>
          The key question is whether the skip occupies any part of the <strong>public highway</strong> —
          which includes the road surface, the kerb, and the footway (pavement). If it does, a permit
          is required without exception.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Skip Placement</th>
              <th className="px-3 py-2 text-left font-semibold">Permit Required?</th>
              <th className="px-3 py-2 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {skipPermitPlacementTable.map(([placement, required, notes], i) => {
              const isYes = required.toLowerCase().startsWith('yes');
              const isNo = required.toLowerCase() === 'no';
              return (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border-b border-gray-100 px-3 py-2 font-medium">{placement}</td>
                  <td className={`border-b border-gray-100 px-3 py-2 font-semibold ${isYes ? 'text-red-600' : isNo ? 'text-green-700' : 'text-amber-600'}`}>{required}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Internal link — what size skip */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">What Size Skip Do I Need? The Practical UK Guide</p>
          <Link to="/blog/what-size-skip-do-i-need-the-practical-uk-guide" className="text-sm text-brand-primary hover:underline">
            Match skip size to your project →
          </Link>
        </div>
      </div>

      <H2>What Does a Skip Permit Cost?</H2>
      <Prose>
        <p>
          Skip permit costs vary by local authority. They are typically paid by the hire company and
          passed through to you as a line item on the invoice. In London, allow extra lead time —
          some boroughs take 3–5 working days to process a permit. Book well ahead for road-placed
          skips in busy London postcodes.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Local Authority Type</th>
              <th className="px-3 py-2 text-left font-semibold">Typical Permit Cost</th>
              <th className="px-3 py-2 text-left font-semibold">Typical Validity Period</th>
            </tr>
          </thead>
          <tbody>
            {skipPermitCostTable.map(([authority, cost, validity], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{authority}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{cost}</td>
                <td className="border-b border-gray-100 px-3 py-2">{validity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">If the skip needs to stay longer than the permit period, the hire company must renew the permit. Tell the company if your hire is likely to extend beyond the initial period.</p>
      </div>

      <img
        src="/images/blog/do-i-need-a-permit-for-a-skip.webp"
        alt="Skip permit notice attached to a builders skip on a public pavement in a London residential street"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>Safety Requirements on Road-Placed Skips</H2>
      <Prose>
        <p>
          A skip placed on a public highway in the UK must by law comply with the{' '}
          <a href="https://www.legislation.gov.uk/uksi/1984/1933" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            Builders' Skips (Markings) Regulations 1984
          </a>.
          The hire company is responsible for ensuring the skip is correctly marked on delivery.
          If markings are damaged or removed during hire, notify the company immediately.
        </p>
      </Prose>

      <CheckList
        items={[
          'Marked at each end with reflective amber markers or lights — required under the Highways Act 1980 and the Builders\' Skips (Markings) Regulations 1984',
          'Illuminated at night — flashing or fixed lights at each end, mandatory from dusk to dawn on public highways',
          'Not overfilled — skip must not be loaded above the fill line, creating a hazardous road obstruction',
          'Covered if necessary — if material could blow onto the highway, a net cover must be used',
          'Check markings are in place when the skip is delivered — report any missing lights to the hire company immediately',
        ]}
      />

      <H2>What Happens Without a Permit?</H2>

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <p className="text-sm font-semibold">Consequences of placing a skip without a permit</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>• The local council can issue a fixed penalty notice or fine to the hire company and/or hirer</li>
          <li>• The council can order immediate removal of the skip at the hirer's cost</li>
          <li>• Persistent non-compliance risks the skip company's operating licence under the Highways Act 1980</li>
          <li>• In London, enforcement is common — especially in permit-controlled residential zones</li>
        </ul>
      </div>

      <Prose>
        <p>
          In practice, councils often issue a warning for a first offence. However, the cost of removal
          — typically £200–£400 — far exceeds the permit fee. Legitimate hire companies will refuse to
          place a skip on a road without a valid permit in place. The{' '}
          <a href="https://www.gov.uk/guidance/permits-and-licences" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            GOV.UK guidance on permits and licences
          </a>{' '}
          covers the highway permit framework in full.
        </p>
      </Prose>

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      <H2>Practical Tips to Avoid Permit Problems</H2>
      <CheckList
        items={[
          'Tell the hire company at booking whether the skip goes on your drive or the road — not after delivery',
          'If your driveway is gated or access is awkward, confirm the depot knows before the lorry arrives — failed deliveries incur a charge',
          'In London, some boroughs take 3–5 working days to process permits — book well ahead for road-placed skips',
          'If the permit is due to expire before collection, call the company proactively — don\'t wait for them to chase you',
          'If the skip is half on your drive and half touching the road or pavement, get the permit — it\'s cheaper than the fine',
        ]}
      />

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Choose the right plate for your groundworks →
          </Link>
        </div>
      </div>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: How to Compare Prices in 2026</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Full breakdown of day and week rates →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect concrete and plasterwork through winter →
          </Link>
        </div>
      </div>

      {/* Internal link — site heater */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Site Heater Hire UK: Which Type Do You Need?</p>
          <Link to="/blog/site-heater-hire-uk-which-type-do-you-need-and-what-does-it-cost" className="text-sm text-brand-primary hover:underline">
            Diesel, propane and electric options compared →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Ready to Hire a Skip?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — skip hire prices from local UK suppliers including road permit arrangement where needed.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 32 — Generator Hire UK: Prices & Power Output Guide 2026 */

const generatorPriceTable: [string, string, string, string, string, string][] = [
  ['Small site', '6–10 kVA', '£60–£100', '£95–£155', '£220–£370', '£560–£940'],
  ['Medium site', '15–20 kVA', '£90–£150', '£140–£230', '£330–£550', '£840–£1,400'],
  ['Large site', '30–45 kVA', '£140–£220', '£210–£340', '£510–£810', '£1,300–£2,100'],
  ['Commercial (small)', '60 kVA', '£200–£280', '£300–£430', '£730–£1,020', '£1,850–£2,600'],
  ['Commercial (medium)', '100 kVA', '£260–£360', '£390–£550', '£950–£1,320', '£2,400–£3,400'],
  ['Industrial', '150–250 kVA', '£350–£520', '£520–£780', '£1,280–£1,900', '£3,200–£4,800'],
];

const generatorLoadTable: [string, string, string, string][] = [
  ['LED site light string (10 units)', '0.5 kW', '0.5 kW (no motor)', 'Any'],
  ['Site radio / battery charger', '0.1–0.3 kW', '0.3 kW', 'Any'],
  ['SDS drill (1,000W)', '1.0 kW', '2.0 kW', '4 kVA+'],
  ['Circular saw (1,200W)', '1.2 kW', '2.5 kW', '5 kVA+'],
  ['Angle grinder (2,000W)', '2.0 kW', '4.5 kW', '7 kVA+'],
  ['Table saw (1,800W)', '1.8 kW', '4.0 kW', '6 kVA+'],
  ['Air compressor (2-cylinder)', '1.5–2.5 kW', '4.0–6.0 kW', '10 kVA+'],
  ['Core drill (110V, 2,000W)', '2.0 kW', '4.5 kW', '7 kVA+'],
  ['Concrete mixer (750W)', '0.75 kW', '1.5 kW', '4 kVA+'],
  ['Welfare unit (kettle + sockets)', '3.0 kW', '3.0 kW', '6 kVA+'],
  ['2 × angle grinder + lighting + radio', '~5 kW running', '~11 kW surge', '15 kVA+'],
  ['Full trade site (4 tools + welfare)', '~8 kW running', '~18 kW surge', '30 kVA+'],
];

const generatorVoltageTable: [string, string, string][] = [
  ['110V', 'Power tools, site lighting, most construction equipment', 'Standard on UK construction sites — safer for outdoor/wet conditions'],
  ['240V', 'Welfare units, kettles, chargers, some IT equipment', 'Available on most hire generators as a separate output'],
  ['400V / 3-phase', 'Large plant, heavy equipment, commercial HVAC', 'Available on larger hire generators — confirm specification at booking'],
];

const generatorFaqs: Faq[] = [
  [
    'What size generator do I need for a building site?',
    'A small trade site with 2–3 power tools and site lighting typically needs a 10–15 kVA generator. A medium trade site with 4–6 simultaneous tools plus a welfare unit needs 20–30 kVA. A large commercial site with plant and heavy equipment needs 60 kVA or above. Use the load calculation guide to arrive at your specific requirement.',
  ],
  [
    'Do I need a generator on a construction site?',
    'If your site has no mains power connection — a new-build, a remote location, or a road or groundworks project — yes. Generators are also used as backup power during mains disruptions, for 110V reduced-voltage tool supply, and for temporary power before the permanent connection is commissioned.',
  ],
  [
    'Can I run 110V tools from a generator?',
    'Yes — most site generators provide both 110V (via a built-in 110V outlet or centre-tap transformer) and 240V outputs. Always confirm the 110V output capacity with the hire depot before booking — some smaller generators are 240V only.',
  ],
  [
    'How much fuel does a generator use per day?',
    'A 10 kVA generator running at 50% load for 10 hours uses approximately 15–25 litres of diesel. A 60 kVA unit at 50% load uses 80–120 litres per 10-hour day. Fuel is not included in hire rates — budget separately at current pump prices.',
  ],
  [
    'Do I need to provide diesel for a hire generator?',
    'Yes. Virtually all hire generators are delivered empty or with a minimal amount of fuel and you are expected to supply diesel. Return the generator with the same fuel level as collected. Some depots offer fuel delivery as an add-on service.',
  ],
  [
    'Can I hire a generator without a trade account?',
    'Yes. Most UK hire depots hire generators to private individuals and one-off trade customers without a trade account. You will need valid photo ID and a card for the deposit. Call ahead to confirm requirements.',
  ],
];

function GeneratorHireBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">Generator Hire at a Glance</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>6–10 kVA:</strong> £60–£100/day — 2–3 power tools + lighting for small sites or DIY</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>15–20 kVA:</strong> £90–£150/day — trade site with 4–6 tools, welfare unit, site office</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>30–45 kVA:</strong> £140–£220/day — large trade site, multiple heavy tools simultaneously</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>60–100 kVA:</strong> £200–£320/day — commercial site, plant, large-scale power requirements</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>100 kVA+:</strong> £280–£450/day — major events, large construction sites, industrial use</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Most hire generators are diesel — fuel is your responsibility and <strong>not</strong> included in the hire rate</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          Generator hire in the UK costs between <strong>£60 and £450 per day</strong> depending on
          power output. A 6 kVA site generator handles a handful of power tools and site lighting.
          A 60 kVA towable generator powers an entire medium commercial site. The most common hiring
          mistake is undersizing — which means tripped breakers, damaged tools, and a wasted day.
        </p>
        <p>
          This guide covers UK hire rates by kVA output, how to calculate what you need, fuel costs,
          and what to check before you book.
        </p>
      </Prose>

      <H2>Generator Hire Prices UK 2026</H2>
      <Prose>
        <p>
          All prices are VAT-inclusive guidance based on average UK market rates. Diesel fuel is
          additional — see the fuel cost section below. Use Tooli.uk to{' '}
          <Link to="/search" className="font-medium text-brand-primary hover:underline">compare now</Link>{' '}
          and confirm current quotes from local suppliers.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Generator Size</th>
              <th className="px-3 py-2 text-left font-semibold">Rated Output</th>
              <th className="px-3 py-2 text-left font-semibold">Day Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Weekend Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Week Rate</th>
              <th className="px-3 py-2 text-left font-semibold">4-Week Rate</th>
            </tr>
          </thead>
          <tbody>
            {generatorPriceTable.map(([size, output, day, weekend, week, month], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{size}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold">{output}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{day}</td>
                <td className="border-b border-gray-100 px-3 py-2">{weekend}</td>
                <td className="border-b border-gray-100 px-3 py-2">{week}</td>
                <td className="border-b border-gray-100 px-3 py-2">{month}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">*All prices VAT-inclusive guidance. Diesel fuel is additional — not included in hire rates. Compare current supplier quotes on Tooli.uk.</p>
      </div>

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>How to Calculate What Size Generator You Need</H2>

      <H3>Step 1: List Your Power Loads</H3>
      <Prose>
        <p>
          Write down every piece of equipment that will be running from the generator simultaneously —
          not just what <em>might</em> run, but what will realistically run at the same time at peak
          load. Use the table below as a reference for common site equipment.
        </p>
      </Prose>

      <H3>Step 2: Account for Starting (Surge) Current</H3>
      <Prose>
        <p>
          Electric motors — angle grinders, circular saws, core drills, compressors — draw <strong>2–3
          times their running current at start-up</strong>. A generator rated at 6 kVA running current
          must handle this surge without tripping. Use starting current for the calculation, not running
          current. The HSE guidance on{' '}
          <a href="https://www.hse.gov.uk/construction/safetytopics/electricalsafety.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            electrical safety on construction sites
          </a>{' '}
          covers temporary supply requirements including generator use.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Common Site Equipment</th>
              <th className="px-3 py-2 text-left font-semibold">Running Current</th>
              <th className="px-3 py-2 text-left font-semibold">Starting Surge</th>
              <th className="px-3 py-2 text-left font-semibold">Recommended Min Generator</th>
            </tr>
          </thead>
          <tbody>
            {generatorLoadTable.map(([equipment, running, surge, minGen], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{equipment}</td>
                <td className="border-b border-gray-100 px-3 py-2">{running}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-amber-700 font-medium">{surge}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{minGen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3>Step 3: Apply the Rule of Thumb</H3>
      <Prose>
        <p>
          Total your peak simultaneous running loads in kW, then multiply by <strong>1.25</strong> to
          account for motor starting surges and leave headroom. Convert to kVA using:{' '}
          <strong>kVA = kW ÷ 0.8</strong> (power factor for typical generator loads). This gives your
          minimum generator rating.
        </p>
        <p>
          <strong>Example:</strong> Two angle grinders (2.0 kW each) + site lighting (0.5 kW) + radio
          (0.2 kW) = 4.7 kW running. Multiply by 1.25 = 5.9 kW. Divide by 0.8 = <strong>7.4 kVA
          minimum</strong>. A 10 kVA generator gives comfortable headroom.
        </p>
      </Prose>

      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3 text-sm text-gray-700">
        <p className="font-semibold text-brand-primary">Quick Sizing Formula</p>
        <p className="mt-1">Total running kW × 1.25 ÷ 0.8 = <strong>minimum kVA rating</strong></p>
        <p className="mt-1 text-xs text-gray-500">Always round up to the next standard generator size and confirm with your hire depot.</p>
      </div>

      <img
        src="/images/blog/generator-hire-uk-prices.webp"
        alt="Site engineer checking kVA output on a 30 kVA hire generator control panel on a UK construction site"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      {/* Internal link — site heater */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Site Heater Hire UK: Which Type Do You Need?</p>
          <Link to="/blog/site-heater-hire-uk-which-type-do-you-need-and-what-does-it-cost" className="text-sm text-brand-primary hover:underline">
            Diesel, propane and electric options compared →
          </Link>
        </div>
      </div>

      <H2>110V vs 240V: Which Output Does Your Site Need?</H2>
      <Prose>
        <p>
          UK construction sites predominantly use <strong>110V reduced-low-voltage (RLV)</strong> power
          for most tools — drills, saws, grinders, compressors. 110V is significantly safer than 240V
          in wet or outdoor conditions because the centre-tapped transformer limits shock voltage to
          55V to earth. This is governed by{' '}
          <a href="https://www.theiet.org/publishing/wiring-regulations" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            IET Wiring Regulations BS 7671
          </a>{' '}
          and the{' '}
          <a href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            HSE PUWER regulations
          </a>{' '}
          which apply to generators as work equipment.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Voltage</th>
              <th className="px-3 py-2 text-left font-semibold">Used For</th>
              <th className="px-3 py-2 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {generatorVoltageTable.map(([voltage, uses, notes], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-bold text-brand-primary">{voltage}</td>
                <td className="border-b border-gray-100 px-3 py-2">{uses}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Choose the right plate for your groundworks →
          </Link>
        </div>
      </div>

      <H2>Fuel Costs: The Hidden Cost of Generator Hire</H2>
      <Prose>
        <p>
          Hire rates do not include diesel fuel. Budget approximately:
        </p>
      </Prose>

      <CheckList
        items={[
          '6–10 kVA generator at 50% load: 1.5–2.5 litres per hour (~£25–£35 per 10-hour day)',
          '20–30 kVA generator at 50% load: 3–6 litres per hour (~£50–£100 per 10-hour day)',
          '60 kVA generator at 50% load: 8–12 litres per hour (~£130–£180 per 10-hour day)',
          'Return the generator with the same fuel level as collected — most depots specify this in the hire agreement',
          'Some depots offer fuel delivery as an add-on — ask when booking if site access for a fuel bowser is possible',
        ]}
      />

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: How to Compare Prices in 2026</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Full breakdown of day and week rates →
          </Link>
        </div>
      </div>

      {/* Internal link — dehumidifier */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Dehumidifier Hire UK: Prices &amp; Which Size to Choose</p>
          <Link to="/blog/dehumidifier-hire-uk-prices-which-size-to-choose" className="text-sm text-brand-primary hover:underline">
            Full sizing guide and hire prices →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect concrete and plasterwork through winter →
          </Link>
        </div>
      </div>

      {/* Internal link — skip hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</p>
          <Link to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026" className="text-sm text-brand-primary hover:underline">
            Full price guide for every skip size →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Generator Hire Prices Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — diesel generator hire from local UK suppliers by kVA output, day rate, and hire duration.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 33 — What Size Generator Do I Need for Power Tools? The Direct Answer */

const genSizeQuickTable: [string, string, string][] = [
  ['1 × SDS drill + site lighting', '4 kVA', '6 kVA — gives comfortable headroom'],
  ['1 × angle grinder + 1 × drill + lighting', '6 kVA', '10 kVA — motor surge needs headroom'],
  ['Circular saw + drill + air compressor', '10 kVA', '15 kVA — compressor surge is large'],
  ['2 × grinder + saw + lighting + radio', '12 kVA', '15–20 kVA'],
  ['Full trade site (4 tools + welfare unit)', '20 kVA', '30 kVA — welfare kettle is a load spike'],
  ['Large site — 6 tools + welfare + office', '35 kVA', '45–60 kVA'],
  ['Commercial plant + tools + welfare', '60 kVA+', '100 kVA — consult depot'],
];

const genSurgTable: [string, string, string, string][] = [
  ['SDS/rotary drill — 800W', '800W', '1,600–2,000W', '4 kVA'],
  ['Corded drill — 600W', '600W', '1,200–1,500W', '3 kVA'],
  ['Circular saw — 1,200W', '1,200W', '2,500–3,000W', '5 kVA'],
  ['Angle grinder — 1,000W', '1,000W', '2,200–2,500W', '5 kVA'],
  ['Angle grinder — 2,000W', '2,000W', '4,500–5,500W', '8 kVA'],
  ['Disc cutter (petrol)', 'Petrol engine', 'No electrical surge', 'No generator needed'],
  ['Air compressor — 1,500W', '1,500W', '3,500–5,000W', '8 kVA'],
  ['Air compressor — 2,500W', '2,500W', '5,500–7,500W', '12 kVA'],
  ['Table saw — 1,800W', '1,800W', '4,000–5,000W', '8 kVA'],
  ['Core drill — 2,000W (110V)', '2,000W', '4,500–5,500W', '8 kVA'],
  ['Concrete mixer — 750W', '750W', '1,500–2,000W', '4 kVA'],
  ['Site kettle — 3,000W', '3,000W', '3,000W (resistive — no surge)', '5 kVA'],
  ['LED site floodlight — 150W', '150W', '150W (no motor)', 'Any'],
];

const genSizeFaqs: Faq[] = [
  [
    'What generator do I need to run two angle grinders?',
    'To run two 2,000W angle grinders simultaneously, you need a generator that can handle the starting surge of one grinder (approximately 4,500–5,500W) plus the running load of the other (2,000W). Total peak demand: ~6,500W. At 0.8 power factor = 8.1 kVA. Plus 25% headroom = at least a 10 kVA generator. A 15 kVA unit gives comfortable margin.',
  ],
  [
    'Can I run a compressor from a 6 kVA generator?',
    'It depends on the compressor size. A small single-cylinder compressor (750W rated) has a starting surge of around 1,500–2,000W and can start on a 6 kVA generator — though with little headroom for other simultaneous loads. A 2-cylinder or larger compressor (2,500W+ rated) needs at least a 10–12 kVA generator to start reliably.',
  ],
  [
    'Why does my generator trip when I start a power tool?',
    'The tool\'s starting surge is exceeding the generator\'s rated or peak output. This is the most common cause of generator breaker trips on site. The solution is a larger generator — not a different breaker or a different tool. Use the starting surge values in the table above to size correctly.',
  ],
  [
    'Do I need a generator for 110V tools?',
    'Only if you have no mains power supply. Most hire generators above 6 kVA provide a 110V outlet via a built-in centre-tap transformer. Confirm 110V availability at the point of hire — some smaller generators are 240V only and would need a separate transformer step-down unit for 110V tools.',
  ],
  [
    'What is a kVA?',
    'kVA (kilovolt-ampere) is the unit of apparent power used to rate generators. In practical terms, a generator\'s kW (kilowatt) output in real power is approximately 80% of its kVA rating (assuming a 0.8 power factor for typical construction site loads). A 10 kVA generator delivers approximately 8 kW of usable power to your tools.',
  ],
];

function WhatSizeGeneratorBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">The Key Rule</h2>
        <p className="text-sm text-gray-700">
          Size your generator to the <strong>starting surge</strong> of your largest motor — not its
          rated wattage. Electric motors draw 2–3× their running current at start-up. A generator
          sized only to running loads will trip its overload breaker every time a motor starts.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Single drill or small saw: <strong>4–6 kVA</strong></span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>2–3 tools + lighting: <strong>10–15 kVA</strong></span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Full trade site (4 tools + welfare): <strong>20–30 kVA</strong></span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Always add 25% headroom above your calculated minimum</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          For a single corded drill or small circular saw, a <strong>4–6 kVA generator</strong> is
          sufficient. For a typical trade-site setup with two or three power tools running
          simultaneously, you need <strong>10–15 kVA</strong>. The key number is not the tool's rated
          wattage — it is the starting surge current, which is 2–3 times higher. Size your generator
          to the surge, not the run, or you'll trip the breaker every time a motor starts.
        </p>
      </Prose>

      <H2>Quick Reference: Generator Size by Tool Setup</H2>
      <Prose>
        <p>
          Use this table as a fast first check. The minimum is the lowest rating that will work;
          the recommended size gives comfortable headroom for surge and leaves capacity to add loads.
          To{' '}
          <Link to="/search" className="font-medium text-brand-primary hover:underline">compare now</Link>{' '}
          on generator hire rates from local suppliers, enter your postcode on Tooli.uk.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">What You're Running</th>
              <th className="px-3 py-2 text-left font-semibold">Min Generator Size</th>
              <th className="px-3 py-2 text-left font-semibold">Recommended Hire Size</th>
            </tr>
          </thead>
          <tbody>
            {genSizeQuickTable.map(([setup, min, recommended], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{setup}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-amber-700 font-semibold">{min}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{recommended}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — generator hire prices */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Generator Hire UK: Prices &amp; Power Output Guide 2026</p>
          <Link to="/blog/generator-hire-uk-prices-power-output-guide-2026" className="text-sm text-brand-primary hover:underline">
            Full kVA price guide and fuel cost estimates →
          </Link>
        </div>
      </div>

      <H2>Why Starting Surge Matters More Than Rated Wattage</H2>
      <Prose>
        <p>
          Every power tool with an electric motor draws <strong>2–3 times its rated current</strong> for
          a fraction of a second when it starts. This is called the <em>starting surge</em> or inrush
          current. A 2,000W angle grinder has a starting surge of approximately 4,500–5,000W.
        </p>
        <p>
          A generator rated at 5 kVA cannot start a 2,000W angle grinder without tripping the overload
          protection — because the 4,500W surge exceeds its capacity. You need at least 7–8 kVA to
          start that single grinder reliably. The{' '}
          <a href="https://www.hse.gov.uk/construction/safetytopics/electricalsafety.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            HSE guidance on electrical safety on construction sites
          </a>{' '}
          recommends 110V reduced-low-voltage systems for outdoor and wet-condition tool use, which most
          hire generators above 6 kVA support via a built-in centre-tap transformer.
        </p>
        <p>
          <strong>The rule:</strong> size the generator to handle the starting surge of your largest
          motor, plus the running load of everything else running simultaneously.
        </p>
      </Prose>

      <img
        src="/images/blog/what-size-generator-do-i-need-for-power-tools.png"
        alt="Site worker operating a 110V angle grinder powered from a diesel generator on a UK outdoor construction site"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      <H2>Tool-by-Tool Starting Surge Reference</H2>
      <Prose>
        <p>
          The table below shows rated power, typical starting surge, and the minimum generator rating
          needed to start each tool in isolation. When running multiple tools together, use the
          three-step calculation below.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Power Tool</th>
              <th className="px-3 py-2 text-left font-semibold">Rated Power</th>
              <th className="px-3 py-2 text-left font-semibold">Typical Starting Surge</th>
              <th className="px-3 py-2 text-left font-semibold">Min Generator to Start</th>
            </tr>
          </thead>
          <tbody>
            {genSurgTable.map(([tool, rated, surge, minGen], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{tool}</td>
                <td className="border-b border-gray-100 px-3 py-2">{rated}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-amber-700 font-medium">{surge}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{minGen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>The Calculation in Three Steps</H2>

      <H3>Step 1: Identify Your Peak Simultaneous Load</H3>
      <Prose>
        <p>
          Write down every tool that could be running at the same time at peak load. Be realistic —
          not every tool on a site runs simultaneously, but be conservative. Include the welfare kettle
          if it's on the same circuit — a 3,000W kettle is a significant load spike even though it
          has no starting surge.
        </p>
      </Prose>

      <H3>Step 2: Calculate Total Running Load + Largest Starting Surge</H3>
      <Prose>
        <p>
          Add the running power of all tools <strong>except</strong> the one with the largest starting
          surge. Add the starting surge of that single largest tool instead of its running load. This
          is your peak demand figure in watts (W).
        </p>
      </Prose>

      <H3>Step 3: Convert to kVA and Add 25% Headroom</H3>
      <Prose>
        <p>
          Divide the peak demand in watts by 1,000 to get kW. Divide by 0.8 (power factor) to get
          kVA, as governed by the{' '}
          <a href="https://www.theiet.org/publishing/wiring-regulations" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            IET Wiring Regulations BS 7671
          </a>
          . Add 25% headroom: kVA × 1.25 = recommended generator size.
        </p>
      </Prose>

      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-5 py-4 text-sm">
        <p className="font-bold text-brand-primary">Worked Example</p>
        <p className="mt-2 text-gray-700">
          Circular saw (1,200W running) + angle grinder (2,000W — largest motor, use starting surge
          of 4,500W) + site lighting (500W) = <strong>6,200W peak demand</strong>
        </p>
        <p className="mt-1 text-gray-700">÷ 1,000 = 6.2 kW → ÷ 0.8 = 7.75 kVA → × 1.25 = <strong>9.7 kVA minimum</strong></p>
        <p className="mt-1 font-semibold text-brand-primary">Hire a 10 kVA generator.</p>
        <p className="mt-2 text-xs text-gray-500">Formula: (Running loads + largest surge) ÷ 1,000 ÷ 0.8 × 1.25 = recommended kVA</p>
      </div>

      <img
        src="/images/blog/what-size-generator.png"
        alt="Close-up of a 15 kVA hire generator control panel showing 110V and 240V output sockets"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Choose the right plate for your groundworks →
          </Link>
        </div>
      </div>

      <H2>110V vs 240V: Does It Change the Calculation?</H2>
      <Prose>
        <p>
          No — the calculation is the same in watts or kW regardless of voltage. Most site tools are
          110V on UK construction sites (safer outdoors and in wet conditions). Confirm your generator
          provides 110V output — not all smaller generators do. A 110V centre-tap transformer is
          built into most hire models above 6 kVA, limiting shock voltage to 55V to earth.
        </p>
        <p>
          If you're running 240V equipment (welfare unit, battery chargers, site office) from the same
          generator, factor those loads into your calculation as normal — they have no motor surge
          unless they contain a motor.
        </p>
      </Prose>

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <p className="text-sm font-semibold">Check 110V availability before booking</p>
        <p className="mt-1 text-sm">
          Some generators below 6 kVA are 240V only. If your tools are 110V, confirm the generator
          has a 110V outlet — or ask the depot to include a separate centre-tap transformer in the hire.
        </p>
      </div>

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: How to Compare Prices in 2026</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Full breakdown of day and week rates →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect concrete and plasterwork through winter →
          </Link>
        </div>
      </div>

      {/* Internal link — skip hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</p>
          <Link to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026" className="text-sm text-brand-primary hover:underline">
            Full price guide for every skip size →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Hire the Right Generator Today</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — diesel generator hire from local UK suppliers by kVA output, with 110V and 240V options confirmed at booking.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 34 — Cut-Off Saw & Disc Cutter Hire UK: Prices Compared */

const cutOffSawPriceTable: [string, string, string, string, string, string][] = [
  ['Small petrol cut-off saw', '300 mm', 'Petrol', '£40–£65', '£65–£100', '£155–£240'],
  ['Standard petrol cut-off saw', '350 mm', 'Petrol', '£50–£80', '£80–£125', '£190–£300'],
  ['Large petrol cut-off saw', '400 mm', 'Petrol', '£60–£90', '£95–£140', '£230–£340'],
  ['Electric disc cutter', '230 mm', '110V electric', '£35–£55', '£55–£85', '£130–£200'],
  ['Electric disc cutter (large)', '300 mm', '110/240V electric', '£45–£70', '£70–£110', '£170–£260'],
  ['Floor saw (road saw)', '350–400 mm', 'Petrol', '£90–£150', '£140–£230', '£340–£560'],
  ['Table / bench saw (masonry)', '300 mm', 'Electric', '£55–£85', '£85–£130', '£200–£315'],
];

const cutOffSawComparisonTable: [string, string, string][] = [
  ['Power source', 'Self-contained — petrol', 'Requires 110V or 240V supply'],
  ['Best environment', 'Outdoor, roadworks, open sites', 'Indoor, enclosed spaces, dust-sensitive areas'],
  ['Exhaust fumes', 'Yes — significant CO risk indoors', 'None'],
  ['Noise level', '100–115 dB', '85–100 dB (quieter)'],
  ['Dust production', 'High — water suppression essential', 'High — water suppression or extraction essential'],
  ['Weight (typical)', '10–14 kg', '5–9 kg'],
  ['Hire cost', 'Slightly higher', 'Slightly lower'],
  ['Ideal for', 'Kerbs, paviors, tarmac cuts, outdoor masonry', 'Internal block cuts, bathroom tiling, quieter sites'],
];

const cutOffBladeTable: [string, string, string, string][] = [
  ['Abrasive (composite) disc', 'Soft masonry, block, brick', 'Short — consumable', 'Included or available from depot — cheap'],
  ['Diamond segmented blade', 'Hard concrete, granite, engineering brick', 'Long — specialist', 'Usually additional hire or purchase cost'],
  ['Diamond continuous rim', 'Ceramic tiles, smooth-cut masonry', 'Long', 'Low chipping — finish quality blade'],
  ['Asphalt / road blade', 'Tarmac, asphalt, road surfaces', 'Medium', 'Specific to road-cutting machines'],
];

const cutOffSawFaqs: Faq[] = [
  [
    'How much does it cost to hire a disc cutter for a day?',
    'A standard petrol cut-off saw (350 mm blade) costs approximately £50–£80 per day in the UK. An electric disc cutter (230 mm) costs £35–£55/day. Floor saws for road cutting run £90–£150/day. All prices are VAT-inclusive guidance — confirm current rates on Tooli.uk.',
  ],
  [
    'Do I need training to use a hire cut-off saw?',
    'Yes — under PUWER 1998 Regulation 9, operators of abrasive wheel equipment must have received adequate training. This is a competence requirement rather than a specific card or certification, but records should be kept. On commercial sites, site managers may ask for evidence of abrasive wheel training before permitting use.',
  ],
  [
    'Can I use a disc cutter indoors?',
    'A petrol disc cutter must never be used in enclosed or poorly ventilated spaces — carbon monoxide from the exhaust poses a serious and rapid health risk. Use an electric disc cutter for indoor applications. Dust suppression and RPE (FFP3 mask) are required regardless of machine type.',
  ],
  [
    'What is the difference between a cut-off saw and a disc cutter?',
    'They are the same thing — cut-off saw, disc cutter, abrasive wheel cutter, and angle grinder (at smaller sizes) all describe similar cutting machines. The terms are used interchangeably in the UK hire trade. Floor saws (road saws) are a related but distinct machine specifically for cutting flat surfaces.',
  ],
  [
    'What blades come with a hire cut-off saw?',
    'Most hire depots supply the machine with a standard abrasive composite disc fitted. Diamond blades are usually available at an additional cost or as a separate hire/purchase item. Specify the material you\'re cutting when booking — the depot can advise on the right blade type.',
  ],
];

function CutOffSawHireBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">Cut-Off Saw Hire at a Glance</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Petrol cut-off saw (300–350 mm blade):</strong> £40–£75/day — outdoor masonry, kerbs, blocks</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Petrol cut-off saw (350–400 mm blade):</strong> £55–£90/day — heavier cutting, concrete</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Electric disc cutter (230–300 mm blade):</strong> £35–£65/day — indoor/quiet sites, less dust</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Abrasive wheel training required by PUWER 1998 Reg 9 for all commercial operators</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Dust suppression (water feed) required on most hire machines — confirm at booking</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Diamond blades vs abrasive discs — different materials, different hire machines</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          Cut-off saw hire in the UK costs between <strong>£35 and £90 per day</strong> depending on
          whether the machine is petrol or electric and the blade diameter. Petrol disc cutters are the
          most commonly hired type — they work without a power source, making them the default choice
          for roadworks, site clearance, and outdoor masonry cutting. Electric models are quieter and
          produce no exhaust fumes, making them better suited for indoor or enclosed cutting.
        </p>
        <p>
          This guide covers hire rates, blade types, the abrasive wheels training requirement, and dust
          control rules.
        </p>
      </Prose>

      <H2>Cut-Off Saw Hire Prices UK 2026</H2>
      <Prose>
        <p>
          All prices are VAT-inclusive guidance based on average UK market rates. Use Tooli.uk to{' '}
          <Link to="/search" className="font-medium text-brand-primary hover:underline">compare now</Link>{' '}
          and confirm current quotes from local suppliers.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Machine Type</th>
              <th className="px-3 py-2 text-left font-semibold">Blade Size</th>
              <th className="px-3 py-2 text-left font-semibold">Fuel / Power</th>
              <th className="px-3 py-2 text-left font-semibold">Day Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Weekend Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Week Rate</th>
            </tr>
          </thead>
          <tbody>
            {cutOffSawPriceTable.map(([machine, blade, fuel, day, weekend, week], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{machine}</td>
                <td className="border-b border-gray-100 px-3 py-2">{blade}</td>
                <td className="border-b border-gray-100 px-3 py-2">{fuel}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{day}</td>
                <td className="border-b border-gray-100 px-3 py-2">{weekend}</td>
                <td className="border-b border-gray-100 px-3 py-2">{week}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">*All prices VAT-inclusive guidance. Confirm live rates on Tooli.uk.</p>
      </div>

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>Petrol vs Electric Cut-Off Saw: Which to Hire?</H2>
      <Prose>
        <p>
          The choice between petrol and electric comes down to where you are cutting and whether you
          have access to a power supply. A petrol machine is the default on road and groundworks sites;
          an electric machine is the only safe choice indoors.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Factor</th>
              <th className="px-3 py-2 text-left font-semibold">Petrol</th>
              <th className="px-3 py-2 text-left font-semibold">Electric</th>
            </tr>
          </thead>
          <tbody>
            {cutOffSawComparisonTable.map(([factor, petrol, electric], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{factor}</td>
                <td className="border-b border-gray-100 px-3 py-2">{petrol}</td>
                <td className="border-b border-gray-100 px-3 py-2">{electric}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <p className="text-sm font-semibold">Never use a petrol cut-off saw indoors</p>
        <p className="mt-1 text-sm">
          Carbon monoxide from petrol engine exhaust is colourless and odourless — it accumulates
          rapidly in enclosed spaces and causes incapacitation within minutes at high concentrations.
          Use an electric disc cutter for any indoor or enclosed cutting.
        </p>
      </div>

      <img
        src="/images/blog/cut-off-saw-disc-cutter-hire.webp"
        alt="Electric disc cutter being used on a block wall inside a UK building — indoor cut-off saw hire"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Choose the right plate for your groundworks →
          </Link>
        </div>
      </div>

      <H2>Blade Types: Abrasive vs Diamond</H2>
      <Prose>
        <p>
          The blade fitted to a hire cut-off saw determines what materials it will cut effectively and
          safely. Most depots supply a standard abrasive composite disc; diamond blades are usually
          available at additional cost. Always specify the material you're cutting when booking.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Blade Type</th>
              <th className="px-3 py-2 text-left font-semibold">Best For</th>
              <th className="px-3 py-2 text-left font-semibold">Lifespan</th>
              <th className="px-3 py-2 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {cutOffBladeTable.map(([blade, bestFor, lifespan, notes], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{blade}</td>
                <td className="border-b border-gray-100 px-3 py-2">{bestFor}</td>
                <td className="border-b border-gray-100 px-3 py-2">{lifespan}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <p className="text-sm font-semibold">Blade speed rating — safety critical</p>
        <p className="mt-1 text-sm">
          Never fit a blade or disc not rated for the machine speed. The machine's maximum RPM must
          be equal to or less than the blade's rated RPM. Fitting an incorrect disc to a high-speed
          cut-off saw creates a serious fragmentation risk under{' '}
          <a href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-amber-900 hover:underline">
            PUWER 1998
          </a>.
        </p>
      </div>

      {/* Internal link — generator hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Generator Hire UK: Prices &amp; Power Output Guide 2026</p>
          <Link to="/blog/generator-hire-uk-prices-power-output-guide-2026" className="text-sm text-brand-primary hover:underline">
            Size a generator for your electric disc cutter →
          </Link>
        </div>
      </div>

      <H2>Dust Control: A Legal Requirement</H2>
      <Prose>
        <p>
          Silica dust produced by cutting masonry, concrete, and stone is a carcinogen. Under the{' '}
          <a href="https://www.hse.gov.uk/coshh" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            Control of Substances Hazardous to Health Regulations 2002 (COSHH)
          </a>
          , employers and self-employed workers have a legal duty to control exposure to silica dust.
          The{' '}
          <a href="https://www.hse.gov.uk/construction/healthrisks/silica-quartz.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            HSE guidance on silica dust and cut-off saws
          </a>{' '}
          sets out the hierarchy of controls:
        </p>
      </Prose>

      <CheckList
        items={[
          'Water suppression (wet cutting): the standard method on hire machines — most hire cut-off saws have an integrated water feed. Confirm at booking and ensure the water supply is connected before cutting',
          'On-tool extraction: required where wet cutting is not possible (e.g. electrical cuts near moisture) — an H-class vacuum extractor must be used',
          'RPE (respiratory protective equipment): FFP3 half-mask minimum when cutting dry, even briefly — P3 is the correct filter class for silica dust',
          'Exclusion zone: keep bystanders clear of the cutting area — silica dust disperses widely and is invisible in the air',
        ]}
      />

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      <H2>Abrasive Wheels: Training Requirement</H2>
      <Prose>
        <p>
          Under{' '}
          <a href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            PUWER 1998 Regulation 9
          </a>
          , anyone who mounts, adjusts, or operates a cut-off saw with an abrasive wheel must have
          received adequate training. This is not a card or certificate system like CPCS or PASMA —
          it is a competence requirement. Training records should be kept.
        </p>
        <p>
          Most hire depots will not refuse to hire a cut-off saw on the basis of lacking a specific
          card. However, using an abrasive wheel without training on a commercial site may constitute
          a PUWER breach if audited.
        </p>
      </Prose>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: How to Compare Prices in 2026</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Full breakdown of day and week rates →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect concrete and plasterwork through winter →
          </Link>
        </div>
      </div>

      {/* Internal link — skip hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</p>
          <Link to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026" className="text-sm text-brand-primary hover:underline">
            Full price guide for every skip size →
          </Link>
        </div>
      </div>

      {/* Internal link — site heater */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Site Heater Hire UK: Which Type Do You Need?</p>
          <Link to="/blog/site-heater-hire-uk-which-type-do-you-need-and-what-does-it-cost" className="text-sm text-brand-primary hover:underline">
            Diesel, propane and electric options compared →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Cut-Off Saw Hire Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — petrol and electric disc cutter hire from local UK suppliers by blade size and hire duration.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 35 — Abrasive Wheels Regulations UK: What Hirers Must Know */

const abrasiveEquipmentTable: [string, string, string][] = [
  ['Petrol cut-off saw / abrasive saw', 'Yes', 'Mounted abrasive wheel — core application'],
  ['Electric disc cutter', 'Yes', 'Same wheel mounting principle'],
  ['Angle grinder (all sizes)', 'Yes', 'Particularly relevant when changing discs'],
  ['Floor saw / road saw', 'Yes', 'Large-diameter abrasive or diamond wheels'],
  ['Bench grinder', 'Yes', 'Fixed abrasive wheels — wheel dressing also covered'],
  ['Diamond blade on cut-off saw', 'Yes', 'Diamond blades subject to the same PUWER training requirement'],
  ['Cordless angle grinder', 'Yes', 'Battery-powered does not exempt from PUWER'],
  ['Wire wheel attachment on angle grinder', 'Yes — under PUWER Reg 9', 'Wire wheels are not abrasive wheels per se but PUWER training still applies'],
  ['Jigsaw, circular saw (wood)', 'No', 'Different cutting mechanism — PUWER applies but abrasive wheel regs do not'],
];

const abrasiveTrainingTable: [string, string][] = [
  ['Types of abrasive wheels and discs', 'Identification of wheel types, materials, max RPM ratings, correct application'],
  ['Marking and storage', 'How wheels are marked (speed, material, diameter), storage requirements (humidity, temperature, stacking)'],
  ['Inspection before mounting', 'Checking for cracks, chips, and damage — ring test procedure for vitrified wheels'],
  ['Mounting procedure', 'Correct blotters, flanges, nut tightening sequence — overtightening causes wheel breakage'],
  ['Speed matching', 'Machine RPM vs wheel max RPM — never fit a wheel with a lower max RPM than the machine speed'],
  ['Safe operating procedures', 'Guards, work rests, wheel dressing, working position relative to wheel rotation'],
  ['Hazards and PPE', 'Fragmentation risk, sparks, noise, dust, eye and face protection requirements'],
  ['Legal duties (PUWER, HSWA 1974)', 'Operator and employer duties — when and why to stop work'],
];

const abrasiveAccidentTable: [string, string, string][] = [
  ['Wheel fragmentation / disc burst', 'Wheel RPM exceeds machine RPM, or cracked disc mounted', 'Speed matching and pre-use inspection taught in training'],
  ['Kickback injury', 'Disc snagged or bound in cut — operator loses control', 'Correct grip, cutting technique and guard use covered in training'],
  ['Incorrect disc for material', 'Abrasive disc used on metal, or wrong stone disc on concrete', 'Material matching section of training covers this explicitly'],
  ['Eye injury from fragments', 'No eye protection worn, or wrong PPE class', 'PPE requirements covered — BS EN 166 rated eye protection for grinding'],
  ['Disc breakage from overtightening', 'Mounting flange overtightened, cracking the disc at the bore', 'Correct mounting procedure covered in torque and flange sequence module'],
];

const abrasiveWheelsFaqs: Faq[] = [
  [
    'Do I need training to use a hire cut-off saw?',
    'Yes — under PUWER 1998 Regulation 9, anyone who mounts, adjusts, or uses abrasive wheel equipment must have received adequate training. This applies regardless of whether you hire or own the machine, and regardless of whether you\'re on private or commercial land. It is a statutory competence requirement, not a card system.',
  ],
  [
    'Is there a specific abrasive wheels certificate I need?',
    'No — there is no prescribed certificate or card. PUWER requires adequate training with documented records. Many training providers issue completion certificates (typically after a half-day or 1-day course), and these are useful evidence of compliance, but the regulations do not mandate a specific format or issuing body.',
  ],
  [
    'What is HSG17?',
    'HSG17 is the HSE guidance document \'Safe Use of Abrasive Wheels.\' It is the definitive technical reference for abrasive wheel safety in the UK, covering wheel types, marking, storage, mounting, speed matching, and operating procedures. It is free to download from the HSE website and is the document training providers base their courses on.',
  ],
  [
    'Does PUWER apply on private land?',
    'Yes — PUWER 1998 applies wherever work equipment is in use in connection with work activities, including self-employed workers operating on private domestic land (their own or a client\'s property). The domestic householder using equipment purely for DIY is not subject to PUWER, but any trade or commercial operator is.',
  ],
  [
    'Can my employer be liable if I use a hire disc cutter without training?',
    'Yes. Under PUWER Regulation 9, the employer has a duty to ensure training has been provided. If an accident occurs and training records cannot be produced, the employer faces potential prosecution under PUWER and the Health and Safety at Work Act 1974. Self-employed workers face the same liability in both capacities.',
  ],
  [
    'What PPE is required when using a cut-off saw or disc cutter?',
    'As a minimum: BS EN 166-compliant face shield or safety glasses for fragmentation, FFP3 dust mask (P3 filter) for silica dust, hearing protection (abrasive saws typically generate 100–115 dB), steel-toe boots, and close-fitting clothing. Gloves are generally not recommended for rotating equipment as they can snag.',
  ],
];

function AbrasiveWheelsBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">Abrasive Wheels Rules at a Glance</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>PUWER 1998 Reg 9:</strong> training required for anyone who mounts, adjusts, or operates an abrasive wheel</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Applies to:</strong> cut-off saws, disc cutters, angle grinders, bench grinders, floor saws</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>No card system — a competence requirement backed by training records</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Employer and employee both have duties — self-employed workers are treated as both</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>HSE Guidance Document HSG17 is the definitive reference for abrasive wheel safety</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Hire depots are not required to check training before hire — but PUWER still applies on site</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          Anyone who mounts, adjusts, or operates abrasive wheel equipment — including cut-off saws,
          disc cutters, angle grinders, and bench grinders — must have received adequate training under{' '}
          <a href="https://www.legislation.gov.uk/uksi/1998/2306" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            PUWER 1998 Regulation 9
          </a>.
          This is not a licence or a card system. It is a competence requirement backed by statute.
          Non-compliance creates personal and employer liability if an accident occurs.
        </p>
      </Prose>

      <H2>The Legal Framework</H2>

      <H3>PUWER 1998 Regulation 9</H3>
      <Prose>
        <p>
          Regulation 9 of the{' '}
          <a href="https://www.legislation.gov.uk/uksi/1998/2306" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            Provision and Use of Work Equipment Regulations 1998 (SI 1998/2306)
          </a>{' '}
          states (paraphrased): <em>Every employer shall ensure that all persons who use work equipment
          have received adequate training for purposes of health and safety, including training in the
          methods which may be adopted when using the work equipment, any risks which such use may
          entail and precautions to be taken.</em>
        </p>
        <p>
          The HSE has historically identified abrasive wheel equipment as a specific high-risk category
          requiring particular attention to training — reflected in the dedicated guidance document{' '}
          <a href="https://www.hse.gov.uk/pubns/books/hsg17.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            HSG17 (Safe Use of Abrasive Wheels)
          </a>.
        </p>
      </Prose>

      <H3>The Health and Safety at Work Act 1974</H3>
      <Prose>
        <p>
          Section 2 of the HSWA 1974 places a general duty on employers to ensure the health, safety,
          and welfare of employees. Section 3 extends a similar duty to non-employees (including the
          public) who may be affected by work activities. Section 7 places a duty on employees to take
          reasonable care for their own safety and the safety of others.
        </p>
        <p>
          Self-employed workers operating a cut-off saw are treated simultaneously as the employer
          (duty under Section 2 and PUWER Reg 9) and the employee (duty under Section 7).
        </p>
      </Prose>

      {/* Internal link — cut-off saw hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Cut-Off Saw &amp; Disc Cutter Hire UK: Prices Compared</p>
          <Link to="/blog/cut-off-saw-and-disc-cutter-hire-uk-prices-compared" className="text-sm text-brand-primary hover:underline">
            Full price guide — petrol and electric disc cutters →
          </Link>
        </div>
      </div>

      <H2>What Equipment Is Covered?</H2>
      <Prose>
        <p>
          The abrasive wheel regulations apply broadly to any machine that uses a bonded abrasive or
          diamond wheel — whether powered by petrol, electricity, or battery. The table below lists
          common site equipment and whether the training requirement applies.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Equipment</th>
              <th className="px-3 py-2 text-left font-semibold">Covered?</th>
              <th className="px-3 py-2 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {abrasiveEquipmentTable.map(([equipment, covered, notes], i) => {
              const isYes = covered.toLowerCase().startsWith('yes');
              return (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border-b border-gray-100 px-3 py-2 font-medium">{equipment}</td>
                  <td className={`border-b border-gray-100 px-3 py-2 font-semibold ${isYes ? 'text-brand-primary' : 'text-gray-500'}`}>{covered}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>What Training Is Required?</H2>
      <Prose>
        <p>
          The regulations do not specify a minimum course duration, specific training provider, or a
          certification card. What is required is that training is:
        </p>
      </Prose>

      <CheckList
        items={[
          'Adequate — covers the specific machine type and the risks associated with it',
          'Documented — training records must be kept by the employer',
          'Task-specific — training on an angle grinder does not automatically cover a cut-off saw, as mounting procedure and technique differ',
          'Refreshed when equipment types change or significant time has elapsed',
        ]}
      />

      <img
        src="/images/blog/abrasive-wheels-regulations-uk.webp"
        alt="Close-up of abrasive disc speed rating label (max RPM) matching machine specification before mounting"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      <H2>What's Typically Covered in Abrasive Wheel Training?</H2>
      <Prose>
        <p>
          Training providers base their courses on{' '}
          <a href="https://www.hse.gov.uk/pubns/books/hsg17.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            HSG17
          </a>.
          A typical half-day or 1-day course covers the following modules:
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Training Module</th>
              <th className="px-3 py-2 text-left font-semibold">Key Content</th>
            </tr>
          </thead>
          <tbody>
            {abrasiveTrainingTable.map(([module, content], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{module}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-gray-700">{content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      <H2>What Hire Depots Are — and Are Not — Required to Do</H2>
      <Prose>
        <p>
          UK hire depots have a duty under PUWER to ensure that equipment is suitable for use and that
          safe use information is provided. They are <strong>not</strong> legally required to verify
          that the hirer has completed abrasive wheel training before releasing equipment. In practice:
        </p>
      </Prose>

      <CheckList
        items={[
          'Most depots provide a basic operational handover on collection',
          'Commercial depots with trade accounts may record operator training status for liability management',
          'The hirer remains responsible for PUWER compliance on site, regardless of what the depot does or does not check',
          'Placing a cut-off saw into the hands of an untrained operator — even as a site manager or principal contractor — creates personal PUWER liability',
        ]}
      />

      <H2>Common Abrasive Wheel Accidents and How the Regs Prevent Them</H2>
      <Prose>
        <p>
          The{' '}
          <a href="https://www.hse.gov.uk/construction/healthrisks/silica-quartz.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            HSE COSHH guidance on silica dust from cut-off saws
          </a>{' '}
          identifies these as the most frequent causes of injury and ill health from abrasive wheel
          equipment. Proper training directly reduces each risk:
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Accident Type</th>
              <th className="px-3 py-2 text-left font-semibold">Cause</th>
              <th className="px-3 py-2 text-left font-semibold">How Training Prevents It</th>
            </tr>
          </thead>
          <tbody>
            {abrasiveAccidentTable.map(([accident, cause, prevention], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium text-red-700">{accident}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-gray-700">{cause}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-gray-700">{prevention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Choose the right plate for your groundworks →
          </Link>
        </div>
      </div>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: How to Compare Prices in 2026</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Full breakdown of day and week rates →
          </Link>
        </div>
      </div>

      {/* Internal link — skip hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</p>
          <Link to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026" className="text-sm text-brand-primary hover:underline">
            Full price guide for every skip size →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect concrete and plasterwork through winter →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Hire a Cut-Off Saw or Disc Cutter</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Once your training is in order, enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — petrol and electric cut-off saw hire from local UK suppliers, by blade size and hire duration.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 36 — Site Lighting Tower Hire UK: Prices & Types Compared */

const lightingTowerPriceTable: [string, string, string, string, string, string, string][] = [
  ['Standard 4-head', 'Metal halide (4 × 1,000W)', 'Diesel', '300,000+ lm', '£60–£100', '£220–£370', '£560–£940'],
  ['LED 4-head', 'LED (4 × 150–400W)', 'Diesel', '250,000–400,000 lm', '£75–£120', '£275–£440', '£700–£1,120'],
  ['Solar hybrid LED', 'LED', 'Solar + battery', '120,000–200,000 lm', '£80–£130', '£295–£480', '£750–£1,220'],
  ['Single-head mast light', 'LED or halide', 'Diesel / electric', '80,000–150,000 lm', '£45–£80', '£165–£295', '£420–£750'],
  ['Trailer-mounted LED (2-head)', 'LED', 'Diesel / solar', '150,000–250,000 lm', '£55–£90', '£200–£330', '£510–£840'],
  ['High-mast tower (8+ heads)', 'LED or halide', 'Diesel', '600,000+ lm', '£130–£180', '£475–£660', '£1,200–£1,680'],
];

const lightingTowerComparisonTable: [string, string, string, string][] = [
  ['Light quality', 'Warm white — good for area lighting', 'Cool white — excellent visibility and contrast', 'Cool white LED'],
  ['Output', 'Very high (300,000+ lm)', 'High (250,000–400,000 lm)', 'Medium (120,000–200,000 lm)'],
  ['Fuel cost per night (10hr)', '£15–£30 (diesel)', '£8–£18 (less diesel)', '£0 (solar-charged)'],
  ['Warm-up time', '3–5 minutes to full output', 'Instant', 'Instant'],
  ['Noise', 'Diesel generator — significant', 'Diesel generator — significant', 'Silent'],
  ['Remote / off-grid use', 'Requires diesel resupply', 'Requires diesel resupply', 'Ideal — self-sufficient'],
  ['Environmental / noise restrictions', 'Not suitable for quiet sites', 'Not suitable for quiet sites', 'Best for sensitive sites'],
  ['Hire cost premium', 'Baseline', '+15–25% vs metal halide', '+20–35% vs metal halide'],
  ['Best for', 'Active construction sites, roadworks', 'Sites requiring visibility quality', 'Remote sites, night events, eco requirements'],
];

const lightingCoverageLuxTable: [string, string, string][] = [
  ['General movement around site', '20 lux', 'Up to 4,000 m²'],
  ['Site access roads and footways', '50 lux', 'Up to 2,500 m²'],
  ['Active construction work areas', '100 lux', 'Up to 1,200 m²'],
  ['Inspection and detailed work', '200–500 lux', 'Supplementary local lighting needed'],
  ['Vehicle movement and plant operation', '100 lux minimum', 'Up to 1,200 m²'],
];

const lightingTowerFaqs: Faq[] = [
  [
    'How much does it cost to hire a site lighting tower?',
    'A standard diesel-powered 4-head site lighting tower costs approximately £60–£100 per day in the UK. LED towers run £75–£120/day. Solar-hybrid units are £80–£130/day. Weekly rates offer better value for ongoing site use — typically equivalent to 3–4 day rates. Confirm current rates on Tooli.uk.',
  ],
  [
    'How large an area does one lighting tower cover?',
    'A standard 4-head tower illuminates approximately 2,000–4,000 m² at 20 lux (general movement level). For active construction work requiring 100 lux, coverage per tower reduces to approximately 1,000–1,200 m². For precise compliance with HSE lux requirements, a lighting assessment should be carried out.',
  ],
  [
    'What is the difference between LED and metal halide lighting towers?',
    'Metal halide towers produce a very high light output but require a 3–5 minute warm-up period, consume more fuel, and produce a warmer light colour. LED towers deliver comparable or better lumen output, light up instantly, use significantly less fuel, have a longer service life, and produce a cooler, higher-contrast white light preferred for detailed work.',
  ],
  [
    'Can I hire a solar lighting tower for a remote site?',
    'Yes — solar-hybrid LED towers are specifically designed for off-grid and remote site use. They charge their battery pack via solar panels during daylight and run the LEDs through the night without any diesel. They are also silent — useful for noise-sensitive urban sites or events. Output is lower than diesel towers at around 120,000–200,000 lumens.',
  ],
  [
    'Do site lighting towers include fuel?',
    'No — diesel fuel is not included in the hire rate. Most towers are delivered with a partial or empty tank. You are responsible for fuelling. Budget 1.2–2.5 litres per hour depending on tower type. Confirm the tank capacity and your refuelling obligations with the hire depot before delivery.',
  ],
  [
    'What are the legal lighting requirements on a construction site?',
    'HSE and CDM 2015 set minimum illuminance levels for different site activities. General site movement requires 20 lux. Active construction work areas require 100 lux minimum. Detailed inspection work may require 200–500 lux. HSE Guidance Note HS(G)38 covers lighting at work in detail.',
  ],
];

function SiteLightingTowerBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">Site Lighting Tower at a Glance</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Diesel metal halide (4-head):</strong> £60–£100/day — most widely available, high-output workhorse</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Diesel LED (4-head):</strong> £75–£120/day — lower fuel use, whiter light, longer service life</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Solar-hybrid LED:</strong> £80–£130/day — no fuel cost, silent, remote sites and eco requirements</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Mast light (fixed):</strong> £45–£80/day — smaller area, events and welfare lighting</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Standard 4-head tower illuminates 2,000–4,000 m² at road-lighting standard</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Diesel towers consume 1.2–2.5 litres/hr — fuel is not included in hire rates</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          Site lighting tower hire in the UK costs between <strong>£45 and £180 per day</strong> depending
          on the type and output. A standard diesel-powered metal halide tower covers approximately
          2,000–3,000 m² and is the most widely hired type for UK construction sites, road maintenance,
          and events. LED towers reduce fuel consumption significantly — though they command a small hire
          premium. Solar-hybrid towers are the right choice for quiet, remote, or environmentally
          sensitive sites.
        </p>
      </Prose>

      <H2>Site Lighting Tower Hire Prices UK 2026</H2>
      <Prose>
        <p>
          All prices are VAT-inclusive guidance. Diesel fuel is not included — budget 1.2–2.5 L/hr
          depending on tower size. Use Tooli.uk to{' '}
          <Link to="/search" className="font-medium text-brand-primary hover:underline">compare now</Link>{' '}
          and confirm current quotes from local suppliers.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Tower Type</th>
              <th className="px-3 py-2 text-left font-semibold">Light Source</th>
              <th className="px-3 py-2 text-left font-semibold">Power</th>
              <th className="px-3 py-2 text-left font-semibold">Output</th>
              <th className="px-3 py-2 text-left font-semibold">Day Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Week Rate</th>
              <th className="px-3 py-2 text-left font-semibold">4-Week Rate</th>
            </tr>
          </thead>
          <tbody>
            {lightingTowerPriceTable.map(([type, source, power, output, day, week, month], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{type}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-xs">{source}</td>
                <td className="border-b border-gray-100 px-3 py-2">{power}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-xs">{output}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{day}</td>
                <td className="border-b border-gray-100 px-3 py-2">{week}</td>
                <td className="border-b border-gray-100 px-3 py-2">{month}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">*All prices VAT-inclusive guidance. Diesel fuel not included — budget 1.2–2.5 L/hr depending on tower size.</p>
      </div>

      {/* Internal link — generator hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Generator Hire UK: Prices &amp; Power Output Guide 2026</p>
          <Link to="/blog/generator-hire-uk-prices-power-output-guide-2026" className="text-sm text-brand-primary hover:underline">
            Size a generator for electric site lighting →
          </Link>
        </div>
      </div>

      <H2>Metal Halide vs LED vs Solar: Which Type to Hire?</H2>
      <Prose>
        <p>
          The three main technologies — diesel metal halide, diesel LED, and solar-hybrid LED — each
          suit different site conditions. Metal halide remains the most available and cheapest to hire;
          LED is the right choice where fuel savings and light quality matter; solar is the answer for
          off-grid, silent, or environmentally sensitive sites.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Feature</th>
              <th className="px-3 py-2 text-left font-semibold">Diesel Metal Halide</th>
              <th className="px-3 py-2 text-left font-semibold">Diesel LED</th>
              <th className="px-3 py-2 text-left font-semibold">Solar Hybrid LED</th>
            </tr>
          </thead>
          <tbody>
            {lightingTowerComparisonTable.map(([feature, halide, led, solar], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{feature}</td>
                <td className="border-b border-gray-100 px-3 py-2">{halide}</td>
                <td className="border-b border-gray-100 px-3 py-2">{led}</td>
                <td className="border-b border-gray-100 px-3 py-2">{solar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <img
        src="/images/blog/site-lighting-tower-hire-uk.webp"
        alt="Solar-hybrid LED lighting tower on a remote rural construction site — no diesel required"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>Coverage and Placement Guide</H2>
      <Prose>
        <p>
          A single 4-head lighting tower illuminates approximately 2,000–4,000 m² at a standard
          working level (similar to a car park or road lighting standard). Actual coverage depends on
          mast height, head orientation, site obstructions, and the lux level required by the activity.
        </p>
        <p>
          Under{' '}
          <a href="https://www.hse.gov.uk/construction/cdm/2015" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            CDM 2015
          </a>
          , the principal contractor has a duty to provide adequate lighting for the construction phase.{' '}
          <a href="https://www.hse.gov.uk/pubns/books/hsg38.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            HSE Guidance Note HS(G)38 (Lighting at Work)
          </a>{' '}
          and the{' '}
          <a href="https://www.nationalhighways.co.uk/safety/roadworks" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            National Highways roadworks lighting standards
          </a>{' '}
          set out minimum lux levels by activity type:
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Activity</th>
              <th className="px-3 py-2 text-left font-semibold">HSE Minimum Lux Level</th>
              <th className="px-3 py-2 text-left font-semibold">Coverage per Tower (approx)</th>
            </tr>
          </thead>
          <tbody>
            {lightingCoverageLuxTable.map(([activity, lux, coverage], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{activity}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{lux}</td>
                <td className="border-b border-gray-100 px-3 py-2">{coverage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      <H2>How Long Will the Fuel Last?</H2>
      <Prose>
        <p>
          Diesel lighting towers have a built-in generator and integral fuel tank, typically holding
          80–150 litres. Consumption at full load:
        </p>
      </Prose>

      <CheckList
        items={[
          'Standard 4-head metal halide tower (4 × 1,000W): approximately 1.8–2.5 litres per hour',
          'LED 4-head tower: approximately 0.8–1.5 litres per hour (significantly lower)',
          'At 10 hours per night, a metal halide tower uses 18–25 litres — approximately 3–7 nights per tank depending on capacity',
          'Most hire companies will refill or exchange tanks at additional cost — confirm this arrangement before booking if the hire runs longer than 3–4 nights',
          'Solar-hybrid towers require no diesel — but ensure sufficient daylight hours to charge the battery pack (minimum 4–6 hours direct sun recommended)',
        ]}
      />

      {/* Internal link — site heater */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Site Heater Hire UK: Which Type Do You Need?</p>
          <Link to="/blog/site-heater-hire-uk-which-type-do-you-need-and-what-does-it-cost" className="text-sm text-brand-primary hover:underline">
            Diesel, propane and electric options compared →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect concrete and plasterwork through winter →
          </Link>
        </div>
      </div>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: How to Compare Prices in 2026</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Full breakdown of day and week rates →
          </Link>
        </div>
      </div>

      {/* Internal link — skip hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</p>
          <Link to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026" className="text-sm text-brand-primary hover:underline">
            Full price guide for every skip size →
          </Link>
        </div>
      </div>

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Choose the right plate for your groundworks →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Site Lighting Tower Hire Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — diesel, LED and solar lighting tower hire from local UK suppliers, by output, duration, and fuel type.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 37 — Mini Dumper Hire UK: Prices & Capacities Compared */

const miniDumperPriceTable: [string, string, string, string, string, string][] = [
  ['Pedestrian dumper', '500 kg', 'Tracked / wheeled', '£90–£130', '£140–£200', '£280–£390'],
  ['Ride-on mini dumper', '1 tonne', 'Tracked', '£130–£180', '£200–£275', '£400–£540'],
  ['Standard mini dumper', '2 tonne', 'Tracked', '£170–£230', '£260–£350', '£540–£690'],
  ['Large mini dumper', '3 tonne', 'Tracked', '£210–£280', '£320–£430', '£660–£840'],
  ['Swivel skip dumper', '1–2 tonne', 'Tracked', '£180–£250', '£275–£380', '£570–£750'],
  ['High-tip dumper', '2–3 tonne', 'Tracked', '£200–£270', '£305–£410', '£635–£810'],
];

const miniDumperTrackedTable: [string, string, string][] = [
  ['Ground pressure', 'Low — spreads weight across tracks', 'Higher — small contact area on tyres'],
  ['Lawn / soft ground performance', 'Excellent — minimal surface damage', 'Poor — tyres cut into wet soft ground'],
  ['Tarmac / hard surfaces', 'Rubber tracks: acceptable. Steel tracks: damaging', 'Excellent — no surface damage'],
  ['Stability on slopes', 'Better — lower centre of gravity', 'Lower — higher tip risk on grades'],
  ['Manoeuvrability (tight spaces)', 'Excellent — zero-turn capability', 'Good — standard turning circle'],
  ['Speed across site', 'Slower (1.5–3 km/h)', 'Faster (5–10 km/h on flat)'],
  ['Most common UK hire type', 'Tracked (dominant in hire fleets)', 'Wheeled (less common in hire fleets)'],
];

const miniDumperPayloadTable: [string, string, string][] = [
  ['500 kg', '~0.3 m³', 'Light spoil removal, garden waste, small volumes'],
  ['1 tonne', '~0.6 m³', 'Residential landscaping, single-skip spoil runs'],
  ['2 tonne', '~1.2 m³', 'Standard trade use — groundworks, patio sub-base, drainage'],
  ['3 tonne', '~1.8 m³', 'High-volume earthmoving, commercial landscaping, road base'],
];

const miniDumperFaqs: Faq[] = [
  [
    'How much does it cost to hire a mini dumper for a day?',
    'A 1-tonne tracked ride-on mini dumper costs approximately £130–£180 per day in the UK. A 2-tonne tracked dumper runs £170–£230/day. A 3-tonne machine is £210–£280/day. Pedestrian (500 kg) dumpers are the cheapest at £90–£130/day. All prices are VAT-inclusive guidance — compare current local rates on Tooli.uk.',
  ],
  [
    'Do I need a licence to drive a mini dumper?',
    'No formal licence is required to operate a mini dumper on private land for domestic or trade purposes. On managed commercial construction sites, a CPCS (Construction Plant Competence Scheme) card for the dumper category is required in most cases.',
  ],
  [
    'What is the difference between a swivel skip dumper and a standard dumper?',
    'A swivel skip dumper has a skip that rotates left and right before tipping, allowing spoil to be deposited beside the machine as well as in front. This is particularly useful in trench work and drainage projects where spoil needs to be placed cleanly beside the excavation. Standard dumpers tip forward only.',
  ],
  [
    'Can a mini dumper damage a lawn?',
    'A rubber-tracked mini dumper causes less damage to lawns than a wheeled machine, but will leave track impressions on soft or wet ground. Use scaffold boards or trackway panels to protect the most sensitive areas. Avoid running any heavy tracked machine over soft ground after heavy rain.',
  ],
  [
    'What is the maximum payload of a mini hire dumper?',
    'Most UK hire-fleet mini dumpers range from 500 kg (pedestrian) to 3 tonnes (large tracked). The most commonly hired size for residential and trade groundworks is the 2-tonne tracked machine, which carries approximately 1.2 cubic metres per load — enough for efficient spoil removal on most drainage and landscaping jobs.',
  ],
  [
    'Can a mini dumper go through a standard garden gate?',
    'The 1-tonne tracked mini dumper is typically 800–900 mm wide, which clears a standard 900 mm garden gate with minimal margin. Some models are narrower — check the transport width specification with the depot before booking. Pedestrian (500 kg) models are generally 600–700 mm wide and fit through most garden gates.',
  ],
];

function MiniDumperHireBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">Mini Dumper Hire at a Glance</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Pedestrian (500 kg):</strong> £90–£130/day — garden work, tight access, manual-tipping</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Ride-on 1-tonne (tracked):</strong> £130–£180/day — residential groundworks, landscaping</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>2-tonne tracked dumper:</strong> £170–£230/day — most popular size for trade use</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>3-tonne tracked dumper:</strong> £210–£280/day — high-volume earthmoving, commercial sites</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>No formal licence required on private land — CPCS card needed on most commercial sites</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span>Swivel skip models allow side-discharge — essential for trench edge spoil placement</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          Mini dumper hire in the UK costs between <strong>£90 and £280 per day</strong> depending on
          payload capacity. A 500 kg pedestrian dumper is the smallest widely available hire machine —
          suitable for shifting spoil in tight residential gardens. A 3-tonne tracked dumper is the
          workhorse for groundworkers and landscapers moving significant volumes of material across site.
        </p>
        <p>
          This guide covers hire rates by capacity, tracked vs wheeled, licence requirements, and the
          most common job applications across UK residential and commercial sites.
        </p>
      </Prose>

      <H2>Mini Dumper Hire Prices UK 2026</H2>
      <Prose>
        <p>
          All prices are VAT-inclusive guidance based on average UK market rates. Use Tooli.uk to{' '}
          <Link to="/search" className="font-medium text-brand-primary hover:underline">compare now</Link>{' '}
          and confirm current quotes from local suppliers.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Machine Class</th>
              <th className="px-3 py-2 text-left font-semibold">Payload</th>
              <th className="px-3 py-2 text-left font-semibold">Track/Wheel</th>
              <th className="px-3 py-2 text-left font-semibold">Day Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Weekend Rate</th>
              <th className="px-3 py-2 text-left font-semibold">Week Rate</th>
            </tr>
          </thead>
          <tbody>
            {miniDumperPriceTable.map(([machine, payload, track, day, weekend, week], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{machine}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold">{payload}</td>
                <td className="border-b border-gray-100 px-3 py-2">{track}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-semibold text-brand-primary">{day}</td>
                <td className="border-b border-gray-100 px-3 py-2">{weekend}</td>
                <td className="border-b border-gray-100 px-3 py-2">{week}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">*All prices VAT-inclusive guidance. Confirm live rates on Tooli.uk.</p>
      </div>

      {/* Internal link — mini digger */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Digger Hire Cost UK: How to Compare Prices in 2026</p>
          <Link to="/blog/mini-digger-hire-cost-uk-2026-price-guide" className="text-sm text-brand-primary hover:underline">
            Mini diggers and dumpers often hired together →
          </Link>
        </div>
      </div>

      <H2>Tracked vs Wheeled Mini Dumpers: Which to Hire?</H2>
      <Prose>
        <p>
          For most UK residential and landscaping applications — garden clearance, drainage, lawn areas —
          a <strong>rubber-tracked mini dumper</strong> is the correct hire choice. Tracked machines
          spread their weight more evenly, handle soft ground without cutting in, and offer zero-turn
          manoeuvrability essential in tight gardens. Wheeled dumpers are faster on hard standing but
          unsuitable for soft or sensitive surfaces.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Feature</th>
              <th className="px-3 py-2 text-left font-semibold">Tracked</th>
              <th className="px-3 py-2 text-left font-semibold">Wheeled</th>
            </tr>
          </thead>
          <tbody>
            {miniDumperTrackedTable.map(([feature, tracked, wheeled], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{feature}</td>
                <td className="border-b border-gray-100 px-3 py-2">{tracked}</td>
                <td className="border-b border-gray-100 px-3 py-2">{wheeled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <img
        src="/images/blog/mini-dumper-hire-uk.webp"
        alt="Rubber-tracked mini dumper on a wet lawn with scaffold board trackway protecting the grass surface"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Compact sub-base after each dumper load →
          </Link>
        </div>
      </div>

      <H2>Payload Capacity: What Can Each Machine Carry?</H2>
      <Prose>
        <p>
          Payload refers to the maximum load the dumper can safely carry per trip. Matching the payload
          to your material volume determines how many runs are needed per skip or lorry load — and
          therefore how long the job takes. The 2-tonne machine carries approximately 1.2 m³ per load,
          which at typical soil density means roughly one tonne of material per trip.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Payload</th>
              <th className="px-3 py-2 text-left font-semibold">Material Volume per Load</th>
              <th className="px-3 py-2 text-left font-semibold">Common Applications</th>
            </tr>
          </thead>
          <tbody>
            {miniDumperPayloadTable.map(([payload, volume, apps], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-bold text-brand-primary">{payload}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{volume}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-gray-700">{apps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — skip hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</p>
          <Link to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026" className="text-sm text-brand-primary hover:underline">
            Size your skip to the dumper payload →
          </Link>
        </div>
      </div>

      <H2>Standard vs Swivel Skip vs High-Tip: Which Configuration?</H2>

      <H3>Standard Forward-Tipping</H3>
      <Prose>
        <p>
          The basic configuration — skip tips forward to discharge. Suitable for most spoil-moving
          applications where material is tipped into a skip, lorry, or soil heap on open ground.
        </p>
      </Prose>

      <H3>Swivel Skip</H3>
      <Prose>
        <p>
          The skip rotates left and right as well as tipping. Invaluable for trench work where spoil
          needs to be placed neatly beside the open trench rather than in front of the machine.
          Eliminates hand-shovelling to reposition spoil from the trench edge — a significant time
          saving on drainage and foundation projects.
        </p>
      </Prose>

      <H3>High-Tip</H3>
      <Prose>
        <p>
          The skip tips to a greater height — useful for tipping directly into skips, lorries, or
          elevated hoppers without a ramp. More common on larger site dumpers than residential
          mini dumpers, but available in 2–3 tonne hire configurations.
        </p>
      </Prose>

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>Can I Use a Mini Dumper on a Lawn?</H2>
      <Prose>
        <p>
          A rubber-tracked mini dumper causes significantly less damage to lawns and soft ground than
          a wheeled machine. That said, any tracked machine running over soft wet ground will leave
          impressions. Under{' '}
          <a href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            PUWER
          </a>
          , the operator must assess ground conditions before use. Protect lawn areas using these measures:
        </p>
      </Prose>

      <CheckList
        items={[
          'Use scaffold boards or trackway panels under the dumper\'s route across sensitive areas',
          'Restrict access to established dry periods — avoid running over soft ground after rain',
          'Minimise the number of passes over the same line — vary the route where possible',
          'Aerate and over-seed affected areas immediately after work is complete',
          'Check transport width with the depot before booking to confirm the machine fits through access gates',
        ]}
      />

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect concrete and groundworks through winter →
          </Link>
        </div>
      </div>

      {/* Internal link — site lighting */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Site Lighting Tower Hire UK: Prices &amp; Types Compared</p>
          <Link to="/blog/site-lighting-tower-hire-uk-prices-and-types-compared" className="text-sm text-brand-primary hover:underline">
            Light your site for night or winter groundworks →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Mini Dumper Hire Near You</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — tracked mini dumper hire from local UK suppliers by payload capacity, configuration, and hire duration.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 38 — Do You Need a Licence to Drive a Site Dumper? The Honest Answer */

const dumperLicenceSituationTable: [string, string, string][] = [
  ['Private domestic project — garden, landscaping, self-build', 'No', 'PUWER competence requirement still applies'],
  ['Small trade project on client\'s private land', 'No formal card — but PUWER applies', 'Consider training for liability protection'],
  ['Managed commercial construction site', 'Yes — in almost all cases', 'Principal contractor enforces this as a site rule'],
  ['CDM 2015 notifiable project', 'Yes — competence records likely checked', 'Principal designer may audit operator cards'],
  ['Ground adjacent to a public highway', 'Yes — treated as commercial', 'Enhanced risk environment — enforcement more likely'],
];

const dumperCpcsTable: [string, string, string][] = [
  ['A09', 'Forward Tipping Dumper — pedestrian operated', 'Covers walk-behind pedestrian dumpers'],
  ['A09', 'Forward Tipping Dumper — ride-on (up to 10 tonne)', 'Covers 1t, 2t, 3t ride-on dumpers most commonly hired'],
  ['A09 (Swivel Skip variant)', 'Swivel Skip Dumper', 'Some CPCS providers issue separately — confirm with your test centre'],
];

const dumperCpcsVsCscsTable: [string, string, string][] = [
  ['CPCS', 'Plant operator competence — task-tested for specific machine', 'Yes — CPCS A09 covers site dumper operation'],
  ['CSCS', 'Site access — proves general H&S knowledge (CITB test)', 'No — site access only, not machine operation'],
  ['Both', 'May be required on some managed commercial sites', 'CSCS to enter the site; CPCS to operate the dumper'],
];

const dumperLicenceFaqs: Faq[] = [
  [
    'Do I need a licence to drive a site dumper on a construction site?',
    'On private domestic land, no formal licence or card is required — but PUWER 1998 requires competence. On a managed commercial construction site, a CPCS card (category A09 for site dumpers) is required by most principal contractors. A road driving licence is not relevant — site dumpers are not road vehicles.',
  ],
  [
    'What is CPCS A09?',
    'CPCS A09 is the Construction Plant Competence Scheme category covering forward-tipping site dumpers — both pedestrian (walk-behind) and ride-on models up to 10 tonnes. The CPCS blue trained operator card must be renewed after 2 years by achieving an NVQ/SVQ.',
  ],
  [
    'Can I operate a site dumper without CPCS on my own property?',
    'Yes — on private domestic land, no CPCS card is legally required. PUWER 1998 still requires that you are competent to use the machine safely. If you have never operated a dumper before, request a handover from the hire depot and start with slower, controlled movements before taking on heavier work.',
  ],
  [
    'Is CPCS the same as a driving licence for dumpers?',
    'No. CPCS is a construction plant competence certification — it proves you are trained and tested to operate a specific type of plant machinery. A road driving licence permits you to drive road-legal vehicles on public roads. Site dumpers are not road vehicles and a road licence neither qualifies nor disqualifies you from operating one.',
  ],
  [
    'How long does CPCS training for a site dumper take?',
    'Training for CPCS A09 typically takes 1–2 days, followed by the technical test on the same or a subsequent day. For operators with existing plant experience, 1 day of training before the test is often sufficient. Budget £400–£800 for the full process including training, test, and card application.',
  ],
  [
    'Does PUWER apply to a site dumper on my garden renovation?',
    'Yes. PUWER 1998 applies wherever work equipment is used in connection with work activities — including self-employed workers on residential projects. Pure DIY by a homeowner on their own property is generally outside PUWER\'s scope, but any trade or commercial element brings it into scope. The safest position is always to ensure the operator is competent regardless of land type.',
  ],
];

function SiteDumperLicenceBody() {
  return (
    <>
      {/* At a glance */}
      <div className="mb-8 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-primary">Site Dumper Licence Rules at a Glance</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /><span><strong>Private land / domestic project:</strong> no formal licence or card required</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>Commercial construction site:</strong> CPCS card required in most cases</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>PUWER 1998:</strong> competence required on ALL land — private or commercial</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /><span><strong>Road driving licence:</strong> not required — site dumpers are not road vehicles</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /><span><strong>CPCS A09:</strong> the category covering forward-tipping and swivel skip site dumpers</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /><span>A road driving licence does not authorise you to operate a site dumper on a building site</span></li>
        </ul>
      </div>

      <Prose>
        <p>
          <strong>No</strong> — there is no legal requirement to hold a formal driving licence to operate
          a site dumper on private land. A road driving licence is not required either — site dumpers
          are not road-legal vehicles. However, on most managed commercial construction sites, operators
          must hold a valid{' '}
          <a href="https://www.cpcs.uk.com/categories" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            CPCS (Construction Plant Competence Scheme) card
          </a>{' '}
          for the dumper category. And under{' '}
          <a href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            PUWER 1998
          </a>
          , all operators — on any land — must be competent to use the machine safely.
        </p>
      </Prose>

      <H2>The Legal Position</H2>

      <H3>PUWER 1998 and Operator Competence</H3>
      <Prose>
        <p>
          The Provision and Use of Work Equipment Regulations 1998 (PUWER) Regulation 9 requires that
          anyone operating work equipment — including site dumpers — has received adequate training. This
          applies on private domestic land as well as commercial sites. It is the same competence duty
          that applies to mini diggers, cut-off saws, and all other work equipment.
        </p>
        <p>
          On private land, this means demonstrating competence through experience, a brief depot
          handover, or formal training — but not necessarily a specific card. On a commercial site,
          the principal contractor enforces a competence card requirement in almost all cases under{' '}
          <a href="https://www.hse.gov.uk/construction/cdm/2015" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            CDM 2015
          </a>.
        </p>
      </Prose>

      <H3>Site Dumpers Are Not Road Vehicles</H3>
      <Prose>
        <p>
          A site dumper cannot legally travel on a public highway. It must be transported on a flatbed
          lorry or low-loader. A road driving licence is therefore not required to operate a site dumper
          on site — but a valid driving licence is required to tow the machine's transport trailer.
        </p>
      </Prose>

      {/* Internal link — mini dumper hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Mini Dumper Hire UK: Prices &amp; Capacities Compared</p>
          <Link to="/blog/mini-dumper-hire-uk-prices-and-capacities-compared" className="text-sm text-brand-primary hover:underline">
            Day rates for tracked dumpers by payload →
          </Link>
        </div>
      </div>

      <H2>When a CPCS Card Is Required</H2>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Situation</th>
              <th className="px-3 py-2 text-left font-semibold">CPCS Card Required?</th>
              <th className="px-3 py-2 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {dumperLicenceSituationTable.map(([situation, required, notes], i) => {
              const isNo = required.toLowerCase().startsWith('no formal') || required.toLowerCase() === 'no';
              const isYes = required.toLowerCase().startsWith('yes');
              return (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border-b border-gray-100 px-3 py-2 font-medium">{situation}</td>
                  <td className={`border-b border-gray-100 px-3 py-2 font-semibold ${isYes ? 'text-brand-primary' : isNo ? 'text-green-700' : 'text-amber-600'}`}>{required}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Internal link — mini digger licence */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Do I Need a Licence to Operate a Mini Digger?</p>
          <Link to="/blog/do-i-need-licence-to-operate-mini-digger" className="text-sm text-brand-primary hover:underline">
            Same PUWER / CPCS framework explained for diggers →
          </Link>
        </div>
      </div>

      <H2>What Is the CPCS Card for a Site Dumper?</H2>
      <Prose>
        <p>
          CPCS (Construction Plant Competence Scheme) is the industry-standard operator competence
          scheme in the UK. The relevant category for site dumpers is:
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">CPCS Category</th>
              <th className="px-3 py-2 text-left font-semibold">Machine Type</th>
              <th className="px-3 py-2 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {dumperCpcsTable.map(([category, machine, notes], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-bold text-brand-primary">{category}</td>
                <td className="border-b border-gray-100 px-3 py-2 font-medium">{machine}</td>
                <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">CPCS categories and card formats do change — always verify current requirements at cpcs.uk.com before booking training.</p>
      </div>

      <img
        src="/images/blog/do-you-need-a-licence.webp"
        alt="CPCS blue trained operator card alongside a site dumper on a managed construction site UK"
        className="mb-8 w-full rounded-xl object-cover"
        loading="lazy"
      />

      <H2>CPCS vs CSCS: What's the Difference?</H2>
      <Prose>
        <p>
          These two cards are often confused — they serve entirely different purposes. A CSCS card
          proves general site safety awareness and grants site access. A CPCS card proves plant
          operator competence for a specific machine type. On many commercial sites, both are required.
        </p>
      </Prose>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="px-3 py-2 text-left font-semibold">Card</th>
              <th className="px-3 py-2 text-left font-semibold">Purpose</th>
              <th className="px-3 py-2 text-left font-semibold">For Site Dumpers?</th>
            </tr>
          </thead>
          <tbody>
            {dumperCpcsVsCscsTable.map(([card, purpose, forDumpers], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-b border-gray-100 px-3 py-2 font-bold text-brand-primary">{card}</td>
                <td className="border-b border-gray-100 px-3 py-2">{purpose}</td>
                <td className="border-b border-gray-100 px-3 py-2">{forDumpers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal link — tool hire comparison */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">How Tool Hire Comparison Actually Saves You Money</p>
          <Link to="/blog/tool-hire-comparison-save-money" className="text-sm text-brand-primary hover:underline">
            How to compare and avoid overpaying →
          </Link>
        </div>
      </div>

      <H2>How to Get a CPCS Dumper Card</H2>
      <CheckList
        items={[
          'Step 1: Pass the CITB Health, Safety & Environment test if you don\'t already hold a valid CSCS card',
          'Step 2: Complete a CPCS training course for category A09 (site dumper) at an approved CPCS test centre',
          'Step 3: Pass the CPCS technical test — operational assessment on the machine in a controlled environment',
          'Step 4: Apply for the CPCS trained operator card (blue card) — valid 2 years, after which an NVQ or SVQ is required for the experienced operator card (red card)',
        ]}
      />
      <Prose>
        <p>
          Find approved CPCS test centres at{' '}
          <a href="https://www.cpcs.uk.com/categories" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            cpcs.uk.com
          </a>. Training typically takes 1–2 days. Budget <strong>£400–£800</strong> for training,
          testing, and card fees combined. For sole traders, CPCS training costs are generally
          recoverable against tax as a business expense.
        </p>
      </Prose>

      {/* Internal link — scaffold tower */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Scaffold Tower Hire Cost UK: What You'll Pay in 2026</p>
          <Link to="/blog/scaffold-tower-hire-cost-uk-what-you-pay-in-2026" className="text-sm text-brand-primary hover:underline">
            Full rate breakdown by tower type and duration →
          </Link>
        </div>
      </div>

      <H2>What This Means When Hiring a Mini Dumper</H2>
      <Prose>
        <p>
          Hire depots are not legally required to ask for your CPCS card before releasing a mini
          dumper. Most will not ask. However, the consequences of operating without a card in the
          wrong context are significant:
        </p>
      </Prose>

      <CheckList
        items={[
          'Using a site dumper on a commercial site without a CPCS card will result in refusal of access or removal from site',
          'If an accident occurs on any land and you cannot demonstrate competence, PUWER creates personal liability',
          'Principal contractors and site managers may ask to record your card details as part of their own CDM duty of care',
          'For sole traders and small builders regularly using dumpers, a CPCS A09 card is a worthwhile investment',
        ]}
      />

      {/* Internal link — wacker plate */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <Wrench className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Wacker Plate Hire UK: Prices &amp; Plate Sizes Compared</p>
          <Link to="/blog/wacker-plate-hire-uk-prices-plate-sizes-compared" className="text-sm text-brand-primary hover:underline">
            Compact your sub-base after each dumper load →
          </Link>
        </div>
      </div>

      {/* Internal link — skip hire */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</p>
          <Link to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026" className="text-sm text-brand-primary hover:underline">
            Size your skip to match your dumper payload →
          </Link>
        </div>
      </div>

      {/* Internal link — winter site kit */}
      <div className="my-6 flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-primary" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Winter Site Kit: Heaters &amp; Dehumidifiers for UK Builders</p>
          <Link to="/blog/winter-site-kit-heaters-and-dehumidifiers-for-uk-builders" className="text-sm text-brand-primary hover:underline">
            Protect groundworks through winter →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Ready to Hire a Mini Dumper?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Once your competence is confirmed, enter your postcode on Tooli.uk to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — tracked mini dumper hire from local UK suppliers by payload, configuration, and duration.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 39 — Tool Hire SW19: Compare Prices in Wimbledon & Merton */

const sw19WimbledonEquipmentTable: [string, string, string, string][] = [
  ['Mini digger (0.8t)', '£100–£175', '£380–£550', 'Tight access in residential gardens — 0.8t fits through most SW19 side gates'],
  ['Mini digger (1.5t)', '£160–£230', '£500–£700', 'Standard for driveway excavation and extension footings'],
  ['Scaffold tower (4m WH)', '£22–£35/day', '£55–£85/week', 'Loft dormer and external decoration — high local demand'],
  ['Scaffold tower (6m WH)', '£28–£42/day', '£70–£110/week', 'Two-storey Wimbledon Victorian terrace standard'],
  ['Concrete mixer (130L)', '£35–£55', '£100–£150', 'Pointing, rendering, and small-pour work'],
  ['Disc cutter / cut-off saw', '£50–£80', '£190–£300', 'Block cutting for extensions and driveway edgings'],
  ['Skip (6 yard)', '£200–£280', 'N/A (per hire)', 'Road permit required in most SW19 residential streets'],
  ['Skip (8 yard)', '£250–£340', 'N/A (per hire)', 'Most common size for loft and extension clearance'],
  ['Dehumidifier (40 L/day)', '£55–£80', '£200–£290', 'Post-plaster drying in newly converted spaces'],
  ['Pressure washer (commercial)', '£45–£75', '£150–£250', 'Driveway and patio cleaning — strong seasonal demand'],
];

const sw19WimbledonPostcodeTable: [string, string, string][] = [
  ['SW17', 'Tooting, Balham', 'Minimal — same depot zone in most cases'],
  ['SW20', 'Raynes Park, West Wimbledon', 'Minimal — contiguous with SW19'],
  ['CR4', 'Mitcham', 'Minimal — common South London depot location'],
  ['SM4', 'Morden', 'Low — 10–15 min drive'],
  ['SW16', 'Streatham, Norbury', 'Low — 15–20 min drive'],
  ['KT1 / KT2', 'Kingston upon Thames', 'Low to medium — across the borough boundary'],
  ['SW18', 'Wandsworth, Earlsfield', 'Low — North of SW19 along A3'],
];

const sw19WimbledonTradeTable: [string, string, string][] = [
  ['Builders & groundworkers', 'Loft conversions, rear extensions, driveway dig-outs', 'Mini digger, scaffold tower, concrete mixer, skip'],
  ['Landscapers', 'Garden redesigns, patio installation, fencing', 'Wacker plate, mini digger, rotavator, skip'],
  ['Plasterers & decorators', 'Internal renovation, extension fit-out', 'Scaffold tower (internal), dehumidifier, mixer'],
  ['Roofers', 'Victorian terrace re-roofing, dormer construction', 'Scaffold tower (6–8m WH), edge protection'],
  ['DIY homeowners', 'Bathroom renovation, garden landscaping, decorating', 'Disc cutter, scaffold tower, pressure washer, skip'],
];

const sw19WimbledonFaqs: Faq[] = [
  ['Where can I hire tools in SW19?', 'SW19 is served by hire depots in Mitcham (CR4), Tooting (SW17), and Kingston upon Thames (KT1), all within 10–20 minutes. Tooli.uk compares prices from suppliers serving SW19 so you can get the best local rate without ringing round individually.'],
  ['Do I need a skip permit in SW19?', 'Yes — if the skip goes on a public road or pavement anywhere in SW19. The London Borough of Merton issues skip licences for all roads within the borough. Your hire company applies on your behalf, but you must tell them at booking that the skip is going on the road. Permit cost is typically £55–£100 for a London borough.'],
  ['Can a mini digger get through a SW19 side gate?', "Depends on the gate width. A 0.8-tonne micro digger needs approximately 750–850mm of clearance. A 1.5-tonne machine needs 990–1,200mm. Many Victorian terrace side passages in SW19 are 800–900mm — measure carefully and tell the depot the exact width when booking. A micro digger is the right call for most SW19 residential side-access jobs."],
  ['What are the parking and access rules for delivery lorries in SW19?', 'Most SW19 residential streets are covered by Merton CPZ parking restrictions. Delivery lorries for plant equipment typically need a loading bay or a parking suspension — your hire company can advise on what is needed for your specific street. Confirm access route and any height restrictions before the delivery vehicle sets off.'],
  ['Do I need to be home when tools are delivered in SW19?', "For smaller equipment delivered in a van, most depots accept a safe-place instruction if you've arranged it in advance. For plant machinery (mini diggers, scaffold towers, skips) someone must be present to accept delivery, sign the hire agreement, and confirm the placement location is accessible."],
  ['Is there weekend tool hire available in SW19?', 'Saturday hire is available from most depots covering SW19. Sunday collection is generally not available — most South London depots do not operate on Sundays. If you need tools Monday morning, collect or take delivery on Friday and pay the weekend rate, which is typically 1.5–1.8x the daily rate.'],
];

function SW19WimbledonHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-[#030213]">SW19 Tool Hire at a Glance</h2>
        <ul className="space-y-2">
          {[
            'Covers: Wimbledon, South Wimbledon, Colliers Wood, Merton, Raynes Park (partial)',
            'Nearest hire depot areas: Mitcham, Tooting, Kingston upon Thames, Wandsworth',
            'Typical delivery lead time: same-day possible, next-day reliable from South London depots',
            'Congestion and parking: narrow residential roads — confirm delivery access before booking',
            'Most-hired equipment: scaffold towers, mini diggers, skips, disc cutters, concrete mixers',
            'Permitted development activity is high — loft conversions and extensions drive strong hire demand',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-medium text-gray-700">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <H2>About SW19: The Local Context That Matters for Hire</H2>
      <Prose>
        SW19 is one of South London's most active renovation postcodes. The area's mix of Edwardian and Victorian
        terraced housing generates consistent demand for building and groundwork hire equipment — loft conversions in
        Wimbledon Village, side-return extensions across Colliers Wood, and driveway work along the residential roads
        running off the A238.
      </Prose>
      <Prose>
        The town centre redevelopment around Wimbledon station (the Broadway regeneration scheme) has also brought
        commercial construction activity into the SW19 core, increasing demand for welfare units, generators, and
        larger plant hire in and around the station area.
      </Prose>
      <Prose>
        Key local infrastructure note: the A219 Wimbledon Hill Road and Church Road create congestion hotspots during
        peak hours. Low emission zone (LEZ) restrictions apply to older diesel plant vehicles — confirm your hire
        company's vehicle compliance before booking delivery of larger equipment into the SW19 zone.
      </Prose>

      <Link
        to="/blog/tool-hire-london"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire in London: Compare Prices From Local Suppliers</span>
      </Link>

      <H2>Most-Hired Equipment in SW19 and What It Costs</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Equipment</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Typical Day Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Typical Week Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">SW19 Notes</th>
            </tr>
          </thead>
          <tbody>
            {sw19WimbledonEquipmentTable.map(([equip, day, week, notes], i) => (
              <tr key={equip} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{equip}</td>
                <td className="px-4 py-3 text-gray-700">{day}</td>
                <td className="px-4 py-3 text-gray-700">{week}</td>
                <td className="px-4 py-3 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">*All prices VAT-inclusive guidance. Compare current SW19 supplier quotes on Tooli.uk.</p>

      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare SW19 Tool Hire Prices</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — local suppliers serving SW19, Wimbledon, Colliers Wood, and Merton.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>

      <img
        src="/images/blog/tool-hire-sw19-wimbledon.webp"
        alt="Scaffold tower erected outside a two-storey Victorian terrace in Wimbledon for loft dormer construction"
        className="w-full rounded-2xl object-cover"
      />

      <H2>Postcode Areas Served From SW19 Depots</H2>
      <Prose>
        Depots serving SW19 typically also cover the following neighbouring postcodes — useful if you're managing
        projects across borough boundaries:
      </Prose>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Postcode</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Area</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Typical Add-On Delivery Cost vs SW19</th>
            </tr>
          </thead>
          <tbody>
            {sw19WimbledonPostcodeTable.map(([postcode, area, cost], i) => (
              <tr key={postcode} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-bold text-[#030213]">{postcode}</td>
                <td className="px-4 py-3 text-gray-700">{area}</td>
                <td className="px-4 py-3 text-gray-700">{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</span>
      </Link>

      <H2>Delivery to SW19: What to Know Before You Book</H2>
      <H3>Access and Parking</H3>
      <Prose>
        Many SW19 residential streets are narrow Victorian terraces with restricted parking and no dropped kerbs
        outside the property. Before booking delivery of a skip or plant machinery:
      </Prose>
      <CheckList items={[
        'Measure your access route — gate width and any overhead obstructions on the approach',
        'Check whether your road has CPZ (Controlled Parking Zone) restrictions — the London Borough of Merton operates extensive CPZs across SW19',
        'For skip delivery on the road, the hire company must obtain a London Borough of Merton highway permit — tell them at booking, not on the day',
        'For plant delivery by flatbed lorry, confirm the vehicle can access your street — delivery lorries for mini diggers and dumpers can be up to 8 metres long',
      ]} />

      <Link
        to="/blog/do-i-need-a-permit-for-a-skip-on-the-road-the-direct-answer"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Do I Need a Permit for a Skip on the Road? The Direct Answer</span>
      </Link>

      <H3>Low Emission Zone</H3>
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <p className="text-sm font-medium">
          <strong>LEZ Compliance:</strong> Greater London's Low Emission Zone applies to larger diesel vehicles (lorries,
          vans over 3.5t) and affects the vehicles used to deliver plant equipment. Reputable hire companies operating in
          SW19 will use compliant vehicles — but confirm this when booking, as a non-compliant delivery vehicle incurs a
          TfL penalty charge.{' '}
          <a href="https://tfl.gov.uk/modes/driving/low-emission-zone" target="_blank" rel="noopener noreferrer" className="underline">
            TfL LEZ details →
          </a>
        </p>
      </div>

      <Link
        to="/blog/mini-digger-hire-london-prices-local-availability"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Mini Digger Hire London: Prices &amp; Local Availability</span>
      </Link>

      <H2>Trade Activity in SW19: Who Hires and What They Need</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Trade</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Common SW19 Projects</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Key Equipment Hired</th>
            </tr>
          </thead>
          <tbody>
            {sw19WimbledonTradeTable.map(([trade, projects, equipment], i) => (
              <tr key={trade} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{trade}</td>
                <td className="px-4 py-3 text-gray-700">{projects}</td>
                <td className="px-4 py-3 text-gray-700">{equipment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained</span>
      </Link>

      <H2>Weekend and Same-Day Hire in SW19</H2>
      <Prose>
        Weekend tool hire is available from most depots serving SW19, but hours are reduced — most South London depots
        operate Saturday only (typically 7:30am–12:30pm) with Sunday collection not available. If you need equipment
        for a Monday start, book the Friday and factor in the weekend rate.
      </Prose>
      <Prose>
        Same-day hire in SW19 is possible for smaller items (disc cutters, mixers, small compressors) from depots in
        Mitcham and Tooting that stock lighter equipment. Plant machinery (mini diggers, dumpers) requires at least
        24–48 hours' notice for delivery scheduling in SW19.
      </Prose>

      <Link
        to="/blog/tool-hire-comparison-uk"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire Comparison UK: Compare Construction Equipment &amp; Plant Hire Suppliers</span>
      </Link>

      <H2>Neighbouring Areas: Hire Near SW19</H2>
      <Prose>
        If you're working near SW19 but your project site falls in a neighbouring postcode, the following resources
        cover your area and help you compare local hire options:
      </Prose>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">How Tool Hire Comparison Actually Saves Your Money (And How to Do It Properly)</span>
      </Link>

      <Link
        to="/blog/tool-hire-birmingham"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire in Birmingham: Compare Prices From Local Suppliers</span>
      </Link>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-bold text-[#030213]">Useful SW19 Resources</p>
        <ul className="space-y-2">
          <li>
            <a href="https://www.merton.gov.uk/roads-and-transport" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              London Borough of Merton — Skip and Highways Permits
            </a>
            <span className="text-sm text-gray-600"> — Skip licence and CPZ applications for SW19 and surrounding Merton roads</span>
          </li>
          <li>
            <a href="https://tfl.gov.uk/modes/driving/low-emission-zone" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              TfL — Low Emission Zone (LEZ)
            </a>
            <span className="text-sm text-gray-600"> — LEZ compliance requirements for plant delivery vehicles in Greater London</span>
          </li>
          <li>
            <a href="https://planning.merton.gov.uk" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Wimbledon Broadway Regeneration — Planning Portal
            </a>
            <span className="text-sm text-gray-600"> — Local planning applications and permitted development activity in SW19</span>
          </li>
        </ul>
      </div>

      <FaqSection faqs={sw19WimbledonFaqs} />

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Ready to Hire in SW19?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <a href="/search" className="font-bold text-white underline">compare now</a>{' '}
          — local suppliers serving Wimbledon, Colliers Wood, South Wimbledon, and Merton.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 40 — Tool Hire in Manchester: Compare Prices From Local Suppliers */

const manchesterPriceTable: [string, string, string, string][] = [
  ['Mini digger (0.8t)', '£95–£165', '£360–£520', 'Tight-access residential — strong demand in older terraced areas'],
  ['Mini digger (1.5t)', '£150–£215', '£480–£670', 'Most popular size across Greater Manchester groundwork jobs'],
  ['Mini digger (3t)', '£210–£300', '£650–£920', 'Foundation work, drainage, commercial site groundworks'],
  ['Scaffold tower (4m WH)', '£20–£32/day', '£50–£80/week', 'Residential decoration and roofwork — large Victorian stock'],
  ['Scaffold tower (6m WH)', '£26–£40/day', '£65–£105/week', 'Two-storey terrace standard across Salford and inner M postcodes'],
  ['Wacker plate (medium)', '£55–£85', '£180–£260', 'Patio and driveway sub-base — high summer demand'],
  ['Generator (15 kVA)', '£85–£145', '£320–£530', 'New-build and temporary power — Salford Quays / city-fringe sites'],
  ['Mini dumper (2t)', '£165–£225', '£520–£680', 'Groundworks and landscaping across suburban Manchester'],
  ['Skip (8 yard)', '£200–£290', 'N/A', 'Builders skip — renovation clearance across M postcodes'],
  ['Site lighting tower', '£60–£95/day', '£220–£360/week', 'Commercial sites and roadworks across the GMCA area'],
];

const manchesterPostcodeTable: [string, string, string][] = [
  ['Manchester City Centre', 'M1, M2, M3, M4', 'High commercial activity — Deansgate, Ancoats, NOMA development zones'],
  ['Salford', 'M5, M6, M7', 'Salford Quays regeneration, MediaCityUK cluster, dense residential inner Salford'],
  ['Didsbury & Withington', 'M20, M14', 'Large Victorian and Edwardian housing stock — strong renovation hire demand'],
  ['Chorlton-cum-Hardy', 'M21', 'Residential extensions and garden projects — busy landscaping market'],
  ['Stretford & Old Trafford', 'M16, M32', 'Mix of residential and commercial — Trafford Centre area logistics'],
  ['Hulme & Moss Side', 'M13, M15', 'Urban regeneration and student housing cluster'],
  ['Wythenshawe', 'M22, M23', 'Southern suburban — airport corridor, residential groundworks'],
  ['Stockport (border)', 'SK1, SK2, SK3', 'Served by Greater Manchester depots — also see Tool Hire Stockport page'],
  ['Eccles / Worsley', 'M30, M28', 'Western suburbs — served by Salford-area depots'],
  ['Bury / Prestwich direction', 'M25, M26', 'Northern suburbs — confirm delivery coverage with depot when booking'],
];

const manchesterFaqs: Faq[] = [
  ['How much does tool hire cost in Manchester?', 'Tool hire in Manchester is typically 10–15% cheaper than London equivalents. A 1.5-tonne mini digger runs £150–£215 per day. A scaffold tower for a standard two-storey terraced house costs £50–£80 per week. An 8-yard builders skip for renovation clearance is £200–£290. Compare current quotes from local Manchester suppliers on Tooli.uk.'],
  ['Which areas of Manchester do hire depots deliver to?', 'Most Manchester-based hire depots cover all M postcodes (M1–M23), Salford (M5–M7), Trafford (M16–M32), and Stockport (SK1–SK4) as standard delivery zones. Some depots extend coverage to Bolton, Oldham, Wigan, and Preston — confirm delivery coverage with your chosen depot when comparing quotes on Tooli.uk.'],
  ['Can I hire tools in Manchester without a trade account?', "Yes — all hire depots accessible through Tooli.uk will hire to private individuals and one-off trade customers without a trade account. You'll need photo ID (driving licence or passport) and a credit or debit card for the deposit. A trade account is worth setting up if you hire regularly — most Manchester depots offer 30-day payment terms."],
  ['Is same-day tool hire available in Manchester?', 'Yes — from depots in central Manchester and Salford for smaller items (disc cutters, mixers, compressors, power tools). For plant machinery (mini diggers, dumpers, scaffold towers), 24–48 hours\' notice is standard. Call ahead for same-day requirements — availability varies by season and equipment type.'],
  ['What is the cheapest way to hire a mini digger in Manchester?', 'Compare at least 3 local suppliers on Tooli.uk before booking — rates for the same 1.5-tonne machine can vary by 20–25% across Greater Manchester depots. Self-collection (if you have trailer access) saves delivery charges typically £60–£120. Booking weekly rather than by the day saves around 25% if your job runs 4 or more days.'],
  ['Do Manchester hire companies work weekends?', 'Most Manchester depots operate Saturday mornings (typically 7am–12pm). Sunday operation is rare — confirm with the depot if Sunday availability matters to your project. If you need equipment for a Monday start, take delivery Friday and pay the weekend rate (typically 1.5x–1.8x the daily rate).'],
];

function ManchesterToolHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-[#030213]">Manchester Tool Hire at a Glance</h2>
        <ul className="space-y-2">
          {[
            'Postcode coverage: M1–M23, Salford (M5, M6, M7), Trafford (M17, M32), Stockport (SK1–SK8)',
            'Typical day rates: 10–15% below London equivalents on most equipment categories',
            'Delivery lead time: same-day possible from central depots; 24h reliable across Greater Manchester',
            'Most-hired equipment: mini diggers, scaffold towers, skip hire, generators, site lighting',
            'Key sectors: residential renovation (Victorian and Edwardian terraces), student housing builds, city-centre commercial',
            'Tool hire comparison: Tooli.uk compares quotes from depots across the Greater Manchester network',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-medium text-gray-700">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <H2>Why Compare Tool Hire Prices in Manchester?</H2>
      <Prose>
        Manchester has one of the densest concentrations of plant hire depots in the North of England — which means
        competition between suppliers is genuine, and price variation between depots for the same equipment is
        significant. Based on market data across the Tooli.uk network, hire rates for the same 1.5-tonne mini digger
        in Greater Manchester can vary by as much as 20–25% between the cheapest and most expensive local quote.
      </Prose>
      <Prose>
        That difference on a week's hire — typically £100–£175 on a mid-size machine — comes directly off your
        project margin. Comparing before booking takes minutes and costs nothing.
      </Prose>

      <Link
        to="/blog/tool-hire-comparison-uk"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire Comparison UK: Compare Construction Equipment &amp; Plant Hire Suppliers</span>
      </Link>

      <H2>Tool &amp; Plant Hire Prices in Manchester 2026</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Equipment</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Day Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Week Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Notes</th>
            </tr>
          </thead>
          <tbody>
            {manchesterPriceTable.map(([equip, day, week, notes], i) => (
              <tr key={equip} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{equip}</td>
                <td className="px-4 py-3 text-gray-700">{day}</td>
                <td className="px-4 py-3 text-gray-700">{week}</td>
                <td className="px-4 py-3 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">*VAT-inclusive guidance. Compare live Manchester quotes on Tooli.uk.</p>

      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Manchester Tool Hire Prices</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — local suppliers across Greater Manchester, Salford, Trafford, and Stockport.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">How Tool Hire Comparison Actually Saves Your Money (And How to Do It Properly)</span>
      </Link>

      <img
        src="/images/blog/tool-hire-manchester-compare.webp"
        alt="1.5-tonne mini digger on hire working on a rear extension excavation in Didsbury Manchester M20"
        className="w-full rounded-2xl object-cover"
      />

      <H2>Areas and Postcodes We Cover in Manchester</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Area</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Postcode(s)</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Local Notes</th>
            </tr>
          </thead>
          <tbody>
            {manchesterPostcodeTable.map(([area, postcode, notes], i) => (
              <tr key={area} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{area}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{postcode}</td>
                <td className="px-4 py-3 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</span>
      </Link>

      <H2>Most Active Construction Sectors in Manchester</H2>
      <H3>Residential Renovation</H3>
      <Prose>
        Manchester's housing stock is dominated by Victorian and Edwardian terraces — particularly across Salford,
        Hulme, Chorlton, and the inner M postcodes. This generates year-round demand for scaffolding, skip hire,
        concrete mixers, and groundwork equipment. Permitted development activity (rear and side extensions, loft
        conversions) is consistently high across the M14, M20, M21 postcode corridor.
      </Prose>

      <Link
        to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained</span>
      </Link>

      <H3>Student and Build-to-Rent Development</H3>
      <Prose>
        Manchester is the UK's largest student city by volume. Purpose-built student accommodation and build-to-rent
        schemes are a significant part of the city-centre construction market — Ancoats, NOMA, and the Oxford Road
        corridor see active development that drives demand for generators, site lighting, welfare units, and plant hire
        at commercial scale.
      </Prose>

      <H3>Salford Quays and MediaCityUK</H3>
      <Prose>
        The ongoing development of the Salford Quays and MediaCityUK areas represents one of the largest sustained
        commercial construction programmes in the North West. Hire demand here is predominantly for commercial-grade
        plant — 5-tonne+ excavators, dumpers, road sweepers, temporary power at scale.
      </Prose>

      <Link
        to="/blog/mini-digger-hire-london-prices-local-availability"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Mini Digger Hire London: Prices &amp; Local Availability</span>
      </Link>

      <H2>Delivery Times and Weekend Availability in Manchester</H2>
      <CheckList items={[
        'Same-day hire: available from central Manchester and Salford depots for most hand tools and small plant. Book before 10am for same-day delivery.',
        'Next-day delivery: reliable across all Greater Manchester M postcodes and Stockport SK1–SK4 from most hire companies.',
        'Weekend hire: most Manchester depots operate Saturday 7am–12pm. Sunday collection is not standard — confirm with your chosen depot if Sunday availability is critical.',
        'Long-distance delivery: depots in central Manchester will deliver to Preston, Wigan, Bolton, and Oldham — but delivery charges apply. Compare total cost including delivery on Tooli.uk.',
      ]} />

      <Link
        to="/blog/do-i-need-a-permit-for-a-skip-on-the-road-the-direct-answer"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Do I Need a Permit for a Skip on the Road? The Direct Answer</span>
      </Link>

      <H2>Trade Accounts and VAT Receipts in Manchester</H2>
      <Prose>
        Most major hire depots in Manchester offer trade accounts for regular users — typically providing 30-day
        payment terms and consolidated VAT invoicing. If you're a sole trader or small contractor doing regular work
        across Greater Manchester, a trade account with a local depot saves time and simplifies your VAT records.
      </Prose>
      <Prose>
        One-off hirers (including DIY homeowners) can hire without an account from all depots listed on Tooli.uk —
        you'll need valid photo ID and a deposit held on card.
      </Prose>

      <Link
        to="/blog/tool-hire-birmingham"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire in Birmingham: Compare Prices From Local Suppliers</span>
      </Link>

      <Link
        to="/blog/tool-hire-london"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire in London: Compare Prices From Local Suppliers</span>
      </Link>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-bold text-[#030213]">Useful Manchester Resources</p>
        <ul className="space-y-2">
          <li>
            <a href="https://www.greatermanchester-ca.gov.uk" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Greater Manchester Combined Authority — Construction Sector
            </a>
            <span className="text-sm text-gray-600"> — GMCA economic data including construction sector employment and development pipeline</span>
          </li>
          <li>
            <a href="https://www.manchester.gov.uk/planning" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Manchester City Council — Planning Applications
            </a>
            <span className="text-sm text-gray-600"> — Live planning applications across Manchester — useful for tracking local development activity</span>
          </li>
          <li>
            <a href="https://www.salford.gov.uk/planning" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Salford City Council — Planning Portal
            </a>
            <span className="text-sm text-gray-600"> — Planning and permitted development applications across the M5–M7 Salford postcodes</span>
          </li>
        </ul>
      </div>

      <FaqSection faqs={manchesterFaqs} />

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Ready to Hire in Manchester?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <a href="/search" className="font-bold text-white underline">compare now</a>{' '}
          — local suppliers across Greater Manchester, Salford, Trafford, and Stockport.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 41 — Mini Digger Hire Manchester: Prices & Local Availability */

const manchesterDiggerPriceTable: [string, string, string, string, string][] = [
  ['0.8t micro digger', '£95–£165', '£155–£255', '£360–£520', '~12% below London'],
  ['1.5t mini digger', '£150–£215', '£235–£330', '£480–£670', '~10% below London'],
  ['3t mini digger', '£210–£300', '£320–£460', '£650–£920', '~8% below London'],
  ['5t midi digger', '£280–£420', '£430–£640', '£870–£1,310', '~7% below London'],
];

const manchesterDiggerDeliveryTable: [string, string, string][] = [
  ['Under 10 miles', '£60–£90', 'Central Manchester, Salford, Trafford, inner M postcodes'],
  ['10–20 miles', '£90–£130', 'Stockport, Bolton edge, Oldham edge, Wigan edge'],
  ['20–35 miles', '£120–£180', 'Preston, Wigan, Macclesfield — POA from most depots'],
  ['Self-collect', '£0', 'Bring suitable trailer + towing vehicle to the depot'],
];

const manchesterDiggerJobTable: [string, string, string][] = [
  ['Victorian terrace side-passage access', '0.8t', 'Most Manchester inner-terrace passages are 800–1,000mm wide — measure before booking'],
  ['Rear garden clearance and reshaping', '0.8t or 1.5t', '0.8t for tight plots, 1.5t where volume of spoil is significant'],
  ['Extension footings (single-storey)', '1.5t', 'Standard depth 750–1,000mm — 1.5t handles this comfortably'],
  ['Driveway excavation (1–2 cars)', '1.5t', 'Sub-base removal and drainage prep'],
  ['Drainage run / land drain (40m+)', '1.5t or 3t', '3t shifts spoil faster on longer runs'],
  ['Extension footings (two-storey or on clay)', '3t', 'Deeper foundations and harder ground in parts of South Manchester'],
  ['Commercial groundworks / site prep', '3t or 5t', 'Commercial M1–M4 sites typically require 3t minimum'],
];

const manchesterDiggerFaqs: Faq[] = [
  ['How much does it cost to hire a mini digger in Manchester?', 'A 0.8-tonne micro digger in Manchester costs approximately £95–£165 per day. A 1.5-tonne machine — the most commonly hired size — runs £150–£215 per day. A 3-tonne machine for foundation or groundwork use costs £210–£300 per day. Compare current local rates on Tooli.uk.'],
  ['Can a mini digger access a Manchester terrace side entry?', 'The micro digger (0.8t, 750–850mm transport width) fits most Manchester Victorian terrace side entries, which are typically 800–1,000mm wide. Measure the narrowest point of the access route — not just the entry — before booking. Some entries have gatepost-to-wall restrictions as low as 750mm.'],
  ['Is same-day mini digger hire available in Manchester?', 'Yes — for 0.8t and 1.5t machines from depots in Salford and South Manchester, same-day delivery is possible if you book before 9–10am. For 3t+ machines, 24–48 hours\' notice is standard. Call the depot directly for same-day availability — Tooli.uk shows which suppliers cover your postcode.'],
  ['Do I need a CPCS card to hire a mini digger in Manchester?', 'Not for private domestic use on your own property. Hire depots do not legally require a CPCS card from private hirers. On managed commercial sites across Manchester city centre and Greater Manchester, CPCS card (category A59) will be required by the principal contractor.'],
  ['What is the delivery charge for mini digger hire in Manchester?', 'Typically £60–£90 return within 10 miles of a Manchester depot. The M1–M4 core and inner M postcodes are within this range from most local suppliers. Self-collection eliminates delivery costs — most depots will help load the machine onto a suitable trailer.'],
];

function ManchesterDiggerHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-[#030213]">Manchester Mini Digger Hire at a Glance</h2>
        <ul className="space-y-2">
          {[
            '0.8t micro digger: £95–£165/day — tight gardens and side-access residential jobs across Manchester',
            '1.5t mini digger: £150–£215/day — most common size for Greater Manchester groundwork and landscaping',
            '3t mini digger: £210–£300/day — foundation work, drainage, commercial sites',
            'Delivery: typically £60–£130 return from Manchester depots — or self-collect if you have a trailer',
            'Same-day availability: possible from Salford and South Manchester depots for smaller machines',
            'No CPCS card needed for private domestic projects — required on managed commercial sites',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-medium text-gray-700">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <H2>Mini Digger Hire Prices in Manchester 2026</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Size Class</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Day Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Weekend Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Week Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">vs London</th>
            </tr>
          </thead>
          <tbody>
            {manchesterDiggerPriceTable.map(([size, day, weekend, week, vs], i) => (
              <tr key={size} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{size}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{day}</td>
                <td className="px-4 py-3 text-gray-700">{weekend}</td>
                <td className="px-4 py-3 text-gray-700">{week}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{vs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">*VAT-inclusive guidance. Compare live Manchester rates on Tooli.uk.</p>

      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Manchester Mini Digger Prices</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — local suppliers across Greater Manchester, Salford, and Trafford.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>

      <Link
        to="/blog/tool-hire-comparison-uk"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire Comparison UK: Compare Construction Equipment &amp; Plant Hire Suppliers</span>
      </Link>

      <H2>Delivery Costs From Manchester Depots</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Distance from Depot</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Typical Delivery Charge (return)</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Areas Typically Covered</th>
            </tr>
          </thead>
          <tbody>
            {manchesterDiggerDeliveryTable.map(([dist, charge, areas], i) => (
              <tr key={dist} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{dist}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{charge}</td>
                <td className="px-4 py-3 text-gray-600">{areas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">How Tool Hire Comparison Actually Saves Your Money (And How to Do It Properly)</span>
      </Link>

      <img
        src="/images/blog/mini-digger-hire-manchester-prices.webp"
        alt="1.5-tonne mini digger excavating a rear extension foundation in Didsbury Manchester M20"
        className="w-full rounded-2xl object-cover"
      />

      <H2>Common Manchester Mini Digger Jobs and Which Size You Need</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Job</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Recommended Size</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Manchester Context</th>
            </tr>
          </thead>
          <tbody>
            {manchesterDiggerJobTable.map(([job, size, context], i) => (
              <tr key={job} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{job}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{size}</td>
                <td className="px-4 py-3 text-gray-600">{context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/blog/mini-digger-hire-london-prices-local-availability"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Mini Digger Hire London: Prices &amp; Local Availability</span>
      </Link>

      <H2>Access in Manchester: What You Need to Know</H2>
      <H3>Victorian and Edwardian Terraces</H3>
      <Prose>
        The majority of Manchester's residential stock — across Hulme, Salford, Didsbury, Chorlton, and Stretford —
        consists of Victorian and Edwardian terraced housing with rear-access entries (ginnels or jitties in local
        parlance). These entries are typically 800–1,000mm wide. The 0.8-tonne micro digger at 750–850mm transport
        width is the correct machine for this access type.
      </Prose>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <p className="text-sm font-medium">
          <strong>Measure before booking:</strong> Always measure the narrowest point of your access route — not just
          the gate opening. Pipework, meter boxes, and brick reveals often reduce the effective clearance by 50–100mm
          beyond what the opening suggests.
        </p>
      </div>

      <H3>Inner-City Commercial Sites</H3>
      <Prose>
        On commercial sites in the M1–M4 core (Piccadilly, Deansgate, Ancoats), site access is often managed by a
        traffic management plan. Confirm machine delivery arrangements with the site manager before booking —
        low-loaders for 3t+ machines require planned access.
      </Prose>

      <H3>Ground Conditions</H3>
      <Prose>
        Manchester sits on a mix of Triassic sandstone and glacial boulder clay. The inner M postcodes tend to have
        heavy clay subsoil that makes excavation harder and wetter in winter months. Factor in slower dig rates and
        extra spoil-disposal costs if your project involves significant depth in clay ground.
      </Prose>

      <Link
        to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</span>
      </Link>

      <Link
        to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained</span>
      </Link>

      <Link
        to="/blog/do-i-need-a-permit-for-a-skip-on-the-road-the-direct-answer"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Do I Need a Permit for a Skip on the Road? The Direct Answer</span>
      </Link>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-bold text-[#030213]">Useful Resources</p>
        <ul className="space-y-2">
          <li>
            <a href="https://cpcs.uk.com/categories" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              CPCS — Category A59 (360° Excavator)
            </a>
            <span className="text-sm text-gray-600"> — CPCS card information for Manchester-based commercial site operators</span>
          </li>
          <li>
            <a href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              HSE PUWER — Operator Competence
            </a>
            <span className="text-sm text-gray-600"> — PUWER competence requirement applies to all mini digger operators in Manchester and across the UK</span>
          </li>
          <li>
            <a href="https://www.cpa.uk.net" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Construction Plant-hire Association (CPA)
            </a>
            <span className="text-sm text-gray-600"> — UK plant hire industry body — member depots across Greater Manchester</span>
          </li>
        </ul>
      </div>

      <FaqSection faqs={manchesterDiggerFaqs} />

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Ready to Hire a Mini Digger in Manchester?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <a href="/search" className="font-bold text-white underline">compare now</a>{' '}
          — local suppliers across Greater Manchester, Salford, Didsbury, and Chorlton.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 42 — Plant Hire Manchester: Compare Local Plant Hire Companies */

const manchesterPlantCategoryTable: [string, string, string, string][] = [
  ['Mini excavators (tracked)', '0.8t – 5t', '£95–£420/day', 'Residential groundworks, inner-city sites, drainage, landscaping'],
  ['Mid-range excavators', '5t – 13t', '£350–£650/day', 'Commercial foundations, road works, utility trenching across Greater Manchester'],
  ['Large excavators', '13t – 25t+', '£550–£900+/day', 'Major infrastructure — Metrolink works, A-road drainage, commercial basements'],
  ['Mini dumpers (tracked)', '500 kg – 3t', '£90–£280/day', 'Spoil removal from residential and commercial sites'],
  ['Site dumpers (large)', '6t – 10t', '£280–£480/day', 'High-volume earthmoving on Manchester development sites'],
  ['Telehandlers', '7m – 17m lift', '£220–£480/day', 'Block and beam lifts, material handling on housebuilder sites'],
  ['Road sweepers', 'Compact to truck-mounted', '£280–£650/day', 'Site entrance and access road cleaning — required on most managed sites'],
  ['Compaction equipment', 'Wacker plates, rollers', '£45–£380/day', 'Sub-base and road base compaction across Greater Manchester'],
  ['Screening plants', 'Tracked mobile screens', '£350–£700/day', 'Site-won material processing on larger earthworks contracts'],
];

const manchesterPlantHireOptionsTable: [string, string, string, string][] = [
  ['Dry hire', 'Machine only — you provide a CPCS-carded operator', 'Contractors with their own carded operator', 'Baseline hire rate'],
  ['Operated hire', 'Machine + CPCS operator supplied by the hire company', 'One-off projects, smaller contractors without own plant operator', 'Operator typically £200–£380/day additional'],
];

const manchesterPlantFaqs: Faq[] = [
  ['What is the difference between tool hire and plant hire in Manchester?', 'Tool hire covers hand tools, access equipment, and small machinery — disc cutters, scaffold towers, mixers, generators. Plant hire covers larger self-propelled or towable machinery — excavators, dumpers, telehandlers, road sweepers. Many hire companies in Manchester offer both, but specialist plant hire companies focus on the heavier machinery with CPCS operators available.'],
  ['Can I hire plant equipment without a trade account in Manchester?', 'Yes for most equipment. Some plant hire companies in Manchester require a business trade account for larger machines (telehandlers, larger excavators) due to the higher deposit and liability involved. For mini excavators and dumpers, most depots hire on a debit or credit card deposit basis without a formal trade account.'],
  ['Do Manchester plant hire companies supply CPCS-carded operators?', 'Yes — most major plant hire companies serving Greater Manchester offer operated hire as an option. Operators are employed directly by the hire company and hold current CPCS cards for the relevant machine category. Specify operated hire when requesting your quote on Tooli.uk.'],
  ['What documents do I need for plant hire in Manchester?', 'For dry hire: photo ID, company details (if applicable), and a credit or debit card for the deposit. For operated hire on managed sites: site address, site manager contact, CDM duty holder information, and any site induction requirements. LOLER certificates should be requested automatically for any lifting equipment.'],
];

function ManchesterPlantHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-[#030213]">Manchester Plant Hire at a Glance</h2>
        <ul className="space-y-2">
          {[
            'Excavators: 1.5t to 20t+ available from Manchester depots — full range for residential to commercial',
            'Dumpers: 1t to 6t tracked — strong demand from groundworkers across M and SK postcodes',
            'Telehandlers: 7m to 17m lift height — available for commercial and housebuilder sites',
            'Road sweepers: Greater Manchester road and site clearance — seasonal demand spikes',
            'Delivery: most Greater Manchester plant hire companies cover a 30-mile radius from central depots',
            'Operators: most depots can supply CPCS-carded operators alongside machine hire',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-medium text-gray-700">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <H2>Plant Hire Categories Available in Manchester</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Plant Category</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Common Sizes</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Day Rate Guide</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Key Manchester Applications</th>
            </tr>
          </thead>
          <tbody>
            {manchesterPlantCategoryTable.map(([category, sizes, rate, apps], i) => (
              <tr key={category} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{category}</td>
                <td className="px-4 py-3 text-gray-700">{sizes}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{rate}</td>
                <td className="px-4 py-3 text-gray-600">{apps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">*VAT-inclusive guidance — operator costs are additional where specified. Compare Manchester plant hire quotes on Tooli.uk.</p>

      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Manchester Plant Hire Companies</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — excavators, dumpers, telehandlers and more from local Greater Manchester suppliers.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>

      <Link
        to="/blog/tool-hire-comparison-uk"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire Comparison UK: Compare Construction Equipment &amp; Plant Hire Suppliers</span>
      </Link>

      <H2>Plant Hire with Operator vs Dry Hire in Manchester</H2>
      <Prose>
        Manchester plant hire companies offer two fundamental options:
      </Prose>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Option</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">What It Means</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Best For</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Cost Premium</th>
            </tr>
          </thead>
          <tbody>
            {manchesterPlantHireOptionsTable.map(([option, meaning, bestFor, cost], i) => (
              <tr key={option} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-bold text-[#030213]">{option}</td>
                <td className="px-4 py-3 text-gray-700">{meaning}</td>
                <td className="px-4 py-3 text-gray-700">{bestFor}</td>
                <td className="px-4 py-3 text-gray-600">{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Prose>
        On most managed commercial sites across Manchester, operated hire from the plant company provides a clean audit
        trail for CDM 2015 competence records — the operator's CPCS card details are held by the hire company.
      </Prose>

      <Link
        to="/blog/mini-digger-hire-manchester-prices-and-local-availability"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Mini Digger Hire Manchester: Prices &amp; Local Availability</span>
      </Link>

      <img
        src="/images/blog/plant-hire-manchester-compare-local.webp"
        alt="Telehandler lifting materials on a housebuilder site in Wythenshawe South Manchester — plant hire Greater Manchester"
        className="w-full rounded-2xl object-cover"
      />

      <H2>Key Manchester Construction Projects Driving Plant Hire Demand</H2>
      <H3>Metrolink and Transport Infrastructure</H3>
      <Prose>
        Greater Manchester's ongoing Metrolink expansion and associated road infrastructure works create sustained
        demand for utility-grade excavators, road sweepers, and compaction plant. Major civil engineering contractors
        are the primary hirers for this work.
      </Prose>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">How Tool Hire Comparison Actually Saves Your Money (And How to Do It Properly)</span>
      </Link>

      <H3>Residential Housebuilder Sites</H3>
      <Prose>
        Volume housebuilder activity across the Greater Manchester green and brownfield belt — from Wythenshawe in
        the south to Bury in the north — generates consistent demand for telehandlers, 13-tonne excavators, and
        road sweepers on managed site contracts.
      </Prose>

      <H3>Salford Quays and Deansgate Commercial</H3>
      <Prose>
        The continued commercial development of Salford Quays (new office and residential towers) and the
        Deansgate/St John's cultural corridor drives demand for high-reach plant, basement excavation equipment,
        and larger cranes.
      </Prose>

      <Link
        to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</span>
      </Link>

      <H2>How to Compare Plant Hire Companies in Manchester</H2>
      <CheckList items={[
        'Use Tooli.uk to get quotes from multiple Greater Manchester plant hire companies in a single comparison — rates for the same 13-tonne excavator can vary by 15–20% across local depots.',
        'Always specify: required machine size, required attachments, hire duration, delivery address, and whether you need an operator or are dry-hiring.',
        'Confirm the company\'s insurance and CPCS verification process before booking — particularly for operated hire on managed sites.',
        'Ask about LOLER inspection certificates for any lifting equipment — required under the Lifting Operations and Lifting Equipment Regulations 1998 and should be provided automatically on hire of telehandlers and cranes.',
      ]} />

      <Link
        to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained</span>
      </Link>

      <Link
        to="/blog/do-i-need-a-permit-for-a-skip-on-the-road-the-direct-answer"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Do I Need a Permit for a Skip on the Road? The Direct Answer</span>
      </Link>

      <Link
        to="/blog/tool-hire-birmingham"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire in Birmingham: Compare Prices From Local Suppliers</span>
      </Link>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-bold text-[#030213]">Useful Resources</p>
        <ul className="space-y-2">
          <li>
            <a href="https://www.cpa.uk.net" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Construction Plant-hire Association (CPA)
            </a>
            <span className="text-sm text-gray-600"> — UK plant hire trade body — find CPA-member companies operating in Greater Manchester</span>
          </li>
          <li>
            <a href="https://www.hse.gov.uk/work-equipment-machinery/loler.htm" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              HSE LOLER 1998 — Lifting Equipment Inspections
            </a>
            <span className="text-sm text-gray-600"> — LOLER thorough examination requirements for telehandlers and lifting plant</span>
          </li>
          <li>
            <a href="https://www.hse.gov.uk/construction/cdm/2015" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              HSE CDM 2015 — Competence and Plant on Site
            </a>
            <span className="text-sm text-gray-600"> — CDM 2015 guidance on plant operator competence requirements on managed sites</span>
          </li>
        </ul>
      </div>

      <FaqSection faqs={manchesterPlantFaqs} />

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Ready to Compare Manchester Plant Hire?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <a href="/search" className="font-bold text-white underline">compare now</a>{' '}
          — excavators, telehandlers, dumpers, and sweepers from local Greater Manchester plant hire companies.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 43 — Tool Hire M1: Manchester City Centre Postcode Area Guide */

const m1EquipmentTable: [string, string, string, string][] = [
  ['Generator (15–30 kVA)', '£90–£180', '£330–£660', 'New-build and fit-out temporary power — no mains connection on refurbs'],
  ['Scaffold tower (indoor, low-level)', '£20–£35', '£50–£80', 'High-ceiling warehouse and industrial conversions'],
  ['Site lighting tower', '£60–£95', '£220–£360', 'M1 nights-working and enclosed site areas'],
  ['Disc cutter (electric)', '£35–£65', '£130–£240', 'Internal block and concrete cuts — no petrol exhaust risk'],
  ['Dehumidifier (large)', '£75–£110', '£270–£400', 'Post-plaster and screed drying in converted commercial buildings'],
  ['Concrete mixer', '£35–£55', '£100–£155', 'Blockwork and repair mortar on conversion and fit-out sites'],
  ['Mini dumper (1t)', '£130–£180', '£400–£540', 'Internal and basement spoil removal where machinery access is limited'],
  ['Welfare unit (self-contained)', 'POA', 'POA', 'Required on most managed M1 commercial sites'],
];

const m1PostcodeTable: [string, string, string][] = [
  ['M2', 'Manchester City Centre (south of M1)', 'Deansgate, Spinningfields — similar commercial profile'],
  ['M3', 'Salford border / Chapel Street', 'MediaCityUK gateway, mixed residential and commercial'],
  ['M4', 'Rochdale Road corridor', 'Northern edge — Northern Quarter overflow, residential conversion'],
  ['M12', 'Ardwick', 'Industrial and commercial — depot location for M1 delivery'],
  ['M15', 'Hulme / Oxford Road', 'University corridor — student housing builds and commercial'],
];

const m1Faqs: Faq[] = [
  ['Where can I hire tools for a site in M1 Manchester?', 'M1 is served by depots in Salford (M5), Ardwick (M12), and the wider South Manchester area. Tooli.uk compares prices from suppliers with confirmed delivery coverage for M1, so you can find the best local rate and check delivery availability without ringing multiple depots.'],
  ['Can I get same-day tool hire in M1?', 'Yes for smaller equipment (disc cutters, generators up to 15 kVA, mixers, dehumidifiers) from Salford and Ardwick depots. For plant machinery (mini diggers, dumpers, scaffold towers for taller commercial sites), 24–48 hours\' notice is standard for M1 delivery due to traffic management requirements.'],
  ['What are the delivery rules for M1 construction sites?', 'Most managed commercial sites in M1 require deliveries outside peak traffic hours (before 7am or after 7pm), a pre-booked loading bay or street space suspension, and a site representative on-site to accept delivery. For smaller items, kerbside delivery by van during normal hours is more straightforward — confirm requirements with your site manager before booking.'],
  ['Do I need a generator for a fit-out in M1?', 'If the building being refurbished has no live mains power connection, yes — a temporary generator is needed for tools, lighting, welfare, and any screed drying equipment. A 15–30 kVA diesel generator is sufficient for most single-trade fit-out operations. For larger multi-trade commercial fit-outs, consult your temporary power supplier.'],
];

function M1ToolHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-[#030213]">Tool Hire M1 at a Glance</h2>
        <ul className="space-y-2">
          {[
            'Covers: Piccadilly, Northern Quarter, Ancoats, edge of NOMA development zone',
            'Nearest depots: Salford (M5), Ardwick (M12), Openshaw direction — 10–20 min drive',
            'Delivery in M1: loading bays required for plant — traffic management plans on major sites',
            'Most-hired equipment: generators, site lighting, scaffold towers, welfare units, disc cutters',
            'Commercial focus: fit-out and conversion work dominates over residential groundworks in M1',
            'Same-day: available for small plant from Salford depots — confirm before booking',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-medium text-gray-700">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <H2>About M1: The Construction Context</H2>
      <Prose>
        M1 is one of the UK's most active urban regeneration postcodes. The conversion of Manchester's former
        warehouse and industrial stock — particularly across Ancoats (now a NESC heritage zone) and the Northern
        Quarter — into residential apartments, restaurants, offices, and hotels has driven sustained fit-out and
        refurbishment demand for over a decade.
      </Prose>
      <Prose>
        The NOMA (Northern Manchester) development adjacent to M1 represents over £800 million of planned
        development. Construction on this corridor creates ongoing demand for temporary power, access equipment,
        and plant for civil and structural work in a congested urban environment.
      </Prose>

      <Link
        to="/blog/tool-hire-manchester-compare-prices-from-local-suppliers"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire in Manchester: Compare Prices From Local Suppliers</span>
      </Link>

      <H2>Equipment Most Hired in M1 and Typical Rates</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Equipment</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Day Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Week Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">M1 Notes</th>
            </tr>
          </thead>
          <tbody>
            {m1EquipmentTable.map(([equip, day, week, notes], i) => (
              <tr key={equip} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{equip}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{day}</td>
                <td className="px-4 py-3 text-gray-700">{week}</td>
                <td className="px-4 py-3 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">*VAT-inclusive guidance. Compare live M1 rates on Tooli.uk.</p>

      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare M1 Tool Hire Prices</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — local suppliers with confirmed delivery to M1, Piccadilly, Northern Quarter, and Ancoats.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>

      <Link
        to="/blog/generator-hire-uk-prices-power-output-guide-2026"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Generator Hire UK: Prices &amp; Power Output Guide 2026</span>
      </Link>

      <img
        src="/images/blog/tool-hire-m1-manchester-city-centre.webp"
        alt="Scaffold tower inside a high-ceilinged industrial building conversion in the Northern Quarter Manchester M1"
        className="w-full rounded-2xl object-cover"
      />

      <H2>Delivery to M1: Urban Site Rules</H2>
      <H3>Loading Bays and Traffic Management</H3>
      <Prose>
        M1 is a busy urban core with limited kerbside access. Most commercial sites on Piccadilly, Great Ancoats
        Street, and the Northern Quarter require specific delivery arrangements:
      </Prose>
      <CheckList items={[
        'A booked loading bay or traffic management plan for large plant deliveries',
        'Delivery outside peak hours (typically before 7am or after 7pm on key M1 routes)',
        'A site contact on-site to accept delivery — on managed commercial builds this is mandatory',
        'Confirmation of any access height restrictions (car park ramps, undercroft deliveries) before booking',
      ]} />

      <H3>Parking Suspensions</H3>
      <Prose>
        For site operations that require kerbside space in M1, Manchester City Council issues temporary parking
        suspensions (yellow line suspensions). Your hire company can usually advise on the process — or the
        principal contractor will have this in place for managed sites. Budget 3–5 working days for MCC to
        process a suspension application.
      </Prose>

      <Link
        to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained</span>
      </Link>

      <Link
        to="/blog/do-i-need-a-permit-for-a-skip-on-the-road-the-direct-answer"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Do I Need a Permit for a Skip on the Road? The Direct Answer</span>
      </Link>

      <H2>Neighbouring M Postcodes to M1</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Postcode</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Area</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Relationship to M1</th>
            </tr>
          </thead>
          <tbody>
            {m1PostcodeTable.map(([postcode, area, rel], i) => (
              <tr key={postcode} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-bold text-brand-primary">{postcode}</td>
                <td className="px-4 py-3 font-medium text-[#030213]">{area}</td>
                <td className="px-4 py-3 text-gray-600">{rel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/blog/plant-hire-manchester-compare-local-plant-hire-companies"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Plant Hire Manchester: Compare Local Plant Hire Companies</span>
      </Link>

      <Link
        to="/blog/tool-hire-comparison-uk"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire Comparison UK: Compare Construction Equipment &amp; Plant Hire Suppliers</span>
      </Link>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">How Tool Hire Comparison Actually Saves Your Money (And How to Do It Properly)</span>
      </Link>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-bold text-[#030213]">Useful M1 Resources</p>
        <ul className="space-y-2">
          <li>
            <a href="https://www.manchester.gov.uk/roads" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Manchester City Council — Temporary Traffic Orders
            </a>
            <span className="text-sm text-gray-600"> — Parking suspensions and traffic management applications for M1 construction sites</span>
          </li>
          <li>
            <a href="https://www.noma.co.uk" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              NOMA Manchester — Development Programme
            </a>
            <span className="text-sm text-gray-600"> — Northern Manchester development programme — context for M1 construction activity</span>
          </li>
          <li>
            <a href="https://www.manchester.gov.uk/planning" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Manchester City Council — Planning Applications
            </a>
            <span className="text-sm text-gray-600"> — Live planning applications across M1 and wider Manchester city centre</span>
          </li>
        </ul>
      </div>

      <FaqSection faqs={m1Faqs} />

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Ready to Hire in M1?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <a href="/search" className="font-bold text-white underline">compare now</a>{' '}
          — local suppliers covering Piccadilly, Northern Quarter, Ancoats, and the wider M1 postcode.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 44 — Tool Hire in Birmingham: Compare Prices From Local Suppliers */

const bhamComparePriceTable: [string, string, string, string][] = [
  ['Mini digger (0.8t)', '£90–£160', '£350–£510', 'Side-access residential — inter-war semis common across Birmingham suburbs'],
  ['Mini digger (1.5t)', '£145–£210', '£460–£650', 'Standard for renovation and extension groundwork across B postcodes'],
  ['Mini digger (3t)', '£200–£290', '£620–£900', 'Foundation work, drainage — active in Perry Barr regeneration zone'],
  ['Scaffold tower (4m WH)', '£20–£32/day', '£50–£80/week', '1930s semi-detached stock — exterior decoration high demand'],
  ['Scaffold tower (6m WH)', '£26–£38/day', '£62–£100/week', 'Two-storey render and brickwork — popular in Solihull and Edgbaston'],
  ['Wacker plate (medium)', '£55–£82', '£175–£250', 'Driveway and patio base — block paving replacement very common in Birmingham'],
  ['Concrete mixer (130L)', '£33–£52', '£95–£145', 'Garden walls, pointing, path repair'],
  ['Mini dumper (2t)', '£160–£220', '£510–£670', 'Groundworks — strong demand in Sutton Coldfield and Kings Heath'],
  ['Skip (8 yard)', '£195–£285', 'N/A', 'Renovation clearance — road permit needed for most Birmingham roads'],
  ['Generator (15 kVA)', '£82–£140', '£310–£520', 'Commercial fit-out and off-grid residential sites'],
];

const bhamCompareAreaTable: [string, string, string][] = [
  ['Birmingham City Centre', 'B1, B2, B3, B4, B5', 'Big City Plan zone — commercial, office-to-resi conversion'],
  ['Edgbaston', 'B15, B16', 'Affluent residential — strong garden and extension hire demand'],
  ['Moseley & Kings Heath', 'B13, B14', 'Victorian and Edwardian terraces — renovation hire steady year-round'],
  ['Sutton Coldfield', 'B72, B73, B74, B75', 'Large detached and semi-detached — landscaping and driveway hire'],
  ['Erdington', 'B23, B24', 'Mixed residential — several hire depots in this area'],
  ['Sparkbrook & Sparkhill', 'B11, B12', 'Dense residential renovation — access often tight'],
  ['Perry Barr & Handsworth', 'B20, B21, B42, B43', 'Regeneration zone — increased commercial and infrastructure hire'],
  ['Bournville & Kings Norton', 'B30, B31', 'Suburban — garden projects and extension work'],
  ['Solihull', 'B90, B91, B92, B93', 'Affluent commuter belt — high-value garden and landscaping projects'],
  ['Sandwell (Smethwick, Oldbury)', 'B65, B66, B67, B68, B69', 'West Midlands Metro extension area — civil works and infrastructure'],
];

const bhamCompareFaqs: Faq[] = [
  ['How much does tool hire cost in Birmingham?', 'Tool hire in Birmingham runs roughly 5–10% below London equivalents. A 1.5-tonne mini digger costs approximately £145–£210 per day. An 8-yard builders skip is £195–£285. A scaffold tower for a standard semi-detached runs £50–£80 per week. Compare current supplier quotes across Birmingham on Tooli.uk.'],
  ['Which areas of Birmingham do hire depots deliver to?', 'Most Birmingham-based hire depots cover all B postcodes as standard. Solihull (B90–B93) and Sandwell (B65–B71) are typically within the delivery zone — delivery charges may apply. Confirm coverage for your specific postcode when comparing on Tooli.uk.'],
  ['Can I hire tools in Birmingham without a trade account?', 'Yes — all depots on Tooli.uk hire to private individuals and one-off trade customers. You need valid photo ID and a card for the deposit. A trade account gives you 30-day terms and consolidated VAT invoicing — worth setting up if you hire regularly across Birmingham.'],
  ['Is same-day tool hire available in Birmingham?', 'Yes for smaller items from Erdington and Sparkbrook depots. For plant machinery (mini diggers, scaffold towers, dumpers), 24–48 hours\' notice is standard. Call the depot directly for same-day requirements.'],
  ['What is the cheapest way to hire a wacker plate in Birmingham?', 'Compare at least 3 local quotes on Tooli.uk — rates for the same medium forward plate vary by 15–20% across Birmingham depots. Self-collection saves £30–£60 in delivery charges if you have suitable transport. Book weekly if your job runs more than 3 days.'],
  ['Do Birmingham hire companies deliver to Solihull?', 'Most do — Solihull (B90–B93) is within the standard delivery zone for major Birmingham hire depots. A delivery surcharge may apply compared to inner B postcodes. Confirm delivery availability and cost for your specific Solihull postcode when comparing on Tooli.uk.'],
];

function BirminghamCompareSuppliersBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-[#030213]">Birmingham Tool Hire at a Glance</h2>
        <ul className="space-y-2">
          {[
            'Postcode coverage: B1–B45, Solihull (B90–B95), Sandwell (B65–B71), parts of Wolverhampton (WV)',
            'Rates: broadly similar to North of England — 5–10% below London for most equipment classes',
            'Key sectors: commercial redevelopment (Big City Plan), residential renovation (Edwardian/inter-war stock)',
            'Same-day delivery: available from Erdington, Sparkbrook, and Aston depots for smaller plant',
            'Commonwealth Games legacy: ongoing regeneration in Perry Barr and Smethwick areas',
            'Tool hire comparison: Tooli.uk compares quotes from depots across the West Midlands network',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-medium text-gray-700">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <H2>Tool &amp; Plant Hire Prices in Birmingham 2026</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Equipment</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Day Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Week Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Notes</th>
            </tr>
          </thead>
          <tbody>
            {bhamComparePriceTable.map(([equip, day, week, notes], i) => (
              <tr key={equip} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{equip}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{day}</td>
                <td className="px-4 py-3 text-gray-700">{week}</td>
                <td className="px-4 py-3 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">*VAT-inclusive guidance. Compare live Birmingham quotes on Tooli.uk.</p>

      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Birmingham Tool Hire Prices</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — local suppliers across Birmingham, Solihull, Sandwell, and the West Midlands.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>

      <Link
        to="/blog/tool-hire-comparison-uk"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire Comparison UK: Compare Construction Equipment &amp; Plant Hire Suppliers</span>
      </Link>

      <img
        src="/images/blog/tool-hire-birmingham-compare-prices.webp"
        alt="Mini digger on hire in a rear garden in Moseley Birmingham B13 during a patio and landscaping project"
        className="w-full rounded-2xl object-cover"
      />

      <H2>Areas and Postcodes We Cover in Birmingham</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Area</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Postcode(s)</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Local Notes</th>
            </tr>
          </thead>
          <tbody>
            {bhamCompareAreaTable.map(([area, postcode, notes], i) => (
              <tr key={area} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{area}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{postcode}</td>
                <td className="px-4 py-3 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</span>
      </Link>

      <H2>Birmingham's Construction Landscape</H2>
      <H3>Big City Plan and City Centre Regeneration</H3>
      <Prose>
        The Birmingham Big City Plan — approved in 2011 and continuously extended — is the UK's largest
        city-centre masterplan. The construction activity it drives in B1–B5 is substantial: office blocks, hotel
        conversions, retail-to-residential, and associated infrastructure works create ongoing demand for plant,
        temporary power, access equipment, and site welfare across the city core.
      </Prose>

      <Link
        to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained</span>
      </Link>

      <H3>Commonwealth Games 2022 Legacy</H3>
      <Prose>
        The Perry Barr redevelopment and associated road infrastructure works in Handsworth and Smethwick are
        generating continued construction activity in the B20–B43 and B66–B68 postcode corridor. Groundwork and
        civil hire demand in this area remains elevated.
      </Prose>

      <H3>Residential Stock and Renovation</H3>
      <Prose>
        Birmingham's residential fabric is dominated by inter-war semi-detached housing (1930s Wimpey and Taylor
        Woodrow builds) across the B14–B28 suburban arc, and Victorian/Edwardian terraces in the inner-city
        postcodes B11–B13. Block paving driveway installation is one of the highest-volume single hire trigger
        activities in Birmingham — wacker plates and mini diggers see significant seasonal peaks from March
        through October.
      </Prose>

      <Link
        to="/blog/mini-digger-hire-london-prices-local-availability"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Mini Digger Hire London: Prices &amp; Local Availability</span>
      </Link>

      <H2>Delivery Times and Weekend Availability in Birmingham</H2>
      <CheckList items={[
        'Same-day: available from Erdington (B23) and Sparkbrook (B11) depots for smaller plant and tools.',
        'Next-day: reliable across all B postcodes and Solihull (B90–B93) from most Birmingham depots.',
        'Saturday: most Birmingham hire depots operate Saturday 7am–12pm. Some run until 1pm.',
        'Sunday: generally not available from most Birmingham depots — confirm before relying on Sunday collection.',
        'Solihull and further: delivery charges apply from central Birmingham depots to outer Solihull and Sandwell — factor into your total comparison on Tooli.uk.',
      ]} />

      <Link
        to="/blog/do-i-need-a-permit-for-a-skip-on-the-road-the-direct-answer"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Do I Need a Permit for a Skip on the Road? The Direct Answer</span>
      </Link>

      <H2>Trade Accounts and VAT Receipts in Birmingham</H2>
      <Prose>
        Most major West Midlands hire depots offer trade accounts for regular users with 30-day payment terms.
        One-off hirers need photo ID and a card for the deposit — no trade account required. VAT receipts are
        standard from all depots for any business or trade hire.
      </Prose>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">How Tool Hire Comparison Actually Saves Your Money (And How to Do It Properly)</span>
      </Link>

      <Link
        to="/blog/tool-hire-london"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire in London: Compare Prices From Local Suppliers</span>
      </Link>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-bold text-[#030213]">Useful Birmingham Resources</p>
        <ul className="space-y-2">
          <li>
            <a href="https://www.birmingham.gov.uk/bigcityplan" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Birmingham City Council — Big City Plan
            </a>
            <span className="text-sm text-gray-600"> — The masterplan document for Birmingham city centre regeneration — useful for understanding construction pipeline</span>
          </li>
          <li>
            <a href="https://www.birmingham.gov.uk/planning" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Birmingham City Council — Planning Applications
            </a>
            <span className="text-sm text-gray-600"> — Live planning applications across all B postcodes</span>
          </li>
          <li>
            <a href="https://www.wmca.org.uk" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              West Midlands Combined Authority — Construction Sector
            </a>
            <span className="text-sm text-gray-600"> — WMCA economic data and construction investment pipeline for the West Midlands region</span>
          </li>
        </ul>
      </div>

      <FaqSection faqs={bhamCompareFaqs} />

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Ready to Hire in Birmingham?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <a href="/search" className="font-bold text-white underline">compare now</a>{' '}
          — local suppliers across Birmingham, Solihull, Sandwell, and the wider West Midlands.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>
    </>
  );
}

/* Article 45 — Mini Digger Hire Birmingham: Prices & Local Availability */

const bhamDiggerPriceTable: [string, string, string, string, string][] = [
  ['0.8t micro digger', '£90–£160', '£145–£250', '£350–£510', '£55–£85'],
  ['1.5t mini digger', '£145–£210', '£225–£325', '£460–£650', '£65–£100'],
  ['3t mini digger', '£200–£290', '£305–£445', '£620–£900', '£75–£120'],
  ['5t midi digger', '£270–£400', '£415–£615', '£840–£1,240', '£90–£150'],
];

const bhamDiggerJobTable: [string, string, string][] = [
  ['Block paving driveway excavation (1–2 cars)', '1.5t', 'The single most common mini digger hire trigger in Birmingham — old tarmac removal'],
  ['Side passage / tight access on semi', '0.8t', '1930s semi-detached side passages typically 800–900mm — 0.8t fits, 1.5t may not'],
  ['Rear extension foundations (single-storey)', '1.5t', 'Standard strip foundation — 700–900mm depth, 1.5t handles this comfortably'],
  ['Rear extension foundations (two-storey, deeper)', '3t', 'Deeper and wider strip — 3t\'s greater depth and reach needed'],
  ['Garden clearance and reshaping', '1.5t', 'Common across Sutton Coldfield and Solihull garden redesigns'],
  ['Drainage / soakaway installation', '1.5t', 'Standard depth — 1.5t efficient for residential drainage across B postcodes'],
  ['Perry Barr / Handsworth groundworks', '3t', 'Regeneration zone — commercial and infrastructure scale requires 3t minimum'],
];

const bhamDiggerFaqs: Faq[] = [
  ['How much does mini digger hire cost in Birmingham?', 'A 0.8-tonne micro digger in Birmingham costs approximately £90–£160 per day. A 1.5-tonne machine — the most commonly hired size for driveway and extension work — is £145–£210/day. A 3-tonne machine runs £200–£290/day. Compare current local rates on Tooli.uk.'],
  ['Can a mini digger fit through a Birmingham 1930s semi side passage?', 'A micro digger (0.8t, 750–850mm wide) fits most 1930s semi-detached side passages in Birmingham, which are typically 800–900mm. A standard 1.5-tonne machine (990–1,200mm wide) will not fit through most passages of this width. Measure the narrowest point before booking — gate posts, meter boxes, and outbuildings all reduce effective clearance.'],
  ['Which Birmingham postcode has the most mini digger hire demand?', 'Block paving driveway work drives the highest volume of mini digger hire across B14, B28, and B72–B74 (Kings Heath, Yardley Wood, Sutton Coldfield) — all areas with high concentrations of 1930s semi-detached housing where front garden paving is a popular home improvement.'],
  ['Is same-day mini digger hire available in Birmingham?', 'For 0.8t and 1.5t machines, same-day delivery is possible from Erdington (B23) and Sparkbrook (B11) depots if you book before 9–10am. For 3t+ machines, 24–48 hours\' notice is standard.'],
  ['Do I need a CPCS card to hire a mini digger in Birmingham?', 'Not for domestic use on private land. Hire depots do not require a CPCS card from private hirers. On managed commercial sites across Birmingham (including the Big City Plan zone), CPCS A59 is required by most principal contractors.'],
];

function BirminghamDiggerHireBody() {
  return (
    <>
      {/* At a Glance */}
      <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-[#030213]">Birmingham Mini Digger Hire at a Glance</h2>
        <ul className="space-y-2">
          {[
            '0.8t micro digger: £90–£160/day — tight side passages on 1930s semis and Victorian terraces',
            '1.5t mini digger: £145–£210/day — most popular size for Birmingham driveway and extension work',
            '3t mini digger: £200–£290/day — foundation work, drainage, commercial sites',
            'Delivery: typically £55–£120 return from Birmingham depots',
            'Same-day: available from Erdington (B23) and Sparkbrook (B11) depots for 0.8t and 1.5t',
            'No CPCS card needed on private land — required on managed Birmingham commercial sites',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-medium text-gray-700">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <H2>Mini Digger Hire Prices in Birmingham 2026</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Size Class</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Day Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Weekend Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Week Rate</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Delivery (return)</th>
            </tr>
          </thead>
          <tbody>
            {bhamDiggerPriceTable.map(([size, day, weekend, week, delivery], i) => (
              <tr key={size} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{size}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{day}</td>
                <td className="px-4 py-3 text-gray-700">{weekend}</td>
                <td className="px-4 py-3 text-gray-700">{week}</td>
                <td className="px-4 py-3 text-gray-600">{delivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">*VAT-inclusive guidance. Compare Birmingham rates on Tooli.uk.</p>

      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Compare Birmingham Mini Digger Prices</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode to{' '}
          <span className="font-bold text-white">compare now</span>{' '}
          — local suppliers across Birmingham, Solihull, Sandwell, and the West Midlands.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
        </Link>
      </section>

      <Link
        to="/blog/tool-hire-birmingham-compare-prices-from-local-suppliers"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire in Birmingham: Compare Prices From Local Suppliers</span>
      </Link>

      <H2>Birmingham Mini Digger Jobs: Project to Machine Size</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-brand-primary/20 bg-brand-primary/5">
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Project Type</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Recommended Size</th>
              <th className="px-4 py-3 text-left font-bold text-[#030213]">Birmingham Context</th>
            </tr>
          </thead>
          <tbody>
            {bhamDiggerJobTable.map(([job, size, context], i) => (
              <tr key={job} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#030213]">{job}</td>
                <td className="px-4 py-3 font-bold text-brand-primary">{size}</td>
                <td className="px-4 py-3 text-gray-600">{context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/blog/tool-hire-comparison-uk"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Tool Hire Comparison UK: Compare Construction Equipment &amp; Plant Hire Suppliers</span>
      </Link>

      <img
        src="/images/blog/mini-digger-hire-birmingham-prices.webp"
        alt="1.5-tonne mini digger excavating an old tarmac driveway in Sutton Coldfield Birmingham B73 — block paving preparation"
        className="w-full rounded-2xl object-cover"
      />

      <H2>Access Across Birmingham's Housing Stock</H2>
      <H3>1930s Semi-Detached (B14, B28, B72, B73, B74)</H3>
      <Prose>
        Birmingham's dominant suburban housing type is the inter-war semi-detached — typically with a side passage
        of 800–900mm between the house and the boundary wall. This is tight for a 1.5-tonne mini digger (transport
        width 990–1,200mm). The 0.8-tonne micro digger at 750–850mm is the correct machine for this access type.
        Confirm the narrowest point of the passage — including any buttresses, gas meter boxes, or gate posts —
        before booking.
      </Prose>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <p className="text-sm font-medium">
          <strong>Measure before booking:</strong> Always measure the narrowest point of your access route, not just
          the gate opening. Pipework, meter boxes, and brick reveals often reduce effective clearance by 50–100mm
          beyond what the opening suggests.
        </p>
      </div>

      <H3>Victorian and Edwardian Terraces (B11, B12, B13, B19)</H3>
      <Prose>
        The inner Birmingham terraces of Moseley, Balsall Heath, Sparkbrook, and Handsworth have rear-entry access
        via a shared entry or back lane. Back lanes in Birmingham are generally 2–3 metres wide, which accommodates
        a 1.5-tonne machine. Confirm lane surface condition and width before delivery.
      </Prose>

      <Link
        to="/blog/mini-digger-hire-london-prices-local-availability"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Mini Digger Hire London: Prices &amp; Local Availability</span>
      </Link>

      <H3>Solihull Detached (B90–B93)</H3>
      <Prose>
        Solihull's detached housing typically has wider side access and more room to manoeuvre. 1.5-tonne and
        3-tonne machines are generally accessible here without micro digger compromise.
      </Prose>

      <Link
        to="/blog/skip-hire-sizes-prices-uk-full-comparison-2026"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Skip Hire Sizes &amp; Prices UK: Full Comparison 2026</span>
      </Link>

      <Link
        to="/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained</span>
      </Link>

      <Link
        to="/blog/do-i-need-a-permit-for-a-skip-on-the-road-the-direct-answer"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">Do I Need a Permit for a Skip on the Road? The Direct Answer</span>
      </Link>

      <Link
        to="/blog/tool-hire-comparison-save-money"
        className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 transition-colors hover:bg-brand-primary/10"
      >
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-primary" />
        <span className="text-sm font-bold text-brand-primary">How Tool Hire Comparison Actually Saves Your Money (And How to Do It Properly)</span>
      </Link>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-bold text-[#030213]">Useful Resources</p>
        <ul className="space-y-2">
          <li>
            <a href="https://cpcs.uk.com/categories" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              CPCS — Category A59 (360° Excavator)
            </a>
            <span className="text-sm text-gray-600"> — CPCS card for Birmingham-based commercial site mini digger operators</span>
          </li>
          <li>
            <a href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              HSE PUWER — Operator Competence
            </a>
            <span className="text-sm text-gray-600"> — PUWER competence requirement applies to all mini digger operators</span>
          </li>
          <li>
            <a href="https://www.cpa.uk.net" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-primary hover:underline">
              Construction Plant-hire Association (CPA)
            </a>
            <span className="text-sm text-gray-600"> — CPA-member depots across the West Midlands — Birmingham area suppliers</span>
          </li>
        </ul>
      </div>

      <FaqSection faqs={bhamDiggerFaqs} />

      {/* CTA */}
      <section className="rounded-2xl bg-brand-primary p-8 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold">Ready to Hire a Mini Digger in Birmingham?</h2>
        <p className="mb-6 text-base font-medium leading-relaxed text-white/75 md:text-lg">
          Enter your postcode on Tooli.uk to{' '}
          <a href="/search" className="font-bold text-white underline">compare now</a>{' '}
          — local suppliers across Birmingham, Solihull, Erdington, and the wider West Midlands.
        </p>
        <Link
          to="/search"
          className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-bold text-brand-primary transition-colors hover:bg-gray-100"
        >
          Compare Now
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
  {
    slug: 'tool-hire-birmingham',
    category: 'Local Tool Hire',
    title: 'Tool Hire in Birmingham: Compare Prices From Local Suppliers',
    excerpt:
      'Birmingham is one of the busiest hire markets in the UK. Two depots a mile apart can quote very differently for the same machine — here\'s how to compare across all B postcodes and get the best deal.',
    intro:
      'Need tool hire in Birmingham this week? Tooli.uk compares quotes from local and national hire suppliers across the city, from Digbeth and Aston up to Erdington, Sutton Coldfield and out towards Solihull.',
    image: '/images/blog/tool-hire-birmingham.webp',
    imageAlt: 'Tool and plant hire comparison in Birmingham — compare prices from local suppliers on Tooli.uk',
    datePublished: '2026-07-02',
    metaTitle: 'Tool Hire Birmingham | Compare Local Suppliers | Tooli.uk',
    metaDescription:
      'Compare tool hire in Birmingham across trusted local and national suppliers. Diggers, breakers, access and more. Get quotes in minutes on Tooli.uk.',
    primaryCta: 'Compare Birmingham Tool Hire',
    faqs: birminghamFaqs,
    Body: BirminghamToolHireBody,
  },
  {
    slug: 'tool-hire-sw19-london-postcode-area-guide',
    category: 'Local Tool Hire',
    title: 'Tool Hire SW19: London Postcode Area Guide',
    excerpt:
      'SW19 sits in several depots\' delivery zones across Merton, Wandsworth and Kingston, so comparison genuinely pays here. Micro diggers, breakers, wacker plates and sanders — here\'s what locals hire most and how delivery works.',
    intro:
      'Need tool hire in SW19? The postcode covers Wimbledon, Wimbledon Park, South Wimbledon, Merton Park and Colliers Wood, and it\'s served by hire depots across South West London rather than a single local yard.',
    image: '/images/blog/tool-hire-sw19.webp',
    imageAlt: 'Tool hire SW19 Wimbledon — London postcode area guide for local tool and plant hire',
    datePublished: '2026-07-02',
    metaTitle: 'Tool Hire SW19 | Wimbledon Area Suppliers | Tooli.uk',
    metaDescription:
      'Compare tool hire in SW19 from suppliers serving Wimbledon, South Wimbledon and Merton. Diggers, breakers, towers and more. Free quotes on Tooli.uk.',
    primaryCta: 'Compare SW19 Tool Hire',
    faqs: sw19FaqData,
    Body: SW19ToolHireBody,
  },
  {
    slug: 'mini-digger-hire-london-prices-local-availability',
    category: 'Plant Hire Guide',
    title: 'Mini Digger Hire London: Prices & Local Availability',
    excerpt:
      'From 0.8 t micro diggers that fit through a garden doorway to 3 t machines for serious groundworks, here\'s how mini digger hire pricing and availability work across all 32 London boroughs.',
    intro:
      'Looking for a mini digger hire in London? Tooli.uk compares quotes from hire depots across all 32 boroughs, from 0.8 tonne micro diggers that fit through a garden doorway to 3 tonne machines for serious groundworks. Every supplier sets its own rates, so the same machine can be quoted very differently a few miles apart, and comparing is the only reliable way to pin down the best price.',
    image: '/images/blog/mini-digger-hire-london.webp',
    imageAlt: 'Mini digger hire London — compare prices from local suppliers on Tooli.uk',
    datePublished: '2026-07-08',
    metaTitle: 'Mini Digger Hire London | Compare Local Rates | Tooli.uk',
    metaDescription:
      'Compare mini digger hire in London from local suppliers. 0.8 t micro to 3 t machines, fast delivery across all zones. Get quotes free on Tooli.uk.',
    primaryCta: 'Compare Mini Digger Hire',
    faqs: miniDiggerLondonFaqs,
    Body: MiniDiggerLondonBody,
  },
  {
    slug: 'plant-hire-london-compare-local-plant-hire-companies',
    category: 'Local Tool Hire',
    title: 'Plant Hire London: Compare Local Plant Hire Companies',
    excerpt:
      'London has dozens of plant hire companies — nationals with M25 depots and independent yards that have served the same boroughs for decades. Here\'s how to compare them properly and avoid paying over the odds.',
    intro:
      'Plant hire in London means choosing between dozens of companies, from national chains with depots ringing the M25 to independent yards that have served the same boroughs for decades. Tooli.uk compares them in one search.',
    image: '/images/blog/plant-hire-london.webp',
    imageAlt: 'Plant hire London — compare local plant hire companies across all boroughs on Tooli.uk',
    datePublished: '2026-07-08',
    metaTitle: 'Plant Hire London | Compare Local Companies | Tooli.uk',
    metaDescription:
      'Compare plant hire in London across local and national companies. Diggers, dumpers, rollers, telehandlers and access kit. Free quotes on Tooli.uk.',
    primaryCta: 'Compare London Plant Hire',
    faqs: plantHireLondonFaqs,
    Body: PlantHireLondonBody,
  },
  {
    slug: 'mini-digger-hire-birmingham-prices-and-local-availability',
    category: 'Plant Hire',
    title: 'Mini Digger Hire Birmingham: Prices & Local Availability',
    excerpt:
      'Compare mini digger hire across Birmingham B postcodes. Micro to 3 t machines, delivery to Selly Oak, Erdington, Sutton Coldfield and beyond.',
    intro:
      'Mini digger hire in Birmingham spans the full range — from 0.8 t micro machines that thread through Victorian terrace entries to 3 t diggers for open-site muck-shifts. This guide covers what moves the price, which size fits your job, and how to compare Birmingham suppliers quickly on Tooli.uk.',
    image: '/images/blog/tool-hire-birmingham.webp',
    imageAlt: 'Mini digger hire in Birmingham — compare local suppliers and prices on Tooli.uk',
    datePublished: '2026-07-08',
    metaTitle: 'Mini Digger Hire Birmingham | Compare Suppliers | Tooli.uk',
    metaDescription:
      'Compare mini digger hire in Birmingham from local suppliers. 0.8 t micro to 3 t machines, delivery across all B postcodes. Free quotes on Tooli.uk.',
    primaryCta: 'Compare Birmingham Digger Hire',
    faqs: miniDiggerBirminghamFaqs,
    Body: MiniDiggerBirminghamBody,
  },
  {
    slug: 'plant-hire-birmingham-compared-local-plant-hire-companies',
    category: 'Plant Hire',
    title: 'Plant Hire Birmingham: Compare Local Plant Hire Companies',
    excerpt:
      'Compare plant hire companies across Birmingham — local independents and national chains. Diggers, dumpers, telehandlers and access kit for every B postcode.',
    intro:
      'Plant hire in Birmingham is a competitive market: national chains, established city depots and Black Country independents all deliver into the same postcodes. Tooli.uk compares them in one search. Enter your postcode, choose the machine and dates, and get quotes from multiple Birmingham plant hire companies side by side.',
    image: '/images/blog/tool-hire-birmingham.webp',
    imageAlt: 'Plant hire comparison in Birmingham — compare local and national suppliers on Tooli.uk',
    datePublished: '2026-07-08',
    metaTitle: 'Plant Hire Birmingham | Compare Local Companies | Tooli.uk',
    metaDescription:
      'Compare plant hire in Birmingham across local and national companies. Diggers, dumpers, telehandlers and access kit. Get free quotes fast on Tooli.uk.',
    primaryCta: 'Compare Birmingham Plant Hire',
    faqs: plantHireBirminghamFaqs,
    Body: PlantHireBirminghamBody,
  },
  {
    slug: 'tool-hire-b1-birmingham-postcode-area-guide',
    category: 'Tool Hire',
    title: 'Tool Hire B1: Birmingham Postcode Area Guide',
    excerpt:
      'Compare tool hire in B1 from suppliers delivering to Broad Street, Brindleyplace and Centenary Square. Scissor lifts, breakers, dust extraction and more.',
    intro:
      "Need tool hire in B1? The postcode covers the western side of Birmingham city centre, taking in Broad Street, Brindleyplace, Centenary Square and the canalside developments towards Ladywood. It's a commercial-heavy patch served by depots ringing the city rather than sitting inside it, and it falls entirely within the Clean Air Zone. Tooli.uk compares quotes from every supplier delivering into B1 in one search, so you get the best total for the job, delivery included.",
    image: '/images/blog/tool-hire-birmingham.webp',
    imageAlt: 'Tool hire comparison for B1 Birmingham city centre — compare local suppliers on Tooli.uk',
    datePublished: '2026-07-08',
    metaTitle: 'Tool Hire B1 | Birmingham City Centre Guide | Tooli.uk',
    metaDescription:
      'Compare tool hire in B1 from suppliers serving Birmingham city centre, Broad Street and Brindleyplace. Access kit, breakers and more. Quotes on Tooli.uk.',
    primaryCta: 'Compare B1 Tool Hire',
    faqs: toolHireB1Faqs,
    Body: ToolHireB1Body,
  },
  {
    slug: 'mini-digger-hire-uk-prices-and-sizes-compared',
    category: 'Mini Digger Hire',
    title: 'Mini Digger Hire UK: Prices & Sizes Compared',
    excerpt:
      'Day, week and monthly hire rates for 0.8t micro diggers to 8t machines, with a size selector, jobs guide and delivery cost breakdown. Compare UK suppliers on Tooli.uk.',
    intro:
      'Mini digger hire in the UK runs from around £100 to £350 per day depending on the size of machine you need. Micro diggers (0.8 tonne) suit tight-access garden jobs. 1.5-tonne machines are the most popular all-rounder. Three-tonne diggers are the standard choice for foundation work and serious groundworks. This guide covers UK hire rates by size class, what each machine can do, how to choose the right one, and what to check before you book.',
    image: '/images/blog/mini-digger-hire-uk.webp',
    imageAlt: 'Mini digger hire UK — prices and sizes compared on Tooli.uk',
    datePublished: '2026-07-16',
    metaTitle: 'Mini Digger Hire UK: Prices & Sizes Compared | Tooli.uk',
    metaDescription:
      'Compare mini digger hire prices across the UK by size. Day, week & month rates for 0.8t to 5t excavators. Compare suppliers on Tooli.uk.',
    primaryCta: 'Compare Mini Digger Hire',
    faqs: miniDiggerUKFaqs,
    Body: MiniDiggerUKBody,
  },
  {
    slug: 'mini-digger-hire-cost-uk-2026-price-guide',
    category: 'Mini Digger Hire',
    title: 'Mini Digger Hire Cost UK: What You\'ll Pay in 2026',
    excerpt:
      '2026 price guide covering day, weekend, week and month rates by size — plus delivery, fuel, deposit and damage waiver costs. Compare quotes on Tooli.uk.',
    intro:
      'Hiring a mini digger in the UK costs between £100 and £500 per day in 2026, depending on the size of the machine. A 1.5-tonne digger — the most commonly hired size for garden and residential work — typically runs £160–£230 per day. A 3-tonne machine for groundworks or foundations comes in at £220–£320 per day. This guide breaks down every cost you\'ll face: hire rates, delivery charges, fuel, insurance, and deposits — so you know the total bill before you book.',
    image: '/images/blog/mini-digger-hire-cost-uk-infographic.webp',
    imageAlt: 'Mini digger hire cost UK 2026 — price guide by size on Tooli.uk',
    datePublished: '2026-07-16',
    metaTitle: 'Mini Digger Hire Cost UK 2026: Day, Week & Month Rates | Tooli.uk',
    metaDescription:
      'How much does it cost to hire a mini digger in the UK? 2026 price guide covering day, weekend, week & month rates by size. Compare quotes on Tooli.uk.',
    primaryCta: 'Compare Mini Digger Costs',
    faqs: miniDiggerCostFaqs,
    Body: MiniDiggerCostUKBody,
  },
  {
    slug: 'do-i-need-licence-to-operate-mini-digger',
    category: 'Mini Digger Hire',
    title: 'Do I Need a Licence to Operate a Mini Digger? The Honest Answer',
    excerpt:
      'No formal licence is needed on private land — but PUWER requires competence, and a CPCS card is mandatory on commercial sites. Here\'s exactly what applies to you.',
    intro:
      'No — there is no legal requirement for a formal licence to operate a mini digger on private land for a domestic project in the UK. However, on commercial construction sites, a valid CPCS card is required by most principal contractors. Under PUWER 1998, anyone using work equipment must be competent to do so — which means appropriate training even if you\'re working on your own property.',
    image: '/images/blog/mini-digger-licence.webp',
    imageAlt: 'Mini digger operator on a UK site — do you need a licence to operate a mini digger?',
    datePublished: '2026-07-16',
    metaTitle: 'Do You Need a Licence to Operate a Mini Digger? | Tooli.uk',
    metaDescription:
      'No formal licence is needed to operate a mini digger on private land in the UK — but there are rules. Find out what applies to you.',
    primaryCta: 'Compare Mini Digger Hire',
    faqs: miniDiggerLicenceFaqs,
    Body: MiniDiggerLicenceBody,
  },
  {
    slug: 'mini-digger-buy-or-hire-full-uk-cost-comparison',
    category: 'Mini Digger Hire',
    title: 'Mini Digger: Buy or Hire? Full UK Cost Comparison',
    excerpt:
      'New and used purchase prices, hidden ownership costs, break-even analysis by hire days, and real-world verdicts for homeowners, landscapers and groundworkers.',
    intro:
      'Buying a 1.5-tonne mini digger costs between £12,000 and £25,000 second-hand, or £25,000–£60,000 new. Hiring the same machine runs £160–£230 per day. The break-even point is around 60–125 hire-days of use per year — before maintenance, insurance, storage, and depreciation are counted. This guide runs the numbers properly for UK homeowners and small trade businesses.',
    image: '/images/blog/mini-digger-cost-comparison.webp',
    imageAlt: 'Mini digger buy vs hire full UK cost comparison — breakeven analysis on Tooli.uk',
    datePublished: '2026-07-16',
    metaTitle: 'Buy or Hire a Mini Digger? Full Cost Comparison | Tooli.uk',
    metaDescription:
      'Should you buy or hire a mini digger? Honest cost comparison, breakeven calculator, and the real-world verdict for UK homeowners and tradespeople.',
    primaryCta: 'Compare Mini Digger Hire',
    faqs: buyOrHireFaqs,
    Body: MiniDiggerBuyOrHireBody,
  },
  {
    slug: 'mini-digger-attachments-explained-which-one-do-you-need',
    category: 'Mini Digger Hire',
    title: 'Mini Digger Attachments Explained: Which One Do You Need?',
    excerpt:
      'GP buckets, hydraulic breakers, augers, ditching buckets, grabs and quick hitches — what each attachment does, when to use it, and what to ask your hire depot.',
    intro:
      "A mini digger comes with a standard general-purpose bucket as standard — but that's rarely the best tool for the job. Attachments like breakers, augers, grabs, and ditching buckets can halve your working time and get the result a standard bucket simply can't. Most UK hire depots stock a range of attachments at an additional daily rate.",
    image: '/images/blog/mini-digger-attachments-explained.webp',
    imageAlt: 'Mini digger attachments explained — buckets, breakers, augers and grabs for UK hirers',
    datePublished: '2026-07-16',
    metaTitle: 'Mini Digger Attachments: Buckets, Breakers & More Explained | Tooli.uk',
    metaDescription:
      'Not sure which mini digger attachment you need? Buckets, breakers, augers, grabs — explained for UK hirers. Find the right attachment on Tooli.uk.',
    primaryCta: 'Compare Mini Digger Hire',
    faqs: attachmentsFaqs,
    Body: MiniDiggerAttachmentsBody,
  },
  {
    slug: '1-5-tonne-vs-3-tonne-digger-which-one-do-you-actually-need',
    category: 'Mini Digger Hire',
    title: '1.5 Tonne vs 3 Tonne Digger: Which One Do You Actually Need?',
    excerpt:
      'Side-by-side spec comparison, job-by-job decision guide, and a productivity table showing when the 3t pays for itself. The honest answer before you book.',
    intro:
      'The 1.5-tonne mini digger is the most hired size in the UK — versatile, compact, and the right tool for the majority of residential jobs. The 3-tonne machine digs deeper, reaches further, carries more per bucket load, and gets large jobs done significantly faster. The day-rate difference is typically £60–£90. This guide compares the two machines across the most common UK hire scenarios so you can make the right call before you book.',
    image: '/images/blog/1-5-tonne-vs-3-tonne-digger.webp',
    imageAlt: '1.5 tonne vs 3 tonne digger comparison — which mini digger should you hire for your UK job?',
    datePublished: '2026-07-16',
    metaTitle: '1.5 Tonne vs 3 Tonne Digger: Which Should You Hire? | Tooli.uk',
    metaDescription:
      'Not sure whether to hire a 1.5t or 3t mini digger? This guide settles it. Compare dig depth, reach, bucket size, and job suitability in one place.',
    primaryCta: 'Compare Digger Hire Prices',
    faqs: vs15v3Faqs,
    Body: Digger15v3Body,
  },
  {
    slug: 'how-to-hire-mini-digger-without-cpcs-card-what-you-need-to-know',
    category: 'Compliance & Safety',
    title: 'How to Hire a Mini Digger Without a CPCS Card: What You Need to Know',
    excerpt:
      'You can hire a mini digger in the UK without a CPCS card for private domestic use. Here\'s what you actually need to bring, how the handover works, and when a CPCS card does become a requirement.',
    intro:
      'Yes — you can hire a mini digger in the UK without a CPCS card for private domestic use. Most hire depots do not require a CPCS card from private hirers, and there is no legal requirement to hold one when operating a digger on private land. What you will need is valid photo ID, a deposit held on card, and proof you can operate the machine safely.',
    image: '/images/blog/hire-mini-digger-without-cpcs-card.webp',
    imageAlt: 'Hiring a mini digger without a CPCS card in the UK — what you need to know',
    datePublished: '2026-07-18',
    metaTitle: 'Can You Hire a Mini Digger Without a CPCS Card? | Tooli.uk',
    metaDescription:
      'You don\'t need a CPCS card to hire a mini digger in the UK for private use. Here\'s what you do need, and how to hire safely and legally.',
    primaryCta: 'Compare Mini Digger Hire',
    faqs: cpcsFaqs,
    Body: CpcsHireBody,
  },
  {
    slug: 'scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained',
    category: 'Access Equipment',
    title: 'Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained',
    excerpt:
      'From 2.2 m indoor towers to 12 m+ commercial rigs, here\'s how to pick the right scaffold tower, what PASMA actually requires, and how to compare hire rates across UK suppliers.',
    intro:
      'A scaffold tower is one of the most practical pieces of hired access equipment on UK sites. It sets up quickly, works in tight spaces, and gives you a solid working platform at the height you actually need. Whether you\'re repointing brickwork, clearing gutters, fitting fascias, or painting a gable end, the right tower makes the job safer and faster. This guide covers sizes, what to expect on rates, PASMA rules, and how to compare suppliers on Tooli.uk.',
    image: '/images/blog/scaffold-tower-hire-uk.webp',
    imageAlt: 'Scaffold tower hire UK — prices, sizes and PASMA compliance compared on Tooli.uk',
    datePublished: '2026-07-23',
    metaTitle: 'Scaffold Tower Hire UK: Sizes, Rates & PASMA | Tooli.uk',
    metaDescription:
      'Hiring a scaffold tower in the UK? Compare day, week and month rates, choose the right size, and understand PASMA requirements.',
    primaryCta: 'Compare Scaffold Tower Hire',
    faqs: scaffoldTowerFaqs,
    Body: ScaffoldTowerHireBody,
  },
  {
    slug: 'do-you-need-pasma-to-hire-scaffold-tower-in-the-uk',
    category: 'Compliance & Safety',
    title: 'Do You Need PASMA to Hire a Scaffold Tower in the UK?',
    excerpt:
      'Not to hire one, but almost certainly to use one on a commercial site. Here\'s exactly when PASMA is required, what the course covers, and what the law actually says for trade and DIY use.',
    intro:
      'Short answer: not to hire one, but almost certainly to use one on a commercial site. PASMA training is the UK\'s recognised standard for mobile access tower use, and most principal contractors make it a site requirement. DIY homeowners face no legal card requirement, but the Work at Height Regulations 2005 still apply. Here\'s exactly what applies in each situation.',
    image: '/images/blog/do-you-need-pasma-to-hire-scaffold-tower.webp',
    imageAlt: 'Do you need PASMA to hire a scaffold tower in the UK — rules for tradespeople and DIY homeowners',
    datePublished: '2026-07-23',
    metaTitle: 'Do You Need PASMA to Hire a Scaffold Tower? | Tooli.uk',
    metaDescription:
      'Is a PASMA card required to hire or use a scaffold tower in the UK? Clear rules for tradespeople and DIY homeowners.',
    primaryCta: 'Compare Scaffold Tower Hire',
    faqs: pasmaFaqs,
    Body: PasmaRequirementBody,
  },
  {
    slug: 'cherry-picker-vs-scaffold-tower-which-access-option-do-you-actually-need',
    category: 'Access Equipment',
    title: 'Cherry Picker vs Scaffold Tower: Which Access Option Do You Actually Need?',
    excerpt:
      'Cherry pickers and scaffold towers both get you to height — but they suit very different jobs. Compare cost, height, qualifications and access requirements to pick the right option for your project.',
    intro:
      'Cherry pickers and scaffold towers both get you to height — but they suit very different jobs. A scaffold tower gives you a stable, fixed working platform at low weekly cost. A cherry picker gives you reach, mobility, and the ability to work at angles a tower can\'t match, but costs significantly more per day. The right choice depends on how long you\'re working at height, how often you need to reposition, and how much overhead clearance you have.',
    image: '/images/blog/cherry-picker-vs-scaffold-tower-which-to-hire.webp',
    imageAlt: 'Side-by-side comparison of a scaffold tower and a cherry picker boom lift on a UK construction site',
    datePublished: '2026-07-23',
    metaTitle: 'Cherry Picker vs Scaffold Tower: Which to Hire? | Tooli.uk',
    metaDescription:
      'Cherry picker or scaffold tower — which is right for your job? Honest comparison of cost, height, access, and qualification requirements for UK hirers.',
    primaryCta: 'Compare Access Equipment Hire',
    faqs: cherryPickerFaqs,
    Body: CherryPickerVsScaffoldBody,
  },
  {
    slug: 'ipaf-licence-hire-cherry-picker-hire-what-you-actually-need',
    category: 'Compliance & Safety',
    title: 'IPAF Licence for Cherry Picker Hire: What You Actually Need',
    excerpt:
      'You don\'t need an IPAF card for private domestic use — but on any commercial site it\'s effectively mandatory. Full guide to IPAF PAL card categories 3a and 3b, what training involves, and when it applies to you.',
    intro:
      'You do not need an IPAF card to hire a cherry picker for private domestic use in the UK — hire depots have no legal obligation to demand one. On commercial construction sites, an IPAF PAL card (Powered Access Licence) is effectively mandatory. Category 3b covers boom lifts and cherry pickers; Category 3a covers scissor lifts.',
    image: '/images/blog/ipaf-licence-what-you-need.webp',
    imageAlt: 'Operator in full-body harness operating a cherry picker boom lift on a UK commercial construction site — IPAF PAL card required',
    datePublished: '2026-07-23',
    metaTitle: 'IPAF Licence: What You Need to Hire a Cherry Picker UK | Tooli.uk',
    metaDescription:
      'Do you need an IPAF card to hire a cherry picker in the UK? Full guide to IPAF PAL card categories, training, and when it applies to you.',
    primaryCta: 'Compare Cherry Picker Hire',
    faqs: ipafFaqs,
    Body: IpafLicenceBody,
  },
  {
    slug: 'scaffold-tower-hire-cost-uk-what-you-pay-in-2026',
    category: 'Cost & Project Guides',
    title: 'Scaffold Tower Hire Cost UK: What You\'ll Pay in 2026',
    excerpt:
      'Scaffold tower hire costs £40–£220 per week in 2026. Full breakdown of day, week and monthly rates by tower type and height — plus delivery, damage waiver, and deposit costs.',
    intro:
      'Scaffold tower hire in the UK costs between £40 and £220 per week in 2026, depending on height, width configuration, and hire duration. A standard single-width 4-metre working height tower runs around £55–£85 per week. Double-width and stairway towers for heavier work come in at £110–£200 per week.',
    image: '/images/blog/scaffold-tower-hire-cost.webp',
    imageAlt: 'Standard single-width scaffold tower assembled against a two-storey UK terraced house for gutter cleaning',
    datePublished: '2026-07-23',
    metaTitle: 'Scaffold Tower Hire Cost UK 2026: Day, Week & Month Rates | Tooli.uk',
    metaDescription:
      'How much does scaffold tower hire cost in the UK? 2026 rates for day, week and month by tower height and type. Compare local suppliers on Tooli.uk.',
    primaryCta: 'Compare Scaffold Tower Hire',
    faqs: scaffoldCostFaqs,
    Body: ScaffoldCostBody,
  },
  {
    slug: 'wacker-plate-hire-uk-prices-plate-sizes-compared',
    category: 'Equipment Hire',
    title: 'Wacker Plate Hire UK: Prices & Plate Sizes Compared',
    excerpt:
      'Wacker plate hire costs £45–£160 per day in the UK depending on plate size and type. Guide to choosing between small forward plates and heavy reversible compactors — with a plate-to-job quick reference.',
    intro:
      'Wacker plate hire in the UK runs from around £45 to £130 per day depending on plate size and power source. A small forward-plate compactor (50–60 kg) suits patio slabs and path base preparation. A large reversible plate (300 kg+) handles road-base compaction and thick sub-base layers. Choosing the wrong size is the most common hiring mistake.',
    image: '/images/blog/wacker-plate-hire-uk.webp',
    imageAlt: 'Medium forward wacker plate compacting MOT Type 1 sub-base for a block paving driveway UK',
    datePublished: '2026-07-23',
    metaTitle: 'Wacker Plate Hire UK: Prices & Plate Sizes Compared | Tooli.uk',
    metaDescription:
      'Compare wacker plate hire prices across the UK. Guide to plate sizes, compaction depth, petrol vs diesel, and day rates. Find local suppliers on Tooli.uk.',
    primaryCta: 'Compare Wacker Plate Hire',
    faqs: wackerFaqs,
    Body: WackerPlateBody,
  },
  {
    slug: 'what-size-wacker-plate-do-i-need-for-a-patio-the-direct-answer',
    category: 'Equipment Hire',
    title: 'What Size Wacker Plate Do I Need for a Patio? The Direct Answer',
    excerpt:
      'For most domestic patios a small to medium forward plate (50–150 kg) is correct. This guide matches wacker plate size to sub-base depth, surface type, and patio area with a quick-reference table.',
    intro:
      'For a standard domestic patio — slabs or block paving on a 75–150 mm compacted Type 1 sub-base — a small to medium forward wacker plate weighing 50–150 kg is the right choice. Heavier plates are unnecessary and can over-compact or damage shallow sub-bases. The key decision is sub-base depth, patio area size, and surface material.',
    image: '/images/blog/what-size-wacker-plate.webp',
    imageAlt: 'Small 60 kg forward wacker plate compacting MOT Type 1 sub-base for a residential patio UK',
    datePublished: '2026-07-24',
    metaTitle: 'What Size Wacker Plate Do I Need for a Patio? | Tooli.uk',
    metaDescription:
      'For most patio jobs, a small to medium forward plate (50–150 kg) is the right choice. Here\'s exactly how to match wacker plate size to your patio project.',
    primaryCta: 'Compare Wacker Plate Hire',
    faqs: wackerPatioFaqs,
    Body: WackerPatioSizeBody,
  },
  {
    slug: 'wacker-plate-hire-cost-uk-what-you-pay-in-2026',
    category: 'Cost & Project Guides',
    title: 'Wacker Plate Hire Cost UK: What You\'ll Pay in 2026',
    excerpt:
      'Wacker plate hire costs £45–£160 per day in the UK in 2026. Full breakdown of day, weekend, and week rates by plate class — plus rubber pad, fuel, delivery, and deposit costs with real job examples.',
    intro:
      'Hiring a wacker plate in the UK costs between £45 and £160 per day in 2026 depending on the plate size. A small forward plate (50–75 kg) for patio and path preparation runs £45–£65 per day. A large reversible plate for road base or deep compaction costs £110–£160 per day. Weekend rates offer a saving over two separate day hires.',
    image: '/images/blog/wacker-plate-hire-cost-uk.webp',
    imageAlt: 'Medium forward wacker plate on hire at a residential driveway block paving project UK',
    datePublished: '2026-07-24',
    metaTitle: 'Wacker Plate Hire Cost UK 2026: Day & Weekend Rates | Tooli.uk',
    metaDescription:
      'How much does wacker plate hire cost in the UK? Day and weekend rates by plate size for 2026. Compare local suppliers and save on Tooli.uk.',
    primaryCta: 'Compare Wacker Plate Hire',
    faqs: wackerCostFaqs,
    Body: WackerCostBody,
  },
  {
    slug: 'dehumidifier-hire-uk-prices-which-size-to-choose',
    category: 'Equipment Hire',
    title: 'Dehumidifier Hire UK: Prices & Which Size to Choose',
    excerpt:
      'Industrial dehumidifier hire costs £35–£150 per day in the UK. Full guide to extraction rates, refrigerant vs desiccant, drying times by scenario, and how to match machine size to your building drying job.',
    intro:
      'Industrial dehumidifier hire in the UK costs between £35 and £150 per day depending on the machine\'s extraction capacity. A 20-litre/day unit suits a single damp room or small new-build drying task. A 90-litre/day commercial machine dries a full house or large site in a fraction of the time. Getting the size right is critical — an undersized machine will run continuously without achieving adequate drying.',
    image: '/images/blog/dehumidifier-hire-uk.webp',
    imageAlt: 'Industrial dehumidifier operating in a newly plastered UK new-build house during the drying-out programme',
    datePublished: '2026-07-24',
    metaTitle: 'Dehumidifier Hire UK: Prices & Which Size to Choose | Tooli.uk',
    metaDescription:
      'Compare industrial dehumidifier hire prices across the UK. Guide to extraction rates, drying times, and which size suits your building project. Tooli.uk.',
    primaryCta: 'Compare Dehumidifier Hire',
    faqs: dehumidifierFaqs,
    Body: DehumidifierHireBody,
  },
  {
    slug: 'site-heater-hire-uk-which-type-do-you-need-and-what-does-it-cost',
    category: 'Equipment Hire',
    title: 'Site Heater Hire UK: Which Type Do You Need and What Does It Cost?',
    excerpt:
      'Site heater hire costs £20–£130 per day in the UK. Diesel indirect, propane cabinet, and electric options compared — with a safety guide on CO risk, fuel costs, and a decision table matching heater to job.',
    intro:
      'Keeping a building site warm through a UK winter protects freshly laid concrete and plaster from frost damage, lets trades work safely, and keeps drying programmes on schedule. Site heater hire costs between £30 and £120 per day depending on heater type and output.',
    image: '/images/blog/site-heater-hire-uk.webp',
    imageAlt: 'Large diesel indirect site heater operating inside an unfinished UK building shell during winter construction',
    datePublished: '2026-07-24',
    metaTitle: 'Site Heater Hire UK: Prices & Types Compared 2026 | Tooli.uk',
    metaDescription:
      'Compare site heater hire prices across the UK for 2026. Diesel, propane, and electric options explained. Which type suits your site? Compare on Tooli.uk.',
    primaryCta: 'Compare Site Heater Hire',
    faqs: siteHeaterFaqs,
    Body: SiteHeaterHireBody,
  },
  {
    slug: 'winter-site-kit-heaters-and-dehumidifiers-for-uk-builders',
    category: 'Equipment Hire',
    title: 'Winter Site Kit: Heaters & Dehumidifiers for UK Builders',
    excerpt:
      'A winter site kit pairs a site heater with a dehumidifier to protect concrete, screed, and plasterwork on UK construction sites. Full guide to machine selection, sizing, costs, and safety — with scenario tips for concrete pours, screed drying, and plastering.',
    intro:
      'A UK winter brings frost risk, high humidity, and condensation — all of which threaten freshly laid concrete, screed, and plasterwork. The answer is a matched winter site kit: a site heater to maintain temperature and a dehumidifier to control moisture, working together to keep your programme on track. This guide covers which machines to hire, how to size them, and what each scenario demands.',
    image: '/images/blog/winter-site-kit-heaters-dehumidifiers.webp',
    imageAlt: 'Winter site kit setup inside a UK new-build shell — site heater and industrial dehumidifier protecting freshly laid concrete',
    datePublished: '2026-07-30',
    metaTitle: 'Winter Site Kit: Heaters & Dehumidifiers for UK Builders | Tooli.uk',
    metaDescription:
      'Build a complete winter site kit for UK construction. Guide to pairing site heaters and dehumidifiers for concrete pours, screed drying, and plasterwork. Compare hire prices on Tooli.uk.',
    primaryCta: 'Compare Winter Site Kit Hire',
    faqs: winterKitFaqs,
    Body: WinterSiteKitBody,
  },
  {
    slug: 'skip-hire-sizes-prices-uk-full-comparison-2026',
    category: 'Cost & Project Guides',
    title: 'Skip Hire Sizes & Prices UK: Full Comparison 2026',
    excerpt:
      'Skip hire in the UK costs £90–£650 depending on size. Full 2026 price guide covering mini, midi, builders, maxi and roll-on/roll-off skips — with a waste acceptance table, regional price comparison, permit rules, and tips for getting the best rate.',
    intro:
      'Skip hire in the UK costs between £90 and £650 depending on the skip size and how long you need it. A 2-yard mini skip for a small garden clearance runs around £90–£140. An 8-yard builders skip — the most commonly hired size — costs around £200–£320. A 40-yard roll-on/roll-off skip for large commercial clearances starts from £450. The biggest mistake hirers make is ordering too small, then paying for a second collection.',
    image: '/images/blog/skip-hire-sizes-prices-uk.webp',
    imageAlt: '8-yard builders skip outside a UK terraced house loaded with renovation rubble and timber — skip hire UK',
    datePublished: '2026-07-31',
    metaTitle: 'Skip Hire Sizes & Prices UK: Full Comparison 2026 | Tooli.uk',
    metaDescription:
      'Compare skip hire sizes and prices across the UK. Full guide to mini, midi, builders and maxi skips — costs, capacity, permit rules. Compare on Tooli.uk.',
    primaryCta: 'Compare Skip Hire',
    faqs: skipFaqs,
    Body: SkipHireSizesBody,
  },
  {
    slug: 'what-size-skip-do-i-need-the-practical-uk-guide',
    category: 'Cost & Project Guides',
    title: 'What Size Skip Do I Need? The Practical UK Guide',
    excerpt:
      'The most common skip hire mistake in the UK is ordering too small. This guide matches every project type — from a single bathroom strip-out to a full house renovation — to the right skip size, with volume tables, weight limit guidance, and road permit rules.',
    intro:
      'The most common skip hire mistake in the UK is ordering too small. A 4-yard midi skip for a full bathroom strip-out fills up before you\'ve touched the floor tiles. An 8-yard builders skip handles a full bathroom and kitchen combined with room to spare. This guide matches the right skip size to the right project using real volume estimates — so you hire once, not twice.',
    image: '/images/blog/what-size-skip-do-i-need.webp',
    imageAlt: 'Visual comparison chart of UK skip sizes from 2-yard mini to 40-yard RoRo with dimensions and capacity in cubic yards',
    datePublished: '2026-07-31',
    metaTitle: 'What Size Skip Do I Need? UK Skip Size Guide | Tooli.uk',
    metaDescription:
      'Not sure what size skip to hire? This guide matches skip size to project type for UK homeowners and builders. Avoid hiring too small — and wasting money.',
    primaryCta: 'Compare Skip Hire',
    faqs: skipSizeFaqs,
    Body: WhatSizeSkipBody,
  },
  {
    slug: 'do-i-need-a-permit-for-a-skip-on-the-road-the-direct-answer',
    category: 'Compliance & Safety',
    title: 'Do I Need a Permit for a Skip on the Road? The Direct Answer',
    excerpt:
      'Yes — any skip placed on a public highway in the UK legally requires a council permit under the Highways Act 1980. Full guide to who gets the permit, what it costs by council type, how long it lasts, and the marking requirements under the Builders\' Skips (Markings) Regulations 1984.',
    intro:
      'Yes — if a skip is placed on a public highway in the UK, a skip licence from the local council is legally required. This applies regardless of skip size. The permit is obtained by the hire company on your behalf in most cases — but you need to tell them the skip is going on the road when you book. Skip permits typically cost £25–£75 and are valid for 2–4 weeks.',
    image: '/images/blog/do-i-need-a-permit-for-a-skip-on-the-road.webp',
    imageAlt: 'Skip placed on a UK residential road with required amber reflective markers and flashing warning lights fitted',
    datePublished: '2026-07-31',
    metaTitle: 'Do I Need a Skip Permit for the Road? UK Rules | Tooli.uk',
    metaDescription:
      'Yes — if your skip goes on a public road in the UK, a highway permit is legally required. Here\'s what it costs, who gets it, and what happens if you skip it.',
    primaryCta: 'Compare Skip Hire',
    faqs: skipPermitFaqs,
    Body: SkipPermitBody,
  },
  {
    slug: 'generator-hire-uk-prices-power-output-guide-2026',
    category: 'Equipment Hire',
    title: 'Generator Hire UK: Prices & Power Output Guide 2026',
    excerpt:
      'Generator hire in the UK costs £60–£450 per day depending on kVA output. Full 2026 price guide covering 6 kVA site generators to 250 kVA industrial units — with a step-by-step load calculation guide, 110V vs 240V explained, and diesel fuel cost estimates.',
    intro:
      'Generator hire in the UK costs between £60 and £450 per day depending on power output. A 6 kVA site generator handles a handful of power tools and site lighting. A 60 kVA towable generator powers an entire medium commercial site. The most common hiring mistake is undersizing — which means tripped breakers, damaged tools, and a wasted day.',
    image: '/images/blog/generator-hire-uk.webp',
    imageAlt: 'Towable diesel generator on a UK construction site providing 110V power to tools and site lighting',
    datePublished: '2026-07-31',
    metaTitle: 'Generator Hire UK: Prices & Power Output Guide 2026 | Tooli.uk',
    metaDescription:
      'Compare diesel generator hire prices across the UK. Full guide to kVA output, which size suits your site, day and week rates. Compare on Tooli.uk.',
    primaryCta: 'Compare Generator Hire',
    faqs: generatorFaqs,
    Body: GeneratorHireBody,
  },
  {
    slug: 'what-size-generator-do-i-need-for-power-tools-the-direct-answer',
    category: 'Equipment Hire',
    title: 'What Size Generator Do I Need for Power Tools? The Direct Answer',
    excerpt:
      'Size your generator to the starting surge — not the rated wattage. A 2,000W angle grinder surges to 4,500W at start-up and needs at least an 8 kVA generator. Full tool-by-tool surge reference table, a three-step calculation guide, and quick reference by site setup.',
    intro:
      'For a single corded drill or small circular saw, a 4–6 kVA generator is sufficient. For a typical trade-site setup with two or three power tools running simultaneously, you need 10–15 kVA. The key number is not the tool\'s rated wattage — it is the starting surge current, which is 2–3 times higher. Size your generator to the surge, not the run, or you\'ll trip the breaker every time a motor starts.',
    image: '/images/blog/what-size-generator-do-i-need-for-power-tools.png',
    imageAlt: 'Site worker operating a 110V angle grinder powered from a diesel generator on a UK outdoor construction site',
    datePublished: '2026-07-31',
    metaTitle: 'What Size Generator Do I Need for Power Tools? | Tooli.uk',
    metaDescription:
      'Not sure what generator size to hire for power tools? This guide calculates exactly what you need — from a single drill to a full trade-site setup.',
    primaryCta: 'Compare Generator Hire',
    faqs: genSizeFaqs,
    Body: WhatSizeGeneratorBody,
  },
  {
    slug: 'cut-off-saw-and-disc-cutter-hire-uk-prices-compared',
    category: 'Equipment Hire',
    title: 'Cut-Off Saw & Disc Cutter Hire UK: Prices Compared',
    excerpt:
      'Cut-off saw hire costs £35–£90 per day in the UK. Full 2026 price guide covering petrol and electric disc cutters, floor saws, and masonry bench saws — with blade type guide, COSHH dust control rules, and PUWER abrasive wheel training requirements.',
    intro:
      'Cut-off saw hire in the UK costs between £35 and £90 per day depending on whether the machine is petrol or electric and the blade diameter. Petrol disc cutters are the most commonly hired type — they work without a power source, making them the default choice for roadworks, site clearance, and outdoor masonry cutting. Electric models are quieter and produce no exhaust fumes, making them better suited for indoor or enclosed cutting.',
    image: '/images/blog/cut-off-saw-disc-cutter-hire-uk-prices-compared.webp',
    imageAlt: 'Operator using a petrol cut-off saw with water suppression to cut kerb stone on a UK road — disc cutter hire',
    datePublished: '2026-07-31',
    metaTitle: 'Cut-Off Saw & Disc Cutter Hire UK: Prices Compared 2026 | Tooli.uk',
    metaDescription:
      'Compare cut-off saw and disc cutter hire prices across the UK. Petrol vs electric, blade sizes, abrasive wheel rules. Find local suppliers on Tooli.uk.',
    primaryCta: 'Compare Cut-Off Saw Hire',
    faqs: cutOffSawFaqs,
    Body: CutOffSawHireBody,
  },
  {
    slug: 'abrasive-wheels-regulations-uk-what-hirers-must-know',
    category: 'Compliance & Safety',
    title: 'Abrasive Wheels Regulations UK: What Hirers Must Know',
    excerpt:
      'PUWER 1998 Regulation 9 requires adequate training before anyone mounts, adjusts, or operates abrasive wheel equipment — including hire cut-off saws, disc cutters, and angle grinders. Full guide to what the law requires, what training covers, and what hire depots are and are not obliged to check.',
    intro:
      'Anyone who mounts, adjusts, or operates abrasive wheel equipment — including cut-off saws, disc cutters, angle grinders, and bench grinders — must have received adequate training under PUWER 1998 Regulation 9. This is not a licence or a card system. It is a competence requirement backed by statute. Non-compliance creates personal and employer liability if an accident occurs.',
    image: '/images/blog/abrasive-wheels-regulations-uk-what-hirers-must-know.webp',
    imageAlt: 'Abrasive wheel training course — delegate being shown correct disc mounting procedure on a cut-off saw UK',
    datePublished: '2026-07-31',
    metaTitle: 'Abrasive Wheels Regulations UK: What Hirers Must Know | Tooli.uk',
    metaDescription:
      'PUWER Regulation 9 requires training before using abrasive wheel equipment. Here\'s exactly what applies to cut-off saw and disc cutter hirers in the UK.',
    primaryCta: 'Compare Cut-Off Saw Hire',
    faqs: abrasiveWheelsFaqs,
    Body: AbrasiveWheelsBody,
  },
  {
    slug: 'site-lighting-tower-hire-uk-prices-and-types-compared',
    category: 'Equipment Hire',
    title: 'Site Lighting Tower Hire UK: Prices & Types Compared',
    excerpt:
      'Site lighting tower hire costs £45–£180 per day in the UK. Full 2026 guide to diesel metal halide, LED, and solar-hybrid towers — with lux coverage tables for HSE CDM 2015 compliance, fuel consumption estimates, and a type comparison by site condition.',
    intro:
      'Site lighting tower hire in the UK costs between £45 and £180 per day depending on the type and output. A standard diesel-powered metal halide tower covers approximately 2,000–3,000 m² and is the most widely hired type for UK construction sites, road maintenance, and events. LED towers significantly reduce fuel consumption. Solar-hybrid towers are the right choice for quiet, remote, or environmentally sensitive sites.',
    image: '/images/blog/site-lighting-tower-hire-uk-prices-types.webp',
    imageAlt: 'Four-head diesel LED site lighting tower illuminating a large UK construction site at night',
    datePublished: '2026-08-01',
    metaTitle: 'Site Lighting Tower Hire UK: Prices & Types 2026 | Tooli.uk',
    metaDescription:
      'Compare site lighting tower hire prices across the UK. LED vs metal halide, diesel vs solar, coverage areas and day rates. Compare suppliers on Tooli.uk.',
    primaryCta: 'Compare Lighting Tower Hire',
    faqs: lightingTowerFaqs,
    Body: SiteLightingTowerBody,
  },
  {
    slug: 'mini-dumper-hire-uk-prices-and-capacities-compared',
    category: 'Equipment Hire',
    title: 'Mini Dumper Hire UK: Prices & Capacities Compared',
    excerpt:
      'Mini dumper hire costs £90–£280 per day in the UK. Full 2026 guide to pedestrian, 1-tonne, 2-tonne and 3-tonne tracked dumpers — with payload capacity table, tracked vs wheeled comparison, swivel skip explained, and lawn protection tips.',
    intro:
      'Mini dumper hire in the UK costs between £90 and £280 per day depending on payload capacity. A 500 kg pedestrian dumper is the smallest widely available hire machine — suitable for shifting spoil in tight residential gardens. A 3-tonne tracked dumper is the workhorse for groundworkers and landscapers moving significant volumes of material across site.',
    image: '/images/blog/mini-dumper-hire-uk-prices-capacities-compared.webp',
    imageAlt: '2-tonne tracked mini dumper transporting excavated soil across a UK residential landscaping site',
    datePublished: '2026-08-01',
    metaTitle: 'Mini Dumper Hire UK: Prices & Capacities Compared 2026 | Tooli.uk',
    metaDescription:
      'Compare mini dumper hire prices across the UK. Full guide to tracked vs wheeled, payload capacities, day rates, and licence requirements. Tooli.uk.',
    primaryCta: 'Compare Mini Dumper Hire',
    faqs: miniDumperFaqs,
    Body: MiniDumperHireBody,
  },
  {
    slug: 'do-you-need-a-licence-to-drive-a-site-dumper-the-honest-answer',
    category: 'Compliance & Safety',
    title: 'Do You Need a Licence to Drive a Site Dumper? The Honest Answer',
    excerpt:
      'No formal licence is required to drive a site dumper on private land — but PUWER 1998 requires competence on all land, and a CPCS A09 card is required on most commercial sites. Full guide to when each rule applies, what CPCS A09 covers, and how CPCS differs from CSCS.',
    intro:
      'No — there is no legal requirement to hold a formal driving licence to operate a site dumper on private land. A road driving licence is not required either — site dumpers are not road-legal vehicles. However, on most managed commercial construction sites, operators must hold a valid CPCS card for the dumper category. And under PUWER 1998, all operators must be competent to use the machine safely — on any land.',
    image: '/images/blog/do-you-need-a-licence-to-drive-a-site-dumper.webp',
    imageAlt: 'Site dumper operator on a commercial UK construction site — CPCS A09 card required for commercial site use',
    datePublished: '2026-08-01',
    metaTitle: 'Do You Need a Licence to Drive a Site Dumper? | Tooli.uk',
    metaDescription:
      'No formal licence is required to drive a site dumper on private land. On commercial sites, a CPCS card is required. Here\'s exactly what applies to you.',
    primaryCta: 'Compare Mini Dumper Hire',
    faqs: dumperLicenceFaqs,
    Body: SiteDumperLicenceBody,
  },
  {
    slug: 'tool-hire-sw19-compare-prices-in-wimbledon-and-merton',
    category: 'Location Guides',
    title: 'Tool Hire SW19: Compare Prices in Wimbledon & Merton',
    excerpt:
      'Compare tool hire prices across SW19 — Wimbledon, Colliers Wood, South Wimbledon, and Merton. Equipment rates, delivery rules, skip permits, LEZ guidance, and weekend hire availability from local South London depots.',
    intro:
      'SW19 covers Wimbledon, South Wimbledon, Colliers Wood, and the northern edge of Merton — a dense residential and commercial postcode that sits between the A3 and the South Circular. Tool and plant hire demand here runs year-round, driven by an active domestic renovation market, the ongoing commercial development around the Wimbledon town centre corridor, and landscaping work across the substantial private gardens of the area. This guide covers what to hire, what it costs, and which suppliers serve SW19 reliably.',
    image: '/images/blog/tool-hire-sw19-wimbledon-merton-postcode-area-guide.webp',
    imageAlt: 'Mini digger being operated in a narrow Victorian terraced garden in Wimbledon SW19 — residential tool hire South London',
    datePublished: '2026-08-05',
    metaTitle: 'Tool Hire SW19: Wimbledon & Merton Area | Tooli.uk',
    metaDescription:
      'Compare tool hire prices in SW19 — Wimbledon, Colliers Wood, South Wimbledon and Merton. Local suppliers, delivery times, and equipment guide for SW19 hirers.',
    primaryCta: 'Compare SW19 Tool Hire',
    faqs: sw19WimbledonFaqs,
    Body: SW19WimbledonHireBody,
  },
  {
    slug: 'tool-hire-manchester-compare-prices-from-local-suppliers',
    category: 'Location Guides',
    title: 'Tool Hire in Manchester: Compare Prices From Local Suppliers',
    excerpt:
      'Compare tool and plant hire prices from Manchester suppliers across M1–M23, Salford, Trafford, and Stockport. Day rates 10–15% below London. Mini diggers, scaffold towers, skips, generators, and more — compare on Tooli.uk.',
    intro:
      'Manchester is one of the UK\'s busiest construction markets outside London — with a city centre in near-continuous redevelopment, a sprawling residential belt stretching from Salford to Stockport, and a trade sector serving everything from inner-city high-rise fits to rural-edge landscaping contracts. Whether you\'re a sole-trader groundworker based in Didsbury or a site manager on a Deansgate commercial build, comparing tool hire prices before booking is the single fastest way to cut your project costs.',
    image: '/images/blog/tool-hire-manchester-compare-prices-from-local-suppliers.webp',
    imageAlt: 'Tool hire delivery van arriving at a Victorian terraced house in Manchester for a renovation project — local tool hire Manchester',
    datePublished: '2026-08-05',
    metaTitle: 'Tool Hire in Manchester: Compare Prices From Local Suppliers | Tooli.uk',
    metaDescription:
      'Compare tool and plant hire prices from Manchester suppliers. Coverage across M1–M23, Salford, Trafford, Stockport and beyond. Find the best local rate on Tooli.uk.',
    primaryCta: 'Compare Manchester Tool Hire',
    faqs: manchesterFaqs,
    Body: ManchesterToolHireBody,
  },
  {
    slug: 'mini-digger-hire-manchester-prices-and-local-availability',
    category: 'Plant Hire Guide',
    title: 'Mini Digger Hire Manchester: Prices & Local Availability',
    excerpt:
      'Mini digger hire in Manchester costs £95–£300/day depending on size — 10–15% below London rates. Guide to 0.8t, 1.5t, and 3t machines across Greater Manchester, tight-access Victorian terrace jobs, delivery costs, and same-day availability.',
    intro:
      'Mini digger hire in Manchester costs between £95 and £300 per day depending on machine size — typically 10–15% below London equivalents for the same class of excavator. Greater Manchester has one of the densest networks of plant hire depots in the North of England, with multiple suppliers covering all M postcodes, Salford, and Trafford from central and suburban locations.',
    image: '/images/blog/mini-digger-hire-manchester-prices-and-local-availability.webp',
    imageAlt: '0.8-tonne micro digger working through a Victorian terrace side entry in Manchester — tight-access mini digger hire',
    datePublished: '2026-08-07',
    metaTitle: 'Mini Digger Hire Manchester: Prices & Local Availability | Tooli.uk',
    metaDescription:
      'Compare mini digger hire prices from Manchester suppliers. Local rates for 0.8t to 5t excavators across M postcodes, Salford, and Trafford. Tooli.uk.',
    primaryCta: 'Compare Manchester Digger Hire',
    faqs: manchesterDiggerFaqs,
    Body: ManchesterDiggerHireBody,
  },
  {
    slug: 'plant-hire-manchester-compare-local-plant-hire-companies',
    category: 'Plant Hire Guide',
    title: 'Plant Hire Manchester: Compare Local Plant Hire Companies',
    excerpt:
      'Compare plant hire companies serving Greater Manchester. Excavators, dumpers, telehandlers, road sweepers, and compaction plant — dry hire or with CPCS operator. Full rate guide and comparison tool on Tooli.uk.',
    intro:
      'Plant hire in Manchester covers a different market to general tool hire — excavators, dumpers, telehandlers, road sweepers, and larger compaction equipment rather than hand tools and scaffold towers. Greater Manchester is served by a competitive network of plant hire companies ranging from national depots in Trafford and Salford to independent operators covering specific borough areas.',
    image: '/images/blog/plant-hire-manchester-compare-local-plant-hire-companies.webp',
    imageAlt: '13-tonne tracked excavator on a commercial construction site in Manchester city centre — plant hire Manchester',
    datePublished: '2026-08-07',
    metaTitle: 'Plant Hire Manchester: Compare Local Plant Hire Companies | Tooli.uk',
    metaDescription:
      'Compare plant hire companies serving Manchester and Greater Manchester. Groundwork plant, lifting equipment and site machinery — find the best local rate on Tooli.uk.',
    primaryCta: 'Compare Manchester Plant Hire',
    faqs: manchesterPlantFaqs,
    Body: ManchesterPlantHireBody,
  },
  {
    slug: 'tool-hire-m1-manchester-city-centre-postcode-area-guide',
    category: 'Location Guides',
    title: 'Tool Hire M1: Manchester City Centre Postcode Area Guide',
    excerpt:
      'Compare tool and plant hire in M1 — Manchester city centre, Piccadilly, Northern Quarter, and Ancoats. Generator hire, scaffold towers, site lighting, and fit-out equipment from local suppliers covering M1 and neighbouring M postcodes.',
    intro:
      'M1 covers Manchester\'s commercial and creative core — Piccadilly, the Northern Quarter, Ancoats, and the edge of the city-centre retail district. Construction activity in M1 is predominantly commercial — fit-outs, residential conversions of former industrial buildings, and infrastructure works supporting the city\'s continued growth.',
    image: '/images/blog/tool-hire-m1-manchester-city-centre-postcode-area-guide.webp',
    imageAlt: 'Generator hire powering a fit-out project inside a former warehouse conversion in Ancoats Manchester M1',
    datePublished: '2026-08-07',
    metaTitle: 'Tool Hire M1: Manchester City Centre Area Guide | Tooli.uk',
    metaDescription:
      'Compare tool and plant hire in M1 — Manchester city centre, Piccadilly, Northern Quarter and Ancoats. Local suppliers, delivery rules and hire rates for M1 hirers.',
    primaryCta: 'Compare M1 Tool Hire',
    faqs: m1Faqs,
    Body: M1ToolHireBody,
  },
  {
    slug: 'tool-hire-birmingham-compare-prices-from-local-suppliers',
    category: 'Location Guides',
    title: 'Tool Hire in Birmingham: Compare Prices From Local Suppliers',
    excerpt:
      'Compare tool and plant hire prices from Birmingham suppliers across B1–B45, Solihull, Sandwell, and Wolverhampton. Mini diggers, scaffold towers, wacker plates, skips, generators and more — 5–10% below London rates on most equipment.',
    intro:
      'Birmingham is the UK\'s second-largest city and its most active non-London construction market. The Big City Plan — the UK\'s largest city-centre regeneration scheme — has been reshaping the B1–B5 core for years, while the suburban residential belt from Sutton Coldfield to Bournville generates consistent demand for domestic renovation hire equipment.',
    image: '/images/blog/tool-hire-birmingham-compare-prices-from-local-suppliers.webp',
    imageAlt: 'Tool hire delivery to a 1930s semi-detached house in Sutton Coldfield Birmingham for a driveway replacement project',
    datePublished: '2026-08-07',
    metaTitle: 'Tool Hire in Birmingham: Compare Prices From Local Suppliers | Tooli.uk',
    metaDescription:
      'Compare tool and plant hire prices from Birmingham suppliers. Coverage across B1–B45, Solihull, Sandwell, and Wolverhampton. Find the best local rate on Tooli.uk.',
    primaryCta: 'Compare Birmingham Tool Hire',
    faqs: bhamCompareFaqs,
    Body: BirminghamCompareSuppliersBody,
  },
  {
    slug: 'mini-digger-hire-birmingham-prices-and-local-availability',
    category: 'Plant Hire Guide',
    title: 'Mini Digger Hire Birmingham: Prices & Local Availability',
    excerpt:
      'Mini digger hire in Birmingham costs £90–£290/day depending on size. Guide to 0.8t, 1.5t, and 3t machines across the B postcodes — including tight-access 1930s semi side passages, block paving jobs, and same-day availability from Erdington and Sparkbrook depots.',
    intro:
      'Mini digger hire in Birmingham costs between £90 and £290 per day depending on machine size. The West Midlands has a dense plant hire network with genuine competition between suppliers — which means rates are among the most competitive outside London, and same-day availability from Erdington and Sparkbrook depots is realistic for smaller machines.',
    image: '/images/blog/mini-digger-hire-birmingham-prices-and-local-availability.webp',
    imageAlt: '0.8-tonne micro digger accessing the side passage of a 1930s semi-detached house in Birmingham — tight-access hire West Midlands',
    datePublished: '2026-08-07',
    metaTitle: 'Mini Digger Hire Birmingham: Prices & Local Availability | Tooli.uk',
    metaDescription:
      'Compare mini digger hire prices from Birmingham suppliers. Local rates for 0.8t to 5t excavators across B postcodes, Solihull, and Sandwell. Tooli.uk.',
    primaryCta: 'Compare Birmingham Digger Hire',
    faqs: bhamDiggerFaqs,
    Body: BirminghamDiggerHireBody,
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
      '@id': 'https://www.tooli.uk/blog#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tooli.uk/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.tooli.uk/blog' },
      ],
    },
    {
      '@type': 'Blog',
      '@id': 'https://www.tooli.uk/blog#blog',
      name: 'Tooli UK Blog',
      url: 'https://www.tooli.uk/blog',
      publisher: { '@id': 'https://www.tooli.uk/#organization' },
      blogPost: blogPosts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription,
        url: `https://www.tooli.uk/blog/${post.slug}`,
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
        canonicalUrl="https://www.tooli.uk/blog"
        image="https://www.tooli.uk/images/blog/tool-hire-comparison-uk.png"
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
        canonicalUrl={`https://www.tooli.uk/blog/${post.slug}`}
        image={`https://www.tooli.uk${post.image}`}
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
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
