import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { contactAPI } from '../Api/api';

const infoCards = [
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+91 9728667800', 'Mon – Sun, 9am – 7pm']
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['support@mbrg.com', 'business@mbrg.com']
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: ['MBRG, Balianwala Road, Tohana (125120), Haryana', 'India']
  },
  {
    icon: Clock,
    title: 'Business Hours',
    lines: ['Mon – Sun: 9:00 AM – 7:00 PM']
  }
];

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const update = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.message.trim()) e.message = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await contactAPI.send(form);
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Could not send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main id='contact'>
        <section className='section'>
          <div className='container' style={{ position: 'relative' }}>
            <div className='glow' style={{ top: -80, left: -60 }} />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ maxWidth: 780 }}
            >
              <span className='badge'>📞 Get in touch</span>

              <h1 className='hero-title' style={{ marginTop: 22, fontSize: 'clamp(2.2rem,5vw,4.4rem)' }}>
                We'd love to <span className='gradient-text'>hear from you</span>
              </h1>

              <p className='hero-sub'>
                Have a question about our products, an order, or a bulk
                requirement? Reach out and our team will get back to you
                shortly.
              </p>
            </motion.div>
          </div>
        </section>

        <section className='section' style={{ paddingTop: 0 }}>
          <div className='container'>
            <div className='grid' style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginBottom: 12 }}>
              {infoCards.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className='trust-item' style={{ textAlign: 'left' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: 'linear-gradient(135deg,var(--gold),var(--gold-2))',
                      display: 'grid', placeItems: 'center', marginBottom: 12
                    }}>
                      <Icon size={20} color='#241A0D' />
                    </div>
                    <div style={{ fontWeight: 700 }}>{c.title}</div>
                    {c.lines.map((l) => (
                      <div key={l} style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4 }}>
                        {l}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className='section' style={{ paddingTop: 0 }}>
          <div className='container'>
            <div className='glass' style={{ borderRadius: 30, padding: 32, maxWidth: 700, margin: '0 auto' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 16,
                  background: 'linear-gradient(135deg,var(--gold),var(--gold-2))',
                  display: 'grid', placeItems: 'center', color: '#241A0D'
                }}>
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 26 }}>Send us a message</h2>
                  <div style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>
                    We usually reply within one business day
                  </div>
                </div>
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <CheckCircle2 size={52} color='var(--emerald)' />
                  <h3 style={{ marginTop: 16 }}>Message sent!</h3>
                  <p style={{ color: 'var(--muted)', maxWidth: 420, margin: '10px auto 0' }}>
                    Thanks for reaching out — our team will get back to you soon.
                  </p>
                </div>
              ) : (
                <>
                  <div className='checkout-grid'>
                    <Input
                      icon={User}
                      placeholder='Full name'
                      value={form.name}
                      onChange={(v) => update('name', v)}
                      error={errors.name}
                    />
                    <Input
                      icon={Mail}
                      placeholder='Email address'
                      value={form.email}
                      onChange={(v) => update('email', v)}
                      error={errors.email}
                    />
                    <Input
                      icon={Phone}
                      placeholder='Phone number (optional)'
                      value={form.phone}
                      onChange={(v) => update('phone', v)}
                    />
                    <Input
                      icon={MessageSquare}
                      placeholder='Subject (optional)'
                      value={form.subject}
                      onChange={(v) => update('subject', v)}
                    />
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <Textarea
                      placeholder='Your message'
                      value={form.message}
                      onChange={(v) => update('message', v)}
                      error={errors.message}
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
                        Sending...
                      </>
                    ) : (
                      'Send Message'
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
        rows={5}
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
