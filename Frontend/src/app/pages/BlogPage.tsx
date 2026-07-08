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
