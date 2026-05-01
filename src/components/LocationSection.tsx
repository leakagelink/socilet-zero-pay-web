import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

const LocationSection: React.FC = () => {
  return (
    <section
      id="location"
      aria-labelledby="location-heading"
      className="w-full py-16 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Visit Our Office
          </span>
          <h2
            id="location-heading"
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            Web & App Development Company in Ayodhya Nagar, Bhopal
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Socilet is a leading digital services agency based in Ayodhya Nagar, Bhopal,
            Madhya Pradesh. We serve clients across Bhopal, Indore, Jabalpur, and globally
            in USA, Canada, UK, and Australia with our zero advance payment model.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Address Card */}
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border space-y-6">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              Our Bhopal Office
            </h3>

            <address className="not-italic space-y-4 text-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Socilet — Digital Services Agency</p>
                  <p className="text-muted-foreground">
                    Ayodhya Nagar, Bhopal,<br />
                    Madhya Pradesh — 462041, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+919301139140" className="text-muted-foreground hover:text-primary transition-colors">
                    +91 93011 39140
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:contact@socilet.in" className="text-muted-foreground hover:text-primary transition-colors">
                    contact@socilet.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Business Hours</p>
                  <p className="text-muted-foreground">
                    Monday – Saturday: 10:00 AM – 8:00 PM<br />
                    Sunday: By appointment
                  </p>
                </div>
              </div>
            </address>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Ayodhya+Nagar+Bhopal+Madhya+Pradesh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </a>

            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-2">Areas We Serve in Bhopal</h4>
              <p className="text-sm text-muted-foreground">
                Ayodhya Nagar, Arera Colony, MP Nagar, Shahpura, Kolar Road, Bairagarh,
                Hoshangabad Road, Bittan Market, New Market, Habibganj, Indrapuri,
                Misrod, Chunabhatti, and all surrounding areas of Bhopal.
              </p>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-border min-h-[450px]">
            <iframe
              title="Socilet Office Location — Ayodhya Nagar, Bhopal"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.9876!2d77.4521!3d23.2156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQXlvZGh5YSBOYWdhciwgQmhvcGFs!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '450px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Local SEO content */}
        <div className="mt-12 bg-card rounded-2xl p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Why Choose a Bhopal-Based Digital Agency?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Local Presence, Global Reach</h4>
              <p className="text-sm">
                Based in Ayodhya Nagar Bhopal, we deliver world-class web development,
                mobile apps, and AI services to clients across India and internationally.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Affordable Pricing</h4>
              <p className="text-sm">
                Bhopal-based operations let us offer premium digital services at
                competitive INR pricing without compromising on quality or timelines.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">In-Person Meetings</h4>
              <p className="text-sm">
                Local clients in Bhopal can schedule in-person consultations at our
                Ayodhya Nagar office for project discussions and strategy planning.
              </p>
            </div>
          </div>
        </div>

        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Socilet',
              image: 'https://socilet.in/og-image.png',
              '@id': 'https://socilet.in/#localbusiness',
              url: 'https://socilet.in',
              telephone: '+91-9301139140',
              email: 'contact@socilet.in',
              priceRange: '₹₹',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Ayodhya Nagar',
                addressLocality: 'Bhopal',
                addressRegion: 'Madhya Pradesh',
                postalCode: '462041',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 23.2156,
                longitude: 77.4521,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: [
                    'Monday', 'Tuesday', 'Wednesday',
                    'Thursday', 'Friday', 'Saturday',
                  ],
                  opens: '10:00',
                  closes: '20:00',
                },
              ],
              areaServed: [
                { '@type': 'City', name: 'Bhopal' },
                { '@type': 'City', name: 'Indore' },
                { '@type': 'City', name: 'Jabalpur' },
                { '@type': 'Country', name: 'India' },
                { '@type': 'Country', name: 'United States' },
                { '@type': 'Country', name: 'Canada' },
              ],
            }),
          }}
        />
      </div>
    </section>
  );
};

export default LocationSection;
