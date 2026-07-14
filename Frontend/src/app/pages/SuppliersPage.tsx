import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { CheckCircle, Calendar, PoundSterling, Clock, BarChart3, Settings, CreditCard, Truck, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

const supplierTypes = [
  ['Independent hire depots', 'Single-site or multi-site independents that need visibility beside national brands.'],
  ['Regional hire chains', 'List each depot with its own postcode coverage, delivery radius, and equipment list.'],
  ['Plant hire operators', 'Excavators, dumpers, telehandlers, rollers, and site vehicles with detailed plant listings.'],
  ['Builders merchants with hire desks', 'Put your hire inventory in front of customers who may not know you offer hire.'],
  ['Scaffolding and access specialists', 'IPAF and PASMA-compliant stock can be flagged as a competitive advantage.'],
];

const supplierStandards = [
  'Hold current public liability insurance with a minimum £2 million cover',
  'Comply with PUWER 1998 so hire equipment is maintained and fit for use',
  'Provide LOLER examination certificates for lifting equipment where required',
  'Be a registered UK business, sole trader, limited company, or partnership',
  'Maintain accurate rate information for day, weekend, and week hire',
];

const supplierFaqs = [
  ['We already have our own website - why list on Tooli.uk?', 'Your website captures customers who already know your name. Tooli captures customers searching by equipment type and location who do not know you yet.'],
  ['Can we list multiple depots?', 'Yes. Each depot gets its own listing with its own postcode, delivery radius, and equipment inventory.'],
  ['Do we have to list our prices publicly?', 'Supplier listings can show the information customers need to make a booking decision. We can confirm the exact listing requirements during onboarding.'],
  ['Can we update our rates seasonally?', 'Yes. You can update rates through your supplier dashboard as demand changes.'],
  ['Do we need to offer delivery to be listed?', 'No. Collection-only depots can be listed, with delivery availability and charges clearly shown where relevant.'],
];

export function SuppliersPage() {
  return (
    <div className="w-full bg-white">
      <PageMeta
        title="List Your Hire Depot on Tooli.uk | Reach More UK Customers"
        description="Get your tool hire or plant hire business in front of thousands of UK tradespeople and DIYers searching for equipment right now. Free to list. No long contracts."
        canonicalUrl="https://www.tooli.uk/suppliers"
      />
      {/* Hero Section */}
      <section className="relative min-h-[560px] md:h-[500px] flex items-center overflow-hidden bg-[#F8F9FC] md:bg-white">
        <div className="absolute inset-0 z-0">
          <div className="container mx-auto px-4 h-full flex items-center justify-end">
            <div className="absolute inset-0 md:relative md:w-3/5 h-full">
              <img
                src="/images/hero.jpg"
                alt="Construction Equipment"
                className="w-full h-full object-cover opacity-20 md:opacity-90"
                style={{ maskImage: 'linear-gradient(to left, black 70%, transparent)', WebkitMaskImage: 'linear-gradient(to left, black 70%, transparent)' }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl py-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#030213] mb-5 md:mb-6 leading-tight">
              Grow Your Hire Business. Get Listed on Tooli.uk.
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-medium mb-7 md:mb-8 max-w-md leading-relaxed">
              Put your tool hire or plant hire business in front of tradespeople, site managers, and homeowners searching for equipment near them. No cold calling. No expensive ad spend. Just qualified local enquiries from people ready to book.
            </p>

            <div className="mb-6">
              <Link to="/signup">
                <Button className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-sm sm:text-base md:text-lg transition-all shadow-lg shadow-orange-500/20 w-full sm:w-auto">
                  List Your Equipment
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400 font-bold mb-8 md:mb-10 italic">Free to list for early partners. No long contracts.</p>

            <div className="grid sm:flex sm:flex-wrap gap-3 sm:gap-8">
              <div className="flex items-center gap-2 text-brand-success font-bold">
                <CheckCircle className="w-5 h-5" />
                Qualified enquiries
              </div>
              <div className="flex items-center gap-2 text-brand-success font-bold">
                <CheckCircle className="w-5 h-5" />
                Postcode-level matching
              </div>
              <div className="flex items-center gap-2 text-brand-success font-bold">
                <CheckCircle className="w-5 h-5" />
                Your rates, your customers
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why List on Tooli Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213]">The UK Hire Market Has a Visibility Problem</h2>
            <p className="text-base sm:text-lg text-gray-500 font-medium max-w-3xl mx-auto mt-4 leading-relaxed">
              Customers type "mini digger hire near me" and often see the same national brands first. Tooli surfaces independent and regional hire companies alongside national names so the customer sees the full picture and the best price wins.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center flex flex-col items-center bg-[#F8F9FC] md:bg-transparent rounded-2xl p-6 md:p-0">
              <Calendar className="w-10 h-10 md:w-12 md:h-12 text-brand-primary mb-5 md:mb-6" />
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Your Own Depot Profile</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Show your business name, location, delivery radius, equipment categories, contact details, and customer ratings.
              </p>
            </div>

            <div className="text-center flex flex-col items-center bg-[#F8F9FC] md:bg-transparent rounded-2xl p-6 md:p-0">
              <PoundSterling className="w-10 h-10 md:w-12 md:h-12 text-brand-primary mb-5 md:mb-6" />
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Visible in the Comparison Engine</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Your depot appears when customers compare equipment in your area, with the key listing details they need to contact you.
              </p>
            </div>

            <div className="text-center flex flex-col items-center bg-[#F8F9FC] md:bg-transparent rounded-2xl p-6 md:p-0">
              <Clock className="w-10 h-10 md:w-12 md:h-12 text-brand-primary mb-5 md:mb-6" />
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Postcode-Based Matching</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Customers enter their postcode and Tooli surfaces depots closest to them with the right kit.
              </p>
            </div>

            <div className="text-center flex flex-col items-center bg-[#F8F9FC] md:bg-transparent rounded-2xl p-6 md:p-0">
              <BarChart3 className="w-10 h-10 md:w-12 md:h-12 text-brand-primary mb-5 md:mb-6" />
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Compliance Flagging</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Highlight IPAF-certified access equipment, LOLER-inspected lifting gear, and PUWER-compliant plant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-[#F8F9FC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213]">How Getting Listed on Tooli.uk Works</h2>
          </div>

          <div className="bg-white rounded-2xl md:rounded-[40px] p-6 sm:p-10 md:p-16 shadow-sm border border-gray-100 max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 md:mb-6">
                  <Settings className="w-7 h-7 md:w-8 md:h-8 text-brand-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">1. Create Your Supplier Profile</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Tell us about your depot, location, delivery radius, equipment categories, and standard rates.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 md:mb-6">
                  <Calendar className="w-7 h-7 md:w-8 md:h-8 text-brand-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">2. Your Rates Go Live</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">When a local customer searches for kit you stock, your rates appear in the comparison results.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 md:mb-6">
                  <CreditCard className="w-7 h-7 md:w-8 md:h-8 text-brand-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">3. Get the Enquiry Direct</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Customers click through to your listing or contact you direct. You own the customer relationship.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 md:mb-6">
                  <Truck className="w-7 h-7 md:w-8 md:h-8 text-brand-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">4. Pay When It Works</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Tooli is built around useful leads and bookings, not impressions that go nowhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-14">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">Who Should List on Tooli.uk?</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-6">
                Tooli.uk is open to legitimate UK hire businesses that want to be found when customers compare equipment by type, price, and postcode.
              </p>
              <div className="grid gap-4">
                {supplierTypes.map(([title, copy]) => (
                  <div key={title} className="bg-[#F8F9FC] rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-extrabold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">Why List Here Instead of Just Running Google Ads?</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-6">
                On Tooli.uk, you appear when someone is actively comparing prices. They already know what they need and are in decision mode.
              </p>
              <div className="bg-[#F8F9FC] rounded-2xl border border-gray-100 overflow-hidden">
                {[
                  ['Cost model', 'Google Ads: pay per click', 'Tooli: pay per lead / commission'],
                  ['Traffic intent', 'Mixed research and buying', 'Commercial price comparison stage'],
                  ['Setup effort', 'Ongoing ad management', 'Around 15 minutes to list'],
                  ['Visibility', 'Stops when budget runs out', 'Persistent listing'],
                  ['Local targeting', 'Complex postcode setup', 'Built in by delivery radius'],
                ].map(([label, ads, tooli]) => (
                  <div key={label} className="grid sm:grid-cols-[0.7fr_1fr_1fr] gap-3 p-4 border-b border-gray-100 last:border-b-0 text-sm">
                    <span className="font-extrabold text-gray-900">{label}</span>
                    <span className="text-gray-500 font-medium">{ads}</span>
                    <span className="text-gray-900 font-bold">{tooli}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can List Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-12 md:mb-20">What You Can List</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-3 md:gap-4 bg-[#F8F9FC] md:bg-transparent rounded-2xl p-4 md:p-0">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Excavators</span>
            </div>
            <div className="flex flex-col items-center gap-3 md:gap-4 bg-[#F8F9FC] md:bg-transparent rounded-2xl p-4 md:p-0">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Dumpers</span>
            </div>
            <div className="flex flex-col items-center gap-3 md:gap-4 bg-[#F8F9FC] md:bg-transparent rounded-2xl p-4 md:p-0">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Rollers</span>
            </div>
            <div className="flex flex-col items-center gap-3 md:gap-4 bg-[#F8F9FC] md:bg-transparent rounded-2xl p-4 md:p-0">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Telehandlers</span>
            </div>
            <div className="flex flex-col items-center gap-3 md:gap-4 bg-[#F8F9FC] md:bg-transparent rounded-2xl p-4 md:p-0">
              <div className="w-12 h-12 text-brand-primary"><Truck className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Access Equipment</span>
            </div>
            <div className="flex flex-col items-center gap-3 md:gap-4 bg-[#F8F9FC] md:bg-transparent rounded-2xl p-4 md:p-0">
              <div className="w-12 h-12 text-brand-primary"><Hammer className="w-12 h-12" /></div>
              <span className="font-bold text-sm text-gray-900">Tools & More</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F8F9FC]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-14">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">What Tooli.uk Is Not</h2>
              <div className="space-y-4 text-gray-500 font-medium leading-relaxed">
                <p><span className="font-bold text-gray-900">We're not a booking system.</span> We do not process payments, hold customer card details, or manage your hire contracts.</p>
                <p><span className="font-bold text-gray-900">We do not own the customer relationship.</span> When a customer clicks through, they are going to your business.</p>
                <p><span className="font-bold text-gray-900">We're not a franchise.</span> Listing does not change how you operate, what you charge, or who you work with.</p>
                <p><span className="font-bold text-gray-900">We do not favour national chains.</span> Results are ranked by relevance and proximity, not by who pays the most.</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-5">Our Standards for Listed Suppliers</h2>
              <div className="grid gap-3">
                {supplierStandards.map((standard) => (
                  <div key={standard} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
                    <CheckCircle className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
                    <span className="text-gray-600 font-medium">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-10 text-center">Questions From Hire Companies</h2>
          <div className="max-w-4xl mx-auto grid gap-4">
            {supplierFaqs.map(([question, answer]) => (
              <div key={question} className="rounded-2xl bg-[#F8F9FC] border border-gray-100 p-5 md:p-6">
                <h3 className="font-extrabold text-gray-900 mb-2">{question}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-[#FFF7F2] rounded-2xl md:rounded-[40px] p-6 sm:p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#030213] mb-4">Ready to Get More Hire Enquiries?</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-500 font-medium">Getting listed takes about 15 minutes. Bring your business details, insurance information, equipment categories, rates, and delivery radius.</p>
            </div>
            <div className="text-center md:text-right w-full md:w-auto">
              <Link to="/signup">
                <Button className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-sm sm:text-base md:text-lg transition-all shadow-lg shadow-orange-500/20 mb-4 w-full sm:w-auto">
                  List Your Equipment
                </Button>
              </Link>
              <p className="text-sm text-gray-400 font-bold italic">Free to list for early partners. No long contracts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
