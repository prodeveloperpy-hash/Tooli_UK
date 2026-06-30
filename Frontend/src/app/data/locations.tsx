import type { ReactNode } from 'react';

type LocationPageData = {
  slug: string;
  name: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  title: string;
  description: string;
  image: string;
  faqs: Array<{ question: string; answer: string }>;
  content: ReactNode;
};

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="text-base font-medium leading-relaxed text-gray-500 md:text-lg">{children}</p>;
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-3xl font-extrabold leading-tight text-[#030213] md:text-4xl">{children}</h2>;
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-2xl font-extrabold leading-tight text-gray-900">{children}</h3>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3 text-sm font-bold text-gray-800">
          {item}
        </li>
      ))}
    </ul>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full min-w-[560px] border-collapse bg-white text-left">
        <thead className="bg-[#F8F9FC]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell) => (
                <td key={cell} className="px-5 py-4 text-sm font-bold text-gray-800">
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

function Section({ children }: { children: ReactNode }) {
  return <section className="space-y-6">{children}</section>;
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-black text-white">
            {i + 1}
          </span>
          <span className="pt-0.5 text-base font-medium leading-relaxed text-gray-600">{step}</span>
        </li>
      ))}
    </ol>
  );
}

const londonFaqs = [
  {
    question: 'How much does plant hire cost in London?',
    answer:
      'Plant hire costs vary depending on the machine, hire duration, supplier and delivery location. As a guide, mini diggers start from around £145 per day, excavators from £175–£325 per day, telehandlers from approximately £220 per day, generators from £40 per day and wacker plates from £30 per day. Weekly hire generally offers considerably better value than paying daily rates.',
  },
  {
    question: 'Is weekly hire cheaper than daily hire?',
    answer:
      'Yes. For projects lasting more than three days, weekly hire is usually between 25% and 40% cheaper than booking daily. Always request both daily and weekly quotations before booking.',
  },
  {
    question: 'Can homeowners hire plant equipment?',
    answer:
      'Absolutely. Many suppliers hire directly to homeowners undertaking extensions, landscaping, garden renovations, driveways, patio installations and self-build projects. Most suppliers simply require photo ID, proof of address, payment card and refundable deposit where applicable.',
  },
  {
    question: 'Do I need a licence to hire a mini digger?',
    answer:
      'For domestic projects on private land, there is generally no formal licence required to hire a mini excavator. For commercial construction sites, principal contractors will often require operators to hold recognised competency cards such as CPCS or NPORS depending on site rules. Always ensure anyone operating machinery is suitably trained and competent.',
  },
  {
    question: 'Can I hire plant equipment without a trade account?',
    answer:
      'Yes. Trade accounts may offer discounted pricing and credit facilities, but most London suppliers also welcome private customers.',
  },
  {
    question: 'Which areas of London are covered?',
    answer:
      'Most suppliers provide delivery throughout Westminster, Camden, Kensington, Chelsea, Islington, Barnet, Enfield, Haringey, Hackney, Tower Hamlets, Stratford, Croydon, Bromley, Richmond, Hounslow, Ealing, Brent, Hillingdon, Greenwich and Lewisham. Many also deliver into surrounding counties including Essex, Surrey, Kent, Hertfordshire and Berkshire.',
  },
  {
    question: 'Do suppliers deliver equipment?',
    answer:
      'Yes. Most companies offer site delivery, collection, same-day delivery subject to availability, next-day delivery and weekend delivery. Delivery charges usually depend on postcode and machine size.',
  },
  {
    question: 'How quickly can equipment be delivered?',
    answer:
      'Many common machines can often be delivered within 24 hours. Emergency same-day delivery may also be available for popular equipment depending on supplier availability.',
  },
  {
    question: 'What happens if equipment breaks down?',
    answer:
      'Reputable suppliers provide emergency breakdown support. Many larger hire companies also offer replacement machinery where repairs cannot be completed quickly. Before booking, check breakdown response times, replacement policy and out-of-hours support.',
  },
  {
    question: 'What insurance do I need?',
    answer:
      'Many contractors already have insurance covering hired-in plant. If not, suppliers frequently offer optional damage waiver cover. Always read the exclusions carefully before accepting additional insurance.',
  },
  {
    question: 'Is delivery included?',
    answer:
      'Some suppliers include delivery within certain London postcodes. Others charge separately based on distance, machine size, delivery vehicle, congestion charges and ULEZ requirements. Always compare the total cost rather than the daily hire rate alone.',
  },
  {
    question: 'What is the cheapest way to hire equipment?',
    answer:
      'Generally: book weekly instead of daily, compare multiple suppliers, book in advance, hire locally, avoid peak summer demand where possible and return equipment on time. These simple steps can significantly reduce overall hire costs.',
  },
  {
    question: 'Are electric machines available?',
    answer:
      'Yes. Demand for electric construction equipment continues to increase throughout London. Many suppliers now offer electric mini excavators, battery-powered dumpers, electric scissor lifts, battery-powered generators and cordless professional tools. These are particularly useful for indoor projects, noise-sensitive locations, low-emission developments and basement conversions.',
  },
  {
    question: 'Can equipment be hired for weekends only?',
    answer:
      'Yes. Weekend hire is popular for DIY projects and home improvements. Many suppliers offer Friday afternoon collection and return Monday morning at little additional cost.',
  },
];

const londonContent = (
  <>
    <Section>
      <H2>Compare Tool & Plant Hire Prices in London</H2>
      <Paragraph>
        Hiring construction equipment shouldn't mean spending hours contacting multiple suppliers for quotes. Whether you're building a house extension in Richmond, landscaping a garden in Bromley, carrying out commercial groundworks in Canary Wharf or managing a large construction project in Wembley, finding reliable equipment at the right price can make a significant difference to your budget.
      </Paragraph>
      <Paragraph>
        Tooli.uk makes it simple to compare tool hire and plant hire prices from local independent depots alongside national hire companies serving Greater London. Instead of calling numerous suppliers individually, compare availability, equipment specifications, delivery options and daily or weekly hire prices in one place before booking directly with your chosen supplier.
      </Paragraph>
      <Paragraph>
        Whether you need a mini digger for a weekend project, a telehandler for a commercial development, an access platform for roofing work or power tools for an interior refurbishment, comparing suppliers helps ensure you're getting competitive prices without compromising on quality or service.
      </Paragraph>
      <Paragraph>
        London is one of the busiest construction markets in Europe. Demand for plant and equipment remains high throughout the year, particularly between March and October. Booking the right equipment at the right time not only reduces hire costs but also prevents expensive project delays.
      </Paragraph>
    </Section>

    <Section>
      <H2>Why Compare Plant Hire Prices in London?</H2>
      <Paragraph>Construction equipment hire prices vary considerably across Greater London.</Paragraph>
      <Paragraph>The same 1.5-tonne mini excavator may cost over £100 more per day depending on:</Paragraph>
      <BulletList items={['Your location', 'Delivery distance', 'Demand', 'Hire duration', 'Supplier', 'Equipment age', 'Availability', 'Whether delivery is included']} />
      <Paragraph>Comparing suppliers allows contractors, builders and homeowners to benefit from:</Paragraph>
      <BulletList items={['Lower hire costs', 'Better machine availability', 'Faster delivery', 'Newer equipment', 'Flexible hire periods', 'Weekend collection', 'Trade account discounts', 'Local depot support']} />
      <Paragraph>
        Many independent London hire companies offer significantly lower weekly rates than larger national chains while providing the same leading manufacturers including JCB, Kubota, Takeuchi, Thwaites, Genie, Skyjack, Manitou and Avant.
      </Paragraph>
    </Section>

    <Section>
      <H2>Plant & Tool Hire Across Greater London</H2>
      <Paragraph>Tooli.uk compares suppliers serving every part of Greater London including:</Paragraph>
      <BulletList
        items={[
          'Central London', 'Westminster', 'Camden', 'City of London', 'Kensington', 'Chelsea', 'Southwark', 'Lambeth', 'Islington',
          'North London', 'Barnet', 'Enfield', 'Haringey', 'Finchley', 'Muswell Hill', 'Wood Green', 'Edmonton',
          'East London', 'Stratford', 'Hackney', 'Tower Hamlets', 'Barking', 'Dagenham', 'Newham', 'Waltham Forest', 'Redbridge',
          'South London', 'Croydon', 'Bromley', 'Sutton', 'Merton', 'Lewisham', 'Greenwich', 'Bexley', 'Wandsworth',
          'West London', 'Hounslow', 'Ealing', 'Brentford', 'Harrow', 'Richmond', 'Hillingdon', 'Brent', 'Acton',
        ]}
      />
      <Paragraph>
        Whether you're working inside the Congestion Charge Zone or on a residential project in outer London, comparing nearby suppliers can reduce delivery costs and improve availability.
      </Paragraph>
    </Section>

    <Section>
      <H2>Construction Equipment Available</H2>
      <Paragraph>Compare prices for hundreds of equipment types including:</Paragraph>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <H3>Plant Hire</H3>
          <BulletList items={['Mini Diggers', 'Micro Excavators', 'Midi Excavators', 'Large Excavators', 'Site Dumpers', 'Tracked Dumpers', 'Rollers', 'Telehandlers', 'Skid Steers', 'Wheel Loaders', 'Compactors', 'Trench Rollers']} />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <H3>Powered Access</H3>
          <BulletList items={['Scissor Lifts', 'Boom Lifts', 'Cherry Pickers', 'Spider Lifts', 'Personnel Lifts']} />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <H3>Site Equipment</H3>
          <BulletList items={['Generators', 'Lighting Towers', 'Compressors', 'Pumps', 'Water Bowsers', 'Site Cabins']} />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <H3>Power Tools</H3>
          <BulletList items={['Breakers', 'SDS Drills', 'Diamond Core Drills', 'Disc Cutters', 'Floor Saws', 'Wall Chasers', 'Concrete Mixers', 'Wacker Plates', 'Floor Sanders', 'Tile Cutters']} />
        </div>
      </div>
      <H3>Landscaping Equipment</H3>
      <BulletList items={['Rotavators', 'Wood Chippers', 'Stump Grinders', 'Turf Cutters', 'Lawn Rollers', 'Garden Tillers']} />
    </Section>

    <Section>
      <H2>London Tool & Plant Hire Prices</H2>
      <Paragraph>The table below provides realistic guide prices based on equipment commonly hired throughout Greater London.</Paragraph>
      <DataTable
        headers={['Equipment', 'Daily From', 'Weekly From']}
        rows={[
          ['Mini Digger (1T)', '£145', '£495'],
          ['Mini Digger (1.5T)', '£175', '£595'],
          ['3T Excavator', '£240', '£790'],
          ['5T Excavator', '£325', '£1,050'],
          ['Site Dumper', '£90', '£295'],
          ['Roller', '£75', '£245'],
          ['Telehandler', '£220', '£725'],
          ['Scissor Lift', '£95', '£335'],
          ['Boom Lift', '£145', '£495'],
          ['Generator', '£40', '£140'],
          ['Wacker Plate', '£30', '£95'],
          ['Concrete Breaker', '£35', '£120'],
        ]}
      />
      <Paragraph>Prices vary depending on supplier, delivery location, season and availability.</Paragraph>
      <H3>Daily vs Weekly Hire</H3>
      <Paragraph>One of the biggest mistakes made by homeowners and contractors is booking equipment on daily rates when weekly hire would cost significantly less.</Paragraph>
      <Paragraph>Example:</Paragraph>
      <DataTable
        headers={['Equipment', '5 Days Daily', 'Weekly Hire', 'Saving']}
        rows={[
          ['Mini Digger', '£875', '£595', '£280'],
          ['Scissor Lift', '£475', '£335', '£140'],
          ['Telehandler', '£1,100', '£725', '£375'],
        ]}
      />
      <Paragraph>For projects lasting more than three days, weekly hire almost always represents the best value.</Paragraph>
      <Paragraph>Many London suppliers also offer discounted monthly rates for long-term commercial projects.</Paragraph>
    </Section>

    <Section>
      <H2>Cheapest Tool Hire in London</H2>
      <Paragraph>Lowest price doesn't always represent the best value.</Paragraph>
      <Paragraph>Before choosing a supplier compare:</Paragraph>
      <BulletList items={['Delivery charges', 'Collection fees', 'Weekend rates', 'Fuel policy', 'Damage waiver', 'Machine age', 'Breakdown response', 'Replacement guarantees', 'Included accessories', 'Customer reviews']} />
      <Paragraph>
        An independent depot may quote a lower daily rate but charge higher delivery fees, while a larger supplier could offer free delivery within a specific postcode area.
      </Paragraph>
      <Paragraph>Always compare the total hire cost rather than the headline price alone.</Paragraph>
    </Section>

    <Section>
      <H2>Mini Digger Hire London</H2>
      <Paragraph>Mini excavators remain the most popular category of construction equipment hired across London.</Paragraph>
      <Paragraph>Suitable for:</Paragraph>
      <BulletList items={['Extensions', 'Foundations', 'Drainage', 'Landscaping', 'Garden projects', 'Driveways', 'Utility trenches', 'Site clearance']} />
      <H3>0.8T Micro Diggers</H3>
      <Paragraph>Perfect where access is restricted.</Paragraph>
      <Paragraph>Ideal for:</Paragraph>
      <BulletList items={['Garden gates', 'Narrow alleyways', 'Indoor demolition', 'Basement excavations']} />
      <Paragraph>Typical hire from:</Paragraph>
      <Paragraph>£145 per day</Paragraph>
      <H3>1.5T Mini Diggers</H3>
      <Paragraph>The most commonly hired machine in London.</Paragraph>
      <Paragraph>Suitable for:</Paragraph>
      <BulletList items={['Residential construction', 'Landscaping', 'Footings', 'Groundworks', 'Drainage', 'Patios']} />
      <Paragraph>Weekly hire generally offers savings of over 30%.</Paragraph>
      <H3>3T Excavators</H3>
      <Paragraph>Ideal for:</Paragraph>
      <BulletList items={['Larger foundations', 'Commercial projects', 'Car parks', 'Bulk excavation', 'Utility work']} />
      <Paragraph>Higher bucket capacity significantly improves productivity compared with smaller machines.</Paragraph>
      <H3>Choosing the Right Excavator</H3>
      <DataTable
        headers={['Project', 'Recommended Machine']}
        rows={[
          ['Garden landscaping', '0.8T'],
          ['Patio installation', '1T'],
          ['House extension', '1.5T'],
          ['Footings', '1.5–3T'],
          ['Commercial groundwork', '3–5T'],
          ['Bulk excavation', '5T+'],
        ]}
      />
      <Paragraph>Selecting equipment that is too large can create access problems, while equipment that is too small may increase labour time and overall project costs.</Paragraph>
    </Section>

    <Section>
      <H2>Site Dumper Hire London</H2>
      <Paragraph>Dumpers are commonly hired alongside excavators to move spoil, hardcore and building materials around site efficiently.</Paragraph>
      <Paragraph>Popular sizes include:</Paragraph>
      <BulletList items={['0.5T', '1T', '3T', '6T', 'Swivel dumpers', 'Hi-tip dumpers']} />
      <Paragraph>Matching dumper capacity to excavator size helps maximise productivity and reduce fuel consumption.</Paragraph>
      <Paragraph>Typical hire starts from approximately £90 per day, with significant discounts available on weekly bookings.</Paragraph>
    </Section>

    <Section>
      <H2>Why London Contractors Compare Prices</H2>
      <Paragraph>Construction costs continue to increase, making equipment hire one of the easiest areas to reduce project expenditure.</Paragraph>
      <Paragraph>By comparing suppliers before booking, contractors can often secure:</Paragraph>
      <BulletList items={['Lower hire rates', 'Reduced delivery charges', 'Free weekend hire promotions', 'Better machine availability', 'Flexible collection times', 'Longer hire periods for less']} />
      <Paragraph>Rather than accepting the first quotation, comparing multiple London suppliers provides greater transparency and can deliver substantial savings over the course of a project.</Paragraph>
    </Section>

    <Section>
      <H2>Equipment Guide, London Regulations & Supplier Comparison</H2>
      <H3>Telehandler Hire London</H3>
      <Paragraph>
        Telehandlers, also known as telescopic handlers, are essential machines on commercial construction sites across London. Designed for lifting heavy materials to height, they are commonly used for moving pallets of bricks, roof trusses, steelwork, timber, scaffold components and bulk materials safely around site.
      </Paragraph>
      <Paragraph>Unlike traditional forklifts, telehandlers provide greater reach and lifting height, making them ideal for multi-storey developments, housebuilding sites and infrastructure projects.</Paragraph>
      <H3>Common Telehandler Sizes</H3>
      <DataTable
        headers={['Machine', 'Typical Use']}
        rows={[
          ['2.5T – 3T', 'Housebuilding'],
          ['4T', 'Medium commercial projects'],
          ['5T', 'Steel frame construction'],
          ['7T+', 'Large infrastructure projects'],
        ]}
      />
      <Paragraph>Typical hire prices in London:</Paragraph>
      <DataTable headers={['Duration', 'Price From']} rows={[['Daily', '£220'], ['Weekly', '£725'], ['Monthly', '£2,350']]} />
      <Paragraph>Most suppliers offer:</Paragraph>
      <BulletList items={['Self-drive hire', 'Operated hire', 'Long-term contracts', 'Nationwide delivery', 'CPA compliant machines']} />
      <Paragraph>For commercial sites, operators should normally hold the appropriate CPCS or NPORS certification.</Paragraph>
    </Section>

    <Section>
      <H2>Access Platform Hire London</H2>
      <Paragraph>Working safely at height remains one of the biggest priorities on any construction site.</Paragraph>
      <Paragraph>Powered access equipment provides a safer and more efficient alternative to ladders or scaffolding for many tasks.</Paragraph>
      <Paragraph>Compare prices for:</Paragraph>
      <BulletList items={['Electric Scissor Lifts', 'Diesel Scissor Lifts', 'Boom Lifts', 'Cherry Pickers', 'Spider Lifts', 'Personnel Lifts']} />
      <H3>Scissor Lift Hire</H3>
      <Paragraph>Ideal for:</Paragraph>
      <BulletList items={['Warehouse maintenance', 'Ceiling installations', 'Electrical work', 'Commercial fit-outs', 'Interior decorating']} />
      <Paragraph>Working heights typically range from:</Paragraph>
      <BulletList items={['6 metres', '8 metres', '10 metres', '12 metres', '16 metres']} />
      <Paragraph>Prices start from around:</Paragraph>
      <Paragraph>£95 per day</Paragraph>
      <H3>Boom Lift Hire</H3>
      <Paragraph>Boom lifts offer excellent horizontal outreach where obstacles prevent direct access.</Paragraph>
      <Paragraph>Suitable for:</Paragraph>
      <BulletList items={['Roofing', 'Steel erection', 'External maintenance', 'Building inspections', 'Tree surgery', 'Cladding installation']} />
      <Paragraph>Daily hire from approximately:</Paragraph>
      <Paragraph>£145</Paragraph>
      <H3>Spider Lift Hire</H3>
      <Paragraph>Spider lifts are perfect where access is restricted.</Paragraph>
      <Paragraph>Popular for:</Paragraph>
      <BulletList items={['Churches', 'Historic buildings', 'Gardens', 'Courtyards', 'Schools', 'Hotels']} />
      <Paragraph>Their low ground pressure makes them ideal for sensitive surfaces.</Paragraph>
    </Section>

    <Section>
      <H2>Generator Hire London</H2>
      <Paragraph>Temporary power is essential across construction, events and emergency projects.</Paragraph>
      <Paragraph>Generators are commonly hired for:</Paragraph>
      <BulletList items={['Construction sites', 'Site cabins', 'Festivals', 'Emergency backup', 'Outdoor events', 'Remote working']} />
      <Paragraph>Generator sizes include:</Paragraph>
      <BulletList items={['2kVA', '3kVA', '5kVA', '10kVA', '20kVA', '50kVA', '100kVA+']} />
      <Paragraph>Silent generators remain particularly popular throughout London because they minimise disruption in residential areas.</Paragraph>
      <Paragraph>Daily hire starts from approximately:</Paragraph>
      <Paragraph>£40</Paragraph>
    </Section>

    <Section>
      <H2>Wacker Plate Hire London</H2>
      <Paragraph>Compaction equipment is required for almost every groundwork project.</Paragraph>
      <Paragraph>Applications include:</Paragraph>
      <BulletList items={['Driveways', 'Patios', 'Extensions', 'Foundations', 'Block paving', 'Landscaping']} />
      <Paragraph>Popular machines include:</Paragraph>
      <BulletList items={['Forward Plates', 'Reversible Plates', 'Trench Compactors', 'Pedestrian Rollers']} />
      <Paragraph>Prices typically begin from:</Paragraph>
      <Paragraph>£30 per day</Paragraph>
    </Section>

    <Section>
      <H2>Concrete Breaker Hire London</H2>
      <Paragraph>Concrete breakers remain one of the most commonly hired tools for renovation and demolition work.</Paragraph>
      <Paragraph>Suitable for:</Paragraph>
      <BulletList items={['Concrete removal', 'Driveways', 'Internal demolition', 'Brickwork', 'Foundations', 'Floors']} />
      <Paragraph>Available options include:</Paragraph>
      <BulletList items={['SDS Max Breakers', '110V Breakers', 'Hydraulic Breakers', 'Petrol Breakers']} />
      <Paragraph>Daily hire usually starts around:</Paragraph>
      <Paragraph>£35</Paragraph>
    </Section>

    <Section>
      <H2>Diamond Drilling & Cutting Equipment</H2>
      <Paragraph>Professional contractors regularly hire:</Paragraph>
      <BulletList items={['Diamond Core Drills', 'Floor Saws', 'Wall Saws', 'Ring Saws', 'Disc Cutters', 'Masonry Saws']} />
      <Paragraph>Ideal for:</Paragraph>
      <BulletList items={['Service penetrations', 'Structural openings', 'Concrete cutting', 'Drainage work', 'Utilities']} />
    </Section>

    <Section>
      <H2>Landscaping Equipment Hire</H2>
      <Paragraph>Home improvement continues to drive strong demand throughout Greater London.</Paragraph>
      <Paragraph>Popular landscaping equipment includes:</Paragraph>
      <BulletList items={['Turf Cutters', 'Rotavators', 'Lawn Rollers', 'Wood Chippers', 'Stump Grinders', 'Garden Tillers']} />
      <Paragraph>Hiring specialist equipment often allows homeowners to complete projects faster while avoiding the cost of purchasing machinery that may only be used once.</Paragraph>
    </Section>

    <Section>
      <H2>ULEZ & Low Emission Plant Hire</H2>
      <Paragraph>London's Ultra Low Emission Zone (ULEZ) has changed the way construction equipment is selected.</Paragraph>
      <Paragraph>Many contractors now request:</Paragraph>
      <BulletList items={['Stage V Excavators', 'Electric Mini Diggers', 'Hybrid Equipment', 'Battery Powered Tools', 'Low Emission Generators']} />
      <Paragraph>Choosing compliant machinery can help reduce environmental impact while ensuring compatibility with site requirements and sustainability policies.</Paragraph>
      <Paragraph>Always ask suppliers whether machines meet current emission standards before booking.</Paragraph>
    </Section>

    <Section>
      <H2>Delivery Across London</H2>
      <Paragraph>Most suppliers provide delivery throughout Greater London.</Paragraph>
      <Paragraph>Delivery areas typically include:</Paragraph>
      <BulletList items={['Central London', 'Westminster', 'Camden', 'Southwark', 'City of London', 'North London', 'Barnet', 'Enfield', 'Haringey', 'Islington', 'East London', 'Stratford', 'Newham', 'Hackney', 'Tower Hamlets', 'South London', 'Croydon', 'Bromley', 'Lewisham', 'Greenwich', 'West London', 'Ealing', 'Hounslow', 'Richmond', 'Hillingdon']} />
      <Paragraph>Many suppliers also deliver into surrounding areas including:</Paragraph>
      <BulletList items={['Watford', 'Slough', 'St Albans', 'Dartford', 'Epsom', 'Romford', 'Woking', 'Luton']} />
    </Section>

    <Section>
      <H2>Same Day Plant Hire</H2>
      <Paragraph>Emergency breakdown?</Paragraph>
      <Paragraph>Unexpected project delay?</Paragraph>
      <Paragraph>Many London suppliers can provide:</Paragraph>
      <BulletList items={['Same-day delivery', 'Next-day delivery', 'Weekend delivery', 'Early morning delivery', 'Saturday collections']} />
      <Paragraph>Availability naturally depends on machine type and location.</Paragraph>
    </Section>

    <Section>
      <H2>London Construction Considerations</H2>
      <Paragraph>Hiring equipment in London often requires additional planning.</Paragraph>
      <Paragraph>Consider:</Paragraph>
      <BulletList items={['Congestion Charge', 'ULEZ', 'Restricted delivery times', 'Parking suspensions', 'Road permits', 'Pavement licences', 'Crane permits', 'Site access restrictions']} />
      <Paragraph>Inner London projects frequently require smaller machinery due to limited access and narrow streets.</Paragraph>
      <Paragraph>Micro excavators are particularly popular for basement developments and rear garden extensions.</Paragraph>
    </Section>

    <Section>
      <H2>Choosing Self Drive or Operated Hire</H2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <H3>Self Drive Hire</H3>
          <Paragraph>Best for:</Paragraph>
          <BulletList items={['Experienced contractors', 'Builders', 'Landscapers', 'Groundworkers', 'Domestic projects']} />
          <Paragraph>Advantages:</Paragraph>
          <BulletList items={['Lower costs', 'Greater flexibility', 'Longer hire periods', 'Immediate availability']} />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <H3>Operated Plant Hire</H3>
          <Paragraph>Ideal for:</Paragraph>
          <BulletList items={['Commercial developments', 'Specialist lifting', 'Large excavations', 'High-risk operations']} />
          <Paragraph>Advantages:</Paragraph>
          <BulletList items={['Qualified operators', 'Improved productivity', 'Reduced compliance concerns', 'Experienced machine operators']} />
        </div>
      </div>
    </Section>

    <Section>
      <H2>How to Compare Plant Hire Prices</H2>
      <Paragraph>Finding the cheapest quotation doesn't always mean securing the best value.</Paragraph>
      <Paragraph>Compare:</Paragraph>
      <BulletList items={['✔ Daily rate', '✔ Weekly rate', '✔ Delivery charges', '✔ Collection costs', '✔ Fuel policy', '✔ Damage waiver', '✔ Insurance', '✔ Machine age', '✔ Breakdown response', '✔ Replacement equipment', '✔ Weekend availability', '✔ Reviews', '✔ Depot location']} />
      <Paragraph>The overall project cost should always be considered rather than the headline hire price.</Paragraph>
    </Section>

    <Section>
      <H2>National Chains vs Independent London Hire Companies</H2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <H3>National Companies</H3>
          <Paragraph>Advantages</Paragraph>
          <BulletList items={['Large fleets', 'Multiple depots', 'Online booking', 'National coverage', 'Trade accounts', 'Consistent service']} />
          <Paragraph>Ideal for:</Paragraph>
          <BulletList items={['Large contractors', 'Multi-site projects', 'National businesses']} />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <H3>Independent London Suppliers</H3>
          <Paragraph>Often provide:</Paragraph>
          <BulletList items={['Lower prices', 'Flexible delivery', 'Better local knowledge', 'Faster response', 'Personal service', 'Competitive weekly rates']} />
        </div>
      </div>
      <Paragraph>Many independent suppliers can undercut larger companies while providing identical equipment from manufacturers such as JCB, Kubota, Takeuchi, Manitou, Thwaites and Genie.</Paragraph>
    </Section>

    <Section>
      <H2>Why Compare Prices Before Booking?</H2>
      <Paragraph>Construction equipment represents a significant project cost.</Paragraph>
      <Paragraph>Comparing suppliers can help reduce expenditure while improving availability.</Paragraph>
      <Paragraph>Benefits include:</Paragraph>
      <BulletList items={['Lower overall hire costs', 'Access to more suppliers', 'Better delivery options', 'Reduced downtime', 'Flexible hire periods', 'Improved project planning']} />
      <Paragraph>Instead of contacting multiple depots individually, compare equipment, specifications and prices in one place before booking directly with the supplier.</Paragraph>
    </Section>

    <Section>
      <H2>Related Categories</H2>
      <Paragraph>To help you find the right equipment for your next project, compare prices across:</Paragraph>
      <BulletList items={['Mini Digger Hire London', 'Excavator Hire London', 'Tool Hire London', 'Generator Hire London', 'Telehandler Hire London', 'Scissor Lift Hire London', 'Cherry Picker Hire London', 'Wacker Plate Hire London', 'Concrete Breaker Hire London', 'Dumper Hire London', 'Roller Hire London', 'Landscaping Equipment Hire', 'Powered Access Hire', 'Construction Equipment Hire', 'Building Equipment Hire']} />
      <Paragraph>These category pages create a strong internal linking structure while helping users compare specialist equipment for specific project requirements.</Paragraph>
    </Section>

    <Section>
      <H2>Frequently Asked Questions, Expert Advice, EEAT & Conclusion</H2>
      <H3>Frequently Asked Questions</H3>
      <div className="grid gap-4">
        {londonFaqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
            <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
            <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section>
      <H2>Expert Guide to Reducing Plant Hire Costs</H2>
      <Paragraph>Experienced contractors rarely book the first quotation they receive.</Paragraph>
      <Paragraph>Instead they compare:</Paragraph>
      <BulletList items={['Availability', 'Weekly discounts', 'Fuel policies', 'Delivery charges', 'Machine specification', 'Customer service', 'Equipment age']} />
      <Paragraph>Comparing several suppliers often saves considerably more than negotiating with a single company.</Paragraph>
      <Paragraph>For larger commercial projects, requesting quotations several weeks before work begins usually secures the best prices and availability.</Paragraph>
    </Section>

    <Section>
      <H2>Why Local Suppliers Often Offer Better Value</H2>
      <Paragraph>Independent London hire companies frequently provide:</Paragraph>
      <BulletList items={['Lower overheads', 'Flexible pricing', 'Better delivery windows', 'Faster response times', 'Local engineering support', 'Personal customer service']} />
      <Paragraph>National chains generally provide larger fleets and nationwide support, while local suppliers often compete by offering more competitive pricing and greater flexibility.</Paragraph>
      <Paragraph>Comparing both options helps identify the best overall value.</Paragraph>
    </Section>

    <Section>
      <H2>Plant Hire Safety Checklist</H2>
      <Paragraph>Before equipment arrives:</Paragraph>
      <BulletList items={['✓ Confirm access width', '✓ Check delivery route', '✓ Arrange suitable parking', '✓ Ensure adequate fuel', '✓ Confirm operator competence', '✓ Inspect underground services', '✓ Prepare level working area', '✓ Wear appropriate PPE', '✓ Check weather conditions', '✓ Photograph equipment on delivery']} />
      <Paragraph>These simple checks help reduce delays and minimise the risk of additional charges.</Paragraph>
    </Section>

    <Section>
      <H2>Why Compare Prices Using Tooli.uk?</H2>
      <Paragraph>Rather than contacting multiple hire companies individually, Tooli.uk allows users to compare suppliers in one place.</Paragraph>
      <Paragraph>Benefits include:</Paragraph>
      <BulletList items={['✔ Compare multiple suppliers', '✔ Find cheaper prices', '✔ View equipment availability', '✔ Compare delivery options', '✔ Search by postcode', '✔ Find nearby depots', '✔ Compare daily and weekly rates', '✔ No hidden booking fees', '✔ Suitable for domestic and commercial customers']} />
      <Paragraph>Whether you're hiring one breaker for a weekend or managing a major commercial development requiring multiple machines, comparing suppliers can save both time and money.</Paragraph>
    </Section>

    <Section>
      <H2>Popular Searches</H2>
      <Paragraph>Users regularly compare prices for:</Paragraph>
      <BulletList items={['Tool Hire London', 'Plant Hire London', 'Mini Digger Hire London', 'Excavator Hire London', 'Dumper Hire London', 'Roller Hire London', 'Telehandler Hire London', 'Cherry Picker Hire London', 'Scissor Lift Hire London', 'Generator Hire London', 'Wacker Plate Hire London', 'Concrete Breaker Hire London', 'Construction Equipment Hire London', 'Builders Tool Hire London', 'Powered Access Hire London']} />
    </Section>

    <Section>
      <H2>Related Pages</H2>
      <Paragraph>For complete coverage, create supporting pages targeting:</Paragraph>
      <BulletList items={['Mini Digger Hire London', 'Excavator Hire London', 'Micro Digger Hire London', 'Dumper Hire London', 'Roller Hire London', 'Telehandler Hire London', 'Scissor Lift Hire London', 'Boom Lift Hire London', 'Cherry Picker Hire London', 'Generator Hire London', 'Tool Hire Westminster', 'Tool Hire Croydon', 'Tool Hire Enfield', 'Tool Hire Camden', 'Tool Hire Bromley', 'Tool Hire Richmond', 'Tool Hire Barnet', 'Tool Hire Greenwich']} />
      <Paragraph>These location-specific pages strengthen topical authority and help capture borough-level search demand.</Paragraph>
    </Section>

    <Section>
      <H2>Final Thoughts</H2>
      <Paragraph>Finding affordable construction equipment in London no longer requires contacting numerous suppliers or spending hours requesting quotations.</Paragraph>
      <Paragraph>By comparing tool and plant hire prices from local independent depots alongside national hire companies, builders, contractors, landscapers and homeowners can secure competitive prices, improve equipment availability and reduce project costs.</Paragraph>
      <Paragraph>Whether you require a mini digger for a weekend landscaping project, a telehandler for a commercial development, powered access equipment for maintenance work or professional power tools for an interior refurbishment, comparing suppliers before booking ensures you receive the right equipment at the right price.</Paragraph>
      <Paragraph>With coverage across every London borough, transparent price comparisons and access to trusted suppliers, Tooli.uk helps construction professionals and homeowners make informed hiring decisions quickly and confidently.</Paragraph>
    </Section>
  </>
);

const manchesterFaqs = [
  {
    question: 'How much does it cost to hire a mini digger in Manchester?',
    answer:
      'Based on Tooli.uk network data, a 1.5-tonne tracked mini digger in Manchester typically costs between £[DATA] and £[DATA] per day including VAT. Weekly rates work out cheaper per day — expect to pay around £[DATA]–£[DATA] for a full week. Price varies by supplier, delivery distance, and whether attachments are included.',
  },
  {
    question: 'Which tool hire companies operate in Manchester?',
    answer:
      "Manchester is served by several national chains including HSS Hire, Speedy Services, and Brandon Hire Station, plus regional and independent hire yards across Trafford Park, Salford, Stockport, and Oldham. Tooli.uk compares prices across the available network so you don't have to contact them all individually.",
  },
  {
    question: 'Can I hire tools in Manchester without a trade account?',
    answer:
      "Yes. Most suppliers accept private hire with a valid form of ID and a credit or debit card for the deposit. You don't need a trade account or CSCS card to hire most general tools. For certain plant (telehandlers, MEWPs, larger excavators), some suppliers require proof of operator competency — CPCS or IPAF certification where relevant.",
  },
  {
    question: 'Do I need an IPAF licence to hire a cherry picker in Manchester?',
    answer:
      "You don't need an IPAF card to hire a Mobile Elevated Work Platform (MEWP) in Manchester — but you do need one to operate it legally on site under the Work at Height Regulations 2005. Most professional suppliers will ask to see your IPAF PAL card before handing over keys.",
  },
  {
    question: 'Is weekend tool hire available in Manchester?',
    answer:
      'Yes, most Manchester suppliers offer Saturday collection or delivery and Sunday returns. Some depots are open Saturday only — check individual supplier hours when comparing. Weekend hire packages (Friday–Monday return) can work out better value than two separate day rates. Tooli.uk shows weekend rates alongside day rates so you can compare.',
  },
  {
    question: 'Do Manchester tool hire companies deliver to site?',
    answer:
      'Yes, most do. Delivery charges vary by distance from the depot and the size of the equipment. Heavy plant (mini diggers, dumpers, rollers) typically attracts a delivery and collection charge on top of the hire rate. Always confirm this when comparing — Tooli.uk flags where delivery costs apply.',
  },
  {
    question: 'Can I hire tools in Manchester for just a few hours?',
    answer:
      'Some suppliers offer half-day rates, but most book by the day. If you only need a piece of kit for three or four hours, a full day rate still usually applies. For very short-term needs on power tools, consider whether purchasing outright or borrowing is more practical.',
  },
  {
    question: 'What happens if a hired tool breaks down on site in Manchester?',
    answer:
      "This depends on the supplier's terms. Most reputable hire companies will replace a faulty machine or offer a credit for downtime. Check the supplier's breakdown policy before you commit. Always inspect the kit on delivery and note any existing damage in writing — photograph it before use.",
  },
];

const manchesterContent = (
  <>
    <Section>
      <H2>Compare Tool & Plant Hire Prices in Manchester</H2>
      <Paragraph>
        Hiring a tool in Manchester without comparing prices first is like buying timber from the first merchant you pass on the A57 — you'll almost certainly overpay. Tooli.uk lets you compare tool hire prices from suppliers across Greater Manchester in one place: no phone calls, no holding music, no haggling. Whether you're pricing up a mini digger for a groundworks job in Salford or need a site dumper for a weekend extension in Didsbury, you'll find real rates here.
      </Paragraph>
    </Section>

    <Section>
      <H2>Why Compare Tool Hire in Manchester?</H2>
      <Paragraph>
        Manchester's construction market is one of the busiest outside London. With the city centre seeing sustained commercial development around Deansgate, NOMA, and the Northern Quarter, plus a rolling programme of residential builds across Ancoats, Hulme, and Salford Quays, demand for hired kit stays high year-round.
      </Paragraph>
      <Paragraph>
        That demand pressure means prices vary more than most hirers realise. The same 1.5-tonne tracked mini digger can cost significantly differently per day depending on which supplier you contact first. The depot on the Trafford Park industrial estate prices differently to the independent yard in Rochdale. Both might be available for your job dates. Only one is cheapest.
      </Paragraph>
      <Paragraph>That's the gap Tooli.uk closes.</Paragraph>
    </Section>

    <Section>
      <H2>Manchester's Tool Hire Suppliers — What's Out There</H2>
      <Paragraph>
        Greater Manchester has a strong mix of national chains with local depots and independent hire yards. Here's the honest lay of the land.
      </Paragraph>
      <H3>National Chains With Manchester Depots</H3>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">HSS Hire</p>
          <Paragraph>Has depots serving central Manchester and the surrounding areas. Good for online booking and a wide catalogue though their trade counter hours aren't always the most flexible for early starts.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Speedy Services</p>
          <Paragraph>Operates across Greater Manchester with strong coverage for larger plant. Suited to main contractors and site managers who need account facilities and fleet-scale hire.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Brandon Hire Station</p>
          <Paragraph>Has a presence across the North West. Generally competitive on power tools and access equipment. Less strong on heavy plant compared to specialists.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Hewden</p>
          <Paragraph>Operating regionally — worth checking for larger civil engineering plant if you're working on bigger groundworks contracts around Salford or Trafford.</Paragraph>
        </div>
      </div>
      <H3>What Tooli UK Does Differently</H3>
      <Paragraph>
        None of those sites show you all the others side by side. You'd have to visit four websites, call two depots, and wait for callbacks before you had a complete picture. Tooli.uk compares them in one search so you can see who's cheapest, who delivers to your postcode, and who has availability on your dates.
      </Paragraph>
    </Section>

    <Section>
      <H2>Manchester Postcodes We Cover</H2>
      <Paragraph>Tooli UK's supplier network covers all Greater Manchester postcodes, including:</Paragraph>
      <BulletList
        items={[
          'City centre & inner areas: M1, M2, M3, M4, M5, M6, M8, M9, M11, M12, M13, M14, M15, M16',
          'North & east Manchester: M24 (Middleton), M25 (Prestwich), M26 (Radcliffe), M27 (Pendlebury), M28 (Worsley), M29 (Tyldesley)',
          'Salford: M6, M7, M27, M30, M50',
          'Stockport: SK1–SK7 (Stockport, Edgeley, Cheadle, Hazel Grove, Bramhall)',
          'Bolton: BL1–BL7',
          'Oldham: OL1–OL9',
          'Rochdale: OL11–OL16',
          'Bury: BL8–BL9',
          'Wigan: WN1–WN8',
          'Ashton-under-Lyne / Tameside: OL6–OL7, SK14–SK16',
        ]}
      />
      <Paragraph>
        If your site postcode isn't listed, run a comparison search on Tooli.uk — our network extends into Lancashire and Cheshire borders too.
      </Paragraph>
    </Section>

    <Section>
      <H2>Trades We Serve in Manchester</H2>
      <Paragraph>Manchester's trades are busy. Here's who Tooli.uk is built for in this city:</Paragraph>
      <div className="space-y-3">
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Groundworkers and civil contractors</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Working on the ongoing residential expansion across Ancoats, Collyhurst, and Middlewood Locks. Mini diggers, dumpers, and vibrating rollers are the bread and butter.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Landscapers</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Garden projects in Didsbury, Chorlton, Hale, and Altrincham run heavy in spring and summer. Rotavators, mini diggers, skid steers, and plate compactors.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Plasterers and drylining contractors</p>
          <p className="mt-1 text-sm font-medium text-gray-500">The tower build boom across Manchester city centre keeps this trade busy. Scaffold towers, mixing equipment, and dehumidifiers for new-build first-fix.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Roofers</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Covering terraced and semi-detached stock across Salford, Eccles, and Gorton. Access towers, materials hoists, and safety kit.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Decorators and refurb contractors</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Airbnb refurbs and HMO conversions across student areas (Fallowfield, Withington, Victoria Park). Scaffold towers, floor sanders, wallpaper steamers.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Electricians and plumbers</p>
          <p className="mt-1 text-sm font-medium text-gray-500">First and second fix on new residential. Core drills, cable pullers, press tools.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Builders and small-to-medium contractors</p>
          <p className="mt-1 text-sm font-medium text-gray-500">The bread and butter of Greater Manchester's trade economy. Every type of kit.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Homeowners and serious DIYers</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Extension projects in Worsley, Sale, and Stretford. Weekend hire is always available.</p>
        </div>
      </div>
    </Section>

    <Section>
      <H2>How to Compare Tool Hire in Manchester on Tooli.uk</H2>
      <Paragraph>Straightforward. No account needed.</Paragraph>
      <StepList
        steps={[
          'Enter the equipment you need (e.g. "mini digger" or "scaffold tower")',
          'Enter your postcode or area (e.g. M14 or Didsbury)',
          'Select your hire dates',
          'Compare prices from available suppliers side by side',
          'Click through to book directly with the supplier you choose',
        ]}
      />
      <Paragraph>
        Tooli.uk doesn't take a booking fee. We don't mark up prices. We're a comparison platform — our job is to show you the options clearly so you can make the right call.
      </Paragraph>
    </Section>

    <Section>
      <H2>FAQ: Tool Hire in Manchester</H2>
      <div className="grid gap-4">
        {manchesterFaqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
            <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
            <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
          </div>
        ))}
      </div>
    </Section>
  </>
);

const birminghamFaqs = [
  {
    question: 'How much does it cost to hire a mini digger in Birmingham?',
    answer:
      'Based on Tooli.uk network data, a 1.5-tonne tracked mini digger in Birmingham costs [DATA] per day including VAT. Prices vary by supplier, delivery distance, and attachment. Compare current rates across Birmingham-area suppliers on Tooli.uk.',
  },
  {
    question: 'Which tool hire companies cover Birmingham?',
    answer:
      "Birmingham is served by national chains including HSS Hire, Speedy Services, Brandon Hire Station, and Sunbelt Rentals, alongside West Midlands independent hire yards. Tooli.uk compares prices across the network so you see all available options for your postcode and dates in a single search.",
  },
  {
    question: 'Do I need a licence to operate a mini digger in Birmingham?',
    answer:
      "No licence is legally required to operate a mini digger on private land. On commercial sites, operators should hold a CPCS (Construction Plant Competence Scheme) or equivalent card. Operators on public contracts or council works are almost always required to hold CPCS. The Health and Safety Executive's PUWER regulations require that anyone operating plant must be competent to do so safely, regardless of site type.",
  },
  {
    question: 'Does Birmingham have a Clean Air Zone affecting hired plant?',
    answer:
      "Yes. Birmingham's Clean Air Zone covers the area within the A4540 Middleway. Commercial vehicles that don't meet Euro 6 (diesel) or Euro 3 (petrol) standards face a daily charge. When hiring plant delivered by vehicle into this zone, confirm with your supplier that their delivery fleet is CAZ-compliant. Most national depots operate compliant vehicles; check with independents.",
  },
  {
    question: 'Can I hire tools in Birmingham at the weekend?',
    answer:
      'Yes. Most Birmingham-area suppliers offer Saturday delivery and collection, with some offering Sunday returns. Weekend hire packages (Friday to Monday) often represent better value than separate day rates. Weekend availability is limited during peak spring and summer months — book at least five working days ahead for Saturday delivery to avoid disappointment.',
  },
  {
    question: 'Do Birmingham tool hire companies deliver to Solihull and the Black Country?',
    answer:
      "Most do, though delivery charges and lead times vary by distance from the depot. Tooli.uk shows delivery charges alongside hire rates so you can compare total costs, not just day rates. Solihull (B90–B94), Wolverhampton (WV1–WV14), and Dudley (DY1–DY9) are all within our supplier network's standard coverage area.",
  },
  {
    question: 'Can a homeowner hire tools in Birmingham, or is it trade only?',
    answer:
      "Any adult can hire tools and equipment in Birmingham — no trade account or CSCS card required for general tools and most plant. You'll typically need a valid photo ID and a credit or debit card to cover the damage deposit. For larger plant (telehandlers, larger excavators, MEWPs), some suppliers require proof of operator competency.",
  },
  {
    question: 'What should I check when a hired machine is delivered?',
    answer:
      'Inspect the machine before the delivery driver leaves. Check for pre-existing damage, fuel or oil levels, and confirm that all safety features (seatbelt, ROPS bar on diggers, alarm on MEWPs) are functional. Note any existing damage in writing and photograph it. This protects you from being charged for damage you did not cause on return.',
  },
];

const birminghamContent = (
  <>
    <Section>
      <H2>Compare Tool & Plant Hire Prices in Birmingham</H2>
      <Paragraph>
        Birmingham is one of the busiest construction cities in the UK outside London, and tool hire prices here vary more than most tradespeople expect. Tooli.uk compares rates from suppliers across the West Midlands in one place — no ringing round depots, no waiting for callbacks, no surprise extras on the invoice. Whether you're groundworking in Erdington, landscaping in Sutton Coldfield, or running a refurb in Digbeth, find the right kit at the right price and get on with the job.
      </Paragraph>
    </Section>

    <Section>
      <H2>Why Compare Tool Hire in Birmingham?</H2>
      <Paragraph>
        Birmingham is the UK's second-largest city by population and one of its most active construction markets. The Big City Plan — the largest city-centre regeneration project in UK history — has driven sustained demand for plant and equipment hire across the inner ring and beyond. Add in HS2 groundworks, the Midlands Metro expansion, and thousands of residential extensions and new builds across Solihull, Sutton Coldfield, and the Black Country, and you've got a hire market where kit is in constant demand and prices shift regularly.
      </Paragraph>
      <Paragraph>
        That competition between suppliers should work in your favour. But only if you know what everyone's charging. Same machine. Same job. Different invoice. Tooli.uk puts those numbers side by side so you can make an informed decision, not just a quick one.
      </Paragraph>
    </Section>

    <Section>
      <H2>Birmingham's Tool Hire Suppliers — The Honest Picture</H2>
      <Paragraph>
        Greater Birmingham is well served by national chains and a solid network of West Midlands independents. Here's what's out there.
      </Paragraph>
      <H3>National Chains With Birmingham Depots</H3>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">HSS Hire</p>
          <Paragraph>Has multiple points of service across Birmingham and the West Midlands. Online booking works well for standard power tools and access equipment. Trade counter stock and availability can vary across branches — worth confirming before you travel.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Speedy Services</p>
          <Paragraph>Has good West Midlands coverage and is a reasonable choice for account customers on larger projects. Particularly strong on plant and welfare units for commercial sites.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Brandon Hire Station</p>
          <Paragraph>Operates across the region and tends to be competitive on access equipment and power tools. Worth including in any comparison for smaller kit.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">A-Plant (now Sunbelt Rentals)</p>
          <Paragraph>Has a significant presence in the Midlands, particularly for larger plant and specialist equipment. Worth checking for telescopic handlers, road rollers, and excavators above 3 tonnes.</Paragraph>
        </div>
      </div>
      <H3>What Tooli.uk Does Differently</H3>
      <Paragraph>
        None of those companies shows you what the others charge. You'd need four browser tabs, two phone calls, and a fair amount of patience to get a complete picture. Tooli.uk does it in one search. You compare what's available for your postcode and your dates, then click straight through to book with the supplier you choose. We don't mark up prices. We don't take a booking fee. We're a comparison platform — our job ends when you've found the best deal.
      </Paragraph>
    </Section>

    <Section>
      <H2>Birmingham Postcodes We Cover</H2>
      <Paragraph>Tooli.uk's supplier network covers all Birmingham and West Midlands postcodes, including:</Paragraph>
      <BulletList
        items={[
          'Birmingham city & inner areas: B1–B20 (City Centre, Digbeth, Erdington, Handsworth, Aston, Newtown, Perry Barr, Witton, Lozells)',
          'South Birmingham: B14, B28, B30, B31 (Kings Heath, Hall Green, Stirchley, Northfield, Longbridge)',
          'East Birmingham: B8, B9, B10, B11, B25, B26, B33 (Bordesley, Small Heath, Sparkhill, Stechford, Sheldon, Kitts Green)',
          'West Birmingham / Black Country borders: B65, B66, B68, B69 (Rowley Regis, Smethwick, Oldbury, Tipton)',
          'Sutton Coldfield & north: B72, B73, B74, B75, B76 (Four Oaks, Mere Green, Walmley, Minworth)',
          'Solihull: B90, B91, B92, B93, B94 (Shirley, Solihull, Olton, Knowle, Balsall Common)',
          'Wolverhampton: WV1–WV14',
          'Coventry: CV1–CV8',
          'Walsall: WS1–WS12',
          'Dudley: DY1–DY9',
        ]}
      />
      <Paragraph>
        If your postcode isn't listed, run a search on Tooli.uk — our network extends into Staffordshire, Worcestershire, and Warwickshire borders.
      </Paragraph>
    </Section>

    <Section>
      <H2>Trades We Serve in Birmingham</H2>
      <Paragraph>Birmingham's trades market is as diverse as the city. Tooli.uk is built for all of them.</Paragraph>
      <div className="space-y-3">
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Groundworkers and civil contractors</p>
          <p className="mt-1 text-sm font-medium text-gray-500">HS2 enabling works, Midlands Metro infrastructure, and dense residential development across Sutton Coldfield and Solihull keep groundworkers stretched. Mini diggers, dumpers, vibrating rollers, and compaction equipment are the core hire items.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Landscapers</p>
          <p className="mt-1 text-sm font-medium text-gray-500">The large private gardens of Sutton Coldfield, Edgbaston, and Solihull generate steady commercial landscaping work. Mini diggers, skid steers, rotavators, and grab lorries.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Builders and main contractors</p>
          <p className="mt-1 text-sm font-medium text-gray-500">From terraced house extensions in Handsworth to new-build residential across the Worcestershire border. Every category of kit.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Plasterers and drylining contractors</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Birmingham's ongoing apartment conversion market (particularly around Jewellery Quarter, Digbeth, and Brindleyplace) keeps this trade in work. Scaffold towers, mixing equipment, dehumidifiers, and industrial fans.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Roofers</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Serving Birmingham's dense Victorian terrace stock across Moseley, Kings Heath, Erdington, and Bournville. Access towers, materials hoists, and safety equipment.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Decorators and refurb contractors</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Short-term residential refurbs, HMO conversions, and commercial fit-outs across the city. Scaffold towers, floor sanders, pressure washers, and steam strippers.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Electricians and plumbers</p>
          <p className="mt-1 text-sm font-medium text-gray-500">First and second fix across new residential and commercial. Core drills, pipe freezing kits, and cable pull systems.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Homeowners and serious DIYers</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Sutton Coldfield, Moseley, Harborne, and Edgbaston have a high concentration of owner-occupiers running significant self-managed projects. Weekend hire is consistently in demand.</p>
        </div>
      </div>
    </Section>

    <Section>
      <H2>How to Compare Tool Hire in Birmingham on Tooli.uk</H2>
      <Paragraph>No sign-up required. Here's how it works:</Paragraph>
      <StepList
        steps={[
          'Enter the equipment you need (e.g. "mini digger" or "scaffold tower")',
          'Enter your postcode or area (e.g. B15 or Edgbaston)',
          'Select your hire dates',
          'Compare available suppliers and prices side by side',
          'Click through to book directly with your chosen supplier',
        ]}
      />
      <Paragraph>No booking fees. No price mark-up. No third-party calls. Tooli.uk is a free comparison service.</Paragraph>
    </Section>

    <Section>
      <H2>Birmingham-Specific Notes for Hirers</H2>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">City centre access and delivery</p>
          <Paragraph>Birmingham city centre has restricted loading zones, one-way systems, and active tram infrastructure around the Midland Metro route on Corporation Street and Grand Central. If you're delivering plant to a B1–B5 postcode, confirm vehicle access routes and delivery windows with the supplier before booking. Early morning deliveries (before 7:30 a.m.) often avoid the worst of it.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">HS2 and major infrastructure impact</p>
          <Paragraph>HS2 demolition and enabling works across Digbeth, Bordesley, and the eastern ring have closed or restricted several routes into the city. This can affect delivery lead times from depots on the south and east sides. Build in an extra half-day lead time for city-centre and inner-ring deliveries when HS2 work is active on your route.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">West Midlands Clean Air Zone</p>
          <Paragraph>Birmingham's CAZ is one of the UK's most established, covering the city centre within the A4540 Middleway ring road. Commercial vehicles rated below Euro 6 (diesel) or Euro 3 (petrol) face a daily charge. When hiring diesel plant vehicles for delivery into the CAZ, confirm your supplier's fleet compliance. Most national chains operate compliant vehicles; verify with independents.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Spring and summer peak demand</p>
          <Paragraph>The combination of Birmingham's large owner-occupier suburbs and high landscaping demand means mini diggers and access equipment book out fast between April and September, particularly for weekends. For Saturday delivery, book at least five working days ahead. Bank holiday weekends: two weeks minimum.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Red soil and clay ground conditions</p>
          <Paragraph>Large parts of Birmingham and Solihull sit on Mercia Mudstone and Keuper Marl — heavy, sticky clay that becomes waterlogged quickly. On landscaping and groundworks jobs from October to March, specify tracked plant rather than wheeled wherever possible. Factor in extra time for spoil removal — clay is heavy and compresses differently to sandy soil.</Paragraph>
        </div>
      </div>
    </Section>

    <Section>
      <H2>FAQ: Tool Hire in Birmingham</H2>
      <div className="grid gap-4">
        {birminghamFaqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
            <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
            <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
          </div>
        ))}
      </div>
    </Section>
  </>
);

const leedsFaqs = [
  {
    question: 'How much does it cost to hire a mini digger in Leeds?',
    answer:
      'Mini digger hire in Leeds costs between £160 and £310 per day (VAT inclusive), depending on machine size. A 0.8–1.5 tonne micro digger typically runs £160–£220/day; a 3 tonne machine is £220–£310/day. Weekly rates drop the effective daily cost considerably — usually £480–£900 for a full week depending on size. Delivery charges apply on top unless included in the supplier\'s rate.',
  },
  {
    question: 'Can I hire tools in Leeds without a trade account?',
    answer:
      "Yes. All suppliers compared on Tooli.uk accept bookings from private individuals, homeowners, and tradespeople without a pre-existing account. You'll typically need a valid ID and a payment card. Trade accounts offer benefits (credit terms, discounts) but are not required to hire.",
  },
  {
    question: 'Do Leeds tool hire suppliers deliver on weekends?',
    answer:
      'Most do, yes. Saturday delivery is widely available across Leeds postcodes. Some suppliers offer a Friday-to-Monday weekend rate that works out cheaper than paying separate day rates for Saturday and Sunday. Sunday delivery is less common — confirm at booking.',
  },
  {
    question: 'What tool hire suppliers operate in Leeds?',
    answer:
      'Leeds is served by national chains (HSS Hire, Speedy Services, Brandon Hire Station, Jewson Tool Hire) and regional independents. Coverage spans city-centre depots (LS1–LS4) through to outer-ring locations serving Morley, Pudsey, Wetherby, and Garforth. Tooli.uk compares rates across suppliers currently active in the Leeds area.',
  },
  {
    question: 'Do I need a licence or certification to hire a digger in Leeds?',
    answer:
      'No licence is legally required to operate a mini digger on private land in the UK. However, CPCS (Construction Plant Competence Scheme) certification is required if operating on public roads or regulated construction sites. For any hired plant, PUWER requires that the operator is competent — meaning you have the knowledge and practical ability to use the machine safely. Untrained operation is both a legal risk and a safety issue.',
  },
  {
    question: "What's the cheapest tool hire option in Leeds for a one-day job?",
    answer:
      'For small tools (breakers, mixers, pressure washers), day rates typically start around £45–£75 (VAT inclusive). If your job is within range of a depot, self-collection saves the delivery charge and sometimes gets you a slightly better rate. Compare on Tooli.uk to see who\'s cheapest for your specific postcode and equipment.',
  },
  {
    question: 'Can I hire a scaffold tower in Leeds for a weekend?',
    answer:
      'Yes. Scaffold towers are widely available on weekend hire across Leeds. A 4-metre aluminium tower typically runs £75–£110 for a Friday-to-Monday period. Make sure the tower you hire is PASMA-compliant and that the person erecting it has completed PASMA training if it\'s going to be used on a construction site.',
  },
  {
    question: 'How far in advance do I need to book plant hire in Leeds?',
    answer:
      'For small tools and standard equipment, 24–48 hours is usually sufficient. For large plant (3+ tonne diggers, larger access platforms, telehandlers), 48–72 hours is recommended — especially in spring and summer when availability tightens. Last-minute hires are possible but selection and pricing are less favourable.',
  },
];

const leedsContent = (
  <>
    <Section>
      <H2>Tool Hire in Leeds: Compare Local Prices Before You Book</H2>
      <Paragraph>
        Tool hire prices in Leeds vary significantly depending on which supplier you call first — sometimes by 30% or more for the same piece of kit. Tooli.uk compares rates from local and national suppliers covering LS1 through to LS28, Morley, Horsforth, Rothwell, and beyond. Whether you're a groundworker pricing up a job in Beeston, a builder on a new-build in Garforth, or a homeowner cracking on with a driveway in Headingley — you'll find the best available price here without ringing round.
      </Paragraph>
    </Section>

    <Section>
      <H2>Why Tool Hire Prices Vary So Much Across Leeds</H2>
      <Paragraph>
        Leeds is a big city — and hire costs reflect that. A national chain depot in the city centre (LS1–LS3 corridor) might charge full rack rate. A regional independent in Morley or Seacroft might be 20–25% cheaper for the same day rate, with free delivery thrown in for jobs over two days.
      </Paragraph>
      <Paragraph>
        The rate also shifts depending on what's on hire. Demand spikes in spring (April–June) and September, when groundwork, landscaping, and roofing projects surge across South Leeds and the outer suburbs. Book ahead or prices and availability tighten fast.
      </Paragraph>
      <Paragraph>
        Tooli.uk pulls live-updated pricing from suppliers across the Leeds area so you compare the actual rate — not a brochure figure.
      </Paragraph>
    </Section>

    <Section>
      <H2>Most-Hired Equipment in Leeds — By Trade</H2>
      <Paragraph>Different trades dominate different postcodes across Leeds. Here's what gets hired most by each.</Paragraph>
      <div className="space-y-3">
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Groundworkers and landscapers (LS10, LS11, South Leeds)</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Mini diggers, dumpers, wacker plates, plate compactors, and trench rammers lead the list. Spring through summer is the peak season. Delivery to sites off the M62 and M621 corridors is typically next-morning.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Builders and extension contractors (LS16, LS17, North Leeds)</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Scaffold towers, electric breakers, concrete mixers, and skip loaders. North Leeds has a high volume of Victorian semi and terrace extension work running most of the year.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Plasterers and drylining contractors (LS6, LS7, inner Leeds)</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Paddle mixers, stilts, drywall lifters, and dehumidifiers for drying out after rendering. Fast-access city-centre depots suit these short-notice daily hires.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Decorators and homeowners (LS8, LS9, Harehills, Roundhay)</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Steam wallpaper strippers, floor sanders, carpet lifters, skip bags, and pressure washers. Weekend availability is key for this group — most want Saturday pickup, Sunday return.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Roofers (LS12, LS13, Armley, Bramley)</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Scaffold towers, safety harness kits, roof ladders, and lead working tools. PASMA-compliant towers are required for safe working-at-height — check supplier certification at booking.</p>
        </div>
      </div>
    </Section>

    <Section>
      <H2>Delivery and Collection Across Leeds</H2>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Collection from depot</p>
          <Paragraph>Same-day in most cases. City-centre depots (LS1–LS4) typically have drop-in counters open from 07:00.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Delivery to site</p>
          <Paragraph>Next-morning delivery is standard across inner Leeds postcodes. Outer areas (Wetherby, Otley, Guiseley) may require 24–48 hours' notice.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Weekend hires</p>
          <Paragraph>Widely available. Friday-to-Monday weekend rates are offered by most suppliers — often better value than two separate day rates.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Long-term hire</p>
          <Paragraph>Weekly and monthly rates available for equipment staying on-site. Ask suppliers about swap-out options for extended groundwork or renovation projects.</Paragraph>
        </div>
      </div>
      <Paragraph>Delivery charges vary. Some suppliers include free delivery on hires over £150/day or within a set radius of their depot. Tooli.uk shows total cost including delivery so there are no surprises.</Paragraph>
    </Section>

    <Section>
      <H2>Tool Hire for Leeds Tradespeople — Trade Accounts</H2>
      <Paragraph>If you're hiring regularly, a trade account with a local supplier cuts admin time and often unlocks 10–15% off rack rate. Most Leeds-area depots — national chains included — offer:</Paragraph>
      <BulletList items={['30-day invoiced payment terms', 'VAT receipts for every hire (HMRC-compliant)', 'Named-account pricing (slightly below walk-in rates)', 'Priority booking during busy periods']} />
      <Paragraph>Even with a trade account, it's worth checking Tooli.uk first. Supplier-specific accounts lock you into one depot's rate. Comparing across the Leeds network first means you know whether your account rate is actually competitive.</Paragraph>
    </Section>

    <Section>
      <H2>Leeds Building Activity: What's Driving Hire Demand</H2>
      <Paragraph>Leeds is one of the fastest-growing construction markets in the north of England. Several large-scale factors push tool and plant hire demand across the city year-round:</Paragraph>
      <div className="space-y-3">
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Residential development</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Major housing schemes across East Leeds (Killingbeck, Cross Gates), South Leeds (Belle Isle, Middleton), and the outer ring (Seacroft, Kippax) keep groundwork and plant in constant demand.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Commercial and mixed-use</p>
          <p className="mt-1 text-sm font-medium text-gray-500">The South Bank regeneration, Kirkstall Forge, and ongoing development around Thorpe Park and Junction 45 of the M1 generate significant plant and equipment hire activity.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Highway and utilities works</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Yorkshire Water and National Highways schemes across the A1(M), M62, and Ring Road corridors produce steady demand for compaction equipment, trench digging, and temporary works gear.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
          <p className="text-sm font-black text-gray-800">Homeowner renovation</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Leeds has a large stock of pre-1919 terraced and semi-detached housing, particularly across LS6, LS7, LS8, LS10, and LS12. Renovations, kitchen extensions, and loft conversions drive steady demand for breakers, mixers, floor saws, and access equipment.</p>
        </div>
      </div>
    </Section>

    <Section>
      <H2>How to Get the Best Tool Hire Price in Leeds</H2>
      <Paragraph>Follow these four steps and you'll almost always pay less than the first quote you're given.</Paragraph>
      <StepList
        steps={[
          'Compare before you call. Use Tooli.uk to see what multiple Leeds suppliers are charging before picking up the phone. Prices differ by supplier and by day — a Tuesday booking sometimes beats a Monday for rate.',
          'Book the right duration. A weekend rate (Friday–Monday) often undercuts two separate day rates. A weekly rate almost always beats five daily rates. Work out your realistic timeframe and book accordingly.',
          'Check what\'s included. Fuel, delivery, consumables (chisels, blades), and damage waiver are the four hidden costs that inflate a seemingly cheap quote. Tooli.uk surfaces these at the comparison stage.',
          'Ask about attachments. A mini digger hired with a breaker or auger attachment from the same supplier is usually cheaper than sourcing them separately. Bundled hire saves logistics headaches too.',
        ]}
      />
    </Section>

    <Section>
      <H2>Safety and Compliance — What Leeds Hirers Need to Know</H2>
      <Paragraph>UK law requires that hired equipment is used safely and, in some cases, by certified operators. Here's the short version.</Paragraph>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">PUWER (Provision and Use of Work Equipment Regulations 1998)</p>
          <Paragraph>All hired work equipment must be suitable for purpose, maintained in safe condition, and used only by people who are competent to do so. You're responsible for this the moment the equipment leaves the depot.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">LOLER (Lifting Operations and Lifting Equipment Regulations 1998)</p>
          <Paragraph>Applies to any equipment used for lifting — including MEWP access platforms, telehandlers, and hoists. Pre-use checks are required; thorough examination certificates must be available.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">Working at Height Regulations 2005</p>
          <Paragraph>Scaffold towers must be erected by competent persons. PASMA certification is the accepted standard for mobile access towers. Check whether your supplier's delivery team erects and certifies the tower or whether that's your responsibility.</Paragraph>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-2 font-extrabold text-gray-900">IPAF</p>
          <Paragraph>Powered access platforms (cherry pickers, scissor lifts) require a valid IPAF PAL card for the platform category being used. Suppliers are required to check; if yours doesn't, that's a red flag.</Paragraph>
        </div>
      </div>
    </Section>

    <Section>
      <H2>Trades We Serve in Leeds</H2>
      <Paragraph>Tooli.uk covers tool and plant hire comparison for all trades operating across Leeds:</Paragraph>
      <BulletList
        items={[
          'Groundworkers and civil contractors',
          'Builders and general contractors',
          'Landscapers and garden design contractors',
          'Plasterers and rendering specialists',
          'Roofers and cladding contractors',
          'Electricians and M&E contractors',
          'Decorators and interior fit-out trades',
          'Scaffolding contractors',
          'Homeowners and self-build project managers',
        ]}
      />
    </Section>

    <Section>
      <H2>FAQ: Tool Hire in Leeds</H2>
      <div className="grid gap-4">
        {leedsFaqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5">
            <h4 className="mb-2 text-lg font-extrabold text-gray-900">{faq.question}</h4>
            <p className="font-medium leading-relaxed text-gray-500">{faq.answer}</p>
          </div>
        ))}
      </div>
    </Section>
  </>
);

export const locationPages: LocationPageData[] = [
  {
    slug: 'london',
    name: 'London',
    path: '/locations/london',
    metaTitle: 'Tool & Plant Hire London | Compare Prices from Local Suppliers',
    metaDescription:
      'Compare tool and plant hire prices across London from trusted local suppliers and national hire companies. Find the cheapest rates on mini diggers, excavators, dumpers, generators, telehandlers, access platforms and power tools. No booking fees. Compare prices in minutes.',
    canonicalUrl: 'https://www.tooli.uk/locations/london',
    title: 'Compare Tool & Plant Hire Prices in London – Find the Cheapest Rates Fast',
    description:
      'Compare tool hire and plant hire prices from local independent depots alongside national hire companies serving Greater London.',
    image: '/images/london-hero.webp',
    faqs: londonFaqs,
    content: londonContent,
  },
  {
    slug: 'manchester',
    name: 'Manchester',
    path: '/locations/manchester',
    metaTitle: 'Tool & Plant Hire Manchester | Compare Prices from Local Suppliers',
    metaDescription:
      'Compare tool hire and plant hire prices across Greater Manchester from trusted local suppliers and national hire companies. Find the cheapest rates on mini diggers, scaffold towers, dumpers, generators, and more. No booking fees.',
    canonicalUrl: 'https://www.tooli.uk/locations/manchester',
    title: 'Tool & Plant Hire Comparison in Manchester — Find the Best Price Before You Book',
    description:
      'Compare tool hire prices from suppliers across Greater Manchester in one place. No phone calls, no haggling — real rates from trusted local and national suppliers.',
    image: '/images/hero.jpg',
    faqs: manchesterFaqs,
    content: manchesterContent,
  },
  {
    slug: 'birmingham',
    name: 'Birmingham',
    path: '/locations/birmingham',
    metaTitle: 'Tool & Plant Hire Birmingham | Compare Prices from Local Suppliers',
    metaDescription:
      'Compare tool hire and plant hire prices across Birmingham and the West Midlands from trusted local suppliers and national hire companies. Find the cheapest rates on mini diggers, scaffold towers, dumpers, generators, and more. No booking fees.',
    canonicalUrl: 'https://www.tooli.uk/locations/birmingham',
    title: 'Tool & Plant Hire Comparison in Birmingham — Compare Prices Before You Book',
    description:
      'Compare tool hire rates from suppliers across the West Midlands in one place. No ringing round depots, no callbacks, no surprise extras — just real prices side by side.',
    image: '/images/birmingham-hero.webp',
    faqs: birminghamFaqs,
    content: birminghamContent,
  },
  {
    slug: 'leeds',
    name: 'Leeds',
    path: '/locations/leeds',
    metaTitle: 'Tool Hire Leeds | Compare Local Prices Before You Book | Tooli.uk',
    metaDescription:
      'Compare tool hire prices from local and national suppliers across Leeds. Find the best rates on mini diggers, scaffold towers, breakers, floor saws, and more. No booking fees. VAT inclusive prices.',
    canonicalUrl: 'https://www.tooli.uk/locations/leeds',
    title: 'Tool Hire in Leeds: Compare Local Prices Before You Book',
    description:
      'Compare tool hire rates from local and national suppliers covering LS1 through to LS28, Morley, Horsforth, Rothwell, and beyond — no ringing round, no callbacks.',
    image: '/images/leeds-hero.webp',
    faqs: leedsFaqs,
    content: leedsContent,
  },
];

export const locationNavItems = locationPages.map(({ name, path }) => ({ name, path }));
