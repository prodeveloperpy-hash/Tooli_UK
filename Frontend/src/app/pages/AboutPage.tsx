import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, TrendingDown, Clock, Award, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="w-full">
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Tooli.uk
            </h1>
            <p className="text-xl text-muted-foreground">
              The UK's most trusted platform for comparing equipment hire prices. We connect construction professionals with verified suppliers across the country.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  We believe hiring construction equipment should be simple, transparent, and cost-effective. That's why we built Tooli.uk - to give construction professionals the power to compare prices, read verified reviews, and make informed decisions.
                </p>
                <p className="text-lg text-muted-foreground">
                  Since 2018, we've helped thousands of businesses across the UK save time and money on equipment hire, connecting them with reliable suppliers they can trust.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
                  <CardContent className="p-6">
                    <Award className="w-10 h-10 mb-3" />
                    <div className="text-3xl font-bold mb-1">8+</div>
                    <p className="text-blue-100">Years in Business</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
                  <CardContent className="p-6">
                    <Shield className="w-10 h-10 mb-3" />
                    <div className="text-3xl font-bold mb-1">500+</div>
                    <p className="text-purple-100">Verified Suppliers</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-0">
                  <CardContent className="p-6">
                    <TrendingDown className="w-10 h-10 mb-3" />
                    <div className="text-3xl font-bold mb-1">30%</div>
                    <p className="text-cyan-100">Average Savings</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
                  <CardContent className="p-6">
                    <Clock className="w-10 h-10 mb-3" />
                    <div className="text-3xl font-bold mb-1">24/7</div>
                    <p className="text-orange-100">Platform Access</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-2 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Verified Suppliers</h3>
                    <p className="text-muted-foreground">
                      Every supplier on our platform is thoroughly vetted and verified to ensure quality and reliability.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                      <TrendingDown className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
                    <p className="text-muted-foreground">
                      Compare prices from multiple suppliers in seconds to ensure you're always getting the best deal.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-2 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Save Time</h3>
                    <p className="text-muted-foreground">
                      No more calling around for quotes. Get instant price comparisons from hundreds of suppliers.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">How Our Pricing Works</h2>
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">For Customers</h3>
                    <p className="text-muted-foreground">
                      Tooli.uk is <span className="font-semibold text-foreground">100% free</span> for customers. Search, compare, and contact suppliers at no cost. We're here to help you find the best deals without any hidden fees.
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-2">For Suppliers</h3>
                    <p className="text-muted-foreground">
                      We charge suppliers a small commission only when they successfully complete a hire through our platform. This ensures we're aligned with both suppliers and customers to facilitate successful transactions.
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-2">Transparent Listings</h3>
                    <p className="text-muted-foreground">
                      All prices shown are the actual hire prices you'll pay to suppliers. We never mark up prices or add hidden fees. What you see is what you get.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Mail className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl mb-8 text-blue-100">
              Have questions? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:hello@tooli.uk">
                <Button size="lg" className="bg-white text-[var(--brand-primary)] hover:bg-gray-100">
                  Email Us
                </Button>
              </a>
              <Link to="/search">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Start Searching
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
