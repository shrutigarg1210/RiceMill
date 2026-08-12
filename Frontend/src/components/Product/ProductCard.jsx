import { motion } from "framer-motion";
import { Star, Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function ProductCard({ product }) {

  const [quantityKg, setQuantityKg] = useState(100);
   console.log(product);
  const { addToCart } = useAuth();

  const handleAddToCart = () => {

    if (quantityKg < 100) {
        alert("Minimum order is 100 KG");
        return;
    }

    if (quantityKg > product.availableQuantityKg) {
        alert(
            `Only ${product.availableQuantityKg} KG available`
        );
        return;
    }

    addToCart(product, quantityKg);
};

  return (

    <motion.div
      whileHover={{
        y: -8,
        rotateX: 2,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
      }}
      className="card glass"
    >

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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <span className="badge">

          <Star size={14} />

          {product.qualityGrade || "Premium"}

        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#6B7280",
            fontSize: 13,
          }}
        >

          <Package size={14} />

          {product.availableQuantityKg} KG

        </div>

      </div>

      <h3
        style={{
          fontSize: 22,
          margin: "16px 0 8px",
        }}
      >
        {product.variety}
      </h3>

      <p
        style={{
          color: "#6B7280",
          lineHeight: 1.7,
          minHeight: 70,
          margin: "14px 0 20px",
        }}
      >
        {product.description}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <div>

          <div
            style={{
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            Price / KG
          </div>

          <div
            className="gradient-text"
            style={{
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            ₹{product.pricePerKg}
          </div>

        </div>

   <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 170,
  }}
>
  <label
    style={{
      fontSize: 12,
      color: "#6B7280",
      fontWeight: 600,
    }}
  >
    Quantity (KG)
  </label>

  <input
    type="number"
    min={100}
    max={product.availableQuantityKg}
    value={quantityKg}
    onChange={(e) => setQuantityKg(Number(e.target.value))}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: 10,
      border: "1px solid #D8C7A0",
      outline: "none",
      fontSize: 15,
      fontWeight: 600,
      textAlign: "center",
      background: "#FFFDF8",
    }}
  />

  <button
    className="btn-primary"
    onClick={handleAddToCart}
    disabled={product.availableQuantityKg < 100}
  >
    {product.availableQuantityKg >= 100
      ? "Add to Cart"
      : "Out of Stock"}
  </button>
</div>

      </div>

    </motion.div>

  );

}