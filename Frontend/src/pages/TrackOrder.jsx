import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Package,
  Cog,
  Truck,
  MapPin,
  CheckCircle2,
  XCircle
} from 'lucide-react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { orderAPI } from '../Api/api';

const STAGES = [
  { key: 'PLACED', label: 'Order Placed', icon: Package },
  { key: 'PROCESSING', label: 'Processing', icon: Cog },
  { key: 'DISPATCHED', label: 'Dispatched', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
];

function getQueryOrder() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('order') || '';
  } catch {
    return '';
  }
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState(getQueryOrder());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const handleTrack = async (num) => {
    const value = (num ?? orderNumber).trim();
    if (!value) {
      setError('Please enter an order number');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await orderAPI.track(value);
      setOrder(res.data || res);
    } catch (err) {
      setOrder(null);
      setError(err.message || 'Order not found. Please check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = getQueryOrder();
    if (initial) handleTrack(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentIndex = order
    ? STAGES.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <>
      <Header />

      <main id='track-order'>
        <section className='section'>
          <div className='container' style={{ position: 'relative' }}>
            <div className='glow' style={{ top: -80, right: -60 }} />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}
            >
              <span className='badge'>📦 Order tracking</span>

              <h1 className='hero-title' style={{ marginTop: 22, fontSize: 'clamp(2.2rem,5vw,4rem)' }}>
                Track your <span className='gradient-text'>order</span>
              </h1>

              <p className='hero-sub' style={{ margin: '0 auto' }}>
                Enter your order number below to see real-time status,
                from processing to delivery.
              </p>

              <div style={{
                display: 'flex',
                gap: 12,
                marginTop: 28,
                maxWidth: 460,
                margin: '28px auto 0'
              }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search
                    size={18}
                    style={{
                      position: 'absolute', left: 14, top: '50%',
                      transform: 'translateY(-50%)', color: 'var(--muted)'
                    }}
                  />
                  <input
                    placeholder='e.g. MBRG-2026-000123'
                    value={orderNumber}
                    onChange={(e) => { setOrderNumber(e.target.value); setError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleTrack(); }}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.72)',
                      border: `1px solid ${error ? '#EF4444' : 'var(--border)'}`,
                      color: 'var(--text)',
                      padding: '14px 14px 14px 42px',
                      borderRadius: 16,
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  onClick={() => handleTrack()}
                  disabled={loading}
                  className='btn-primary'
                  style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? <div className='spinner' /> : 'Track'}
                </button>
              </div>

              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  justifyContent: 'center', marginTop: 14, color: '#C0392B', fontSize: 14
                }}>
                  <XCircle size={16} /> {error}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {order && (
          <section className='section' style={{ paddingTop: 0 }}>
            <div className='container'>
              <div className='glass' style={{ borderRadius: 30, padding: 32, maxWidth: 820, margin: '0 auto' }}>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 32
                }}>
                  <div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>Order Number</div>
                    <div style={{ fontWeight: 800, fontSize: 22 }}>
                      {order.orderNumber || orderNumber}
                    </div>
                  </div>

                  {order.expectedDelivery && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--muted)', fontSize: 13 }}>Expected Delivery</div>
                      <div style={{ fontWeight: 700 }}>{order.expectedDelivery}</div>
                    </div>
                  )}
                </div>

                {/* Stage tracker */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: 22, left: 22, right: 22,
                    height: 3, background: 'var(--border)', zIndex: 0
                  }} />
                  <div style={{
                    position: 'absolute', top: 22, left: 22,
                    width: currentIndex >= 0
                      ? `calc(${(currentIndex / (STAGES.length - 1)) * 100}% - 22px + ${currentIndex === 0 ? '0px' : '22px'})`
                      : 0,
                    maxWidth: 'calc(100% - 44px)',
                    height: 3, background: 'linear-gradient(90deg,var(--gold),var(--gold-2))', zIndex: 1
                  }} />

                  {STAGES.map((s, i) => {
                    const Icon = s.icon;
                    const reached = currentIndex >= i;
                    return (
                      <div key={s.key} style={{
                        position: 'relative', zIndex: 2, textAlign: 'center', flex: 1
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          margin: '0 auto',
                          display: 'grid', placeItems: 'center',
                          background: reached
                            ? 'linear-gradient(135deg,var(--gold),var(--gold-2))'
                            : 'rgba(255,255,255,0.72)',
                          border: reached ? 'none' : '1px solid var(--border)',
                          color: reached ? '#241A0D' : 'var(--muted)'
                        }}>
                          <Icon size={19} />
                        </div>
                        <div style={{
                          fontSize: 12.5, marginTop: 10, fontWeight: reached ? 700 : 500,
                          color: reached ? 'var(--text)' : 'var(--muted)'
                        }}>
                          {s.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div style={{ marginTop: 40 }}>
                    <div style={{ fontWeight: 700, marginBottom: 14 }}>Items</div>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between',
                          paddingBottom: 12, borderBottom: '1px solid var(--border)'
                        }}>
                          <span>{item.variety || item.name}</span>
                          <span style={{ color: 'var(--muted)' }}>
                            {item.quantityMT ? `${item.quantityMT} MT` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
