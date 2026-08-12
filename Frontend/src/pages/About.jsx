import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {
  Award,
  Sprout,
  Cog,
  Package,
  Truck,
  Users
} from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Premium quality rice',
    desc: 'Every batch is graded and quality-checked to meet consistent, export-ready standards.'
  },
  {
    icon: Sprout,
    title: 'Direct farmer sourcing',
    desc: 'We source paddy directly from certified farmers, ensuring traceability and fair pricing.'
  },
  {
    icon: Cog,
    title: 'Modern processing & grading',
    desc: 'Our milling and grading technology delivers uniform grain size, purity and taste.'
  },
  {
    icon: Package,
    title: 'Bulk order capability',
    desc: 'From 100 kg starter orders to 25+ MT contracts, we scale to your business needs.'
  },
  {
    icon: Truck,
    title: 'PAN India dispatch',
    desc: 'Reliable, timely delivery to households, retailers and institutions nationwide.'
  },
  {
    icon: Users,
    title: 'Dedicated business support',
    desc: 'A dedicated team for pricing, availability and dispatch timelines for partners.'
  }
];

export default function About() {
  return (
    <>
      <Header />

      <main id='about'>
        <section className='section'>
          <div className='container' style={{ position: 'relative' }}>
            <div className='glow' style={{ top: -80, left: -60 }} />

            <div className='checkout-grid' style={{
              gridTemplateColumns: '1.3fr .9fr',
              gap: 44,
              alignItems: 'center'
            }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className='badge'>🌾 Who we are</span>

                <h1 className='hero-title' style={{ marginTop: 22, fontSize: 'clamp(2.2rem,5vw,4.4rem)' }}>
                  About <span className='gradient-text'>MBRG</span>
                </h1>

                <p className='hero-sub' style={{ maxWidth: 760 }}>
                  MBRG is a trusted name in premium rice manufacturing, processing,
                  and wholesale distribution. We source high-quality paddy directly from
                  certified farmers and process it using modern milling and grading
                  technology to ensure consistent quality, purity, and taste.
                </p>

                <p className='hero-sub' style={{ maxWidth: 760 }}>
                  With a focus on transparency, hygiene, and timely delivery, we serve
                  households, retailers, wholesalers, restaurants, and institutional
                  buyers across India. Our mission is to deliver rice that meets the
                  highest standards while building long-term relationships with
                  customers and business partners.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <div className='glass' style={{
                  borderRadius: '50%',
                  padding: 20,
                  width: 'min(360px, 80%)',
                  aspectRatio: '1 / 1',
                  display: 'grid',
                  placeItems: 'center'
                }}>
                  <img
                    src='/logo.png'
                    alt='MBRG logo'
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.18)'
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className='section' style={{ paddingTop: 0 }}>
          <div className='container'>
            <div style={{ marginBottom: 32 }}>
              <div className='badge'>Why Choose Us</div>
              <h2 style={{ fontSize: 38, margin: '14px 0 8px' }}>
                Built on quality, trust and reliability
              </h2>
              <p style={{ color: 'var(--muted)', maxWidth: 560 }}>
                Everything we do is anchored around consistent grain quality and
                dependable service to our partners.
              </p>
            </div>

            <div className='grid' style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
              {reasons.map((r, i) => {
                const Icon = r.icon;
                return (
                  <motion.div
                    key={r.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className='card glass'
                    style={{ borderRadius: 24, padding: 26 }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      background: 'linear-gradient(135deg,var(--gold),var(--gold-2))',
                      display: 'grid', placeItems: 'center',
                      marginBottom: 18
                    }}>
                      <Icon size={24} color='#241C10' />
                    </div>

                    <h3 style={{ fontSize: 19, margin: '0 0 8px' }}>{r.title}</h3>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0, fontSize: 14.5 }}>
                      {r.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className='section' style={{ paddingTop: 0 }}>
          <div className='container glass'
            style={{
              borderRadius: 32,
              padding: '42px 36px',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center'
            }}>
            <div className='glow' style={{ right: -100, top: -100 }} />

            <div className='badge'>Partner with us</div>
            <h2 style={{ fontSize: 36, margin: '16px 0' }}>
              Let's build a lasting rice supply partnership
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: 620, margin: '0 auto' }}>
              Whether you're a household buyer or a bulk distributor, our team is
              ready to support your requirements with quality and consistency.
            </p>

            <div style={{ display: 'flex', gap: 16, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href='/products' className='btn-primary' style={{ textDecoration: 'none' }}>
                Explore Products
              </a>
              <a href='/business' className='btn-secondary' style={{ textDecoration: 'none' }}>
                Business Enquiry
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
