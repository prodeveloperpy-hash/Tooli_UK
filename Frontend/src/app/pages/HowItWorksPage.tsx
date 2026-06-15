import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Calendar, MapPin, Clock, Shield, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

const equipmentCategories = [
  ['Earthmoving & Plant Hire', 'Mini diggers, tracked dumpers, micro diggers, site dumpers, trench rollers, and plate compactors.'],
  ['Access Equipment', 'Scaffold towers, podium steps, push-around scissor lifts, boom lifts, and cherry pickers.'],
  ['Concrete & Groundworks', 'Concrete mixers, wacker plates, breakers, demolition hammers, trench rammers, and core drill rigs.'],
  ['Finishing & Flooring', 'Floor sanders, edge sanders, tile cutters, floor grinders, carpet strippers, and shot blasters.'],
  ['Power & Climate', 'Diesel generators, site lighting towers, industrial heaters, commercial dehumidifiers, and drying fans.'],
  ['Lifting & Material Handling', 'Chain blocks, lever hoists, pallet trucks, telehandlers, forklifts, material hoists, and engine cranes.'],
];

const userGroups = [
  ['Tradespeople and Independent Contractors', 'Hire equipment job by job and cut the time spent sourcing kit before work starts.'],
  ['Small Building Firms and Site Managers', 'Compare suppliers by delivery radius, availability, and rate fast enough to do before every job.'],
  ['Property Developers and Renovators', 'Compare prices across different UK locations from a single search interface.'],
  ['DIYers and Homeowners', 'See what a fair rate looks like before you call anyone, and spot the right weekend rate for your project.'],
];

const regions = [
  'London - all postcode zones, inner and outer',
  'South East - Kent, Surrey, Sussex, Essex, Hertfordshire, Oxfordshire',
  'South West - Bristol, Devon, Cornwall, Dorset, Somerset',
  'Midlands - Birmingham, Coventry, Nottingham, Leicester, Derby',
  'Yorkshire - Leeds, Sheffield, Bradford, Hull, York',
  'North West - Manchester, Liverpool, Preston, Blackpool',
  'North East - Newcastle, Sunderland, Middlesbrough, Durham',
  'Scotland - Glasgow, Edinburgh, Aberdeen, Dundee, Inverness',
  'Wales - Cardiff, Swansea, Newport, Wrexham',
];

export function HowItWorksPage() {
  return (
    <div className="w-full bg-white">
      <PageMeta
        title="Compare Tool & Plant Hire Prices UK | Tooli.uk"
        description="Compare tool hire and plant hire prices from hundreds of UK suppliers in seconds. Find the cheapest rate near you. Free to use - no account needed."
      />
      {/* Hero Section */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-[#F8F9FC] text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#030213] mb-4">
              How Tooli Works - Compare Tool Hire Prices Across the UK in Minutes
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
              Tooli is the UK's tool and plant hire comparison platform. No phone calls, no waiting for quotes, no guesswork. Just search, compare, and hire from the best supplier for your job, location, and budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* For Contractors Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-4">Three Simple Steps to Compare Tool Hire Prices UK</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 font-medium">Search once, compare complete costs, and book direct.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6 md:mb-8">
                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-base md:text-lg z-10">1</div>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl md:rounded-[40px] bg-orange-50 flex items-center justify-center transition-transform group-hover:scale-105 md:group-hover:scale-110 duration-300">
                  <Search className="w-10 h-10 md:w-12 md:h-12 text-brand-primary" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Search for Your Equipment</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Type in the tool or plant equipment you need, enter your postcode, and choose whether you need it for a day, weekend, or week.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6 md:mb-8">
                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-base md:text-lg z-10">2</div>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl md:rounded-[40px] bg-orange-50 flex items-center justify-center transition-transform group-hover:scale-105 md:group-hover:scale-110 duration-300">
                  <SlidersHorizontal className="w-10 h-10 md:w-12 md:h-12 text-brand-primary" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Compare Prices Side by Side</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                See supplier options, availability, delivery choices, minimum hire periods, and fuel policies upfront.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6 md:mb-8">
                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-base md:text-lg z-10">3</div>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl md:rounded-[40px] bg-orange-50 flex items-center justify-center transition-transform group-hover:scale-105 md:group-hover:scale-110 duration-300">
                  <Calendar className="w-10 h-10 md:w-12 md:h-12 text-brand-primary" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Choose Your Supplier and Book</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                Click through to confirm with the hire company directly. Tooli does not sit in the middle or add fees on top.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-[#F8F9FC] rounded-2xl md:rounded-[40px] py-8 md:py-16 px-5 sm:px-8 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            <div className="flex flex-row md:flex-row items-start text-left gap-4 md:border-r border-gray-200">
              <MapPin className="w-8 h-8 text-brand-primary shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Market Visibility</h4>
                <p className="text-sm text-gray-500 font-medium">Compare local independents and national chains together.</p>
              </div>
            </div>
            <div className="flex flex-row md:flex-row items-start text-left gap-4 md:border-r border-gray-200 md:pr-8">
              <Clock className="w-8 h-8 text-brand-primary shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Fast Results</h4>
                <p className="text-sm text-gray-500 font-medium">Make site decisions in seconds, not working days.</p>
              </div>
            </div>
            <div className="flex flex-row md:flex-row items-start text-left gap-4 md:border-r border-gray-200 md:pr-8">
              <Shield className="w-8 h-8 text-brand-primary shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Full-Cost Comparison</h4>
                <p className="text-sm text-gray-500 font-medium">Delivery, fuel, and deposit terms are visible before you choose.</p>
              </div>
            </div>
            <div className="flex flex-row md:flex-row items-start text-left gap-4">
              <Truck className="w-8 h-8 text-brand-primary shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Free to Search</h4>
                <p className="text-sm text-gray-500 font-medium">No subscription, no account needed, no obligation to book.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-4">What Equipment Can You Compare on Tooli?</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Tooli covers the full range of UK tool and plant hire, from small hand tools to heavy plant.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentCategories.map(([title, copy]) => (
              <div key={title} className="bg-[#F8F9FC] rounded-2xl p-6 border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F8F9FC]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-14">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">Who Uses Tooli?</h2>
              <div className="space-y-4">
                {userGroups.map(([title, copy]) => (
                  <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-extrabold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">Tool Hire Comparison Across the UK</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-6">
                Enter your postcode and we show what is available in your area, not a national price that ignores where your site actually is.
              </p>
              <div className="grid gap-3">
                {regions.map((region) => (
                  <div key={region} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
                    <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600 font-medium">{region}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">Tooli vs Calling a Depot Directly</h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              When you call a single depot, you get one price. It might be fair, or it might be 30% above what a supplier two miles away would charge. Tooli runs those comparisons for you in seconds, then you still book directly with the supplier.
            </p>
            <Link to="/search">
              <Button className="h-12 sm:h-14 px-6 sm:px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 w-full sm:w-auto">
                Start Comparing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Suppliers Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-[#FDF7F3] rounded-2xl md:rounded-[40px] overflow-hidden relative min-h-[0] md:min-h-[400px] flex items-center shadow-sm border border-orange-50">
            <div className="grid md:grid-cols-2 gap-0 md:gap-12 items-center w-full">
              <div className="p-6 sm:p-10 md:p-20 relative z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-4">For Suppliers</h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-500 font-medium mb-8 md:mb-10 max-w-sm leading-relaxed">
                  List your equipment on Tooli and connect with contractors in your area.
                </p>
                <Link to="/signup">
                  <Button className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-sm sm:text-base md:text-lg transition-all shadow-lg shadow-orange-500/20 w-full sm:w-auto">
                    List Your Equipment
                  </Button>
                </Link>
              </div>
              <div className="relative h-56 md:h-full block">
                <img 
                  src="/images/hero.jpg" 
                  alt="For Suppliers" 
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ maskImage: 'linear-gradient(to top, black 70%, transparent)', WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
