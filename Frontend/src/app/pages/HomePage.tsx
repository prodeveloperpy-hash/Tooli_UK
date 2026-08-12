import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { CheckCircle, Search, BarChart3, MapPin, Calendar as CalendarIcon, ChevronRight, X, HardHat, Building2, Home } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { SearchableSelect } from '../components/ui/searchable-select';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { equipmentApi, Category, Location } from '../../context/equipment.api';
import { PageMeta } from '../components/PageMeta';
import { SearchWidget, SearchWidgetBadges } from '../components/SearchWidget';

const blogSliderPosts = [
  {
    slug: 'tool-hire-leeds-compare-prices-from-local-suppliers',
    category: 'Location Guides',
    title: 'Tool Hire in Leeds: Compare Prices From Local Suppliers',
    excerpt: 'Hire rates in Leeds are among the most competitive in the North. Compare mini diggers, scaffold towers, skips and more across the LS postcode district.',
    image: '/images/blog/tool-hire-leeds-compare-prices-from-local-suppliers.webp',
  },
  {
    slug: 'tool-hire-b1-birmingham-city-centre-postcode-area-guide',
    category: 'Location Guides',
    title: 'Tool Hire B1: Birmingham City Centre Postcode Area Guide',
    excerpt: 'B1 covers Broad Street, Brindleyplace and Five Ways. This guide covers generators, access platforms and disc cutters for commercial fit-out projects in B1.',
    image: '/images/blog/tool-hire-b1-birmingham-city-centre-postcode-area-guide.webp',
  },
  {
    slug: 'plant-hire-birmingham-compare-local-plant-hire-companies',
    category: 'Plant Hire Guide',
    title: 'Plant Hire Birmingham: Compare Local Plant Hire Companies',
    excerpt: 'Compare excavators, dumpers, telehandlers and road sweepers from West Midlands plant hire companies. Full rate guide for B postcodes.',
    image: '/images/blog/plant-hire-birmingham-compare-local-plant-hire-companies.webp',
  },
  {
    slug: 'mini-digger-hire-birmingham-prices-and-local-availability',
    category: 'Plant Hire Guide',
    title: 'Mini Digger Hire Birmingham: Prices & Local Availability',
    excerpt: 'Day rates for 0.8t to 5t mini excavators across Birmingham postcodes. Compare local digger hire suppliers before you book.',
    image: '/images/blog/mini-digger-hire-birmingham-prices-and-local-availability.webp',
  },
  {
    slug: 'plant-hire-manchester-compare-local-plant-hire-companies',
    category: 'Plant Hire Guide',
    title: 'Plant Hire Manchester: Compare Local Plant Hire Companies',
    excerpt: 'Compare excavators, dumpers and telehandlers from Manchester plant hire companies. Rate guide covering all M postcodes and Greater Manchester.',
    image: '/images/blog/plant-hire-manchester-compare-local-plant-hire-companies.webp',
  },
  {
    slug: 'tool-hire-manchester-compare-prices-from-local-suppliers',
    category: 'Location Guides',
    title: 'Tool Hire in Manchester: Compare Prices From Local Suppliers',
    excerpt: 'Manchester has one of the most competitive hire markets outside London. Compare prices from local and national depots across M postcodes.',
    image: '/images/blog/tool-hire-manchester-compare-prices-from-local-suppliers.webp',
  },
  {
    slug: 'scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained',
    category: 'Equipment Guides',
    title: 'Scaffold Tower Hire UK: Prices, Sizes and PASMA Rules Explained',
    excerpt: 'Everything you need to know before hiring a scaffold tower — sizes, weekly rates, PASMA rules and what happens if something goes wrong on site.',
    image: '/images/blog/scaffold-tower-hire-uk-prices-sizes-pasma-rules-explained.webp',
  },
  {
    slug: 'skip-hire-sizes-prices-uk-full-comparison-2026',
    category: 'Equipment Guides',
    title: 'Skip Hire Sizes & Prices UK: Full Comparison 2026',
    excerpt: 'Mini skip to 40-yard roll-on roll-off — full UK price guide for 2026. Includes permit rules, weight limits and when to choose a larger size.',
    image: '/images/blog/skip-hire-sizes-prices-uk-full-comparison-2026.webp',
  },
  {
    slug: 'mini-digger-hire-manchester-prices-and-local-availability',
    category: 'Plant Hire Guide',
    title: 'Mini Digger Hire Manchester: Prices & Local Availability',
    excerpt: 'Compare mini digger hire prices across Manchester postcodes. Local rates for 0.8t to 5t excavators with delivery across Greater Manchester.',
    image: '/images/blog/mini-digger-hire-manchester-prices-and-local-availability.webp',
  },
  {
    slug: 'tool-hire-birmingham-compare-prices-from-local-suppliers',
    category: 'Location Guides',
    title: 'Tool Hire in Birmingham: Compare Prices From Local Suppliers',
    excerpt: 'Compare tool hire prices from Birmingham suppliers. Coverage across B postcodes, Solihull and Sandwell — find the best local rate on Tooli.uk.',
    image: '/images/blog/tool-hire-birmingham-compare-prices-from-local-suppliers.webp',
  },
];

const faqs = [
  ['How do I compare tool hire prices in the UK?', 'Search on Tooli.uk by equipment type, postcode, and hire period. We return supplier options from multiple local and national hire companies side by side.'],
  ['What is the cheapest way to hire tools in the UK?', 'Compare before you book, choose the right hire period for your project, and check collection or delivery options before committing.'],
  ['Why are tool hire prices higher in London?', 'Depot operating costs, delivery logistics, and congestion charges push London rates above the national average, but the dense supplier market creates strong competition.'],
  ['Can I compare plant hire on Tooli as well as tool hire?', 'Yes. Tooli covers both tool hire and plant hire, including mini diggers, dumpers, scissor lifts, telehandlers, boom lifts, and compressors.'],
  ['Is Tooli free to use?', 'Yes. Comparing tool hire prices on Tooli.uk is completely free, and no account is required to search or view supplier rates.'],
];

const equipmentItems = [
  {
    path: '/equipment/excavator-hire-uk',
    name: 'Excavator Hire',
    tagline: 'Mini to large digger',
    description: 'Compare excavator hire from 0.8t micro diggers to 25t+ machines. Residential groundwork to major civil works.',
    image: '/images/excavator.png',
  },
  {
    path: '/equipment/dumper-hire-uk',
    name: 'Dumper Hire',
    tagline: 'Site & tracked dumpers',
    description: 'Compare 0.5T to 10T site dumpers. Forward tip, high-tip and tracked dumpers for groundwork and landscaping.',
    image: '/images/dumper-3.png',
  },
  {
    path: '/equipment/telehandler-hire-uk',
    name: 'Telehandler Hire',
    tagline: '6m to 17m lift height',
    description: 'Compare compact 6m machines to 17m high-reach telehandlers for block lifts, roofing and steel frame builds.',
    image: '/images/telehandler-1.png',
  },
  {
    path: '/equipment/compactor-hire-uk',
    name: 'Compactor Hire',
    tagline: 'Plates, rollers & rammers',
    description: 'Compare wacker plates, reversible plates, trench rammers and ride-on rollers. Sub-base to highway works.',
    image: '/images/compactor-1.png',
  },
  {
    path: '/equipment/scissor-lift-hire-uk',
    name: 'Scissor Lift Hire',
    tagline: 'Electric & rough terrain',
    description: 'Compare electric indoor, narrow aisle and rough terrain scissor lifts. IPAF certification required for all.',
    image: '/images/scissor-lift-1.png',
  },
  {
    path: '/equipment/generator-hire-uk',
    name: 'Generator Hire',
    tagline: 'Portable to industrial',
    description: 'Compare portable, site and industrial generators by kVA output. Temp power for fit-out, events and new-build.',
    image: '/images/generator-1.png',
  },
];

const locationItems = [
  {
    path: '/locations/london',
    name: 'London',
    postcode: 'E, EC, N, NW, SE, SW, W, WC',
    description: 'Compare tool hire from local depots and national chains across Greater London.',
    image: '/images/london-hero.webp',
  },
  {
    path: '/locations/manchester',
    name: 'Manchester',
    postcode: 'M1–M90, Greater Manchester',
    description: 'Compare tool hire prices across Greater Manchester from local and national suppliers.',
    image: '/images/manchester-hero.png',
  },
  {
    path: '/locations/birmingham',
    name: 'Birmingham',
    postcode: 'B1–B98, West Midlands',
    description: 'Compare tool and plant hire rates from suppliers across the West Midlands.',
    image: '/images/birmingham-hero.webp',
  },
  {
    path: '/locations/leeds',
    name: 'Leeds',
    postcode: 'LS1–LS28, West Yorkshire',
    description: 'Compare tool hire from local and national suppliers covering all LS postcodes.',
    image: '/images/leeds-hero.webp',
  },
  {
    path: '/locations/glasgow',
    name: 'Glasgow',
    postcode: 'G1–G78, Greater Glasgow',
    description: 'Compare tool hire rates from independents and national chains across Glasgow.',
    image: '/images/glasgow-hero.webp',
  },
  {
    path: '/locations/bristol',
    name: 'Bristol',
    postcode: 'BS1–BS16, Avonmouth',
    description: 'Compare tool hire prices from local and national suppliers across Bristol.',
    image: '/images/bristol-hero.webp',
  },
  {
    path: '/locations/liverpool',
    name: 'Liverpool',
    postcode: 'L1–L36, Merseyside',
    description: 'Compare tool hire rates covering Liverpool and the wider Merseyside area.',
    image: '/images/liverpool-hero.png',
  },
];

function LocationsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 260;
    scrollRef.current.scrollBy({ left: dir === 'right' ? cardWidth + 16 : -(cardWidth + 16), behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-20 bg-[#F8F9FC]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#030213]">Compare Tool Hire by Location</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">Find the best hire rates in your city from local and national suppliers.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => scroll('left')} aria-label="Scroll left" className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right" className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {locationItems.map((loc) => (
            <Link
              key={loc.path}
              to={loc.path}
              className="snap-start shrink-0 w-[220px] sm:w-[240px] md:w-[260px] rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-md hover:border-brand-primary/20 transition-all group flex flex-col"
            >
              <div className="h-36 overflow-hidden bg-gray-100 relative">
                <img
                  src={loc.image}
                  alt={`Tool hire ${loc.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white font-extrabold text-lg leading-none">{loc.name}</span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs font-bold text-brand-primary mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {loc.postcode}
                </span>
                <p className="text-xs text-gray-500 font-medium leading-relaxed flex-1">{loc.description}</p>
                <span className="mt-3 text-xs font-bold text-brand-primary flex items-center gap-1">
                  Compare prices <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4 md:hidden">
          <button onClick={() => scroll('left')} aria-label="Scroll left" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
          </button>
          <button onClick={() => scroll('right')} aria-label="Scroll right" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}

function EquipmentSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 280;
    scrollRef.current.scrollBy({ left: dir === 'right' ? cardWidth + 16 : -(cardWidth + 16), behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#030213]">Browse Equipment Categories</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">Compare hire prices across all major plant and tool categories.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => scroll('left')} aria-label="Scroll left" className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right" className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {equipmentItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="snap-start shrink-0 w-[240px] sm:w-[260px] md:w-[280px] rounded-2xl border border-gray-100 bg-[#F8F9FC] overflow-hidden hover:shadow-md hover:border-brand-primary/20 transition-all group flex flex-col"
            >
              <div className="h-40 overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs font-bold text-brand-primary mb-1">{item.tagline}</span>
                <h3 className="font-extrabold text-[#030213] text-base mb-2 group-hover:text-brand-primary transition-colors">{item.name}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed flex-1">{item.description}</p>
                <span className="mt-3 text-xs font-bold text-brand-primary flex items-center gap-1">
                  Compare prices <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4 md:hidden">
          <button onClick={() => scroll('left')} aria-label="Scroll left" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
          </button>
          <button onClick={() => scroll('right')} aria-label="Scroll right" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}

function BlogSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 320;
    scrollRef.current.scrollBy({ left: dir === 'right' ? cardWidth + 16 : -(cardWidth + 16), behavior: 'smooth' });
  };

  const categoryColour: Record<string, string> = {
    'Location Guides': 'bg-blue-100 text-blue-700',
    'Plant Hire Guide': 'bg-green-100 text-green-700',
    'Equipment Guides': 'bg-orange-100 text-orange-700',
  };

  return (
    <section className="py-16 md:py-24 bg-[#F8F9FC]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213]">Latest from the Tooli Blog</h2>
            <p className="text-gray-500 font-medium mt-2">Hire guides, price comparisons and expert advice for UK tradespeople.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {blogSliderPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[340px] rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="h-44 overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full self-start mb-3 ${categoryColour[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {post.category}
                </span>
                <h3 className="font-bold text-[#030213] leading-snug mb-2 text-sm group-hover:text-brand-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed flex-1">{post.excerpt}</p>
                <span className="mt-4 text-xs font-bold text-brand-primary flex items-center gap-1">
                  Read more <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4 md:hidden">
          <button onClick={() => scroll('left')} aria-label="Scroll left" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
          </button>
          <button onClick={() => scroll('right')} aria-label="Scroll right" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline"
          >
            View all articles <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchData, setSearchData] = useState({
    categoryId: '',
    locationId: '',
  });
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, locData] = await Promise.all([
          equipmentApi.getCategories(),
          equipmentApi.getLocations()
        ]);
        setCategories(Array.isArray(catData) ? catData : (catData as any).results || []);
        setLocations(Array.isArray(locData) ? locData : (locData as any).results || []);
      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!searchData.categoryId || !searchData.locationId) {
      setShowValidationErrors(true);
      return;
    }

    setShowValidationErrors(false);
    const params = new URLSearchParams();
    if (searchData.categoryId) params.append('category', searchData.categoryId);
    if (searchData.locationId) params.append('location', searchData.locationId);
    if (dateRange?.from) params.append('date_from', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange?.to) params.append('date_to', format(dateRange.to, 'yyyy-MM-dd'));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white">
      <PageMeta
        title="Compare Tool & Plant Hire Prices UK | Free Comparison | Tooli UK"
        description="Compare Tool and plant Hire Prices across the UK. Get competitive quotes from trusted local suppliers and find the best hire rates in minutes."
        canonicalUrl="https://www.tooli.uk/"
        image="https://www.tooli.uk/images/logo.webp"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': 'https://www.tooli.uk/#organization',
              name: 'Tooli.uk',
              url: 'https://www.tooli.uk',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.tooli.uk/images/logo.webp',
              },
              description: 'UK comparison platform for tool hire and plant hire prices',
              areaServed: {
                '@type': 'Country',
                name: 'United Kingdom',
              },
              sameAs: [
                'https://www.linkedin.com/company/tooli-uk',
                'https://twitter.com/tooliuk',
              ],
              knowsAbout: ['tool hire', 'plant hire', 'construction equipment hire', 'scaffolding hire'],
            },
            {
              '@type': 'WebPage',
              '@id': 'https://www.tooli.uk/#webpage',
              url: 'https://www.tooli.uk/',
              name: 'Tool Hire Comparison | Compare UK Prices | Tooli.uk',
              description: 'Compare tool hire and plant hire prices across the UK. Free, no account needed.',
              isPartOf: { '@id': 'https://www.tooli.uk/#website' },
              about: { '@id': 'https://www.tooli.uk/#organization' },
              datePublished: '2024-01-01',
              dateModified: '2026-08-04',
              inLanguage: 'en-GB',
              publisher: { '@id': 'https://www.tooli.uk/#organization' },
              breadcrumb: { '@id': 'https://www.tooli.uk/#breadcrumb' },
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
              mainEntity: faqs.map(([question, answer]) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: answer,
                },
              })),
            },
          ],
        }}
      />
      {/* Hero Section */}
      <section className="relative min-h-[760px] sm:min-h-[720px] md:h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Construction Equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-12 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 md:mb-6 text-white leading-[1.15] md:leading-[1.2]">
              <span className="text-[#e87525]">Plant &amp; Tool Hire Comparison</span> | Find the Best Rates Across the UK
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl font-medium leading-relaxed">
              Tooli.uk is a UK plant and tool hire comparison platform. Find the cheapest rates on everything from mini diggers to scaffold towers, plate compactors to access platforms. Enter your location, select equipment, and compare real-time prices from local and national suppliers including HSS, Speedy, Brandon, Smiths and independent depots. Comparison is free and no account required. Prices shown include VAT.
            </p>

            <SearchWidget showBadges={false} />
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <SearchWidgetBadges variant="dark" />
              <Link
                to="/how-it-works"
                className="inline-flex h-11 items-center rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 shrink-0"
              >
                How Tooli Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-4">How Tooli.UK Works For Tool Hire Comparison</h2>
            <p className="text-base sm:text-lg text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed mb-4">
              Finding the best tool hire deal is easy with Tooli.uk:
            </p>
            <ul className="text-base sm:text-lg text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed mb-4 text-left list-disc list-inside space-y-1">
              <li>Search for the equipment you need, from mini diggers to dumpers</li>
              <li>We show you the cheapest hire prices from local and national suppliers</li>
              <li>Click to get a quote or book online with your chosen hire company</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed mb-6">
              Whether you're a tradesperson, small builder or serious DIYer, we've got you covered. Our network includes a large number of UK tool hire depots, so you can compare deals in your area and get on site faster.
            </p>
            <div className="w-12 h-1 bg-brand-primary rounded-full mx-auto" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl md:rounded-[32px] bg-orange-50 flex items-center justify-center mb-5 md:mb-8 transition-transform group-hover:scale-105 md:group-hover:scale-110 duration-300">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#030213] mb-3 md:mb-4">1. Search</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Type what you need and choose your location and dates.
              </p>
            </div>

            <ChevronRight className="hidden md:block w-8 h-8 text-gray-100" />

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl md:rounded-[32px] bg-orange-50 flex items-center justify-center mb-5 md:mb-8 transition-transform group-hover:scale-105 md:group-hover:scale-110 duration-300">
                <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#030213] mb-3 md:mb-4">2. Compare</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                See supplier options, availability, delivery charges, and minimum hire periods side by side.
              </p>
            </div>

            <ChevronRight className="hidden md:block w-8 h-8 text-gray-100" />

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl md:rounded-[32px] bg-orange-50 flex items-center justify-center mb-5 md:mb-8 transition-transform group-hover:scale-105 md:group-hover:scale-110 duration-300">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#030213] mb-3 md:mb-4">3. Book</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Pick the best price and book with the supplier. No Tooli markup is added to your hire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Slider */}
      <LocationsSlider />

      {/* Who Uses Tooli.uk? */}
      <section className="py-16 md:py-20 bg-[#F8F9FC]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-10 text-center">Who Uses Tooli.uk?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white border border-gray-100 p-6 md:p-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-5">
                  <HardHat className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-extrabold text-[#030213] mb-3">Tradespeople</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  From sparkies to chippies, groundworkers to roofers — Tooli.uk helps tradespeople across the UK find the best tool hire deals in a tap. Pull up prices on your mobile, get a quote in seconds, and pick up what you need from a depot near your site.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-gray-100 p-6 md:p-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-5">
                  <Building2 className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-extrabold text-[#030213] mb-3">Small Builders</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  Margins tight on a job? Tooli.uk is the smart way to keep a small build on budget. We show you the day rate, weekend rate and weekly rate for every item, so you can plan ahead and never overpay on a hire.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-gray-100 p-6 md:p-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-5">
                  <Home className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-extrabold text-[#030213] mb-3">DIYers</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  Knee-deep in an extension or landscaping project? Tooli.uk compares mini digger hire, power tool hire, access tower hire and more — so you can crack on with the job using pro-grade kit at the cheapest price.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Compare Tool Hire Prices */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">Why Compare Tool Hire Prices?</h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-4">
              Tool hire costs can vary hugely between suppliers. For example, a 1-day 1.5t mini digger hire ranges from £80 to £150 + VAT across the UK. A week's 2m scaffold tower hire swings from £59 to £108. Even a simple plate compactor can vary by £20–£50 per day.
            </p>
            <p className="text-gray-500 font-medium leading-relaxed mb-4">
              Those differences add up fast — especially on a big project. By comparing hire rates first with Tooli.uk, you can slash your costs and keep more profit in your pocket.
            </p>
            <p className="text-gray-500 font-medium leading-relaxed mb-4">
              According to the{' '}
              <a href="https://www.cpa.uk.net" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-semibold">Construction Plant-hire Association (CPA)</a>
              , UK businesses spend over £4bn a year on tool and equipment hire. For smart firms, using a tool hire comparison engine like Tooli.uk is becoming standard practice on every job.
            </p>
            <p className="text-gray-500 font-medium leading-relaxed">
              At Tooli.uk, every hire price you see is inclusive of VAT, so there are no nasty surprises. And you can filter by IPAF, PASMA, PUWER and{' '}
              <a href="https://www.hse.gov.uk/work-equipment-machinery/loler.htm" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-semibold">LOLER compliance</a>
              , so your site stays on the right side of HSE regs.
            </p>
          </div>

        </div>
      </section>

      {/* Equipment Slider */}
      <EquipmentSlider />

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Trust Banner */}
          <div className="p-5 sm:p-8 md:p-16 bg-[#F8F9FC] rounded-2xl md:rounded-[48px] grid md:grid-cols-3 gap-6 md:gap-12 border border-gray-50">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Transparent Costs</h4>
                <p className="text-sm text-gray-500 font-medium">Delivery, fuel policies and minimum hire terms are shown upfront</p>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">UK Coverage</h4>
                <p className="text-sm text-gray-500 font-medium">Compare suppliers across London, Manchester, Birmingham, Leeds and beyond</p>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Fast Decisions</h4>
                <p className="text-sm text-gray-500 font-medium">One search returns multiple quotes in seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F8F9FC]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">Best Tool Hire Company UK - National Chains vs Local Depots</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-4">
                There is no single best tool hire company for every job, location, and budget. National chains offer broad coverage and standard processes. Independent depots often undercut national chains by 10 to 20% on standard equipment.
              </p>
              <p className="text-gray-500 font-medium leading-relaxed">
                Tooli compares both, filtered to your location and equipment type, so you can make the call with real prices in front of you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Slider */}
      <BlogSlider />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-10 text-center">FAQs - Compare Tool Hire Prices UK</h2>
          <div className="max-w-4xl mx-auto grid gap-4">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-2xl bg-[#F8F9FC] border border-gray-100 p-5 md:p-6">
                <h3 className="font-extrabold text-gray-900 mb-2">{question}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
