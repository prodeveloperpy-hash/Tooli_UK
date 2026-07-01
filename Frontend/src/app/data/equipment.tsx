import { ReactNode } from 'react';

type EquipmentPageData = {
  slug: string;
  name: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedEquipment: Array<{ name: string; path: string }>;
  content: ReactNode;
};

function Section({ children }: { children: ReactNode }) {
  return <section className="space-y-5">{children}</section>;
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-extrabold text-[#030213] md:text-3xl">{children}</h2>;
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-extrabold text-gray-800">{children}</h3>;
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="font-medium leading-relaxed text-gray-500">{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 font-medium text-gray-500">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-[#F8F9FC]">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-extrabold text-gray-800">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-[#F8F9FC]' : 'bg-white'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 font-medium text-gray-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const excavatorFaqs = [
  {
    question: 'Do I need a licence to hire an excavator?',
    answer:
      'Requirements vary depending on where and how the machine is being used. On private land in the UK, no formal licence is legally required. On commercial construction sites, principal contractors may require operators to hold CPCS (Construction Plant Competence Scheme) or NPORS certification. Always check site requirements before booking.',
  },
  {
    question: 'Can homeowners hire excavators?',
    answer:
      'Yes. Many suppliers hire to both businesses and private individuals. You will typically need a valid photo ID and a payment card. No trade account is required for most suppliers.',
  },
  {
    question: 'What size excavator is best for a house extension?',
    answer:
      'Many residential extension projects use 1–3 tonne excavators, depending on site access and excavation requirements. A 1.5-tonne machine is one of the most common choices for residential footings — it balances digging performance with access flexibility.',
  },
  {
    question: 'Can I hire an excavator with an operator?',
    answer:
      'Yes. Many suppliers offer operated hire (with an experienced operator included) as well as self-drive hire options. Operated hire is often preferred for commercial projects or where CPCS certification is required on site.',
  },
  {
    question: 'Is delivery included in the hire price?',
    answer:
      'Delivery arrangements vary between suppliers. Some include delivery within a set radius; others charge based on distance and machine size. Always confirm the total cost including delivery before booking.',
  },
  {
    question: 'Can I hire an excavator for a weekend?',
    answer:
      'Yes. Many suppliers offer Friday-to-Monday weekend hire, weekly hire, and long-term hire options. Weekend rates often work out cheaper per day than booking individual days separately.',
  },
  {
    question: 'What attachments are available with excavator hire?',
    answer:
      'Common attachments include digging buckets, grading buckets, hydraulic breakers, augers, grab buckets, tilt buckets and ripper teeth. Always confirm attachment compatibility with your chosen machine size before booking.',
  },
  {
    question: 'Are tracked excavators better than wheeled ones?',
    answer:
      'Tracked excavators generally provide better stability on uneven, soft or sloped ground. Wheeled excavators offer greater road mobility between locations. For most UK residential and groundwork projects, tracked machines are the standard choice.',
  },
];

const excavatorContent = (
  <>
    <Section>
      <H2>Why Hire an Excavator?</H2>
      <Paragraph>
        Buying an excavator is a significant investment that may not be practical for short-term projects. Hiring provides access to modern, professionally maintained equipment without the costs associated with ownership.
      </Paragraph>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          'Access to the latest equipment',
          'Flexible daily, weekly or long-term hire',
          'No maintenance or servicing costs',
          'Delivery directly to your project',
          'Wide range of machine sizes',
          'Optional attachments for specialist tasks',
          'Operated or self-drive hire options',
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
              <span className="h-2 w-2 rounded-full bg-brand-primary" />
            </span>
            <span className="text-sm font-bold text-gray-700">{item}</span>
          </div>
        ))}
      </div>
      <Paragraph>
        Hiring is suitable for both domestic and commercial projects, whether you need a compact mini digger for a garden or a larger excavator for civil engineering works.
      </Paragraph>
    </Section>

    <Section>
      <H2>What Is an Excavator?</H2>
      <Paragraph>
        An excavator is a hydraulic construction machine designed for digging, lifting and moving materials. Modern excavators consist of four main components:
      </Paragraph>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: 'Undercarriage', desc: 'Tracks or wheels for mobility and stability' },
          { label: 'Rotating Cab', desc: 'Full 360° rotation for maximum reach' },
          { label: 'Boom & Arm', desc: 'Hydraulic arm extending digging reach' },
          { label: 'Bucket / Attachment', desc: 'Interchangeable for different tasks' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-gray-100 bg-[#F8F9FC] p-4">
            <p className="font-extrabold text-gray-900">{c.label}</p>
            <p className="mt-1 text-sm font-medium text-gray-500">{c.desc}</p>
          </div>
        ))}
      </div>
      <Paragraph>
        The hydraulic system enables precise control, making excavators suitable for everything from delicate landscaping work to large-scale earthmoving.
      </Paragraph>
    </Section>

    <Section>
      <H2>Common Uses for Excavators</H2>
      <Paragraph>Excavators are used across a wide range of industries and projects:</Paragraph>
      <img
        src="/images/excavator-4.jpeg"
        alt="JCB excavator hire UK — medium digger loading a site dumper on a residential housing development"
        className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
      />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {[
          'House extension foundations',
          'Garden landscaping',
          'Drainage installation',
          'Utility trenching',
          'Site clearance',
          'Road construction',
          'Demolition support',
          'Pond excavation',
          'Tree stump removal',
          'Agricultural work',
          'Commercial developments',
          'Groundworks',
        ].map((use) => (
          <div key={use} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
            <span className="text-sm font-bold text-gray-700">{use}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section>
      <H2>Types of Excavators Available for Hire</H2>
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">
            0.8–1 Tonne
          </div>
          <H3>Micro Excavators</H3>
          <Paragraph>Designed for restricted access projects where larger machinery cannot reach.</Paragraph>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Ideal For</p>
              <BulletList items={['Small gardens', 'Landscaping', 'Garden rooms', 'Fence posts', 'Drainage', 'Domestic groundwork']} />
            </div>
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Advantages</p>
              <BulletList items={['Fits through many standard garden gates', 'Low ground pressure', 'Easy transportation', 'Minimal site disruption']} />
            </div>
          </div>
        </div>

        <img
          src="/images/excavator-1.jpeg"
          alt="Mini excavator hire UK — Kubota micro digger digging house extension foundations on a residential site"
          className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
        />

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">
            1–2 Tonne
          </div>
          <H3>Mini Excavators</H3>
          <Paragraph>Among the most popular choices for residential builders and landscapers.</Paragraph>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Suitable For</p>
              <BulletList items={['Extension footings', 'Driveway preparation', 'Utility trenches', 'Patio construction', 'General excavation']} />
            </div>
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Advantages</p>
              <BulletList items={['Excellent balance of size and performance', 'Greater digging depth than micro excavators', 'Easy to transport', 'Suitable for confined sites']} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">
            3–8 Tonne
          </div>
          <H3>Medium Excavators</H3>
          <Paragraph>Commonly used by professional contractors for larger construction projects.</Paragraph>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Applications</p>
              <BulletList items={['Housing developments', 'Drainage systems', 'Foundation excavation', 'Commercial groundworks', 'Site preparation']} />
            </div>
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Advantages</p>
              <BulletList items={['Larger bucket capacity', 'Greater reach', 'Higher productivity', 'Improved lifting capability']} />
            </div>
          </div>
        </div>

        <img
          src="/images/excavator-2.jpeg"
          alt="Large excavator hire UK — Volvo EC140 tracked excavator on a large commercial construction site"
          className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
        />

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">
            13 Tonne+
          </div>
          <H3>Large Excavators</H3>
          <Paragraph>Designed for heavy-duty construction and infrastructure projects.</Paragraph>
          <div className="mt-4">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Typical Uses</p>
            <BulletList items={['Commercial developments', 'Road construction', 'Bulk earthmoving', 'Quarry work', 'Demolition support']} />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-500">These machines generally require specialist transportation and experienced operators.</p>
        </div>
      </div>
    </Section>

    <Section>
      <H2>Excavator Size Comparison</H2>
      <DataTable
        headers={['Machine Size', 'Typical Project', 'Site Access', 'Best For']}
        rows={[
          ['0.8–1T', 'Gardens', 'Excellent', 'Homeowners'],
          ['1–2T', 'Extensions', 'Very Good', 'Builders'],
          ['3–8T', 'Groundworks', 'Good', 'Contractors'],
          ['13T+', 'Commercial', 'Limited', 'Civil Engineering'],
        ]}
      />
    </Section>

    <Section>
      <H2>How to Choose the Right Excavator</H2>
      <Paragraph>Before hiring, consider the following factors:</Paragraph>
      <div className="space-y-3">
        {[
          { title: 'Site Access', body: 'Measure gates, pathways and entrances. A larger machine may offer greater productivity but could be unsuitable for restricted access.' },
          { title: 'Digging Depth', body: 'Match the excavator\'s maximum digging depth to your project requirements before booking.' },
          { title: 'Ground Conditions', body: 'Soft ground, clay, gravel and uneven terrain may require tracked machines for improved stability.' },
          { title: 'Attachments', body: 'Specialist attachments can significantly improve efficiency depending on the type of work involved.' },
          { title: 'Hire Duration', body: 'Weekly hire often offers better overall value for longer projects than multiple daily bookings.' },
        ].map((item, i) => (
          <div key={item.title} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-black text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-extrabold text-gray-900">{item.title}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>

    <Section>
      <H2>Popular Excavator Attachments</H2>
      <Paragraph>Attachments increase versatility and reduce the need for additional machinery. Always confirm compatibility before hiring.</Paragraph>
      <img
        src="/images/excavator-3.jpeg"
        alt="Excavator hire attachments UK — digging buckets, grab bucket, hydraulic breaker and auger available for hire"
        className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
      />
      <DataTable
        headers={['Attachment', 'Typical Use']}
        rows={[
          ['Digging Bucket', 'General excavation'],
          ['Grading Bucket', 'Landscaping and levelling'],
          ['Hydraulic Breaker', 'Breaking concrete and rock'],
          ['Auger', 'Drilling holes for posts and piles'],
          ['Grab Bucket', 'Waste handling and material moving'],
          ['Tilt Bucket', 'Precision finishing work'],
          ['Ripper Tooth', 'Breaking up hard or compacted ground'],
        ]}
      />
    </Section>

    <Section>
      <H2>Leading Excavator Manufacturers</H2>
      <Paragraph>Many UK hire companies supply equipment from recognised manufacturers. The manufacturer is only one factor — machine condition, servicing history and suitability are equally important.</Paragraph>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
        {['JCB', 'Kubota', 'Caterpillar', 'Volvo', 'Hitachi', 'Bobcat', 'Komatsu', 'Takeuchi', 'Yanmar'].map((brand) => (
          <div key={brand} className="flex items-center justify-center rounded-xl border border-gray-100 bg-[#F8F9FC] px-3 py-3 text-sm font-extrabold text-gray-700">
            {brand}
          </div>
        ))}
      </div>
    </Section>

    <Section>
      <H2>Who Uses Excavators?</H2>
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          'Building contractors',
          'Groundworkers',
          'Landscapers',
          'Utility companies',
          'Farmers',
          'Demolition contractors',
          'Civil engineers',
          'Local authorities',
          'Self-build homeowners',
          'Property developers',
        ].map((user) => (
          <div key={user} className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-white px-4 py-2.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
            <span className="text-sm font-bold text-gray-700">{user}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section>
      <H2>Delivery and Site Preparation</H2>
      <Paragraph>Preparing your site before delivery helps minimise delays. Before the machine arrives:</Paragraph>
      <div className="space-y-2">
        {[
          'Ensure suitable site access for the delivery vehicle',
          'Remove obstructions from the unloading area',
          'Identify and mark underground utilities',
          'Confirm an adequate unloading area is available',
          'Plan where excavated spoil will be stored',
        ].map((step) => (
          <div key={step} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-700">✓</span>
            <span className="text-sm font-bold text-gray-700">{step}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section>
      <H2>Safety Considerations</H2>
      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
        <p className="mb-3 font-extrabold text-gray-900">Always follow safe working practices when operating an excavator:</p>
        <BulletList
          items={[
            'Wear suitable PPE at all times',
            'Carry out pre-use daily inspections',
            'Check for underground services before digging',
            'Follow manufacturer operating instructions',
            'Keep unauthorised persons clear of the work area',
            'Never exceed the machine\'s rated lifting limits',
            'Only operate equipment if you are competent to do so',
          ]}
        />
        <p className="mt-3 text-sm font-medium text-gray-600">For commercial projects, additional site-specific health and safety requirements may apply under CDM 2015 and PUWER.</p>
      </div>
    </Section>

    <Section>
      <H2>What Influences Excavator Hire Costs?</H2>
      <Paragraph>Hire costs vary depending on several factors. Rather than comparing price alone, consider the overall value offered by each supplier.</Paragraph>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          'Machine size and specification',
          'Hire period (daily, weekly, monthly)',
          'Delivery distance from depot',
          'Attachments required',
          'Seasonal demand',
          'Operated or self-drive hire',
          'Site location and access',
          'Fuel arrangements',
        ].map((factor) => (
          <div key={factor} className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-[#F8F9FC] px-4 py-3">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
            <span className="text-sm font-bold text-gray-700">{factor}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section>
      <H2>How to Compare Excavator Hire Companies</H2>
      <Paragraph>Before making a booking, compare the following across suppliers:</Paragraph>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: 'Hire Rates', desc: 'Daily, weekly and monthly options' },
          { label: 'Machine Availability', desc: 'Right size for your timeline' },
          { label: 'Delivery Charges', desc: 'Total cost to your site' },
          { label: 'Included Attachments', desc: 'What comes with the machine' },
          { label: 'Equipment Age', desc: 'Newer machines mean fewer breakdowns' },
          { label: 'Customer Reviews', desc: 'Service reliability and support' },
          { label: 'Breakdown Support', desc: 'Response time and replacement cover' },
          { label: 'Damage Waiver', desc: 'Cover options and exclusions' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="font-extrabold text-gray-900">{item.label}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section>
      <H2>Frequently Asked Questions</H2>
      <div className="grid gap-4">
        {excavatorFaqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
            <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
            <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section>
      <H2>Compare Excavator Hire with Tooli UK</H2>
      <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
        <Paragraph>
          Choosing the right excavator isn't simply about finding the lowest hire price. The most suitable machine depends on your project requirements, site conditions, access restrictions and hire period.
        </Paragraph>
        <Paragraph>
          Tooli UK helps you compare excavator hire options from multiple UK suppliers, making it easier to find suitable equipment for residential, commercial and civil engineering projects. Compare weekly hire options, equipment specifications and supplier information to make an informed decision before booking.
        </Paragraph>
      </div>
    </Section>
  </>
);

export const equipmentPages: EquipmentPageData[] = [
  {
    slug: 'excavator-hire-uk',
    name: 'Excavator Hire UK',
    path: '/equipment/excavator-hire-uk',
    metaTitle: 'Excavator Hire UK | Compare Mini & Large Digger Hire',
    metaDescription:
      'Compare excavator hire across the UK. Learn about machine sizes, weekly hire, attachments, operator requirements and compare trusted suppliers.',
    canonicalUrl: 'https://www.tooli.uk/equipment/excavator-hire-uk',
    title: 'Excavator Hire UK: Compare Prices From Mini to Large Digger',
    description:
      'Hiring the right excavator can save time, improve productivity and help keep your construction project on schedule. Compare hire options from trusted UK suppliers — residential, commercial and civil engineering.',
    image: '/images/excavator.png',
    imageAlt: 'Excavator hire UK — mini and large digger hire comparison on Tooli UK',
    faqs: excavatorFaqs,
    relatedEquipment: [
      { name: 'Dumper Hire UK', path: '/equipment/dumper-hire-uk' },
      { name: 'Telehandler Hire UK', path: '/equipment/telehandler-hire-uk' },
      { name: 'Compactor Hire UK', path: '/equipment/compactor-hire-uk' },
      { name: 'Scissor Lift Hire UK', path: '/equipment/scissor-lift-hire-uk' },
      { name: 'Generator Hire UK', path: '/equipment/generator-hire-uk' },
    ],
    content: excavatorContent,
  },
  {
    slug: 'dumper-hire-uk',
    name: 'Dumper Hire UK',
    path: '/equipment/dumper-hire-uk',
    metaTitle: 'Dumper Hire UK | Compare Site Dumper Hire Suppliers | Tooli UK',
    metaDescription:
      'Compare dumper hire from trusted UK suppliers. Learn about 0.5T, 1T and 3T site dumpers, machine types, applications, safety and how to choose the right equipment for your project.',
    canonicalUrl: 'https://www.tooli.uk/equipment/dumper-hire-uk',
    title: 'Dumper Hire UK – Compare Site Dumper Hire Suppliers',
    description:
      'Moving heavy materials quickly and safely is essential on any construction, landscaping or groundwork project. Compare site dumper hire from trusted UK suppliers and find the right machine for your project.',
    image: '/images/dumper-3.png',
    imageAlt: 'Dumper hire UK — Thwaites 6-tonne site dumper available for hire across the UK on Tooli UK',
    faqs: [
      {
        question: 'What size dumper is best for landscaping?',
        answer:
          'A 0.5T or 1T dumper is generally suitable for most landscaping projects, depending on access and the volume of material to be moved. The 0.5T is ideal for very tight access, while the 1T provides more capacity for larger gardens and driveways.',
      },
      {
        question: 'Can homeowners hire a dumper?',
        answer:
          'Yes. Many suppliers offer plant hire to both businesses and private individuals. You will typically need a valid photo ID and a payment card. No trade account is required.',
      },
      {
        question: 'Is delivery available?',
        answer:
          'Most suppliers provide delivery and collection services throughout the UK. Delivery charges vary by distance and machine size. Always confirm the total cost including delivery before booking.',
      },
      {
        question: 'Can I hire a dumper for one day?',
        answer:
          'Many suppliers offer flexible hire periods, including daily, weekly and long-term options. Weekend hire (Friday to Monday) is also widely available and often works out cheaper per day than booking individual days.',
      },
      {
        question: 'Do I need an operator?',
        answer:
          'Some suppliers offer self-drive hire, while others can provide experienced operators if required. For domestic and most commercial projects, self-drive hire is the standard option.',
      },
      {
        question: 'What is the difference between a forward tip and a high-tip dumper?',
        answer:
          'A forward tip dumper unloads material directly in front of the machine. A high-tip dumper raises the skip to a greater height, allowing materials to be discharged directly into skips or larger vehicles, reducing manual handling.',
      },
      {
        question: 'Can dumpers operate on muddy ground?',
        answer:
          'Yes. Site dumpers are designed for off-road environments. Tracked dumpers provide additional traction in particularly challenging ground conditions such as wet, soft or uneven terrain.',
      },
      {
        question: 'Should I compare multiple suppliers?',
        answer:
          'Yes. Comparing suppliers allows you to review machine availability, specifications, delivery options and service levels to find the most suitable equipment for your project.',
      },
    ],
    relatedEquipment: [
      { name: 'Excavator Hire UK', path: '/equipment/excavator-hire-uk' },
      { name: 'Telehandler Hire UK', path: '/equipment/telehandler-hire-uk' },
      { name: 'Compactor Hire UK', path: '/equipment/compactor-hire-uk' },
      { name: 'Scissor Lift Hire UK', path: '/equipment/scissor-lift-hire-uk' },
      { name: 'Generator Hire UK', path: '/equipment/generator-hire-uk' },
    ],
    content: (
      <>
        <Section>
          <H2>What is a Site Dumper?</H2>
          <Paragraph>
            A site dumper is a compact off-road vehicle designed to transport loose materials around construction sites. Unlike road-going tipper trucks, site dumpers are built specifically for rough terrain, uneven ground and confined working areas where larger vehicles cannot operate efficiently.
          </Paragraph>
          <Paragraph>
            They are commonly used alongside mini excavators and loaders to move excavated materials around site safely and efficiently. Modern dumpers are available in a range of sizes to suit both domestic and commercial projects.
          </Paragraph>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-5">
            <p className="mb-3 font-extrabold text-gray-900">Typical materials transported:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {['Soil', 'Clay', 'Gravel', 'Sand', 'Hardcore', 'Rubble', 'Concrete waste', 'Drainage stone', 'Landscaping materials', 'General construction waste'].map((m) => (
                <div key={m} className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                  {m}
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <H2>Why Hire a Dumper?</H2>
          <Paragraph>Hiring a dumper provides flexibility without the costs associated with owning plant equipment.</Paragraph>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Access to modern, well-maintained equipment',
              'No servicing or maintenance responsibilities',
              'Flexible daily, weekly and long-term hire',
              'Delivery and collection from most suppliers',
              'Suitable for short and long-term projects',
              'Reduced manual handling on site',
              'Improved productivity and efficiency',
              'No storage requirements after the project',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                  <span className="h-2 w-2 rounded-full bg-brand-primary" />
                </span>
                <span className="text-sm font-bold text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>How to Choose the Right Dumper</H2>
          <Paragraph>Choosing the correct dumper depends on several factors. Hiring a machine that is too small may reduce productivity, while an oversized dumper can be unnecessary for smaller projects.</Paragraph>
          <div className="space-y-3">
            {[
              { title: 'Site Access', body: 'Measure gates, pathways and entrances before selecting a machine size. Compact dumpers offer better manoeuvrability in restricted areas.' },
              { title: 'Volume of Material', body: 'Estimate the total volume to be moved. A larger payload capacity reduces the number of trips required.' },
              { title: 'Ground Conditions', body: 'Soft, muddy or uneven ground may require a tracked dumper for improved stability and traction.' },
              { title: 'Excavator Compatibility', body: 'Match the dumper capacity to your excavator bucket size to maximise loading efficiency.' },
              { title: 'Hire Duration', body: 'Weekly hire often offers better value than multiple daily bookings for projects lasting more than a few days.' },
            ].map((item, i) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-black text-white">{i + 1}</span>
                <div>
                  <p className="font-extrabold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm font-medium text-gray-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Dumper Sizes Available for Hire</H2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">0.5 Tonne</div>
              <H3>0.5 Tonne Dumper Hire</H3>
              <Paragraph>The smallest site dumper available, designed for projects with restricted access. The preferred choice for homeowners and landscapers where space is limited.</Paragraph>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Ideal For</p>
                  <BulletList items={['Garden landscaping', 'Patios', 'Garden rooms', 'Domestic drainage', 'Fence installation', 'Small excavations']} />
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Advantages</p>
                  <BulletList items={['Compact size', 'Excellent manoeuvrability', 'Easy transportation', 'Suitable for narrow access', 'Low ground impact']} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">1 Tonne</div>
              <H3>1 Tonne Dumper Hire</H3>
              <Paragraph>One of the most popular machines available for hire due to its versatility. Provides an excellent balance between payload capacity and ease of operation.</Paragraph>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Suitable For</p>
                  <BulletList items={['House extensions', 'Foundations', 'Driveways', 'Utility trenches', 'Residential groundworks', 'Landscaping']} />
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Advantages</p>
                  <BulletList items={['Increased payload', 'Compact footprint', 'Excellent manoeuvrability', 'Compatible with most mini excavators']} />
                </div>
              </div>
            </div>

            <img
              src="/images/dumper-1.png"
              alt="Dumper hire UK — Thwaites 9-tonne site dumper on a construction groundworks site"
              className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
            />

            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">3 Tonne</div>
              <H3>3 Tonne Dumper Hire</H3>
              <Paragraph>Designed for larger construction and commercial projects where higher payloads are required. Many modern 3T machines feature high-tip skips, allowing material to be unloaded directly into skips or larger vehicles.</Paragraph>
              <div className="mt-4">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-400">Common Applications</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {['Commercial developments', 'Housing projects', 'Civil engineering', 'Bulk spoil removal', 'Site clearance', 'Infrastructure works'].map((use) => (
                    <div key={use} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-[#F8F9FC] px-3 py-2.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                      <span className="text-sm font-bold text-gray-700">{use}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <img
              src="/images/dumper-2.png"
              alt="Large dumper hire UK — JCB 9T-2 site dumper tipping rubble on a commercial quarry site"
              className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
            />
          </div>
        </Section>

        <Section>
          <H2>Types of Site Dumpers</H2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Forward Tip Dumper', desc: 'The most common type found on UK construction sites. Suitable for soil, gravel, hardcore and rubble on most project types.' },
              { title: 'High Tip Dumper', desc: 'Designed to discharge materials into skips, trailers or larger vehicles. Reduces manual handling and improves waste removal efficiency.' },
              { title: 'Swivel Skip Dumper', desc: 'The skip rotates to allow unloading where space is restricted. Commonly used for landscaping, urban construction and confined sites.' },
              { title: 'Tracked Dumper', desc: 'Tracked machines provide improved traction on muddy, uneven or soft ground — ideal for wet conditions, woodland and agricultural projects.' },
              { title: 'Pedestrian Dumper', desc: 'Walk-behind machines for extremely narrow access where ride-on machines cannot operate. Frequently used for garden projects and indoor demolition.' },
            ].map((type) => (
              <div key={type.title} className="rounded-xl border border-gray-100 bg-white p-5">
                <p className="mb-2 font-extrabold text-gray-900">{type.title}</p>
                <p className="text-sm font-medium text-gray-500">{type.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Matching Your Dumper to Your Excavator</H2>
          <Paragraph>Choosing compatible equipment improves efficiency and reduces loading times. Matching machine capacities helps maximise productivity throughout the project.</Paragraph>
          <DataTable
            headers={['Excavator Size', 'Recommended Dumper']}
            rows={[
              ['0.8–1T', '0.5T Dumper'],
              ['1.5–2T', '1T Dumper'],
              ['3T', '3T Dumper'],
              ['5T+', 'Larger Site Dumper'],
            ]}
          />
        </Section>

        <Section>
          <H2>Industries That Use Site Dumpers</H2>
          <Paragraph>Site dumpers are widely used across numerous industries, making them one of the most commonly hired items of plant equipment in the UK.</Paragraph>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {['Construction', 'Groundworks', 'Landscaping', 'Civil Engineering', 'Utilities', 'Agriculture', 'Demolition', 'Property Development', 'Highway Maintenance', 'Local Authorities'].map((ind) => (
              <div key={ind} className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-white px-4 py-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                <span className="text-sm font-bold text-gray-700">{ind}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Site Safety</H2>
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
            <p className="mb-3 font-extrabold text-gray-900">Before operating a site dumper:</p>
            <div className="grid gap-2 sm:grid-cols-2 mb-4">
              {['Inspect tyres or tracks', 'Check brakes and steering', 'Inspect hydraulic systems', 'Test warning devices', 'Ensure the route is clear', 'Wear appropriate PPE'].map((check) => (
                <div key={check} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-700">✓</span>
                  <span className="text-sm font-bold text-gray-700">{check}</span>
                </div>
              ))}
            </div>
            <p className="mb-2 font-extrabold text-gray-900">Always avoid:</p>
            <BulletList items={['Carrying passengers', 'Overloading the machine', 'Travelling across steep side slopes', 'Operating outside manufacturer recommendations']} />
            <p className="mt-3 text-sm font-medium text-gray-600">Only trained and competent operators should use plant equipment on site.</p>
          </div>
        </Section>

        <Section>
          <H2>Delivery and Collection</H2>
          <Paragraph>Most plant hire suppliers offer delivery and collection directly to site. Planning ahead helps avoid unnecessary delays.</Paragraph>
          <div className="space-y-2">
            {['Ensure sufficient access for the delivery vehicle', 'Prepare a suitable unloading area', 'Remove obstacles from the delivery route', 'Confirm someone is available on site to receive the machine'].map((step) => (
              <div key={step} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-700">✓</span>
                <span className="text-sm font-bold text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Why Compare Dumper Hire Suppliers?</H2>
          <Paragraph>Not every supplier offers the same equipment, availability or level of service. When comparing dumper hire, consider:</Paragraph>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Machine Size & Type', desc: 'Right capacity for your project' },
              { label: 'Equipment Condition', desc: 'Well-maintained, modern machines' },
              { label: 'Delivery Coverage', desc: 'Reaches your site postcode' },
              { label: 'Weekly Hire Options', desc: 'Better value for longer projects' },
              { label: 'Breakdown Support', desc: 'Response time and replacement cover' },
              { label: 'Customer Reviews', desc: 'Track record of service and reliability' },
              { label: 'Machine Availability', desc: 'Ready when your project needs it' },
              { label: 'Additional Plant', desc: 'Other equipment from the same supplier' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="font-extrabold text-gray-900">{item.label}</p>
                <p className="mt-0.5 text-sm font-medium text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Common Mistakes When Hiring a Dumper</H2>
          <Paragraph>Taking time to plan your hire can improve efficiency and reduce downtime. Avoid these common mistakes:</Paragraph>
          <div className="space-y-2">
            {['Choosing the wrong machine size for the project', 'Ignoring site access restrictions before booking', 'Not matching the dumper capacity to the excavator', 'Forgetting to confirm delivery and collection arrangements', 'Underestimating the volume of material to be moved', 'Overloading the machine beyond its rated capacity', 'Failing to inspect the equipment before use'].map((mistake) => (
              <div key={mistake} className="flex items-center gap-3 rounded-xl border border-red-50 bg-red-50/50 px-4 py-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-black text-red-600">✕</span>
                <span className="text-sm font-bold text-gray-700">{mistake}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Frequently Asked Questions</H2>
          <div className="grid gap-4">
            {[
              { question: 'What size dumper is best for landscaping?', answer: 'A 0.5T or 1T dumper is generally suitable for most landscaping projects, depending on access and the volume of material to be moved. The 0.5T is ideal for very tight access, while the 1T provides more capacity for larger gardens and driveways.' },
              { question: 'Can homeowners hire a dumper?', answer: 'Yes. Many suppliers offer plant hire to both businesses and private individuals. You will typically need a valid photo ID and a payment card. No trade account is required.' },
              { question: 'Is delivery available?', answer: 'Most suppliers provide delivery and collection services throughout the UK. Delivery charges vary by distance and machine size. Always confirm the total cost including delivery before booking.' },
              { question: 'Can I hire a dumper for one day?', answer: 'Many suppliers offer flexible hire periods, including daily, weekly and long-term options. Weekend hire (Friday to Monday) is also widely available and often works out cheaper per day than booking individual days.' },
              { question: 'Do I need an operator?', answer: 'Some suppliers offer self-drive hire, while others can provide experienced operators if required. For domestic and most commercial projects, self-drive hire is the standard option.' },
              { question: 'What is the difference between a forward tip and a high-tip dumper?', answer: 'A forward tip dumper unloads material directly in front of the machine. A high-tip dumper raises the skip to a greater height, allowing materials to be discharged directly into skips or larger vehicles, reducing manual handling.' },
              { question: 'Can dumpers operate on muddy ground?', answer: 'Yes. Site dumpers are designed for off-road environments. Tracked dumpers provide additional traction in particularly challenging ground conditions such as wet, soft or uneven terrain.' },
              { question: 'Should I compare multiple suppliers?', answer: 'Yes. Comparing suppliers allows you to review machine availability, specifications, delivery options and service levels to find the most suitable equipment for your project.' },
            ].map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
                <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
                <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Compare Dumper Hire with Tooli UK</H2>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
            <Paragraph>
              Choosing the right dumper is about more than simply selecting a machine. The correct equipment should match your project's access, ground conditions, material volumes and working environment to maximise productivity and minimise unnecessary delays.
            </Paragraph>
            <Paragraph>
              Tooli UK makes it easy to compare dumper hire from trusted suppliers across the UK. Whether you're working on a domestic landscaping project, residential extension or large commercial development, you can compare site dumper options, machine specifications and supplier information in one place.
            </Paragraph>
          </div>
        </Section>
      </>
    ),
  },
  {
    slug: 'telehandler-hire-uk',
    name: 'Telehandler Hire UK',
    path: '/equipment/telehandler-hire-uk',
    metaTitle: 'Telehandler Hire UK | Compare Lift Heights & Capacities | Tooli UK',
    metaDescription:
      'Compare telehandler hire across the UK. Compact 6m machines to 17m high-reach models — find the right lift height, load capacity and supplier for your project.',
    canonicalUrl: 'https://www.tooli.uk/equipment/telehandler-hire-uk',
    title: 'Telehandler Hire UK: Compare Prices on All Lift Heights and Capacities',
    description:
      'Hiring a telehandler comes down to lift height, load capacity, and hire length. Compare rates from depots nationwide — whether you need a compact 6m machine for a barn conversion or a 17m high-reach telehandler for a steel frame build.',
    image: '/images/telehandler-1.png',
    imageAlt: 'Telehandler hire UK — telescopic handler lifting pallet of blocks on a construction site at sunset',
    faqs: [
      {
        question: 'What is the difference between a telehandler and a forklift?',
        answer:
          'A standard forklift lifts vertically in front of the machine. A telehandler has a telescopic boom that extends forward and upward simultaneously, allowing it to reach over obstacles, place materials at height, and operate on rough or uneven ground. Telehandlers are far more versatile on UK construction and agricultural sites.',
      },
      {
        question: 'Do I need a licence to hire and operate a telehandler?',
        answer:
          'On private land, no formal licence is legally required, but operators must be competent under PUWER 1998. On commercial construction sites, a CPCS card (category A17) or LANTRA equivalent is required by most principal contractors. LOLER 1998 also requires that all lifting operations are properly planned and supervised.',
      },
      {
        question: 'What size telehandler do I need for a two-storey build?',
        answer:
          'For a standard UK two-storey residential build, a 7–9 metre mid-range machine with a 2.5 to 3 tonne lift capacity is the correct choice. It reaches first and second floor levels comfortably and handles the pallet weights typical of block, brick, and roofing materials. Only step up to a high-reach machine if you are working three storeys or above.',
      },
      {
        question: 'Can a telehandler be used with a man basket?',
        answer:
          'Yes — but only when the machine is rated for personnel lifting and the operator holds an IPAF licence for the basket configuration. Not all telehandlers are rated for man basket use. Confirm with the depot before hiring and ensure a lift plan is in place on any commercial site.',
      },
      {
        question: 'Is delivery included in telehandler hire prices?',
        answer:
          'Rarely. Delivery and collection are almost always charged separately. High-reach models requiring a low-loader attract higher transport costs. Some depots offer free delivery within a set radius on weekly or monthly hires — always confirm before booking.',
      },
      {
        question: 'How much fuel does a telehandler use per day?',
        answer:
          'A full day of active use typically consumes 20 to 35 litres of diesel, depending on the machine size and workload. Return the machine at the same fuel level it arrived with or expect a refuelling charge from the depot.',
      },
      {
        question: 'What attachments do I need for block laying?',
        answer:
          'Standard pallet forks handle the majority of block and brick lifting. For coursing blocks into position at height, a block grab attachment gives more precise placement. Confirm availability and compatibility with your specific machine when booking.',
      },
      {
        question: 'Do I need a lift plan for a telehandler on site?',
        answer:
          'On commercial sites, a lift plan is required under LOLER 1998 for all significant lifting operations. For high-reach machines, most principal contractors will ask to see it before the machine moves. On smaller residential projects it is still good practice, particularly when using a man basket or lifting near overhead obstructions.',
      },
    ],
    relatedEquipment: [
      { name: 'Excavator Hire UK', path: '/equipment/excavator-hire-uk' },
      { name: 'Dumper Hire UK', path: '/equipment/dumper-hire-uk' },
      { name: 'Compactor Hire UK', path: '/equipment/compactor-hire-uk' },
      { name: 'Scissor Lift Hire UK', path: '/equipment/scissor-lift-hire-uk' },
      { name: 'Generator Hire UK', path: '/equipment/generator-hire-uk' },
    ],
    content: (
      <>
        <Section>
          <H2>What Is a Telehandler?</H2>
          <Paragraph>
            A telehandler (short for telescopic handler) is a rough-terrain forklift with an extendable boom arm. Unlike a standard forklift, it reaches forward and upward simultaneously — making it the go-to machine for lifting materials to height on construction sites, agricultural yards, and industrial facilities.
          </Paragraph>
          <Paragraph>
            In the UK, builders, roofers, steel erectors, and groundworkers use them daily. Shifting pallets of blocks to first-floor height, loading roof trusses, or feeding a concrete pour from height — a telehandler does the job faster and safer than any alternative.
          </Paragraph>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-5">
            <p className="mb-3 font-extrabold text-gray-900">Common uses on UK sites:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {['Lifting pallets of blocks and bricks', 'Placing roof trusses', 'Feeding concrete pours from height', 'Loading and unloading delivery vehicles', 'Steel frame construction support', 'Agricultural yard material handling', 'Cladding and curtain wall installation', 'Scaffolding material placement'].map((use) => (
                <div key={use} className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                  {use}
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <H2>Telehandler Sizes: Which One Do You Need?</H2>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">Compact Class</div>
              <H3>Compact Telehandlers (Up to 6m Lift Height)</H3>
              <Paragraph>Built for sites with restricted overhead clearance, tight yard access, or agricultural use. They are lighter, narrower, and more manoeuvrable than full-size machines. Lift capacity typically runs from 1.5 to 2.5 tonnes — enough for standard pallet loads of bricks, blocks, and bagged materials on low-rise jobs.</Paragraph>
              <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
                <span className="text-sm font-bold text-gray-700">Best for: </span>
                <span className="text-sm font-medium text-gray-600">farm yards, barn conversions, material handling in confined spaces, low-rise residential.</span>
              </div>
            </div>

            <img
              src="/images/telehandler-2.png"
              alt="Mid-range telehandler hire UK — yellow telescopic handler lifting concrete blocks on a commercial construction site"
              className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
            />

            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">Mid-Range Class</div>
              <H3>Mid-Range Telehandlers (7–10m Lift Height)</H3>
              <Paragraph>The most hired telehandler class in the UK. A 7–9 metre machine with a 2.5 to 3.5 tonne lift capacity covers the vast majority of UK construction tasks — from block-laying support to roofing material placement on two and three-storey builds.</Paragraph>
              <Paragraph>The JCB 540-170 and Manitou MT 932 are among the most commonly seen machines in this class on UK sites. If you are not sure which class to book, this is the one to start with.</Paragraph>
              <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
                <span className="text-sm font-bold text-gray-700">Best for: </span>
                <span className="text-sm font-medium text-gray-600">housing developments, commercial groundworks, roofing, scaffolding support, block and beam flooring.</span>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-primary">High-Reach Class</div>
              <H3>High-Reach Telehandlers (14–17m+ Lift Height)</H3>
              <Paragraph>High-reach machines are hired for steel frame construction, large roofing contracts, cladding installation, and any lift that a mid-range machine simply cannot reach. At 14 metres and above, these are serious plant — and they come with serious site planning requirements.</Paragraph>
              <Paragraph>You will need adequate outrigger space, confirmed ground-bearing capacity, and a trained operator with a valid CPCS card (category A17). Most principal contractors will ask for a lift plan before the machine moves on site.</Paragraph>
              <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
                <span className="text-sm font-bold text-gray-700">Best for: </span>
                <span className="text-sm font-medium text-gray-600">steel frame builds, large commercial roofing, cladding, pre-cast concrete panel placement.</span>
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <H2>All Classes at a Glance</H2>
          <DataTable
            headers={['Class', 'Lift Height', 'Lift Capacity', 'CPCS Required?']}
            rows={[
              ['Compact', 'Up to 6m', '1.5–2.5T', 'Recommended'],
              ['Mid-Range', '7–10m', '2.5–3.5T', 'Yes (most sites)'],
              ['High-Reach', '14–17m+', '3–4.5T', 'Yes'],
            ]}
          />
        </Section>

        <Section>
          <H2>Attachments Available With Telehandler Hire</H2>
          <Paragraph>Most depots hire attachments separately. Confirm compatibility with your specific machine before booking — not every attachment fits every model.</Paragraph>
          <DataTable
            headers={['Attachment', 'Use']}
            rows={[
              ['Pallet forks (standard)', 'Block, brick, and pallet lifting — usually included'],
              ['Man basket (MEWP rated)', 'Working at height with operator present'],
              ['Bucket', 'Loose material handling'],
              ['Hook / sling attachment', 'Steel beam and structural lifting'],
              ['Block grab', 'Lightweight block placing and coursing'],
            ]}
          />
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">Important: Using a man basket on a telehandler requires the machine to be rated for personnel lifting. The operator must also hold a valid IPAF licence for that basket configuration. Confirm with your depot before booking — not all machines are rated for man basket use, and using an unrated machine is a LOLER breach.</p>
          </div>
        </Section>

        <Section>
          <H2>Do You Need a Licence to Operate a Telehandler?</H2>
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">On private land</p>
              <p className="text-sm font-medium leading-relaxed text-gray-500">No formal licence is strictly required by law. That said, any competent operator should complete recognised training before using one. HSE guidance under PUWER 1998 requires operators to be demonstrably competent, regardless of site type.</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">On commercial construction sites</p>
              <p className="text-sm font-medium leading-relaxed text-gray-500">A CPCS card (category A17 — telescopic handler) or a LANTRA Awards equivalent is required by most principal contractors. This is non-negotiable on the majority of UK housebuilding and commercial projects. Turning up without a valid card will get you stood down.</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">LOLER requirements</p>
              <p className="text-sm font-medium leading-relaxed text-gray-500">LOLER 1998 (Lifting Operations and Lifting Equipment Regulations) applies to all telehandler lifting operations. Lifts must be properly planned, supervised, and carried out by competent persons. On any commercial site, a lift plan is good practice — and often a contractual requirement. Full HSE guidance is available at hse.gov.uk.</p>
            </div>
          </div>
        </Section>

        <Section>
          <H2>Hidden Costs to Budget For</H2>
          <Paragraph>Headline hire rates rarely tell the full story. Here is what to account for before you sign the hire agreement:</Paragraph>
          <div className="space-y-3">
            {[
              { title: 'Delivery and Collection', body: 'Charged separately by most depots. High-reach models often require a low-loader, which adds to the transport cost. Check whether your depot offers free delivery within a radius on longer hires.' },
              { title: 'Fuel', body: 'Telehandlers are diesel-heavy. A full day of active use can consume 20 to 35 litres depending on the machine and the work. Return the machine full unless you have agreed a fuel-inclusive deal in writing.' },
              { title: 'Damage Waiver', body: 'Most depots offer an optional damage waiver per day. Read the exclusions carefully — tyre damage and boom damage are commonly excluded from standard waivers, and the cost of either can be significant.' },
              { title: 'Attachments', body: 'Only pallet forks are typically included as standard. Budget separately for buckets, man baskets, or hook attachments if your job needs them.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-700">!</span>
                <div>
                  <p className="font-extrabold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>What Size Telehandler Do I Need?</H2>
          <Paragraph>The right machine depends on your lift height and what you are lifting. If your job sits between two classes, hire up — the cost difference between classes is smaller than the cost of a machine that cannot reach.</Paragraph>
          <DataTable
            headers={['Job Type', 'Recommended Class']}
            rows={[
              ['Low-rise residential, farm yard, barn', 'Compact (up to 6m)'],
              ['Two or three-storey housing, standard roofing', 'Mid-range (7–10m)'],
              ['Steel frame, large commercial roof, cladding', 'High-reach (14–17m+)'],
              ['Man basket work at height', 'Check IPAF rating — any class'],
            ]}
          />
        </Section>

        <Section>
          <H2>Hire Period Options</H2>
          <Paragraph>Most UK depots offer four standard hire terms:</Paragraph>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { period: 'Day Hire', desc: 'One-off lifts, single-phase work, or spot hire alongside a longer project.' },
              { period: 'Weekend Hire', desc: 'Friday to Monday — common for self-builders and serious DIYers.' },
              { period: 'Weekly Hire', desc: 'The most cost-effective option on jobs running three days or more. Most depots price weekly hire to reward longer bookings.' },
              { period: 'Monthly Hire', desc: 'Used by site managers on extended programmes. Some depots include free delivery within a set radius on monthly contracts.' },
            ].map((item) => (
              <div key={item.period} className="rounded-xl border border-gray-100 bg-white p-5">
                <p className="mb-2 font-extrabold text-gray-900">{item.period}</p>
                <p className="text-sm font-medium text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">For jobs with uncertain durations, ask about open-hire or flexible return terms rather than committing to a fixed end date you might not hit.</p>
        </Section>

        <img
          src="/images/telehandler-3.png"
          alt="Telehandler hire UK guide — specifications and key features of a telescopic handler for construction use"
          className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
        />

        <Section>
          <H2>Frequently Asked Questions</H2>
          <div className="grid gap-4">
            {[
              { question: 'What is the difference between a telehandler and a forklift?', answer: 'A standard forklift lifts vertically in front of the machine. A telehandler has a telescopic boom that extends forward and upward simultaneously, allowing it to reach over obstacles, place materials at height, and operate on rough or uneven ground. Telehandlers are far more versatile on UK construction and agricultural sites.' },
              { question: 'Do I need a licence to hire and operate a telehandler?', answer: 'On private land, no formal licence is legally required, but operators must be competent under PUWER 1998. On commercial construction sites, a CPCS card (category A17) or LANTRA equivalent is required by most principal contractors. LOLER 1998 also requires that all lifting operations are properly planned and supervised.' },
              { question: 'What size telehandler do I need for a two-storey build?', answer: 'For a standard UK two-storey residential build, a 7–9 metre mid-range machine with a 2.5 to 3 tonne lift capacity is the correct choice. It reaches first and second floor levels comfortably and handles the pallet weights typical of block, brick, and roofing materials.' },
              { question: 'Can a telehandler be used with a man basket?', answer: 'Yes — but only when the machine is rated for personnel lifting and the operator holds an IPAF licence for the basket configuration. Not all telehandlers are rated for man basket use. Confirm with the depot before hiring and ensure a lift plan is in place on any commercial site.' },
              { question: 'Is delivery included in telehandler hire prices?', answer: 'Rarely. Delivery and collection are almost always charged separately. High-reach models requiring a low-loader attract higher transport costs. Some depots offer free delivery within a set radius on weekly or monthly hires — always confirm before booking.' },
              { question: 'How much fuel does a telehandler use per day?', answer: 'A full day of active use typically consumes 20 to 35 litres of diesel, depending on the machine size and workload. Return the machine at the same fuel level it arrived with or expect a refuelling charge from the depot.' },
              { question: 'What attachments do I need for block laying?', answer: 'Standard pallet forks handle the majority of block and brick lifting. For coursing blocks into position at height, a block grab attachment gives more precise placement. Confirm availability and compatibility with your specific machine when booking.' },
              { question: 'Do I need a lift plan for a telehandler on site?', answer: 'On commercial sites, a lift plan is required under LOLER 1998 for all significant lifting operations. For high-reach machines, most principal contractors will ask to see it before the machine moves. On smaller residential projects it is still good practice, particularly when using a man basket or lifting near overhead obstructions.' },
            ].map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
                <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
                <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Compare Telehandler Hire with Tooli UK</H2>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
            <Paragraph>
              Choosing the right telehandler is about matching lift height and load capacity to the demands of your specific project. The correct machine should reach your highest lift point with capacity to spare — and arrive from a supplier who can support you if something goes wrong on site.
            </Paragraph>
            <Paragraph>
              Tooli UK makes it straightforward to compare telehandler hire from trusted suppliers across the UK. Whether you are working on a domestic extension, a housing development, or a large commercial project, you can compare machine specifications, lift heights, capacities and supplier information in one place.
            </Paragraph>
          </div>
        </Section>
      </>
    ),
  },
  {
    slug: 'compactor-hire-uk',
    name: 'Compactor Hire UK',
    path: '/equipment/compactor-hire-uk',
    metaTitle: 'Compactor Hire UK | Wacker Plate, Roller & Rammer Hire | Tooli UK',
    metaDescription:
      'Compare compactor hire across the UK. Wacker plates, reversible plates, trench rammers and ride-on rollers — find the right compactor for your job and compare depots near you.',
    canonicalUrl: 'https://www.tooli.uk/equipment/compactor-hire-uk',
    title: 'Compactor Hire UK: Compare Wacker Plate, Roller and Rammer Prices',
    description:
      'Hiring the wrong compactor costs you more than just money — it costs you a day\'s work and a failed inspection. Compare wacker plates, rollers, rammers and reversible plates from depots across the UK.',
    image: '/images/compactor-1.png',
    imageAlt: 'Compactor hire UK — yellow single-drum roller compactor on a rocky construction site with mountain backdrop',
    faqs: [
      {
        question: 'What is the difference between a wacker plate and a trench rammer?',
        answer:
          'A wacker plate uses vibration to compact granular materials like gravel, hardcore, and sand. A trench rammer uses high-impact blows to compact cohesive soils like clay and silt. Using a wacker plate on clay produces poor compaction. If your backfill is clay-heavy, hire a rammer.',
      },
      {
        question: 'What size wacker plate do I need for a driveway?',
        answer:
          'For a standard residential driveway sub-base using MOT Type 1 or recycled aggregate, a 300–500mm forward plate compactor is adequate. For block paving consolidation after laying, fit a rubber pad to avoid cracking or scuffing the surface. Heavy-duty plates are only needed on thicker sub-base layers (150mm+) or larger commercial areas.',
      },
      {
        question: 'Can I use a wacker plate on tarmac?',
        answer:
          'Not without a rubber pad fitted. Bare steel plates will damage fresh tarmac surfaces and leave permanent marks. For proper tarmac and asphalt compaction, hire a walk-behind double-drum roller — it produces a smooth, even finish without surface damage.',
      },
      {
        question: 'Do I need a licence to operate a compactor?',
        answer:
          'For wacker plates, reversible plates, and trench rammers on private land, no formal licence is required. For ride-on rollers on commercial construction sites, most principal contractors require a CPCS card (category A31). HSE noise regulations apply regardless of site type — hearing protection is required when operating any compactor for sustained periods.',
      },
      {
        question: 'Is delivery included in compactor hire prices?',
        answer:
          'Delivery is not usually included in the headline hire rate. Wacker plates and rammers are typically small enough to transport by van, keeping delivery costs lower than larger plant. Ride-on rollers require a plant trailer and cost more to transport. Some depots include free local delivery on weekly hires — always confirm before booking.',
      },
      {
        question: 'How deep should I compact each layer?',
        answer:
          'As a general rule, compact granular material in layers no deeper than 150mm (loose depth). Attempting to compact thicker layers in one pass produces poor results regardless of the machine. For cohesive soils with a rammer, work in shallower layers — 100–125mm loose depth is typically the maximum for effective compaction.',
      },
      {
        question: 'Can a DIYer hire a wacker plate?',
        answer:
          'Yes. Wacker plates and walk-behind rollers are widely available to homeowners from UK depots without trade credentials. You will need to sign a hire agreement and, if the machine is road-registered, show a valid driving licence. Always read the operating instructions before use and wear hearing protection.',
      },
      {
        question: 'What is CONAW and does it apply to my job?',
        answer:
          'CONAW stands for the Control of Noise at Work Regulations 2005. It applies to all employers on UK construction sites and requires noise exposure to be assessed and controlled. The lower action value is 80 dB(A) — most compactors exceed this quickly. Self-employed tradespeople are also covered. Hearing protection must be provided and used when noise levels are at or above the lower action value.',
      },
    ],
    relatedEquipment: [
      { name: 'Excavator Hire UK', path: '/equipment/excavator-hire-uk' },
      { name: 'Dumper Hire UK', path: '/equipment/dumper-hire-uk' },
      { name: 'Telehandler Hire UK', path: '/equipment/telehandler-hire-uk' },
      { name: 'Scissor Lift Hire UK', path: '/equipment/scissor-lift-hire-uk' },
      { name: 'Generator Hire UK', path: '/equipment/generator-hire-uk' },
    ],
    content: (
      <>
        <Section>
          <H2>Wacker Plate Hire (Forward Plate Compactor)</H2>
          <Paragraph>
            The wacker plate is the most commonly hired compactor in the UK. It is a forward-moving vibrating plate that compacts granular materials — MOT Type 1, gravel, sand, hardcore — in layers. Fast, simple, and effective on flat or gently sloping ground.
          </Paragraph>
          <Paragraph>
            It is the right tool for driveway sub-base preparation, patio laying, block paving consolidation, and general backfill compaction on residential jobs.
          </Paragraph>
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50/60 p-4">
            <p className="text-sm font-bold text-red-800">What it won't handle: clay soils, cohesive fill, or narrow trenches under 600mm wide. For those jobs, you need a rammer or reversible plate.</p>
          </div>
          <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">driveway sub-base, patio preparation, block paving, general granular backfill.</span>
          </div>
        </Section>

        <Section>
          <H2>Standard vs Heavy-Duty Wacker Plate</H2>
          <Paragraph>Most depots offer two plate sizes. A standard 300–500mm plate covers the vast majority of residential jobs. Heavy-duty plates are wider, heavier, and produce greater compaction force — used on thicker sub-base layers (150mm+) or on larger commercial areas where a standard plate would take too many passes.</Paragraph>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">For block paving consolidation after laying, always fit a rubber pad to the plate. A bare steel plate on block paving will crack or scuff the surface.</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">Standard Plate (300–500mm)</p>
              <BulletList items={['Residential driveways and patios', 'Block paving sub-base', 'General backfill', 'Layer depth up to 100mm']} />
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">Heavy-Duty Plate (500mm+)</p>
              <BulletList items={['Thicker sub-base (150mm+ layers)', 'Larger commercial areas', 'Fewer passes needed', 'Greater compaction force']} />
            </div>
          </div>
        </Section>

        <img
          src="/images/compactor-2.png"
          alt="Compactor hire UK — single-drum roller compacting fresh tarmac on a road construction site at sunset with city skyline"
          className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
        />

        <Section>
          <H2>Reversible Plate Compactor Hire</H2>
          <Paragraph>
            The reversible plate moves both forward and backward — critical when you are working in a confined space and cannot turn the machine around. It is heavier and more powerful than a standard forward plate, making it the better choice for compacting trench backfill and working close to structures.
          </Paragraph>
          <Paragraph>
            Where a forward plate would leave uncompacted material in the corners or against walls, a reversible plate works the full area without repositioning.
          </Paragraph>
          <div className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">trench reinstatement, utility backfill, working within 500mm of walls or kerbs.</span>
          </div>
        </Section>

        <Section>
          <H2>Trench Rammer Hire</H2>
          <Paragraph>
            A trench rammer (sometimes called a jumping jack or Bomag rammer) compacts cohesive soils — clay, silt, and mixed fill — that a vibrating plate simply cannot handle properly. It delivers high-impact blows rather than vibration, forcing cohesive material to consolidate layer by layer.
          </Paragraph>
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
            <p className="text-sm font-bold text-red-800">If your groundworker is backfilling a foul drainage trench in clay-heavy ground with a wacker plate, you are wasting time and producing poor compaction. A rammer is the correct tool — full stop.</p>
          </div>
          <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">clay backfill, foundation trench reinstatement, narrow trenches under 400mm wide.</span>
          </div>
        </Section>

        <Section>
          <H2>Walk-Behind Roller Hire</H2>
          <Paragraph>
            A walk-behind double-drum roller compacts tarmac, asphalt, and fine-graded gravel surfaces where a vibrating plate would leave marks or cause damage. The twin drums produce a smooth, even finish across the surface.
          </Paragraph>
          <Paragraph>
            This is standard kit on any tarmac driveway or path job. It is not the right tool for granular sub-base compaction — use a wacker plate for that, which is faster and cheaper on loose material.
          </Paragraph>
          <div className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">tarmac driveways, asphalt paths, fine-graded gravel surface finishing.</span>
          </div>
        </Section>

        <Section>
          <H2>Ride-On Roller Hire</H2>
          <Paragraph>
            The ride-on roller is hired for road surfacing, large car parks, commercial tarmac laying, and any job where walk-behind compaction would be too slow or too labour-intensive. Most ride-on rollers available to hire in the UK are single-drum vibratory models or tandem double-drum machines.
          </Paragraph>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">On commercial sites, operators should hold a valid CPCS card (category A31 — compactor) or an NPORS equivalent. Check your principal contractor's site requirements before booking — turning up without the right card will get you stood down.</p>
          </div>
          <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">road resurfacing, commercial car parks, large-area tarmac laying.</span>
          </div>
        </Section>

        <Section>
          <H2>All Compactor Types at a Glance</H2>
          <DataTable
            headers={['Type', 'Best For', 'Soil / Surface', 'CPCS Required?']}
            rows={[
              ['Forward wacker plate', 'Sub-base, block paving, backfill', 'Granular only', 'No (private land)'],
              ['Reversible plate', 'Trenches, confined spaces', 'Granular', 'No (private land)'],
              ['Trench rammer', 'Clay fill, narrow trenches', 'Cohesive', 'No (private land)'],
              ['Walk-behind roller', 'Tarmac, asphalt, gravel paths', 'Surface finishing', 'No'],
              ['Ride-on roller', 'Roads, car parks, large tarmac', 'Surface finishing', 'Yes (commercial)'],
            ]}
          />
        </Section>

        <img
          src="/images/compactor-3.png"
          alt="Compactor hire UK — single-drum roller on a groundworks site with earthworks and construction structure in background"
          className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
        />

        <Section>
          <H2>Choosing the Right Compactor: Decision Guide</H2>
          <Paragraph>Not sure which machine your job needs? Work through these questions:</Paragraph>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-3 font-extrabold text-gray-900">1. What are you compacting?</p>
              <div className="space-y-2">
                {[
                  { label: 'Granular material (gravel, hardcore, MOT Type 1, sand)', answer: 'Forward wacker plate or reversible plate' },
                  { label: 'Cohesive soil (clay, silt, mixed fill)', answer: 'Trench rammer' },
                  { label: 'Tarmac or asphalt', answer: 'Walk-behind or ride-on roller' },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5 rounded-lg border border-gray-50 bg-[#F8F9FC] px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
                    <span className="flex-1 text-sm font-bold text-gray-700">{row.label}</span>
                    <span className="shrink-0 text-sm font-extrabold text-brand-primary">→ {row.answer}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-3 font-extrabold text-gray-900">2. How wide is your working area?</p>
              <div className="space-y-2">
                {[
                  { label: 'Under 400mm', answer: 'Trench rammer only' },
                  { label: '400–600mm', answer: 'Reversible plate or rammer' },
                  { label: 'Over 600mm', answer: 'Forward plate is fine' },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5 rounded-lg border border-gray-50 bg-[#F8F9FC] px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
                    <span className="flex-1 text-sm font-bold text-gray-700">{row.label}</span>
                    <span className="shrink-0 text-sm font-extrabold text-brand-primary">→ {row.answer}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-3 font-extrabold text-gray-900">3. How large is the area?</p>
              <div className="space-y-2">
                {[
                  { label: 'Residential driveway or patio', answer: 'Forward wacker plate' },
                  { label: 'Trench backfill or utility reinstatement', answer: 'Reversible plate or rammer' },
                  { label: 'Road, car park, or large tarmac area', answer: 'Ride-on roller' },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5 rounded-lg border border-gray-50 bg-[#F8F9FC] px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
                    <span className="flex-1 text-sm font-bold text-gray-700">{row.label}</span>
                    <span className="shrink-0 text-sm font-extrabold text-brand-primary">→ {row.answer}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-3 font-extrabold text-gray-900">4. Are you working near walls, kerbs, or structures?</p>
              <div className="rounded-lg border border-gray-50 bg-[#F8F9FC] px-4 py-3">
                <span className="text-sm font-bold text-gray-700">Within 500mm </span>
                <span className="text-sm font-extrabold text-brand-primary">→ Reversible plate or rammer; a forward plate cannot reach back into corners</span>
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <H2>Hire Period Options</H2>
          <Paragraph>Most UK depots offer four standard hire terms:</Paragraph>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { period: 'Day Hire', desc: 'Suited to single-phase compaction or one-off jobs.' },
              { period: 'Weekend Hire', desc: 'Friday to Monday — popular with serious DIYers on driveways and patios.' },
              { period: 'Weekly Hire', desc: 'The most cost-effective option on jobs running more than three days.' },
              { period: 'Monthly Hire', desc: 'Used by groundworkers and contractors on longer programmes. Some depots offer free local delivery on monthly hires.' },
            ].map((item) => (
              <div key={item.period} className="rounded-xl border border-gray-100 bg-white p-5">
                <p className="mb-2 font-extrabold text-gray-900">{item.period}</p>
                <p className="text-sm font-medium text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">For jobs with uncertain durations, ask about open-hire or flexible return terms rather than locking in a fixed end date.</p>
        </Section>

        <Section>
          <H2>Delivery and Running Costs</H2>
          <Paragraph>Delivery is charged separately by most depots. Wacker plates and rammers are small enough to transport in a van, so delivery costs are at the lower end of the plant hire scale. Ride-on rollers require a plant trailer and attract higher transport costs each way.</Paragraph>
          <div className="space-y-3">
            {[
              { title: 'Fuel', body: 'Compactors run on petrol or diesel depending on the model — fuel is your responsibility. Return the machine at the same level it left the depot or expect a refuelling charge.' },
              { title: 'Damage Waiver', body: 'Damage waivers are available from most depots. Read the exclusions carefully — plate damage from hitting buried obstructions is commonly excluded.' },
              { title: 'Transport', body: 'Wacker plates and rammers can be delivered by van. Ride-on rollers require a plant trailer and attract higher delivery charges each way.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-700">!</span>
                <div>
                  <p className="font-extrabold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>HSE Noise Regulations: What You Need to Know</H2>
          <Paragraph>Compactors are among the noisiest pieces of kit on a construction site. Under the Control of Noise at Work Regulations 2005 (CONAW), employers must assess and manage noise exposure. The lower action value is 80 dB(A) — a standard wacker plate running at full throttle typically exceeds this within minutes.</Paragraph>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-5">
            <p className="mb-3 font-extrabold text-gray-900">On any professional job:</p>
            <div className="space-y-2">
              {['Provide hearing protection for all operators', 'Limit continuous exposure time', 'Rotate operatives where possible', 'Assess noise levels before work begins'].map((rule) => (
                <div key={rule} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-700">✓</span>
                  <span className="text-sm font-bold text-gray-700">{rule}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">This applies regardless of whether the site is domestic or commercial. Full HSE guidance is at hse.gov.uk/noise.</p>
          </div>
        </Section>

        <Section>
          <H2>Frequently Asked Questions</H2>
          <div className="grid gap-4">
            {[
              { question: 'What is the difference between a wacker plate and a trench rammer?', answer: 'A wacker plate uses vibration to compact granular materials like gravel, hardcore, and sand. A trench rammer uses high-impact blows to compact cohesive soils like clay and silt. Using a wacker plate on clay produces poor compaction. If your backfill is clay-heavy, hire a rammer.' },
              { question: 'What size wacker plate do I need for a driveway?', answer: 'For a standard residential driveway sub-base using MOT Type 1 or recycled aggregate, a 300–500mm forward plate compactor is adequate. For block paving consolidation after laying, fit a rubber pad to avoid cracking or scuffing the surface. Heavy-duty plates are only needed on thicker sub-base layers (150mm+) or larger commercial areas.' },
              { question: 'Can I use a wacker plate on tarmac?', answer: 'Not without a rubber pad fitted. Bare steel plates will damage fresh tarmac surfaces and leave permanent marks. For proper tarmac and asphalt compaction, hire a walk-behind double-drum roller — it produces a smooth, even finish without surface damage.' },
              { question: 'Do I need a licence to operate a compactor?', answer: 'For wacker plates, reversible plates, and trench rammers on private land, no formal licence is required. For ride-on rollers on commercial construction sites, most principal contractors require a CPCS card (category A31). HSE noise regulations apply regardless of site type — hearing protection is required when operating any compactor for sustained periods.' },
              { question: 'Is delivery included in compactor hire prices?', answer: 'Delivery is not usually included in the headline hire rate. Wacker plates and rammers are typically small enough to transport by van, keeping delivery costs lower than larger plant. Ride-on rollers require a plant trailer and cost more to transport. Some depots include free local delivery on weekly hires — always confirm before booking.' },
              { question: 'How deep should I compact each layer?', answer: 'As a general rule, compact granular material in layers no deeper than 150mm (loose depth). Attempting to compact thicker layers in one pass produces poor results regardless of the machine. For cohesive soils with a rammer, work in shallower layers — 100–125mm loose depth is typically the maximum for effective compaction.' },
              { question: 'Can a DIYer hire a wacker plate?', answer: 'Yes. Wacker plates and walk-behind rollers are widely available to homeowners from UK depots without trade credentials. You will need to sign a hire agreement and, if the machine is road-registered, show a valid driving licence. Always read the operating instructions before use and wear hearing protection.' },
              { question: 'What is CONAW and does it apply to my job?', answer: 'CONAW stands for the Control of Noise at Work Regulations 2005. It applies to all employers on UK construction sites and requires noise exposure to be assessed and controlled. The lower action value is 80 dB(A) — most compactors exceed this quickly. Self-employed tradespeople are also covered. Hearing protection must be provided and used when noise levels are at or above the lower action value.' },
            ].map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
                <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
                <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Compare Compactor Hire with Tooli UK</H2>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
            <Paragraph>
              Choosing the right compactor means matching the machine to the material. A wacker plate on clay will fail the compaction test. A rammer on tarmac will leave the surface uneven. The correct machine for the job makes the difference between passing and failing a layer compaction check.
            </Paragraph>
            <Paragraph>
              Tooli UK makes it straightforward to compare compactor hire from trusted depots across the UK. Whether you need a simple wacker plate for a residential driveway, a reversible plate for trench reinstatement, or a ride-on roller for a commercial tarmac project, you can compare machine types, depot availability and supplier information in one place.
            </Paragraph>
          </div>
        </Section>
      </>
    ),
  },
  {
    slug: 'scissor-lift-hire-uk',
    name: 'Scissor Lift Hire UK',
    path: '/equipment/scissor-lift-hire-uk',
    metaTitle: 'Scissor Lift Hire UK | Electric, Rough Terrain & Large Platform | Tooli UK',
    metaDescription:
      'Compare scissor lift hire across the UK. Electric indoor, narrow aisle, rough terrain and large platform models — find the right MEWP for your job and compare depots near you.',
    canonicalUrl: 'https://www.tooli.uk/equipment/scissor-lift-hire-uk',
    title: 'Scissor Lift Hire UK: Compare Electric, Rough Terrain and Large Platform Prices',
    description:
      'Hiring a scissor lift comes down to three decisions: platform height, indoor or outdoor use, and making sure the operator holds the right IPAF certification. Compare electric, rough terrain and large platform scissor lifts from depots nationwide.',
    image: '/images/scissor-lift-1.png',
    imageAlt: 'Scissor lift hire UK — orange and black electric scissor lift raised inside a large steel-frame construction building at sunset',
    faqs: [
      {
        question: 'Do I need an IPAF licence to hire a scissor lift?',
        answer:
          'On commercial construction and maintenance sites, yes. A valid IPAF licence (category 3a) is required by most principal contractors in the UK. On private land, no formal certificate is legally required, but LOLER 1998 requires all operators to be competent. An IPAF 3a course takes one day and is valid for five years.',
      },
      {
        question: 'What is the difference between an electric and a rough terrain scissor lift?',
        answer:
          'Electric scissor lifts run on battery power, produce no fumes, and are designed for flat, hard indoor surfaces only. Rough terrain models run on diesel or dual-fuel, sit on larger pneumatic tyres, and are built for outdoor use on uneven or soft ground. Using an electric indoor model on soft or sloped ground is a serious safety risk and will likely breach your hire agreement terms.',
      },
      {
        question: 'How high can a scissor lift reach?',
        answer:
          'Standard electric indoor scissor lifts reach 6–10 metres working height. Rough terrain models typically reach 8–14 metres. Large platform machines reach 13–18 metres. Working height is measured from the ground to the top of the operator\'s reach — platform height is typically 2 metres lower than the stated working height figure.',
      },
      {
        question: 'Can I use a scissor lift outdoors?',
        answer:
          'Only if it is rated for outdoor use. Electric indoor scissor lifts must not be used on soft, uneven, or sloped ground. For any outdoor elevated work, hire a rough terrain scissor lift with pneumatic or foam-filled tyres. Always check the maximum wind speed rating — most scissor lifts should not be operated above Beaufort Scale 6 (around 25–31 mph).',
      },
      {
        question: 'What is IPAF category 3a?',
        answer:
          'IPAF category 3a covers static vertical platforms — which includes scissor lifts. It is a one-day course that certifies operators to safely use scissor lifts and other vertically travelling MEWPs. It is the most commonly required MEWP certification on UK construction and maintenance sites. IPAF 3a is valid for five years before renewal.',
      },
      {
        question: 'Is delivery included in scissor lift hire prices?',
        answer:
          'Delivery is almost never included in the headline rate. Standard electric models are typically delivered on a plant trailer. Large rough terrain machines may require a low-loader, which attracts higher transport costs each way. Some depots offer free local delivery on weekly hires — always confirm before booking.',
      },
      {
        question: 'What is the difference between PASMA and IPAF?',
        answer:
          'PASMA covers the erection and use of mobile tower scaffolds. IPAF covers MEWPs — including scissor lifts, boom lifts, and cherry pickers. They are separate certification schemes. PASMA does not qualify you to operate a scissor lift. If your team holds PASMA but not IPAF, they cannot legally operate a scissor lift on a commercial site.',
      },
      {
        question: 'Can a scissor lift be used in the rain?',
        answer:
          'Most scissor lifts are weather-resistant but not waterproof. Electric models can be used in light rain but must not be operated in standing water or on waterlogged ground. Rough terrain models tolerate wet outdoor conditions better. At height in wet weather, wind speed and surface conditions both become greater risks — always assess before raising the platform.',
      },
    ],
    relatedEquipment: [
      { name: 'Excavator Hire UK', path: '/equipment/excavator-hire-uk' },
      { name: 'Dumper Hire UK', path: '/equipment/dumper-hire-uk' },
      { name: 'Telehandler Hire UK', path: '/equipment/telehandler-hire-uk' },
      { name: 'Compactor Hire UK', path: '/equipment/compactor-hire-uk' },
      { name: 'Generator Hire UK', path: '/equipment/generator-hire-uk' },
    ],
    content: (
      <>
        <Section>
          <H2>Electric Indoor Scissor Lift Hire</H2>
          <Paragraph>
            The electric scissor lift is the most widely hired MEWP in the UK for internal work. It runs on battery power, produces no fumes, and leaves no marks on finished floors — making it the only practical choice for fit-out, shopfitting, maintenance, and warehouse work indoors.
          </Paragraph>
          <Paragraph>
            Most electric scissor lifts hired in the UK reach between 6 and 10 metres working height. Platform widths vary from 0.75 metres on narrow models to 1.6 metres on standard units — worth checking if your site has restricted aisle widths.
          </Paragraph>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">6–8m Models</p>
              <BulletList items={['Standard ceiling and fit-out tasks', 'Most common hire class', 'Narrower platform options available', 'Best value for typical internal jobs']} />
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">9–10m Models</p>
              <BulletList items={['Higher ceiling environments', 'Wider platform — more working space', 'Higher safe working load', 'Industrial and large-span interiors']} />
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">suspended ceiling installation, lighting and electrical fit-out, internal decorating at height, warehouse racking work, school and office maintenance.</span>
          </div>
        </Section>

        <img
          src="/images/scissor-lift-2.png"
          alt="Scissor lift hire UK — orange rough terrain scissor lift raised on an outdoor construction site at sunset with steel frame building"
          className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
        />

        <Section>
          <H2>Narrow Aisle Scissor Lift Hire</H2>
          <Paragraph>
            The narrow aisle scissor lift is designed for confined internal spaces where a standard platform width simply will not fit. Most narrow aisle models are under 0.85 metres wide and battery-powered for indoor use.
          </Paragraph>
          <Paragraph>
            They are the right machine for maintenance work between warehouse racking rows, corridor works in hospitals and schools, mezzanine floor installation, and narrow shopfit environments where a standard electric model would block the aisle entirely.
          </Paragraph>
          <div className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">warehouse maintenance between racking, hospital and school corridor works, mezzanine floor installation, narrow shopfit environments.</span>
          </div>
        </Section>

        <Section>
          <H2>Rough Terrain Scissor Lift Hire</H2>
          <Paragraph>
            The rough terrain scissor lift is built for outdoor use on uneven or soft ground. It runs on diesel or dual-fuel (petrol/electric), sits on larger pneumatic or foam-filled tyres, and carries a higher safe working load than most indoor models.
          </Paragraph>
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
            <p className="text-sm font-bold text-red-800">An electric indoor model on soft or uneven ground is a serious safety risk and will likely breach your hire agreement. If there is any doubt about the surface — hire rough terrain.</p>
          </div>
          <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">external cladding, roofing support tasks, steel frame access, outdoor maintenance on exposed sites, agricultural building work.</span>
          </div>
        </Section>

        <Section>
          <H2>Large Platform Scissor Lift Hire (13m+)</H2>
          <Paragraph>
            Large platform scissor lifts reach working heights of 13 to 18 metres and carry wider, heavier platforms suited to multiple workers and materials. They are used on high-level structural access, external cladding at height, and large-area ceiling or steelwork tasks where a boom lift would be overkill or too wide to position accurately.
          </Paragraph>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">Most large platform machines available for hire in the UK are rough terrain capable. At this height, a full working at height risk assessment is non-negotiable — and most principal contractors will require a method statement alongside it.</p>
          </div>
          <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">high-level steel and concrete frame access, large warehouse ceiling works, external cladding above four storeys, multi-person elevated working platforms.</span>
          </div>
        </Section>

        <Section>
          <H2>All Scissor Lift Types at a Glance</H2>
          <DataTable
            headers={['Type', 'Max Working Height', 'Indoor / Outdoor', 'IPAF Category']}
            rows={[
              ['Electric indoor', '6–10m', 'Indoor only', '3a'],
              ['Narrow aisle', '6–9m', 'Indoor only', '3a'],
              ['Rough terrain', '8–14m', 'Outdoor', '3a'],
              ['Large platform', '13–18m', 'Both', '3a'],
            ]}
          />
        </Section>

        <img
          src="/images/scissor-lift-3.png"
          alt="Scissor lift hire UK — electric scissor lift at full height inside a modern industrial warehouse with mezzanine and daylight"
          className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
        />

        <Section>
          <H2>Electric vs Rough Terrain: How to Choose</H2>
          <Paragraph>This is the most common mistake made when booking a scissor lift. The wrong machine on the wrong surface is a safety incident waiting to happen.</Paragraph>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F8F9FC]">
                  <th className="px-4 py-3 text-left font-extrabold text-gray-900">Factor</th>
                  <th className="px-4 py-3 text-left font-extrabold text-brand-primary">Electric Indoor</th>
                  <th className="px-4 py-3 text-left font-extrabold text-gray-900">Rough Terrain</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Power source', 'Battery', 'Diesel / dual-fuel'],
                  ['Ground surface', 'Hard, flat, level only', 'Soft, uneven, outdoor'],
                  ['Fumes', 'None', 'Diesel — outdoor use only'],
                  ['Tyre type', 'Solid / non-marking', 'Pneumatic or foam-filled'],
                  ['Indoor use', 'Yes', 'Only with adequate ventilation'],
                  ['Gradient tolerance', 'Minimal', 'Designed for uneven ground'],
                ].map(([factor, electric, rough], i) => (
                  <tr key={factor} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]/40'}`}>
                    <td className="px-4 py-3 font-bold text-gray-700">{factor}</td>
                    <td className="px-4 py-3 font-medium text-gray-600">{electric}</td>
                    <td className="px-4 py-3 font-medium text-gray-600">{rough}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50/60 p-4">
            <p className="text-sm font-bold text-red-800">If there is any doubt about the ground surface — hire rough terrain. An electric model on soft or sloped ground is both a safety risk and a hire agreement breach.</p>
          </div>
        </Section>

        <Section>
          <H2>Do You Need a Licence to Operate a Scissor Lift?</H2>
          <Paragraph>Scissor lifts are classified as Mobile Elevating Work Platforms (MEWPs). Under the Work at Height Regulations 2005 and LOLER 1998, all MEWP operators must be competent before use.</Paragraph>
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">On commercial sites</p>
              <p className="text-sm font-medium leading-relaxed text-gray-500">A valid IPAF licence (category 3a — scissor lift) is required by virtually every principal contractor in the UK. Without it, your operator will be stood down. The IPAF 3a course takes one day and is valid for five years. It covers pre-use checks, safe operation, emergency procedures, and rescue.</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">On private land</p>
              <p className="text-sm font-medium leading-relaxed text-gray-500">No formal certificate is legally required, but competence remains a legal duty under LOLER and the Health and Safety at Work Act 1974. Untrained operators at height are an HSE enforcement risk regardless of site type.</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">PASMA vs IPAF</p>
              <p className="text-sm font-medium leading-relaxed text-gray-500">PASMA covers tower scaffolds, not scissor lifts. IPAF is the correct scheme for all MEWP operation, including scissor lifts. If your team holds PASMA but not IPAF, they are not certified for scissor lift operation. Full HSE guidance on working at height is at hse.gov.uk/work-at-height.</p>
            </div>
          </div>
        </Section>

        <Section>
          <H2>Working Height vs Platform Height: Know the Difference</H2>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
            <Paragraph>This catches people out constantly. Working height is measured from the ground to the top of the operator's reach — typically assumed to be 2 metres above the platform floor.</Paragraph>
            <div className="my-4 flex items-center gap-4 rounded-xl border border-brand-primary/20 bg-white p-4">
              <div className="text-center">
                <p className="text-2xl font-black text-brand-primary">10m</p>
                <p className="text-xs font-bold text-gray-500">Working Height</p>
              </div>
              <div className="flex-1 text-center text-2xl font-black text-gray-300">→</div>
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900">8m</p>
                <p className="text-xs font-bold text-gray-500">Platform Height</p>
              </div>
            </div>
            <Paragraph>A scissor lift with a stated working height of 10 metres has a platform height of approximately 8 metres. If you need to work at 9 metres, you need a machine with a working height of 11 metres or more.</Paragraph>
            <p className="mt-3 font-extrabold text-brand-primary">Always confirm the platform height — not just the working height — before booking.</p>
          </div>
        </Section>

        <Section>
          <H2>Hire Period Options</H2>
          <Paragraph>Most UK depots offer four standard hire terms:</Paragraph>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { period: 'Day Hire', desc: 'One-off tasks, single-phase works, or when a scissor lift is only needed for a specific stage.' },
              { period: 'Weekend Hire', desc: 'Friday to Monday — common for shopfit and maintenance contractors working out of hours.' },
              { period: 'Weekly Hire', desc: 'The most cost-effective option on jobs running three days or more.' },
              { period: 'Monthly Hire', desc: 'Used by fit-out and construction contractors on longer programmes. Some depots include free local delivery on monthly hires.' },
            ].map((item) => (
              <div key={item.period} className="rounded-xl border border-gray-100 bg-white p-5">
                <p className="mb-2 font-extrabold text-gray-900">{item.period}</p>
                <p className="text-sm font-medium text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">For jobs with uncertain durations, ask about open-hire or flexible return terms rather than committing to a fixed end date.</p>
        </Section>

        <Section>
          <H2>Delivery, Charging and Running Costs</H2>
          <div className="space-y-3">
            {[
              { title: 'Delivery and Collection', body: 'Charged separately by most depots. Standard electric models are compact enough for a standard plant trailer. Large rough terrain machines may require a low-loader, which increases transport costs each way. Confirm before booking.' },
              { title: 'Battery Charging', body: 'Electric models are delivered fully charged. Most depots require you to return them charged. Check whether a charger is included with the hire — if not, hire one separately. Running an electric scissor lift flat mid-job brings your work to a stop.' },
              { title: 'Damage Waiver', body: 'Available from most depots at a daily rate. Scissor lifts are sensitive to kerb strikes and overloading — read the exclusions carefully before signing. Damage to the scissor mechanism or platform is commonly excluded from basic waivers.' },
              { title: 'Operator Training', body: 'If your team is not IPAF 3a certified, factor in a one-day IPAF course before the hire period starts. Training providers are available nationwide — find accredited centres at ipaf.org.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-700">!</span>
                <div>
                  <p className="font-extrabold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Outdoor Scissor Lift Safety: Wind Speed</H2>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
            <Paragraph>Most scissor lifts — including rough terrain models — must not be operated above Beaufort Scale 6 (approximately 25–31 mph wind speed). At height, wind forces on the platform and operator are significantly greater than at ground level.</Paragraph>
            <div className="mt-4 space-y-2">
              {['Check the forecast before raising the platform', 'Use a flag or windsock on exposed sites as a practical wind indicator', 'Never ignore manufacturer wind speed restrictions', 'Wind speed restrictions are enforceable under Working at Height Regulations'].map((rule) => (
                <div key={rule} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-700">✓</span>
                  <span className="text-sm font-bold text-gray-700">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <H2>Frequently Asked Questions</H2>
          <div className="grid gap-4">
            {[
              { question: 'Do I need an IPAF licence to hire a scissor lift?', answer: 'On commercial construction and maintenance sites, yes. A valid IPAF licence (category 3a) is required by most principal contractors in the UK. On private land, no formal certificate is legally required, but LOLER 1998 requires all operators to be competent. An IPAF 3a course takes one day and is valid for five years.' },
              { question: 'What is the difference between an electric and a rough terrain scissor lift?', answer: 'Electric scissor lifts run on battery power, produce no fumes, and are designed for flat, hard indoor surfaces only. Rough terrain models run on diesel or dual-fuel, sit on larger pneumatic tyres, and are built for outdoor use on uneven or soft ground. Using an electric indoor model on soft or sloped ground is a serious safety risk and will likely breach your hire agreement terms.' },
              { question: 'How high can a scissor lift reach?', answer: 'Standard electric indoor scissor lifts reach 6–10 metres working height. Rough terrain models typically reach 8–14 metres. Large platform machines reach 13–18 metres. Working height is measured from the ground to the top of the operator\'s reach — platform height is typically 2 metres lower than the stated working height figure.' },
              { question: 'Can I use a scissor lift outdoors?', answer: 'Only if it is rated for outdoor use. Electric indoor scissor lifts must not be used on soft, uneven, or sloped ground. For any outdoor elevated work, hire a rough terrain scissor lift with pneumatic or foam-filled tyres. Always check the maximum wind speed rating — most scissor lifts should not be operated above Beaufort Scale 6 (around 25–31 mph).' },
              { question: 'What is IPAF category 3a?', answer: 'IPAF category 3a covers static vertical platforms — which includes scissor lifts. It is a one-day course that certifies operators to safely use scissor lifts and other vertically travelling MEWPs. It is the most commonly required MEWP certification on UK construction and maintenance sites. IPAF 3a is valid for five years before renewal.' },
              { question: 'Is delivery included in scissor lift hire prices?', answer: 'Delivery is almost never included in the headline rate. Standard electric models are typically delivered on a plant trailer. Large rough terrain machines may require a low-loader, which attracts higher transport costs each way. Some depots offer free local delivery on weekly hires — always confirm before booking.' },
              { question: 'What is the difference between PASMA and IPAF?', answer: 'PASMA covers the erection and use of mobile tower scaffolds. IPAF covers MEWPs — including scissor lifts, boom lifts, and cherry pickers. They are separate certification schemes. PASMA does not qualify you to operate a scissor lift. If your team holds PASMA but not IPAF, they cannot legally operate a scissor lift on a commercial site.' },
              { question: 'Can a scissor lift be used in the rain?', answer: 'Most scissor lifts are weather-resistant but not waterproof. Electric models can be used in light rain but must not be operated in standing water or on waterlogged ground. Rough terrain models tolerate wet outdoor conditions better. At height in wet weather, wind speed and surface conditions both become greater risks — always assess before raising the platform.' },
            ].map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
                <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
                <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Compare Scissor Lift Hire with Tooli UK</H2>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
            <Paragraph>
              Choosing the right scissor lift means matching the machine to the surface, the height, and the site requirements. An electric indoor model on uneven ground is a safety incident. A rough terrain model hired for a warehouse job is unnecessary cost. Getting it right from the start saves time and avoids the risk of a stood-down operator.
            </Paragraph>
            <Paragraph>
              Tooli UK makes it straightforward to compare scissor lift hire from trusted depots across the UK. Whether you need a compact electric machine for internal fit-out, a narrow aisle model for warehouse maintenance, or a large platform rough terrain lift for a high-level commercial project, you can compare machine types, platform heights, and supplier information in one place.
            </Paragraph>
          </div>
        </Section>
      </>
    ),
  },
  {
    slug: 'generator-hire-uk',
    name: 'Generator Hire UK',
    path: '/equipment/generator-hire-uk',
    metaTitle: 'Generator Hire UK | Compare Portable, Site & Industrial Generators | Tooli UK',
    metaDescription:
      'Compare generator hire across the UK. Portable, site and industrial generators — calculate the kVA you need and compare depots near you on Tooli UK.',
    canonicalUrl: 'https://www.tooli.uk/equipment/generator-hire-uk',
    title: 'Generator Hire UK: Compare Portable, Site and Industrial Generator Prices',
    description:
      'Hiring a generator comes down to getting the kVA output right. Undersized and you\'re tripping breakers mid-job. Oversized and you\'re burning diesel you don\'t need. Compare portable, site and industrial generators from depots nationwide.',
    image: '/images/generator-1.png',
    imageAlt: 'Generator hire UK — white diesel site generator in a remote mountainous outdoor location with wind turbine in background',
    faqs: [
      {
        question: 'What size generator do I need for a construction site?',
        answer:
          'For a typical UK construction site with two to four trades working simultaneously, plus site lighting and a welfare unit, an 8–15 kVA diesel generator is the standard choice. Add up the running power draw of everything operating at the same time, then apply a 25% headroom rule — your generator should run at no more than 75% of its rated output under normal conditions.',
      },
      {
        question: 'Do I need a 110V or 240V generator for site use?',
        answer:
          'UK construction sites operating under HSE guidance use 110V as the standard safe voltage for power tools — it halves the shock risk compared to mains 240V. Most site generators supply both 110V and 240V outputs. Confirm your tools\' voltage requirements and ensure the correct distribution board is hired alongside the generator.',
      },
      {
        question: 'What is the difference between a silent generator and a standard site generator?',
        answer:
          'A standard site generator produces 68–80 dB(A) at 7 metres — roughly equivalent to heavy traffic. A super-silent generator is enclosed in an acoustic canopy and reduces output to 50–65 dB(A). Silent models cost more per day to hire but are non-negotiable on noise-sensitive sites, in occupied buildings, or anywhere a local authority noise limit applies.',
      },
      {
        question: 'Is fuel included in generator hire prices?',
        answer:
          'No. Generators are hired on a full-to-full fuel basis — delivered full, returned full. Fuel costs are entirely your responsibility. Diesel consumption varies from 1.5 litres per hour on a small portable to 12–18 litres per hour on a large industrial unit at full load. Budget fuel costs separately before committing to a hire period.',
      },
      {
        question: 'Do I need a competency certificate to operate a hired generator?',
        answer:
          'No formal licence is required to operate a hired generator in the UK. However, connection to a site distribution system or any fixed electrical installation must be carried out by a qualified electrician. On any commercial site, the generator should be set up, inspected, and managed in line with PUWER 1998.',
      },
      {
        question: 'Can I hire a generator for an outdoor event in the UK?',
        answer:
          'Yes — but for events in public spaces or on licensed premises, check with your local authority regarding noise limits, fuel storage regulations under DSEAR 2002, and whether a temporary event notice or planning permission is required. A super-silent or enclosed industrial generator is strongly recommended for any public-facing event.',
      },
      {
        question: 'What is the 25% headroom rule for generators?',
        answer:
          'It means your generator should never run at more than 75% of its rated output under normal operating conditions. This allows headroom for startup surges — electric motors draw significantly more power on startup than when running. If your simultaneous load adds up to 10 kVA, hire a 13–15 kVA generator, not a 10 kVA one.',
      },
      {
        question: 'What is Section 61 consent and when do I need it?',
        answer:
          'Section 61 of the Control of Pollution Act 1974 allows construction contractors to apply to their local authority for prior consent to carry out noisy works. It sets agreed noise levels and working hours for the site. If you are running a diesel generator near residential properties, your local authority may require this — or may issue an enforcement notice if you do not have it.',
      },
    ],
    relatedEquipment: [
      { name: 'Excavator Hire UK', path: '/equipment/excavator-hire-uk' },
      { name: 'Dumper Hire UK', path: '/equipment/dumper-hire-uk' },
      { name: 'Telehandler Hire UK', path: '/equipment/telehandler-hire-uk' },
      { name: 'Compactor Hire UK', path: '/equipment/compactor-hire-uk' },
      { name: 'Scissor Lift Hire UK', path: '/equipment/scissor-lift-hire-uk' },
    ],
    content: (
      <>
        <Section>
          <H2>How Much Power Do You Actually Need?</H2>
          <Paragraph>
            Getting the kVA output right is the most important decision before you hire. Add up the running power draw of everything operating at the same time, then apply a 25% headroom rule — your generator should run comfortably at no more than 75% of its rated output under normal site conditions.
          </Paragraph>
          <div className="rounded-2xl border border-brand-primary/20 bg-orange-50/30 p-4 mb-4">
            <p className="font-extrabold text-gray-900 mb-1">The 25% Headroom Rule</p>
            <p className="text-sm font-medium text-gray-600">Add your simultaneous loads → divide by 0.75 → that is your minimum generator output. If the maths puts you between two classes, always hire up.</p>
          </div>
          <DataTable
            headers={['Equipment Running', 'Approx. Power Draw']}
            rows={[
              ['Single SDS drill', '1.0–1.5 kVA'],
              ['110V site transformer (single outlet)', '3.0 kVA'],
              ['110V site transformer (twin outlet)', '5.0 kVA'],
              ['Angle grinder (heavy duty)', '2.5–3.5 kVA'],
              ['Site lighting string (10 heads)', '1.5–2.5 kVA'],
              ['Cement mixer (130L)', '1.5–2.0 kVA'],
              ['Submersible pump (3")', '1.5–3.0 kVA'],
              ['Pressure washer', '2.5–4.0 kVA'],
              ['Site cabin / welfare unit', '8.0–15.0 kVA'],
            ]}
          />
        </Section>

        <Section>
          <H2>Portable Generator Hire (2–6 kVA)</H2>
          <Paragraph>
            The portable generator is the entry-level site power solution. Petrol or diesel, light enough to carry or wheel into position, and sufficient for a single trade working alone on a remote plot, renovation, or outbuilding with no mains supply.
          </Paragraph>
          <Paragraph>
            A 2–3 kVA unit powers a 110V site transformer and a handful of hand tools simultaneously. Step up to 5–6 kVA if you are running a mixer, pump, and lights at the same time.
          </Paragraph>
          <div className="mt-3 rounded-xl border border-red-100 bg-red-50/60 p-4">
            <p className="text-sm font-bold text-red-800">Not suitable for: multiple trades working simultaneously, site welfare units, or any application requiring stable power for sensitive electronics.</p>
          </div>
          <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">single-trade remote jobs, outbuildings, renovations with no mains supply, garden works.</span>
          </div>
        </Section>

        <img
          src="/images/generator-2.png"
          alt="Generator hire UK — diesel site generator on a rooftop installation at dusk with city skyline in background"
          className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
        />

        <Section>
          <H2>Site Generator Hire (8–20 kVA)</H2>
          <Paragraph>
            The 8–20 kVA diesel site generator is the most hired generator class in UK construction. It powers a full 110V site distribution board, site lighting, welfare facilities, and multiple trades working simultaneously — all from one machine.
          </Paragraph>
          <Paragraph>
            Most UK site generators in this range are diesel-powered, skid-mounted or road-towable, and built to run continuously for 8–12 hours on a single tank. They are noisy — typically 68–75 dB(A) at 7 metres — so placement relative to site boundaries and neighbours matters under CONAW 2005.
          </Paragraph>
          <DataTable
            headers={['Output', 'Best Suited To']}
            rows={[
              ['8–10 kVA', 'Two to three trades, basic lighting, no welfare unit'],
              ['13–15 kVA', 'Three to four trades, site lighting, welfare cabin'],
              ['18–20 kVA', 'Larger sites, full distribution board, multiple circuits'],
            ]}
          />
          <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">housing refurbishments, extensions, barn conversions, drainage and groundworks sites, any job where three or more trades need simultaneous power.</span>
          </div>
        </Section>

        <Section>
          <H2>Industrial Generator Hire (20–60 kVA)</H2>
          <Paragraph>
            Step up to 20 kVA and above and you are powering a full commercial operation. Industrial generators in this range supply multiple distribution boards, large welfare complexes, temporary site offices, and high-draw equipment such as concrete pumps and large compressors.
          </Paragraph>
          <Paragraph>
            At this scale, most depots will require a site survey or technical specification before confirming the hire. Some 40–60 kVA units are supplied with a dedicated distribution panel and a diesel tank holding 200+ litres — enough for several days of continuous running without refuelling.
          </Paragraph>
          <div className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Best for: </span>
            <span className="text-sm font-medium text-gray-600">large new-build developments, infrastructure projects, commercial fit-out, outdoor events, emergency power backup for commercial premises.</span>
          </div>
        </Section>

        <img
          src="/images/generator-3.png"
          alt="Generator hire UK — industrial diesel generator unit outdoors with 'Generator Equipment — Reliable. Powerful. Durable.' branding"
          className="w-full max-h-72 rounded-2xl border border-gray-100 object-cover shadow-sm"
        />

        <Section>
          <H2>Silent and Inverter Generator Hire</H2>
          <Paragraph>
            Standard site generators are not suitable for every situation. If you are working on a noise-sensitive site — a school, hospital, occupied building, residential street, or event venue — a super-silent or inverter generator is the correct hire.
          </Paragraph>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">Super-Silent Generator</p>
              <p className="text-sm font-medium text-gray-500 mb-3">Enclosed in acoustic canopies — reduces output to 50–65 dB(A) at 7 metres, down from 68–80 dB(A) on standard machines.</p>
              <BulletList items={['Occupied buildings', 'Residential streets', 'Schools and hospitals', 'Sites with Section 61 consent']} />
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">Inverter Generator</p>
              <p className="text-sm font-medium text-gray-500 mb-3">Produces clean, stable sine-wave power — essential for sensitive electronics that standard generators can damage through power fluctuation.</p>
              <BulletList items={['IT and computing equipment', 'Audio-visual setups', 'Event and broadcast use', 'Medical equipment']} />
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">On any site within a noise-sensitive area, check your local authority's permitted working hours and noise limits before placing a standard generator. Failure to comply risks an enforcement notice under the Environmental Protection Act 1990.</p>
          </div>
        </Section>

        <Section>
          <H2>All Generator Classes at a Glance</H2>
          <DataTable
            headers={['Class', 'Output', 'Best For', 'Noise Level']}
            rows={[
              ['Portable', '2–6 kVA', 'Single trade, remote jobs', '70–80 dB(A)'],
              ['Site', '8–20 kVA', 'Multi-trade construction sites', '68–75 dB(A)'],
              ['Industrial', '20–60 kVA', 'Large sites, events, infrastructure', '72–80 dB(A)'],
              ['Silent / Inverter', '3–20 kVA', 'Noise-sensitive sites, electronics', '50–65 dB(A)'],
            ]}
          />
        </Section>

        <Section>
          <H2>110V vs 240V: Which Do You Need?</H2>
          <Paragraph>UK construction sites operating under HSE guidance use 110V as the standard safe voltage for power tools. Centre-tapped to earth (CTE), it halves the shock risk compared to mains 240V — which is why 110V is mandatory on most UK commercial sites.</Paragraph>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">110V (CTE)</p>
              <BulletList items={['Standard on UK commercial sites', 'Mandatory under HSE guidance', 'Halves shock risk vs 240V', 'Requires 110V distribution board', 'Most site tools are 110V rated']} />
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="mb-2 font-extrabold text-gray-900">240V</p>
              <BulletList items={['For domestic appliances and IT', 'Welfare unit sockets', 'Lighting in welfare cabins', 'Not for site power tools', 'Standard on inverter generators']} />
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">Most site generators supply both 110V and 240V outputs. Confirm your tools' voltage requirements before booking and ensure the correct distribution board is hired alongside the generator. A generator without the right distribution board is useless on a 110V site.</p>
          </div>
        </Section>

        <Section>
          <H2>Hire Period Options</H2>
          <Paragraph>Most UK depots offer four standard hire terms:</Paragraph>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { period: 'Day Hire', desc: 'One-off power needs, single-phase works, or spot hire for a specific task.' },
              { period: 'Weekend Hire', desc: 'Friday to Monday — common for self-builders and event organisers working out of hours.' },
              { period: 'Weekly Hire', desc: 'The most cost-effective option on jobs running three days or more.' },
              { period: 'Monthly Hire', desc: 'Used by site managers on longer programmes. Some depots include free local delivery on monthly hires.' },
            ].map((item) => (
              <div key={item.period} className="rounded-xl border border-gray-100 bg-white p-5">
                <p className="mb-2 font-extrabold text-gray-900">{item.period}</p>
                <p className="text-sm font-medium text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">For jobs with uncertain durations, ask about open-hire or flexible return terms. Committing to a weekly hire on a job that runs 10 days costs more than an open hire with a 10-day return.</p>
        </Section>

        <Section>
          <H2>Fuel, Running Costs and Delivery</H2>
          <div className="space-y-3">
            {[
              { title: 'Fuel Consumption', body: 'Most hired generators run on diesel. Consumption varies from 1.5 litres per hour on a small portable to 12–18 litres per hour on a 60 kVA industrial unit at full load. On a week\'s hire of a 15 kVA unit running 8 hours per day, budget for 300–400 litres of diesel. Calculate this before you commit to the hire length.' },
              { title: 'Full-to-Full Fuel Policy', body: 'Generators are delivered full and must be returned full. Returning a part-empty machine incurs a refuelling charge at above-pump rates. Never underestimate this cost on longer hires.' },
              { title: 'Delivery and Collection', body: 'Portable generators are often transported by van — delivery is at the lower end of the plant hire scale. Larger site and industrial units on trailers or skids attract higher transport costs each way. Some depots include delivery within a set radius on weekly hires — always confirm before booking.' },
              { title: 'Site Distribution Boards', body: 'Generators do not come with a 110V distribution board as standard. Hire one separately if needed — confirm availability when booking the generator.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-700">!</span>
                <div>
                  <p className="font-extrabold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>HSE and Noise Compliance</H2>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
            <Paragraph>Under the Control of Noise at Work Regulations 2005 (CONAW), if a generator is running near workers for sustained periods, noise exposure must be assessed and managed. Position generators as far from work areas as cable length permits. Use acoustic barriers where distance alone does not reduce exposure sufficiently.</Paragraph>
            <div className="mt-4 space-y-2">
              {[
                'For sites in residential areas, check whether your local authority requires Section 61 consent under the Control of Pollution Act 1974',
                'Section 61 sets permitted noise levels and working hours for construction activity',
                'Operating outside those limits risks an enforcement notice',
                'For outdoor events involving fuel storage, DSEAR 2002 applies to diesel and petrol storage on site',
              ].map((rule) => (
                <div key={rule} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-700 mt-0.5">✓</span>
                  <span className="text-sm font-bold text-gray-700">{rule}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">Full HSE guidance on noise: hse.gov.uk/noise</p>
          </div>
        </Section>

        <Section>
          <H2>Frequently Asked Questions</H2>
          <div className="grid gap-4">
            {[
              { question: 'What size generator do I need for a construction site?', answer: 'For a typical UK construction site with two to four trades working simultaneously, plus site lighting and a welfare unit, an 8–15 kVA diesel generator is the standard choice. Add up the running power draw of everything operating at the same time, then apply a 25% headroom rule — your generator should run at no more than 75% of its rated output under normal conditions.' },
              { question: 'Do I need a 110V or 240V generator for site use?', answer: 'UK construction sites operating under HSE guidance use 110V as the standard safe voltage for power tools — it halves the shock risk compared to mains 240V. Most site generators supply both 110V and 240V outputs. Confirm your tools\' voltage requirements and ensure the correct distribution board is hired alongside the generator.' },
              { question: 'What is the difference between a silent generator and a standard site generator?', answer: 'A standard site generator produces 68–80 dB(A) at 7 metres — roughly equivalent to heavy traffic. A super-silent generator is enclosed in an acoustic canopy and reduces output to 50–65 dB(A). Silent models are non-negotiable on noise-sensitive sites, in occupied buildings, or anywhere a local authority noise limit applies.' },
              { question: 'Is fuel included in generator hire prices?', answer: 'No. Generators are hired on a full-to-full fuel basis — delivered full, returned full. Fuel costs are entirely your responsibility. Diesel consumption varies from 1.5 litres per hour on a small portable to 12–18 litres per hour on a large industrial unit at full load. Budget fuel costs separately before committing to a hire period.' },
              { question: 'Do I need a competency certificate to operate a hired generator?', answer: 'No formal licence is required to operate a hired generator in the UK. However, connection to a site distribution system or any fixed electrical installation must be carried out by a qualified electrician. On any commercial site, the generator should be set up, inspected, and managed in line with PUWER 1998.' },
              { question: 'Can I hire a generator for an outdoor event in the UK?', answer: 'Yes — but for events in public spaces or on licensed premises, check with your local authority regarding noise limits, fuel storage regulations under DSEAR 2002, and whether a temporary event notice or planning permission is required. A super-silent or enclosed industrial generator is strongly recommended for any public-facing event.' },
              { question: 'What is the 25% headroom rule for generators?', answer: 'It means your generator should never run at more than 75% of its rated output under normal operating conditions. This allows headroom for startup surges — electric motors draw significantly more power on startup than when running. If your simultaneous load adds up to 10 kVA, hire a 13–15 kVA generator, not a 10 kVA one.' },
              { question: 'What is Section 61 consent and when do I need it?', answer: 'Section 61 of the Control of Pollution Act 1974 allows construction contractors to apply to their local authority for prior consent to carry out noisy works. It sets agreed noise levels and working hours for the site. If you are running a diesel generator near residential properties, your local authority may require this — or may issue an enforcement notice if you do not have it.' },
            ].map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
                <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
                <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <H2>Compare Generator Hire with Tooli UK</H2>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FC] p-6">
            <Paragraph>
              Choosing the right generator means matching the kVA output to your site's real-world power demand — not just picking the nearest available size. Get it wrong and you are either tripping breakers or burning diesel you do not need. Get it right and you have reliable, uninterrupted power for the duration of your project.
            </Paragraph>
            <Paragraph>
              Tooli UK makes it straightforward to compare generator hire from trusted depots across the UK. Whether you need a portable unit for a remote domestic job, a site generator for a multi-trade construction project, or a super-silent industrial generator for a noise-sensitive commercial site, you can compare generator classes, output specifications, and supplier information in one place.
            </Paragraph>
          </div>
        </Section>
      </>
    ),
  },
];

export const equipmentNavItems = equipmentPages.map(({ name, path }) => ({ name, path }));
