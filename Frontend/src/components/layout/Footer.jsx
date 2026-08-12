import { Wheat, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ padding: '20px 0 0' }}>
      <div className='container glass'
        style={{
          borderRadius: '32px 32px 0 0',
          padding: '48px 36px 28px',
          position: 'relative',
          overflow: 'hidden'
        }}>
        <div className='glow' style={{ left: -100, top: -140 }} />

        <div className='footer-grid' style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1.2fr',
          gap: 36
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src='/logo.png'
                alt='MBRG logo'
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.18)'
                }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>MBRG</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  Premium Rice Manufacturers
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginTop: 18, maxWidth: 380, fontSize: 14.5 }}>
              Trusted premium rice manufacturing, processing and wholesale
              distribution — from certified farms to your doorstep, PAN India.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Quick Links</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                ['Home', '/home'],
                ['Products', '/products'],
                ['About Us', '/about'],
                ['Business Enquiry', '/business'],
                ['Contact', '/contact'],
                ['Track Order', '/track']
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14.5 }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Get in Touch</div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Phone size={17} color='var(--gold)' style={{ marginTop: 2 }} />
                <span style={{ color: 'var(--muted)', fontSize: 14.5 }}>+91 9728667800</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Mail size={17} color='var(--gold)' style={{ marginTop: 2 }} />
                <span style={{ color: 'var(--muted)', fontSize: 14.5 }}>support@mbrg.com</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Mail size={17} color='var(--gold)' style={{ marginTop: 2 }} />
                <span style={{ color: 'var(--muted)', fontSize: 14.5 }}>business@mbrg.com</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <MapPin size={17} color='var(--gold)' style={{ marginTop: 2 }} />
                <span style={{ color: 'var(--muted)', fontSize: 14.5 }}>
                 MBRG, Balianwala Road, Tohana (125120), Haryana, India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 40,
          paddingTop: 22,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
            <Wheat size={15} color='var(--gold)' />
            © {year} MBRG. All rights reserved.
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            Crafted with pride, milled with precision.
          </div>
        </div>
      </div>
    </footer>
  );
}
