import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MessageCircle, Phone, Mail, FileText, ChevronRight } from 'lucide-react';

const faqs = [
  { q: 'How do I book equipment?', a: 'Simply search for the equipment you need, compare prices from local suppliers, and click "View Deal" to start the booking process.' },
  { q: 'Is insurance included?', a: 'Insurance policies vary by supplier. You will see insurance details on the supplier page before you finalize your booking.' },
  { q: 'Can I cancel my booking?', a: 'Cancellation policies are set by individual suppliers. Most allow free cancellation up to 48 hours before the hire starts.' },
  { q: 'How is delivery handled?', a: 'Suppliers offer either site delivery or yard collection. Delivery fees are calculated based on your location and the equipment size.' },
];

export function HelpPage() {
  return (
    <div className="w-full bg-[#f8f9fc] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How can we help?</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl text-center p-8">
            <div className="w-12 h-12 rounded-full bg-brand-accent/30 text-brand-primary flex items-center justify-center mx-auto mb-6">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-sm text-gray-500 mb-4">Mon-Fri, 9am-5pm</p>
            <p className="text-brand-primary font-bold">020 7123 4567</p>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl text-center p-8">
            <div className="w-12 h-12 rounded-full bg-brand-accent/30 text-brand-primary flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-500 mb-4">Average response: 5 mins</p>
            <Button className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl px-6">
              Start Chat
            </Button>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl text-center p-8">
            <div className="w-12 h-12 rounded-full bg-brand-accent/30 text-brand-primary flex items-center justify-center mx-auto mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-500 mb-4">Response within 24 hours</p>
            <p className="text-brand-primary font-bold">support@tooli.uk</p>
          </Card>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <FileText className="w-6 h-6 text-brand-primary" />
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-gray-50">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6 first:pt-0 last:pb-0">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center justify-between cursor-pointer group">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-primary transition-colors" />
                </h4>
                <p className="text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
