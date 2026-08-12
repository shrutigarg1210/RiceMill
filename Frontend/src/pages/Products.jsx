import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Package,
  MapPin,
  Star,
  ShoppingCart,
  Loader2
} from 'lucide-react';

import Header from '../components/layout/Header';
import { productAPI } from '../Api/API';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';

export default function Products() {
  console.log("Products page rendered");
  const { addToCart } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('ALL');
  // const [origin, setOrigin] = useState('ALL');
  const [sortBy, setSortBy] = useState('default');

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {

       console.log("Calling loadProducts...");
      try {
        setLoading(true);
       const res = await productAPI.getAll();

console.log(res);

const availableProducts = res.filter(
    (p) => p.active === true
);

setProducts(availableProducts);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Unique filter values
const grades = useMemo(
  () => [
    "ALL",
    ...new Set(
      products
        .map((p) => p.qualityGrade)
        .filter(Boolean)
    ),
  ],
  [products]
);

  const origins = ["ALL"];

  // Filter + sort
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Search
    if (search.trim()) {
      data = data.filter((p) =>
        p.variety?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Grade
    if (grade !== 'ALL') {
      data = data.filter((p) => p.qualityGrade === grade);
    }

    // // Origin
    // if (origin !== 'ALL') {
    //   data = data.filter((p) => p.origin === origin);
    // }

    // Sort
    switch (sortBy) {
      case 'price-low':
        data.sort((a, b) => a.pricePerKg - b.pricePerKg);
        break;
      case 'price-high':
        data.sort((a, b) => b.pricePerKg - a.pricePerKg);
        break;
      case 'stock':
        data.sort((a, b) => b.availableQuantityKg - a.availableQuantityKg);
        break;
      default:
        break;
    }

    return data;
  }, [products, search, grade, origin, sortBy]);

const handleAddToCart = (product) => {
  console.log("ADD TO CART CLICKED");
  console.log(product);

  addToCart(product, 100);
};


function StatCard({ label, value }) {
  return (
    <div className="glass" style={{
      borderRadius: 20,
      padding: 20
    }}>
      <div style={{
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 8
      }}>
        {label}
      </div>

      <div style={{
        fontSize: 28,
        fontWeight: 800
      }} className="gradient-text">
        {value}
      </div>
    </div>
  );
}

const selectStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#E5E7EB',
  padding: '14px',
  borderRadius: 14,
  outline: 'none'
};

<a
  href="https://wa.me/919728672614"
  target="_blank"
  rel="noreferrer"
  style={{
    position: 'fixed',
    right: 22,
    bottom: 22,
    width: 62,
    height: 62,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#25D366,#1EBE5D)',
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
    fontSize: 30,
    textDecoration: 'none',
    boxShadow: '0 16px 40px rgba(37,211,102,.35)',
    zIndex: 1000
  }}
>
  💬
</a>

  return (
    <>
      <Header />

      <main className="section" style={{ paddingTop: 40 }}>
        <div className="container">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 36 }}
          >
            <div className="badge">🌾 Live inventory from MBRG backend</div>

            <h1 style={{
              fontSize: 'clamp(2.2rem,5vw,4rem)',
              margin: '18px 0 12px'
            }}>
              Explore Our <span className="gradient-text">Premium Rice Collection</span>
            </h1>

            <p style={{
              color: '#9CA3AF',
              maxWidth: 720,
              lineHeight: 1.8,
              fontSize: '1.05rem'
            }}>
              Real-time stock, premium grades, and wholesale-ready pricing.
              Orders start from 100 KG and scale to multiple tonnes.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="glass" style={{
            borderRadius: 24,
            padding: 20,
            marginBottom: 28
          }}>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18
            }}>
              <SlidersHorizontal size={18} />
              <span style={{ fontWeight: 700 }}>Filters & Search</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: 14
            }}>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF'
                  }}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Basmati, Sella, Brown Rice..."
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#E5E7EB',
                    padding: '14px 14px 14px 42px',
                    borderRadius: 14,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Grade */}
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={selectStyle}
              >
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g === 'ALL' ? 'All Grades' : g}
                  </option>
                ))}
              </select>

              {/* Origin */}
              {/* <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                style={selectStyle}
              >
                {origins.map((o) => (
                  <option key={o} value={o}>
                    {o === 'ALL' ? 'All Origins' : o}
                  </option>
                ))}
              </select> */}

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={selectStyle}
              >
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Highest Stock</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr 1fr',
            gap: 16,
            marginBottom: 32
          }}>

            <StatCard label="Available Varieties" value={filteredProducts.length} />
            <StatCard
              label="Total Stock"
              value={`${filteredProducts.reduce((a, p) => a + (p.availableQuantityKg || 0), 0).toFixed(1)} Kg`}
            />
            <StatCard label="Minimum Order" value="100 KG" />
            <StatCard label="Dispatch" value="PAN India" />
          </div>

          {/* Loading */}
          {loading && (
            <div style={{
              display: 'grid',
              placeItems: 'center',
              padding: 80,
              color: '#9CA3AF'
            }}>
              <Loader2 size={36} className="spin" />
              <div style={{ marginTop: 12 }}>Loading premium inventory...</div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(192,57,43,0.12)',
              border: '1px solid rgba(192,57,43,0.3)',
              color: '#FCA5A5',
              padding: 18,
              borderRadius: 18,
              marginBottom: 24
            }}>
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="glass" style={{
              borderRadius: 24,
              padding: 60,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🌾</div>
              <h3 style={{ marginBottom: 8 }}>No products found</h3>
              <p style={{ color: '#9CA3AF' }}>
                Try changing your search or filter options.
              </p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid products-grid">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -8, rotateX: 2 }}
                  className="card glass"
                >

                  {/* Image */}
                  <div className="product-image">
                   {product.imageUrl ? (
  <img
    src={product.imageUrl}
    alt={product.variety}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: 18,
    }}
  />
) : (
  "🌾"
)}
                  </div>

                  {/* Top Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14
                  }}>

                    <div className="badge">
                      <Star size={14} /> {product.qualityGrade}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: '#9CA3AF',
                      fontSize: 13
                    }}>
                      <Package size={14} />
                      {product.availableQuantityKg || 0} Kg
                    </div>
                  </div>

                  {/* Name */}
                  <h3 style={{
                    fontSize: 22,
                    margin: '0 0 8px',
                    lineHeight: 1.2
                  }}>
                    {product.variety}
                  </h3>

                  {/* Origin */}
                  {/* <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#9CA3AF',
                    fontSize: 14,
                    marginBottom: 14
                  }}>
                    <MapPin size={14} />
                    Available Stock
                  </div> */}

                  {/* Description */}
                  <p style={{
                    color: '#9CA3AF',
                    lineHeight: 1.7,
                    marginBottom: 20,
                    minHeight: 72
                  }}>
                    {product.description}
                  </p>

                  {/* Stock Bar */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      marginBottom: 8
                    }}>
                      <span style={{ color: '#9CA3AF' }}>Stock availability</span>
                      <span style={{ color: '#D4AF37' }}>
                        {product.availableQuantityKg || 0} Kg
                      </span>
                    </div>

                    <div style={{
                      height: 8,
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: 999
                    }}>
                      <div style={{
                        width: `${Math.min((product.availableQuantityKg || 0) * 2, 100)}%`,
                        height: '100%',
                        borderRadius: 999,
                        background: 'linear-gradient(90deg,#D4AF37,#F4D77A)'
                      }} />
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>

                    <div>
                      <div style={{
                        fontSize: 12,
                        color: '#9CA3AF'
                      }}>
                        Starting from
                      </div>

                      <div style={{
                        fontSize: 30,
                        fontWeight: 800
                      }} className="gradient-text">
                        ₹{product.pricePerKg}
                      </div>

                      <div style={{
                        fontSize: 12,
                        color: '#9CA3AF'
                      }}>
                        per kg
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <ShoppingCart size={18} />
                      Add
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </>
  );


}
