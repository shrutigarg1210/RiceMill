import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/product/ProductCard";
import { productAPI } from "../Api/API";

import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Users,
} from "lucide-react";

export default function Home() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {

    try {

      const response = await productAPI.getAll();

      console.log("Products:", response);

      setProducts(response.data || response);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  return (
    <>
      <Header />

      <main id="home">

        <section className="section">

          <div
            className="container"
            style={{ position: "relative" }}
          >

            <div
              className="glow"
              style={{
                top: -80,
                right: -60,
              }}
            />

            <motion.div
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              style={{
                maxWidth: 780,
              }}
            >

              <span className="badge">
                🌾 Trusted by wholesalers & retailers
              </span>

              <h1
                className="hero-title"
                style={{
                  marginTop: 22,
                }}
              >

                Premium Rice

                <br />

                <span className="gradient-text">
                  Crafted with Pride.
                </span>

              </h1>

              <p className="hero-sub">

                MBRG supplies premium basmati, sella and specialty rice
                varieties for homes, retailers, restaurants and bulk buyers
                across India.

                Minimum order 100 kg.

              </p>

              <div
                className="hero-actions"
                style={{
                  display: "flex",
                  gap: 15,
                  marginTop: 26,
                }}
              >

                <Link
                  to="/products"
                  className="btn-primary"
                >
                  Explore Products
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/business"
                  className="btn-primary"
                >
                  Bulk Business Enquiry
                </Link>

              </div>

              <div className="trust-bar">

                <div className="trust-item">

                  <ShieldCheck
                    size={26}
                    color="#D4AF37"
                  />

                  <div
                    style={{
                      fontWeight: 700,
                      marginTop: 10,
                    }}
                  >
                    Export Quality
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#9CA3AF",
                    }}
                  >
                    Certified processing
                  </div>

                </div>

                <div className="trust-item">

                  <Truck
                    size={26}
                    color="#D4AF37"
                  />

                  <div
                    style={{
                      fontWeight: 700,
                      marginTop: 10,
                    }}
                  >
                    PAN India
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#9CA3AF",
                    }}
                  >
                    Fast dispatch
                  </div>

                </div>

                <div className="trust-item">

                  <Award
                    size={26}
                    color="#D4AF37"
                  />

                  <div
                    style={{
                      fontWeight: 700,
                      marginTop: 10,
                    }}
                  >
                    Premium Grade
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#9CA3AF",
                    }}
                  >
                    Consistent quality
                  </div>

                </div>

                <div className="trust-item">

                  <Users
                    size={26}
                    color="#D4AF37"
                  />

                  <div
                    style={{
                      fontWeight: 700,
                      marginTop: 10,
                    }}
                  >
                    100+ Buyers
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#9CA3AF",
                    }}
                  >
                    Trusted network
                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </section>

        <section
          id="products"
          className="section"
        >

          <div className="container">

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: 32,
                flexWrap: "wrap",
                gap: 16,
              }}
            >

              <div>

                <div className="badge">
                  Featured Collection
                </div>

                <h2
                  style={{
                    fontSize: 42,
                    margin: "14px 0 8px",
                  }}
                >
                  Our Premium Rice Range
                </h2>

                <p
                  style={{
                    color: "#9CA3AF",
                    maxWidth: 560,
                  }}
                >
                  Browse products directly from our live inventory.
                </p>

              </div>

              <Link
                to="/products"
                className="btn-secondary"
                style={{
                  textDecoration: "none",
                }}
              >
                View All Varieties
              </Link>

            </div>

            <div className="grid products-grid">

              {loading ? (

                <div
                  style={{
                    textAlign: "center",
                    padding: 60,
                    width: "100%",
                    fontSize: 20,
                  }}
                >
                  Loading Products...
                </div>

              ) : products.length === 0 ? (

                <div
                  style={{
                    textAlign: "center",
                    padding: 60,
                    width: "100%",
                    fontSize: 20,
                  }}
                >
                  No Products Available
                </div>

              ) : (

                products
                  .filter(product => product.active)
                  .map(product => (

                    <ProductCard
                      key={product.id}
                      product={product}
                    />

                  ))

              )}

            </div>

          </div>

        </section>
                <section id="business" className="section">

          <div
            className="container glass"
            style={{
              borderRadius: 32,
              padding: "42px 36px",
              position: "relative",
              overflow: "hidden",
            }}
          >

            <div
              className="glow"
              style={{
                right: -120,
                bottom: -120,
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr .8fr",
                gap: 28,
                alignItems: "center",
              }}
            >

              <div>

                <div className="badge">
                  Wholesale • Retail • Export
                </div>

                <h2
                  style={{
                    fontSize: 44,
                    margin: "16px 0",
                  }}
                >
                  Looking for a reliable rice business partner?
                </h2>

                <p
                  style={{
                    color: "#9CA3AF",
                    lineHeight: 1.9,
                  }}
                >
                  We work with distributors, retailers,
                  restaurants and institutional buyers.

                  Share your monthly requirement and our
                  team will provide pricing,
                  availability and dispatch timelines.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    marginTop: 24,
                    flexWrap: "wrap",
                  }}
                >

                  <Link
                    to="/business"
                    className="btn-primary"
                  >
                    Request Business Quote
                  </Link>

                  <a
                    href="https://wa.me/9728667800"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    Talk on WhatsApp
                  </a>

                </div>

              </div>

              <div
                className="glass"
                style={{
                  borderRadius: 24,
                  padding: 24,
                }}
              >

                <div
                  style={{
                    fontSize: 14,
                    color: "#9CA3AF",
                  }}
                >
                  Minimum Order
                </div>

                <div
                  className="gradient-text"
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                  }}
                >
                  100 KG
                </div>

                <hr
                  style={{
                    border: "none",
                    borderTop:
                      "1px solid rgba(255,255,255,.08)",
                    margin: "22px 0",
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gap: 16,
                  }}
                >

                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      1–5 MT
                    </div>

                    <div
                      style={{
                        color: "#9CA3AF",
                        fontSize: 14,
                      }}
                    >
                      Retail & Restaurant Supply
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      5–25 MT
                    </div>

                    <div
                      style={{
                        color: "#9CA3AF",
                        fontSize: 14,
                      }}
                    >
                      Distributor Pricing
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      25+ MT
                    </div>

                    <div
                      style={{
                        color: "#9CA3AF",
                        fontSize: 14,
                      }}
                    >
                      Custom Supply Contracts
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </>
  );

}