import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  User,
  Phone,
  Mail,
  Package,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Handshake
} from 'lucide-react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { enquiryAPI } from '../Api/api';

const tiers = [
  {
    range: '1–5 MT',
    label: 'Retail & restaurant supply',
    desc: 'Ideal for retail shops, restaurants and small distributors needing steady, reliable stock.'
  },
  {
    range: '5–25 MT',
    label: 'Distributor pricing',
    desc: 'Preferential distributor rates with flexible dispatch scheduling across regions.'
  },
  {
    range: '25+ MT',
    label: 'Custom contracts',
    desc: 'Tailored long-term supply contracts with dedicated account management.'
  }
];

export default function Business() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    riceVariety: '',
    monthlyQuantityMT: '',
    city: '',
    state: '',
    message: ''
  });

  const update = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = 'Required';
    if (!form.contactPerson.trim()) e.contactPerson = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.monthlyQuantityMT.trim()) e.monthlyQuantityMT = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await enquiryAPI.submit(form);
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Could not submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main id='business'>
        <section className='section'>
          <div className='container' style={{ position: 'relative' }}>
            <div className='glow' style={{ top: -80, right: -60 }} />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ maxWidth: 780 }}
            >
              <span className='badge'>Wholesale • Retail • Export</span>

              <h1 className='hero-title' style={{ marginTop: 22, fontSize: 'clamp(2.2rem,5vw,4.4rem)' }}>
                Looking for a reliable
                <br />
                <span className='gradient-text'>rice business partner?</span>
              </h1>

              <p className='hero-sub'>
                We work with distributors, retailers, restaurants and
                institutional buyers. Share your monthly requirement below and
                our team will get back with pricing, availability and dispatch
                timelines.
              </p>
            </motion.div>
          </div>
        </section>

        <section className='section' style={{ paddingTop: 0 }}>
          <div className='container'>
            <div className='grid' style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
              {tiers.map((t) => (
                <div key={t.range} className='glass' style={{ borderRadius: 24, padding: 26 }}>
                  <div className='gradient-text' style={{ fontSize: 30, fontWeight: 800 }}>
                    {t.range}
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 10 }}>{t.label}</div>
                  <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.7, marginTop: 8 }}>
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='section' style={{ paddingTop: 0 }}>
          <div className='container'>
            <div className='glass' style={{ borderRadius: 30, padding: 32, maxWidth: 760, margin: '0 auto' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 16,
                  background: 'linear-gradient(135deg,var(--gold),var(--gold-2))',
                  display: 'grid', placeItems: 'center', color: '#241A0D'
                }}>
                  <Handshake size={22} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 26 }}>Request a Business Quote</h2>
                  <div style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>
                    Our team typically responds within 24 hours
                  </div>
                </div>
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <CheckCircle2 size={52} color='var(--emerald)' />
                  <h3 style={{ marginTop: 16 }}>Enquiry received!</h3>
                  <p style={{ color: 'var(--muted)', maxWidth: 440, margin: '10px auto 0' }}>
                    Thank you for reaching out to MBRG. Our business
                    team will contact you shortly with pricing and availability.
                  </p>
                </div>
              ) : (
                <>
                  <div className='checkout-grid'>
                    <Input
                      icon={Building2}
                      placeholder='Company name'
                      value={form.companyName}
                      onChange={(v) => update('companyName', v)}
                      error={errors.companyName}
                    />
                    <Input
                      icon={User}
                      placeholder='Contact person'
                      value={form.contactPerson}
                      onChange={(v) => update('contactPerson', v)}
                      error={errors.contactPerson}
                    />
                    <Input
                      icon={Phone}
                      placeholder='Phone number'
                      value={form.phone}
                      onChange={(v) => update('phone', v)}
                      error={errors.phone}
                    />
                    <Input
                      icon={Mail}
                      placeholder='Email address'
                      value={form.email}
                      onChange={(v) => update('email', v)}
                      error={errors.email}
                    />
                    <Input
                      icon={Package}
                      placeholder='Rice variety of interest (optional)'
                      value={form.riceVariety}
                      onChange={(v) => update('riceVariety', v)}
                    />
                    <Input
                      icon={Package}
                      placeholder='Monthly requirement (in MT)'
                      value={form.monthlyQuantityMT}
                      onChange={(v) => update('monthlyQuantityMT', v)}
                      error={errors.monthlyQuantityMT}
                    />
                    <Input
                      icon={MapPin}
                      placeholder='City'
                      value={form.city}
                      onChange={(v) => update('city', v)}
                    />
                    <Input
                      icon={MapPin}
                      placeholder='State'
                      value={form.state}
                      onChange={(v) => update('state', v)}
                    />
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <Textarea
                      icon={MessageSquare}
                      placeholder='Tell us more about your requirement'
                      value={form.message}
                      onChange={(v) => update('message', v)}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className='btn-primary'
                    style={{
                      width: '100%',
                      marginTop: 22,
                      padding: '16px 22px',
                      fontSize: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? (
                      <>
                        <div className='spinner' />
                        Submitting...
                      </>
                    ) : (
                      'Submit Enquiry'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Input({ icon: Icon, placeholder, value, onChange, error }) {
  return (
    <div>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={18}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted)'
            }}
          />
        )}
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.72)',
            border: `1px solid ${error ? '#EF4444' : 'var(--border)'}`,
            color: 'var(--text)',
            padding: Icon ? '14px 14px 14px 42px' : '14px',
            borderRadius: 16,
            outline: 'none'
          }}
        />
      </div>
      {error && (
        <div style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{error}</div>
      )}
    </div>
  );
}

function Textarea({ placeholder, value, onChange, error }) {
  return (
    <div>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.72)',
          border: `1px solid ${error ? '#EF4444' : 'var(--border)'}`,
          color: 'var(--text)',
          padding: 14,
          borderRadius: 16,
          outline: 'none',
          resize: 'vertical'
        }}
      />
      {error && (
        <div style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{error}</div>
      )}
    </div>
  );
}
