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
